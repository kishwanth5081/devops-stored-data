const express = require('express');
const db = require('../database/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  try {
    const { action, entity_type, limit = 100 } = req.query;

    let query = `SELECT * FROM audit_logs WHERE user_id = ?`;
    const params = [req.user.id];

    if (action) {
      query += ` AND action = ?`;
      params.push(action);
    }

    if (entity_type) {
      query += ` AND entity_type = ?`;
      params.push(entity_type);
    }

    query += ` ORDER BY created_at DESC LIMIT ?`;
    params.push(parseInt(limit, 10));

    const logs = db.prepare(query).all(...params);
    res.json({ logs });
  } catch (err) {
    console.error('[Get Audit Logs Error]', err);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

module.exports = router;
