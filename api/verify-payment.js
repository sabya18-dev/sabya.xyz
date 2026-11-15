const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const IS_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = IS_VERCEL ? path.join('/tmp', 'data') : path.join(process.cwd(), 'server', 'data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');

function initStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PAYMENTS_FILE)) {
      fs.writeFileSync(PAYMENTS_FILE, JSON.stringify([]), 'utf8');
    }
  } catch (e) {}
}

function savePayment(record) {
  try {
    initStorage();
    let payments = [];
    if (fs.existsSync(PAYMENTS_FILE)) {
      payments = JSON.parse(fs.readFileSync(PAYMENTS_FILE, 'utf8') || '[]');
    }
    payments.push(record);
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2), 'utf8');
  } catch (e) {}
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, name } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required payment verification details' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ error: 'Server misconfiguration: RAZORPAY_KEY_SECRET is missing' });
    }

    // Compute expected signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isAuthentic = razorpay_signature.length === expectedSignature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSignature, 'utf8'), Buffer.from(razorpay_signature, 'utf8'));

    if (!isAuthentic) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature. Verification failed.' });
    }

    const accessToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    const record = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: 1900,
      currency: 'INR',
      customerEmail: email || 'student@checkout',
      customerName: name || 'Student',
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      accessToken: accessToken,
      tokenExpiresAt: tokenExpiresAt,
      source: 'client_verification'
    };

    savePayment(record);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully! Access granted.',
      accessToken: accessToken,
      expiresAt: tokenExpiresAt,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    console.error('Error during payment verification:', error.message);
    res.status(500).json({ error: 'Verification processing error' });
  }
};
