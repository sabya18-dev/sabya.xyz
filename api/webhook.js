const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Helper to determine persistent storage location (Vercel serverless uses /tmp)
const IS_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = IS_VERCEL
  ? path.join('/tmp', 'data')
  : path.join(process.cwd(), 'server', 'data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');

// Ensure data directory and file exist
function initStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PAYMENTS_FILE)) {
      fs.writeFileSync(PAYMENTS_FILE, JSON.stringify([]), 'utf8');
    }
  } catch (err) {
    console.warn('[Razorpay Webhook] Storage init warning:', err.message);
  }
}

// In-memory cache as backup for serverless environments
let memoryPaymentsCache = [];

function getPayments() {
  try {
    initStorage();
    if (fs.existsSync(PAYMENTS_FILE)) {
      const data = fs.readFileSync(PAYMENTS_FILE, 'utf8');
      const parsed = JSON.parse(data || '[]');
      memoryPaymentsCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.error('[Razorpay Webhook] Error reading payments:', err.message);
  }
  return memoryPaymentsCache;
}

function savePayment(paymentRecord) {
  try {
    initStorage();
    const payments = getPayments();
    payments.push(paymentRecord);
    memoryPaymentsCache = payments;
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[Razorpay Webhook] Error saving payment:', err.message);
    memoryPaymentsCache.push(paymentRecord);
    return true;
  }
}

// Helper to read raw request body as Buffer from incoming stream
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    // If rawBody is already attached (by middleware)
    if (Buffer.isBuffer(req.rawBody)) {
      return resolve(req.rawBody);
    }
    if (typeof req.rawBody === 'string') {
      return resolve(Buffer.from(req.rawBody, 'utf8'));
    }
    if (Buffer.isBuffer(req.body)) {
      return resolve(req.body);
    }

    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    });
    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Vercel Serverless Function Handler
 * Route: POST /api/webhook
 */
module.exports = async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed. Webhooks must be POST requests.' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[Razorpay Webhook Error] RAZORPAY_WEBHOOK_SECRET is not configured.');
    return res.status(500).json({ error: 'Server configuration error: Webhook secret missing' });
  }

  const signature = req.headers['x-razorpay-signature'];
  if (!signature) {
    console.warn('[Razorpay Webhook Warning] Request missing x-razorpay-signature header.');
    return res.status(400).json({ error: 'Missing x-razorpay-signature header' });
  }

  let rawBodyBuffer;
  try {
    rawBodyBuffer = await getRawBody(req);
  } catch (err) {
    console.error('[Razorpay Webhook Error] Failed to read request body stream:', err);
    return res.status(500).json({ error: 'Failed to read request body' });
  }

  const rawBodyString = rawBodyBuffer.toString('utf8');

  // Verify HMAC-SHA256 signature using raw body
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBodyString)
    .digest('hex');

  let isAuthentic = false;
  try {
    if (signature.length === expectedSignature.length) {
      isAuthentic = crypto.timingSafeEqual(
        Buffer.from(signature, 'utf8'),
        Buffer.from(expectedSignature, 'utf8')
      );
    }
  } catch (err) {
    console.error('[Razorpay Webhook Error] Signature comparison error:', err);
    isAuthentic = false;
  }

  if (!isAuthentic) {
    console.warn('[Razorpay Webhook Warning] Invalid signature. Webhook rejected.');
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  // Parse JSON payload
  let eventPayload;
  try {
    eventPayload = JSON.parse(rawBodyString);
  } catch (err) {
    console.error('[Razorpay Webhook Error] Malformed JSON payload:', err);
    return res.status(400).json({ error: 'Malformed JSON payload' });
  }

  const eventName = eventPayload.event;
  console.log(`[Razorpay Webhook] Verified event received: ${eventName}`);

  // Handle payment.captured or order.paid events
  if (eventName === 'payment.captured' || eventName === 'order.paid') {
    const paymentEntity = eventPayload.payload && eventPayload.payload.payment
      ? eventPayload.payload.payment.entity
      : null;
    const orderEntity = eventPayload.payload && eventPayload.payload.order
      ? eventPayload.payload.order.entity
      : null;

    const paymentId = paymentEntity ? paymentEntity.id : null;
    const orderId = (orderEntity && orderEntity.id) || (paymentEntity && paymentEntity.order_id) || null;
    const amount = (paymentEntity && paymentEntity.amount) || (orderEntity && orderEntity.amount_paid) || 0;
    const currency = (paymentEntity && paymentEntity.currency) || (orderEntity && orderEntity.currency) || 'INR';

    // Prevent duplicate processing
    const existingPayments = getPayments();
    const alreadyProcessed = existingPayments.some(
      (p) => (paymentId && p.paymentId === paymentId) || (orderId && p.orderId === orderId && p.status === 'verified')
    );

    if (alreadyProcessed) {
      console.log(`[Razorpay Webhook] Duplicate event detected for payment ${paymentId} / order ${orderId}. Skipping.`);
      return res.status(200).json({
        status: 'ok',
        message: 'Event already processed',
        alreadyProcessed: true,
        paymentId: paymentId,
        orderId: orderId,
      });
    }

    // Amount validation for ₹19 Premium Notes (1900 paise)
    if (amount < 1900 || currency !== 'INR') {
      console.warn(`[Razorpay Webhook Warning] Received unexpected amount (${amount}) or currency (${currency}).`);
      return res.status(400).json({ error: 'Payment amount mismatch for Premium Notes' });
    }

    // Generate secure access token valid for 30 days
    const accessToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    const paymentRecord = {
      orderId: orderId,
      paymentId: paymentId,
      amount: amount,
      currency: currency,
      customerEmail: (paymentEntity && paymentEntity.email) || 'customer@razorpay',
      customerContact: (paymentEntity && paymentEntity.contact) || '',
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      accessToken: accessToken,
      tokenExpiresAt: tokenExpiresAt,
      source: 'razorpay_webhook',
      event: eventName,
    };

    savePayment(paymentRecord);
    console.log(`[Razorpay Webhook] Premium Notes successfully unlocked for payment ${paymentId}. Access token issued.`);

    return res.status(200).json({
      status: 'ok',
      message: 'Payment verified successfully and Premium Notes unlocked',
      paymentId: paymentId,
      orderId: orderId,
    });
  }

  // Gracefully acknowledge any other Razorpay events
  return res.status(200).json({
    status: 'ok',
    message: `Event '${eventName}' received and acknowledged`,
  });
};

// Vercel Serverless Config: Disable automatic body parsing to ensure raw body stream is preserved for HMAC verification
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
