const express = require('express');
const crypto = require('crypto');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');
const { logAudit } = require('../services/auditService');

const router = express.Router();

// GET all notes
router.get('/', authenticateToken, (req, res) => {
  try {
    const { search, category, poc_id } = req.query;

    let query = `
      SELECT n.*, p.title as poc_title
      FROM notes n
      LEFT JOIN pocs p ON n.poc_id = p.id
      WHERE n.author_id = ?
    `;
    const params = [req.user.id];

    if (search) {
      query += ` AND (n.title LIKE ? OR n.content LIKE ? OR n.tags LIKE ?)`;
      params.push(`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (category && category !== 'All') {
      query += ` AND n.category = ?`;
      params.push(category);
    }

    if (poc_id) {
      query += ` AND n.poc_id = ?`;
      params.push(poc_id);
    }

    query += ` ORDER BY n.updated_at DESC`;

    const notes = db.prepare(query).all(...params);

    const parsed = notes.map(note => ({
      ...note,
      tags: (() => { try { return JSON.parse(note.tags || '[]'); } catch { return []; } })()
    }));

    res.json({ notes: parsed });
  } catch (err) {
    console.error('[Get Notes Error]', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// GET single note
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const note = db.prepare(`
      SELECT n.*, p.title as poc_title
      FROM notes n
      LEFT JOIN pocs p ON n.poc_id = p.id
      WHERE n.id = ? AND n.author_id = ?
    `).get(req.params.id, req.user.id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.tags = (() => { try { return JSON.parse(note.tags || '[]'); } catch { return []; } })();

    res.json({ note });
  } catch (err) {
    console.error('[Get Single Note Error]', err);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// CREATE note
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, content, category, poc_id, tags } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Note title is required' });
    }

    const id = crypto.randomUUID();
    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO notes (id, poc_id, title, content, category, tags, author_id, author_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      poc_id || null,
      title.trim(),
      content || '',
      category || 'Documentation',
      tagsJson,
      req.user.id,
      req.user.name,
      now,
      now
    );

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'NOTE_CREATED',
      entityType: 'NOTE',
      entityId: id,
      details: `Created note: ${title}`,
      req
    });

    res.status(201).json({ id, message: 'Note created successfully' });
  } catch (err) {
    console.error('[Create Note Error]', err);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// UPDATE note
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, poc_id, tags } = req.body;

    const existing = db.prepare('SELECT id FROM notes WHERE id = ? AND author_id = ?').get(id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE notes
      SET title = ?, content = ?, category = ?, poc_id = ?, tags = ?, updated_at = ?
      WHERE id = ? AND author_id = ?
    `).run(
      title.trim(),
      content || '',
      category,
      poc_id || null,
      tagsJson,
      now,
      id,
      req.user.id
    );

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'NOTE_UPDATED',
      entityType: 'NOTE',
      entityId: id,
      details: `Updated note: ${title}`,
      req
    });

    res.json({ message: 'Note updated successfully' });
  } catch (err) {
    console.error('[Update Note Error]', err);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE note
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT title FROM notes WHERE id = ? AND author_id = ?').get(id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    db.prepare('DELETE FROM notes WHERE id = ? AND author_id = ?').run(id, req.user.id);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'NOTE_DELETED',
      entityType: 'NOTE',
      entityId: id,
      details: `Deleted note: ${existing.title}`,
      req
    });

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('[Delete Note Error]', err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;
