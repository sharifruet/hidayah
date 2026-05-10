import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hidayah-admin-secret-change-in-production';

export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice(7);
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function signToken(payload) {
  const JWT_SECRET = process.env.JWT_SECRET || 'hidayah-admin-secret-change-in-production';
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
