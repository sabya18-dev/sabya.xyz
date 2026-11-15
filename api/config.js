module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID;
  const isConfigured = Boolean(keyId && process.env.RAZORPAY_KEY_SECRET && !keyId.includes('YOUR_RAZORPAY'));

  res.status(200).json({
    isConfigured,
    keyId: isConfigured ? keyId : null,
    amount: 1900,
    currency: 'INR',
    productName: 'DSA Placement Preparation Sheet'
  });
};
