const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('../database/db');
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const { logAudit } = require('../services/auditService');

const router = express.Router();

// Helper to determine category from file extension
function detectCategory(ext) {
  const e = ext.toLowerCase();
  if (e === '.pdf') return 'PDF Document';
  if (['.sh', '.bash', '.ps1', '.py', '.bat', '.rb', '.js', '.ts'].includes(e)) return 'Script';
  if (['.yaml', '.yml', '.json', '.tf', '.conf', '.ini', '.env', '.toml', '.xml'].includes(e)) return 'Config';
  if (['.md', '.docx', '.txt', '.doc', '.rtf'].includes(e)) return 'Documentation';
  if (['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'].includes(e)) return 'Diagram';
  if (['.log', '.out'].includes(e)) return 'Log';
  if (['.crt', '.pem', '.key', '.csr', '.cer'].includes(e)) return 'Certificate';
  return 'Other';
}

// UPLOAD File(s)
router.post('/upload', authenticateToken, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { poc_id, task_id, category, tags, folder_id, folder_name } = req.body;
    let resolvedFolderName = folder_name || null;
    if (folder_id && !resolvedFolderName) {
      try {
        const fRecord = db.prepare('SELECT name FROM folders WHERE id = ?').get(folder_id);
        if (fRecord) resolvedFolderName = fRecord.name;
      } catch {}
    }
    const tagsJson = JSON.stringify(tags ? (Array.isArray(tags) ? tags : [tags]) : []);
    const uploadedFiles = [];

    const insertStmt = db.prepare(`
      INSERT INTO files (id, poc_id, task_id, original_name, stored_name, file_path, file_size, file_type, mime_type, category, tags, uploaded_by, uploaded_by_name, folder_id, folder_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const f of req.files) {
      const id = crypto.randomUUID();
      const ext = path.extname(f.originalname).toLowerCase();
      const fileCategory = category || detectCategory(ext);

      insertStmt.run(
        id,
        poc_id || null,
        task_id || null,
        f.originalname,
        f.filename,
        f.path,
        f.size,
        ext,
        f.mimetype || 'application/octet-stream',
        fileCategory,
        tagsJson,
        req.user.id,
        req.user.name,
        folder_id || null,
        resolvedFolderName || null
      );

      uploadedFiles.push({
        id,
        original_name: f.originalname,
        file_size: f.size,
        category: fileCategory
      });

      logAudit({
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'FILE_UPLOADED',
        entityType: 'FILE',
        entityId: id,
        details: `Uploaded ${f.originalname} (${(f.size / 1024).toFixed(1)} KB) - Category: ${fileCategory}`,
        req
      });
    }

    res.status(201).json({
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles
    });
  } catch (err) {
    console.error('[Upload Files Error]', err);
    res.status(500).json({ error: 'Failed to upload file(s): ' + err.message });
  }
});

// GET all files with filters
router.get('/', authenticateToken, (req, res) => {
  try {
    const { search, category, poc_id, task_id, folder_id } = req.query;

    let query = `
      SELECT f.*, p.title as poc_title, t.title as task_title
      FROM files f
      LEFT JOIN pocs p ON f.poc_id = p.id
      LEFT JOIN tasks t ON f.task_id = t.id
      WHERE f.uploaded_by = ?
    `;
    const params = [req.user.id];

    if (search) {
      query += ` AND (f.original_name LIKE ? OR f.tags LIKE ?)`;
      params.push(`%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (category && category !== 'All') {
      query += ` AND f.category = ?`;
      params.push(category);
    }

    if (poc_id) {
      query += ` AND f.poc_id = ?`;
      params.push(poc_id);
    }

    if (task_id) {
      query += ` AND f.task_id = ?`;
      params.push(task_id);
    }

    if (folder_id) {
      if (folder_id === 'none' || folder_id === 'uncategorized') {
        query += ` AND (f.folder_id IS NULL OR f.folder_id = '')`;
      } else if (folder_id !== 'all') {
        query += ` AND f.folder_id = ?`;
        params.push(folder_id);
      }
    }

    query += ` ORDER BY f.created_at DESC`;

    const files = db.prepare(query).all(...params);

    const parsed = files.map(file => ({
      ...file,
      tags: (() => { try { return JSON.parse(file.tags || '[]'); } catch { return []; } })()
    }));

    res.json({ files: parsed });
  } catch (err) {
    console.error('[Get Files Error]', err);
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
});

// DOWNLOAD File
router.get('/:id/download', authenticateToken, (req, res) => {
  try {
    const file = db.prepare('SELECT * FROM files WHERE id = ? AND uploaded_by = ?').get(req.params.id, req.user.id);
    if (!file) {
      return res.status(404).json({ error: 'File record not found' });
    }

    if (!fs.existsSync(file.file_path)) {
      return res.status(404).json({ error: 'Physical file not found on disk' });
    }

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'FILE_DOWNLOADED',
      entityType: 'FILE',
      entityId: file.id,
      details: `Downloaded ${file.original_name}`,
      req
    });

    res.download(file.file_path, file.original_name);
  } catch (err) {
    console.error('[Download File Error]', err);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// VIEW File inline (especially PDF documents, images, and text files)
router.get('/:id/view', authenticateToken, (req, res) => {
  try {
    const file = db.prepare('SELECT * FROM files WHERE id = ? AND uploaded_by = ?').get(req.params.id, req.user.id);
    if (!file) {
      return res.status(404).send('File record not found');
    }

    if (!fs.existsSync(file.file_path)) {
      return res.status(404).send('Physical file not found on server disk');
    }

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'FILE_VIEWED',
      entityType: 'FILE',
      entityId: file.id,
      details: `Viewed ${file.original_name} (${file.file_type})`,
      req
    });

    const ext = (file.file_type || '').toLowerCase();
    let contentType = file.mime_type || 'application/octet-stream';
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (['.png', '.jpg', '.jpeg', '.svg', '.gif'].includes(ext)) {
      contentType = `image/${ext.replace('.', '')}`;
    } else if (['.txt', '.log', '.sh', '.py', '.yaml', '.yml', '.json', '.md'].includes(ext)) {
      contentType = 'text/plain; charset=utf-8';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.original_name)}"`);

    const stream = fs.createReadStream(file.file_path);
    stream.pipe(res);
  } catch (err) {
    console.error('[View File Error]', err);
    res.status(500).send('Failed to stream file: ' + err.message);
  }
});

