const fs = require('fs');
const path = require('path');

const IS_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = IS_VERCEL ? path.join('/tmp', 'data') : path.join(process.cwd(), 'server', 'data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.query.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) {
    return res.status(401).json({ valid: false, error: 'No token provided' });
  }

  let payments = [];
  try {
    if (fs.existsSync(PAYMENTS_FILE)) {
      payments = JSON.parse(fs.readFileSync(PAYMENTS_FILE, 'utf8') || '[]');
    }
  } catch (e) {}

  const found = payments.find(p => p.accessToken === token && p.status === 'verified');
  if (!found || (found.tokenExpiresAt && Date.now() > found.tokenExpiresAt)) {
    return res.status(403).json({ valid: false, error: 'Token invalid or expired' });
  }

  res.status(200).json({
    valid: true,
    paymentId: found.paymentId,
    verifiedAt: found.verifiedAt
  });
};
