const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Paths
const DATA_DIR = path.join(__dirname, 'data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const PROTECTED_PDF_PATH = path.join(__dirname, 'protected', 'dsa-placement-sheet.pdf');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PAYMENTS_FILE)) {
  fs.writeFileSync(PAYMENTS_FILE, JSON.stringify([]), 'utf8');
}

// Helpers for payment storage
function getPayments() {
  try {
    const data = fs.readFileSync(PAYMENTS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading payments file:', err);
    return [];
  }
}

function savePayment(paymentRecord) {
  try {
    const payments = getPayments();
    payments.push(paymentRecord);
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving payment record:', err);
    return false;
  }
}

function findPaymentByToken(token) {
  if (!token) return null;
  const payments = getPayments();
  const found = payments.find(p => p.accessToken === token && p.status === 'verified');
  if (!found) return null;
  if (found.tokenExpiresAt && Date.now() > found.tokenExpiresAt) {
    return null; // Expired
  }
  return found;
}

// Helper: Make Razorpay API HTTPS request
function razorpayRequest(endpoint, method, payload, keyId, keySecret) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const dataString = payload ? JSON.stringify(payload) : '';

    const options = {
      hostname: 'api.razorpay.com',
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(json.error ? json.error.description : `Razorpay error: ${body}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (dataString) {
      req.write(dataString);
    }
    req.end();
  });
}

// 1. Config endpoint: Returns Key ID to frontend (NEVER returns secret)
app.get('/api/config', (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID;
  const isConfigured = Boolean(keyId && process.env.RAZORPAY_KEY_SECRET && !keyId.includes('YOUR_RAZORPAY'));
  
  res.json({
    isConfigured,
    keyId: isConfigured ? keyId : null,
    amount: 1900, // 1900 paise = 19 INR
    currency: 'INR',
    productName: 'DSA Placement Preparation Sheet'
  });
});

// 2. Health check
app.get('/api/health', (req, res) => {
  const pdfExists = fs.existsSync(PROTECTED_PDF_PATH);
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    pdfAvailable: pdfExists,
    pdfSize: pdfExists ? fs.statSync(PROTECTED_PDF_PATH).size : 0
  });
});

// 3. Create Order
app.post('/api/create-order', async (req, res) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const amount = 1900; // 19 INR in paise
    const currency = 'INR';
    const receipt = `dsa_rcpt_${Date.now()}`;

    // If Razorpay keys are not yet configured or placeholder, support demo/mock order so the user can test the UI
    if (!keyId || !keySecret || keyId.includes('YOUR_RAZORPAY') || keySecret.includes('YOUR_RAZORPAY')) {
      console.log('[Notice] Razorpay keys not configured. Generating test demo order.');
      const demoOrder = {
        id: `order_demo_${Date.now()}`,
        amount: amount,
        currency: currency,
        receipt: receipt,
        isDemo: true,
        message: 'Demo mode active. To accept real payments, configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
      };
      return res.json(demoOrder);
    }

    // Call official Razorpay API to create order
    const orderData = await razorpayRequest(
      '/v1/orders',
      'POST',
      {
        amount: amount,
        currency: currency,
        receipt: receipt,
        notes: {
          product: 'DSA Placement Preparation Sheet',
          price: '₹19 INR'
        }
      },
      keyId,
      keySecret
    );

    res.json(orderData);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      error: 'Failed to create payment order',
      details: error.message
    });
  }
});

// 4. Verify Payment
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, name, isDemo } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let isAuthentic = false;

    // Handle Demo mode verification (for preview/testing before API keys are added)
    if (isDemo || razorpay_order_id.startsWith('order_demo_')) {
      isAuthentic = true;
    } else {
      if (!keySecret) {
        return res.status(500).json({ error: 'Server configuration error: Razorpay Secret is missing' });
      }

      // Generate expected HMAC SHA256 signature
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      // Constant-time comparison to prevent timing attacks
      if (razorpay_signature && razorpay_signature.length === expectedSignature.length) {
        isAuthentic = crypto.timingSafeEqual(
          Buffer.from(expectedSignature, 'utf-8'),
          Buffer.from(razorpay_signature, 'utf-8')
        );
      }
    }

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature. Payment verification failed.'
      });
    }

    // Generate secure access token valid for 30 days
    const accessToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    const paymentRecord = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: 1900,
      currency: 'INR',
      customerEmail: email || 'anonymous',
      customerName: name || 'Student',
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      accessToken: accessToken,
      tokenExpiresAt: tokenExpiresAt,
      isDemo: Boolean(isDemo || razorpay_order_id.startsWith('order_demo_'))
    };

    savePayment(paymentRecord);

    res.json({
      success: true,
      message: 'Payment verified successfully! Access granted.',
      accessToken: accessToken,
      expiresAt: tokenExpiresAt,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    console.error('Error during payment verification:', error);
    res.status(500).json({ error: 'Internal server error during verification' });
  }
});

// 5. Verify existing access token (e.g. on page refresh from localStorage)
app.get('/api/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = req.query.token || (authHeader && authHeader.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ valid: false, error: 'No token provided' });
  }

  const payment = findPaymentByToken(token);
  if (!payment) {
    return res.status(403).json({ valid: false, error: 'Token invalid or expired' });
  }

  res.json({
    valid: true,
    paymentId: payment.paymentId,
    verifiedAt: payment.verifiedAt
  });
});

// 6. Protected PDF - View in Browser (Inline)
app.get('/api/pdf/view', (req, res) => {
  const token = req.query.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).send('<h1>401 Unauthorized</h1><p>Access token is required to view the premium notes.</p>');
  }

  const payment = findPaymentByToken(token);
  if (!payment) {
    return res.status(403).send('<h1>403 Forbidden</h1><p>Invalid or expired access token. Please purchase the DSA sheet to view.</p>');
  }

  if (!fs.existsSync(PROTECTED_PDF_PATH)) {
    return res.status(404).send('<h1>404 Not Found</h1><p>PDF file is currently unavailable on server.</p>');
  }

  const stat = fs.statSync(PROTECTED_PDF_PATH);
  const fileSize = stat.size;
  const range = req.headers.range;

  // Support range requests for fast PDF viewing & jumping to pages
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(PROTECTED_PDF_PATH, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="DSA-Placement-Preparation-Sheet.pdf"'
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="DSA-Placement-Preparation-Sheet.pdf"',
      'Accept-Ranges': 'bytes'
    };
    res.writeHead(200, head);
    fs.createReadStream(PROTECTED_PDF_PATH).pipe(res);
  }
});

// 7. Protected PDF - Download (Attachment)
app.get('/api/pdf/download', (req, res) => {
  const token = req.query.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const payment = findPaymentByToken(token);
  if (!payment) {
    return res.status(403).json({ error: 'Access denied. Please purchase the premium notes.' });
  }

  if (!fs.existsSync(PROTECTED_PDF_PATH)) {
    return res.status(404).json({ error: 'PDF file not found' });
  }

  res.download(PROTECTED_PDF_PATH, 'DSA-Placement-Preparation-Sheet.pdf', (err) => {
    if (err) {
      console.error('Error during PDF download:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Could not download file' });
      }
    }
  });
});

// Serve frontend build if present (for single-command production run)
const BUILD_PATH = path.join(__dirname, '..', 'build');
if (fs.existsSync(BUILD_PATH)) {
  app.use(express.static(BUILD_PATH));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(BUILD_PATH, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Protected PDF size: ${fs.existsSync(PROTECTED_PDF_PATH) ? fs.statSync(PROTECTED_PDF_PATH).size : 0} bytes`);
});
