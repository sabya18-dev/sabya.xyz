const fs = require('fs');
const path = require('path');

const IS_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = IS_VERCEL ? path.join('/tmp', 'data') : path.join(process.cwd(), 'server', 'data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const PROTECTED_PDF_PATH = path.join(process.cwd(), 'server', 'protected', 'dsa-placement-sheet.pdf');

function isTokenValid(token) {
  if (!token) return false;
  try {
    if (!fs.existsSync(PAYMENTS_FILE)) return false;
    const payments = JSON.parse(fs.readFileSync(PAYMENTS_FILE, 'utf8') || '[]');
    const found = payments.find(p => p.accessToken === token && p.status === 'verified');
    if (!found) return false;
    if (found.tokenExpiresAt && Date.now() > found.tokenExpiresAt) return false;
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = function handler(req, res) {
  const token = req.query.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  const action = req.query.action || (req.url.includes('download') ? 'download' : 'view');

  if (!token || !isTokenValid(token)) {
    return res.status(403).json({ error: 'Access denied: Valid purchase token required.' });
  }

  // If running where the local protected PDF exists
  if (fs.existsSync(PROTECTED_PDF_PATH)) {
    const stat = fs.statSync(PROTECTED_PDF_PATH);
    const disposition = action === 'download'
      ? 'attachment; filename="DSA-Placement-Preparation-Sheet.pdf"'
      : 'inline; filename="DSA-Placement-Preparation-Sheet.pdf"';

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Length': stat.size,
      'Content-Disposition': disposition
    });
    return fs.createReadStream(PROTECTED_PDF_PATH).pipe(res);
  }

  // If on Vercel and an external private storage link is configured
  if (process.env.PRIVATE_PDF_URL) {
    return res.redirect(process.env.PRIVATE_PDF_URL);
  }

  res.status(404).json({ error: 'PDF file unavailable' });
};