// PREVIEW File Content (for scripts, configs, yaml, markdown, json, txt, and PDFs)
router.get('/:id/content', authenticateToken, (req, res) => {
  try {
    const file = db.prepare('SELECT * FROM files WHERE id = ? AND uploaded_by = ?').get(req.params.id, req.user.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const ext = (file.file_type || '').toLowerCase();

    // If PDF, provide the view streaming URL
    if (ext === '.pdf') {
      return res.json({
        id: file.id,
        original_name: file.original_name,
        file_type: file.file_type,
        category: file.category,
        is_pdf: true,
        view_url: `/api/files/${file.id}/view`
      });
    }

    // Restrict text preview to files under 2MB
    if (file.file_size > 2 * 1024 * 1024) {
      return res.status(400).json({ error: 'File is too large for inline text preview. Please download instead.' });
    }

    if (!fs.existsSync(file.file_path)) {
      return res.status(404).json({ error: 'Physical file not found' });
    }

    const content = fs.readFileSync(file.file_path, 'utf-8');
    res.json({
      id: file.id,
      original_name: file.original_name,
      file_type: file.file_type,
      category: file.category,
      is_pdf: false,
      content
    });
  } catch (err) {
    console.error('[Preview File Error]', err);
    res.status(500).json({ error: 'Could not read file preview: ' + err.message });
  }
});

// UPDATE File (metadata and optional text content)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { original_name, category, poc_id, tags, content, folder_id, folder_name } = req.body;
    const file = db.prepare('SELECT * FROM files WHERE id = ? AND uploaded_by = ?').get(req.params.id, req.user.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const updatedName = (original_name && original_name.trim()) || file.original_name;
    const updatedCategory = category || file.category;
    const updatedPocId = poc_id !== undefined ? (poc_id || null) : file.poc_id;
    let updatedFolderId = folder_id !== undefined ? (folder_id || null) : file.folder_id;
    let updatedFolderName = folder_name !== undefined ? (folder_name || null) : file.folder_name;

    if (folder_id && !folder_name) {
      try {
        const fRecord = db.prepare('SELECT name FROM folders WHERE id = ? AND created_by = ?').get(folder_id, req.user.id);
        if (fRecord) updatedFolderName = fRecord.name;
      } catch {}
    } else if (folder_id === null || folder_id === '') {
      updatedFolderId = null;
      updatedFolderName = null;
    }

    let tagsJson = file.tags;
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        tagsJson = JSON.stringify(tags);
      } else if (typeof tags === 'string') {
        const splitTags = tags.split(',').map(t => t.trim()).filter(Boolean);
        tagsJson = JSON.stringify(splitTags);
      }
    }

    // If text content is updated and physical file exists, write updated content to disk
    let newSize = file.file_size;
    if (content !== undefined && fs.existsSync(file.file_path)) {
      const ext = (file.file_type || '').toLowerCase();
      if (!['.pdf', '.png', '.jpg', '.jpeg', '.zip', '.tar', '.gz'].includes(ext)) {
        fs.writeFileSync(file.file_path, content, 'utf-8');
        newSize = Buffer.byteLength(content, 'utf-8');
      }
    }

    db.prepare(`
      UPDATE files 
      SET original_name = ?, category = ?, poc_id = ?, tags = ?, file_size = ?, folder_id = ?, folder_name = ?
      WHERE id = ? AND uploaded_by = ?
    `).run(updatedName, updatedCategory, updatedPocId, tagsJson, newSize, updatedFolderId, updatedFolderName, file.id, req.user.id);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'FILE_UPDATED',
      entityType: 'FILE',
      entityId: file.id,
      details: `Updated file ${updatedName}`,
      req
    });

    const updated = db.prepare('SELECT * FROM files WHERE id = ? AND uploaded_by = ?').get(file.id, req.user.id);
    res.json({ message: 'File updated successfully', file: updated });
  } catch (err) {
    console.error('[Update File Error]', err);
    res.status(500).json({ error: 'Failed to update file: ' + err.message });
  }
});

// DELETE File
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const file = db.prepare('SELECT * FROM files WHERE id = ? AND uploaded_by = ?').get(req.params.id, req.user.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Remove from disk if present
    if (fs.existsSync(file.file_path)) {
      try {
        fs.unlinkSync(file.file_path);
      } catch (e) {
        console.warn('[File unlink warning]', e.message);
      }
    }

    db.prepare('DELETE FROM files WHERE id = ? AND uploaded_by = ?').run(file.id, req.user.id);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'FILE_DELETED',
      entityType: 'FILE',
      entityId: file.id,
      details: `Deleted file ${file.original_name}`,
      req
    });

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('[Delete File Error]', err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
