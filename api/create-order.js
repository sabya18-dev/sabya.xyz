const https = require('https');

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
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes('YOUR_RAZORPAY')) {
      return res.status(500).json({ error: 'Razorpay credentials not configured on server' });
    }

    const amount = 1900; // 19 INR in paise
    const currency = 'INR';
    const receipt = `dsa_rcpt_${Date.now()}`;

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

    res.status(200).json(orderData);
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};
