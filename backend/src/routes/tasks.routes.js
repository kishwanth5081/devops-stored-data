const express = require('express');
const crypto = require('crypto');
const path = require('path');
const db = require('../database/db');
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const { logAudit } = require('../services/auditService');

const router = express.Router();

// GET all tasks with search & filters
router.get('/', authenticateToken, (req, res) => {
  try {
    const { search, status, priority, category, poc_id } = req.query;

    let query = `
      SELECT t.*, p.title as poc_title,
        (SELECT COUNT(*) FROM files f WHERE f.task_id = t.id) as file_count,
        (SELECT COUNT(*) FROM files f WHERE f.task_id = t.id AND (f.file_type = '.pdf' OR f.category = 'PDF Document')) as pdf_count,
        (SELECT f.id FROM files f WHERE f.task_id = t.id AND (f.file_type = '.pdf' OR f.category = 'PDF Document') ORDER BY f.created_at DESC LIMIT 1) as pdf_file_id,
        (SELECT f.original_name FROM files f WHERE f.task_id = t.id AND (f.file_type = '.pdf' OR f.category = 'PDF Document') ORDER BY f.created_at DESC LIMIT 1) as pdf_file_name,
        (SELECT f.file_size FROM files f WHERE f.task_id = t.id AND (f.file_type = '.pdf' OR f.category = 'PDF Document') ORDER BY f.created_at DESC LIMIT 1) as pdf_file_size
      FROM tasks t
      LEFT JOIN pocs p ON t.poc_id = p.id
      WHERE (t.created_by = ? OR t.assigned_to = ?)
    `;
    const params = [req.user.id, req.user.id];

    if (search) {
      query += ` AND (t.title LIKE ? OR t.description LIKE ? OR t.tags LIKE ?)`;
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    if (status && status !== 'All') {
      query += ` AND t.status = ?`;
      params.push(status);
    }

    if (priority && priority !== 'All') {
      query += ` AND t.priority = ?`;
      params.push(priority);
    }

    if (category && category !== 'All') {
      query += ` AND t.category = ?`;
      params.push(category);
    }

    if (poc_id) {
      query += ` AND t.poc_id = ?`;
      params.push(poc_id);
    }

    query += ` ORDER BY t.created_at DESC`;

    const tasks = db.prepare(query).all(...params);

    const parsed = tasks.map(t => ({
      ...t,
      tags: (() => {
        try { return JSON.parse(t.tags || '[]'); } catch { return []; }
      })()
    }));

    res.json({ tasks: parsed });
  } catch (err) {
    console.error('[Get Tasks Error]', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET single task
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const task = db.prepare(`
      SELECT t.*, p.title as poc_title
      FROM tasks t
      LEFT JOIN pocs p ON t.poc_id = p.id
      WHERE t.id = ? AND (t.created_by = ? OR t.assigned_to = ?)
    `).get(req.params.id, req.user.id, req.user.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.tags = (() => {
      try { return JSON.parse(task.tags || '[]'); } catch { return []; }
    })();

    const files = db.prepare('SELECT * FROM files WHERE task_id = ?').all(task.id);

    res.json({ task, files });
  } catch (err) {
    console.error('[Get Single Task Error]', err);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// CREATE task (Supports JSON or multipart/form-data with attached PDF)
router.post('/', authenticateToken, upload.single('pdf'), (req, res) => {
  try {
    const { title, description, status, priority, category, poc_id, assigned_to, due_date, tags } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const id = crypto.randomUUID();
    let tagsJson = '[]';
    try {
      tagsJson = typeof tags === 'string' && tags.startsWith('[') ? tags : JSON.stringify(Array.isArray(tags) ? tags : (tags ? [tags] : []));
    } catch {
      tagsJson = '[]';
    }
    const now = new Date().toISOString();

    let assignedName = null;
    if (assigned_to) {
      const user = db.prepare('SELECT name FROM users WHERE id = ?').get(assigned_to);
      if (user) assignedName = user.name;
    }

    db.prepare(`
      INSERT INTO tasks (id, poc_id, title, description, status, priority, assigned_to, assigned_name, category, tags, due_date, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      poc_id || null,
      title.trim(),
      description || '',
      status || 'Backlog',
      priority || 'Medium',
      assigned_to || null,
      assignedName,
      category || 'DevOps',
      tagsJson,
      due_date || null,
      req.user.id,
      now,
      now
    );

    let attachedFile = null;
    if (req.file) {
      const fileId = crypto.randomUUID();
      const ext = path.extname(req.file.originalname).toLowerCase();
      db.prepare(`
        INSERT INTO files (id, poc_id, task_id, original_name, stored_name, file_path, file_size, file_type, mime_type, category, tags, uploaded_by, uploaded_by_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        fileId,
        poc_id || null,
        id,
        req.file.originalname,
        req.file.filename,
        req.file.path,
        req.file.size,
        ext,
        req.file.mimetype || 'application/pdf',
        ext === '.pdf' ? 'PDF Document' : 'Documentation',
        JSON.stringify(['Task Document', 'PDF']),
        req.user.id,
        req.user.name
      );

      attachedFile = {
        id: fileId,
        name: req.file.originalname,
        size: req.file.size
      };

      logAudit({
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'FILE_UPLOADED',
        entityType: 'FILE',
        entityId: fileId,
        details: `Uploaded ${req.file.originalname} for Task ${title}`,
        req
      });
    }

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'TASK_CREATED',
      entityType: 'TASK',
      entityId: id,
      details: `Created task: ${title} (${status})${attachedFile ? ' with attached PDF ' + attachedFile.name : ''}`,
      req
    });

    res.status(201).json({ id, message: 'Task created successfully', pdf: attachedFile });
  } catch (err) {
    console.error('[Create Task Error]', err);
    res.status(500).json({ error: 'Failed to create task: ' + err.message });
  }
});

// QUICK STATUS UPDATE (e.g. Kanban drag/drop or single click)
router.patch('/:id/status', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Backlog', 'In_Progress', 'Review', 'Completed', 'Blocked'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const existing = db.prepare('SELECT title, status FROM tasks WHERE id = ? AND (created_by = ? OR assigned_to = ?)').get(id, req.user.id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.prepare('UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND (created_by = ? OR assigned_to = ?)').run(status, id, req.user.id, req.user.id);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'TASK_STATUS_CHANGED',
      entityType: 'TASK',
      entityId: id,
      details: `Status changed from ${existing.status} to ${status}`,
      req
    });

    res.json({ message: 'Task status updated successfully', newStatus: status });
  } catch (err) {
    console.error('[Update Task Status Error]', err);
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

// UPDATE full task
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, category, poc_id, assigned_to, due_date, tags } = req.body;

    const existing = db.prepare('SELECT id FROM tasks WHERE id = ? AND (created_by = ? OR assigned_to = ?)').get(id, req.user.id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    let assignedName = null;
    if (assigned_to) {
      const user = db.prepare('SELECT name FROM users WHERE id = ?').get(assigned_to);
      if (user) assignedName = user.name;
    }

    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, status = ?, priority = ?, category = ?, poc_id = ?, assigned_to = ?, assigned_name = ?, due_date = ?, tags = ?, updated_at = ?
      WHERE id = ? AND (created_by = ? OR assigned_to = ?)
    `).run(
      title.trim(),
      description || '',
      status,
      priority,
      category,
      poc_id || null,
      assigned_to || null,
      assignedName,
      due_date || null,
      tagsJson,
      now,
      id,
      req.user.id,
      req.user.id
    );

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'TASK_UPDATED',
      entityType: 'TASK',
      entityId: id,
      details: `Updated task: ${title}`,
      req
    });

    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error('[Update Task Error]', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE task
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT title FROM tasks WHERE id = ? AND created_by = ?').get(id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.prepare('DELETE FROM tasks WHERE id = ? AND created_by = ?').run(id, req.user.id);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'TASK_DELETED',
      entityType: 'TASK',
      entityId: id,
      details: `Deleted task: ${existing.title}`,
      req
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('[Delete Task Error]', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
