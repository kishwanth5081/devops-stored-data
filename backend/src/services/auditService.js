const crypto = require('crypto');
const db = require('../database/db');

function logAudit({ userId, userEmail, action, entityType, entityId, details, req }) {
  try {
    const id = crypto.randomUUID();
    const ip = req ? (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1') : 'internal';
    const detailStr = typeof details === 'object' ? JSON.stringify(details) : String(details || '');

    const stmt = db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_email, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    stmt.run(id, userId || 'system', userEmail || 'system', action, entityType, entityId || null, detailStr, ip);
  } catch (err) {
    console.error('[AuditLog Error]', err.message);
  }
}

module.exports = { logAudit };
