const jwt = require('jsonwebtoken');
const config = require('../config/env');
const db = require('../database/db');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || (req.query ? req.query.token : null);

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please log in.' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
    }

    // Verify user still exists in DB
    const dbUser = db.prepare('SELECT id, email, name, role, avatar FROM users WHERE id = ?').get(user.id);
    if (!dbUser) {
      return res.status(403).json({ error: 'User account no longer exists.' });
    }

    req.user = dbUser;
    next();
  });
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: Requires one of [${allowedRoles.join(', ')}] permissions.` });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin: requireRole('admin')
};
