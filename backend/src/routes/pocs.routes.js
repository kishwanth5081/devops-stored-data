const express = require('express');
const crypto = require('crypto');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');
const { logAudit } = require('../services/auditService');

const router = express.Router();

// GET all POCs with search & filters
router.get('/', authenticateToken, (req, res) => {
  try {
    const { search, category, status, environment } = req.query;

    let query = `
      SELECT p.*, 
        (SELECT COUNT(*) FROM tasks t WHERE t.poc_id = p.id) as task_count,
        (SELECT COUNT(*) FROM files f WHERE f.poc_id = p.id) as file_count,
        (SELECT COUNT(*) FROM notes n WHERE n.poc_id = p.id) as note_count
      FROM pocs p
      WHERE p.author_id = ?
    `;
    const params = [req.user.id];

    if (search) {
      query += ` AND (p.title LIKE ? OR p.summary LIKE ? OR p.tags LIKE ? OR p.description LIKE ?)`;
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    if (category && category !== 'All') {
      query += ` AND p.category = ?`;
      params.push(category);
    }

    if (status && status !== 'All') {
      query += ` AND p.status = ?`;
      params.push(status);
    }

    if (environment && environment !== 'All') {
      query += ` AND p.environment = ?`;
      params.push(environment);
    }

    query += ` ORDER BY p.updated_at DESC`;

    const pocs = db.prepare(query).all(...params);

    // Parse tags JSON
    const parsed = pocs.map(p => ({
      ...p,
      tags: (() => {
        try { return JSON.parse(p.tags || '[]'); } catch { return []; }
      })()
    }));

    res.json({ pocs: parsed });
  } catch (err) {
    console.error('[Get POCs Error]', err);
    res.status(500).json({ error: 'Failed to fetch POCs' });
  }
});

// GET single POC by ID with attached tasks, files, notes
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const poc = db.prepare('SELECT * FROM pocs WHERE id = ? AND author_id = ?').get(req.params.id, req.user.id);
    if (!poc) {
      return res.status(404).json({ error: 'POC not found' });
    }

    poc.tags = (() => {
      try { return JSON.parse(poc.tags || '[]'); } catch { return []; }
    })();

    const tasks = db.prepare('SELECT * FROM tasks WHERE poc_id = ? ORDER BY created_at DESC').all(poc.id);
    const files = db.prepare('SELECT * FROM files WHERE poc_id = ? ORDER BY created_at DESC').all(poc.id);
    const notes = db.prepare('SELECT * FROM notes WHERE poc_id = ? ORDER BY created_at DESC').all(poc.id);

    res.json({
      poc,
      tasks: tasks.map(t => ({
        ...t,
        tags: (() => { try { return JSON.parse(t.tags || '[]'); } catch { return []; } })()
      })),
      files,
      notes
    });
  } catch (err) {
    console.error('[Get Single POC Error]', err);
    res.status(500).json({ error: 'Failed to fetch POC details' });
  }
});

// CREATE POC
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, summary, description, category, status, environment, tags, repository_url } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'POC Title is required' });
    }

    const id = crypto.randomUUID();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString(36);
    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO pocs (id, title, slug, summary, description, category, status, environment, tags, repository_url, author_id, author_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title.trim(),
      slug,
      summary || '',
      description || '',
      category || 'Infrastructure',
      status || 'Draft',
      environment || 'Multi-Cloud',
      tagsJson,
      repository_url || '',
      req.user.id,
      req.user.name,
      now,
      now
    );

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'POC_CREATED',
      entityType: 'POC',
      entityId: id,
      details: `Created POC: ${title}`,
      req
    });

    res.status(201).json({ id, message: 'POC created successfully' });
  } catch (err) {
    console.error('[Create POC Error]', err);
    res.status(500).json({ error: 'Failed to create POC' });
  }
});

// UPDATE POC
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, description, category, status, environment, tags, repository_url } = req.body;

    const existing = db.prepare('SELECT id FROM pocs WHERE id = ? AND author_id = ?').get(id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'POC not found' });
    }

    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE pocs
      SET title = ?, summary = ?, description = ?, category = ?, status = ?, environment = ?, tags = ?, repository_url = ?, updated_at = ?
      WHERE id = ? AND author_id = ?
    `).run(
      title.trim(),
      summary || '',
      description || '',
      category,
      status,
      environment,
      tagsJson,
      repository_url || '',
      now,
      id,
      req.user.id
    );

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'POC_UPDATED',
      entityType: 'POC',
      entityId: id,
      details: `Updated POC: ${title}`,
      req
    });

    res.json({ message: 'POC updated successfully' });
  } catch (err) {
    console.error('[Update POC Error]', err);
    res.status(500).json({ error: 'Failed to update POC' });
  }
});

// DELETE POC
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT title FROM pocs WHERE id = ? AND author_id = ?').get(id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'POC not found' });
    }

    db.prepare('DELETE FROM pocs WHERE id = ? AND author_id = ?').run(id, req.user.id);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'POC_DELETED',
      entityType: 'POC',
      entityId: id,
      details: `Deleted POC: ${existing.title}`,
      req
    });

    res.json({ message: 'POC deleted successfully' });
  } catch (err) {
    console.error('[Delete POC Error]', err);
    res.status(500).json({ error: 'Failed to delete POC' });
  }
});

module.exports = router;
