const express = require('express');
const crypto = require('crypto');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');
const { logAudit } = require('../services/auditService');

const router = express.Router();

// GET all folders with file count and total size
router.get('/', authenticateToken, (req, res) => {
  try {
    const { category } = req.query;

    let query = `
      SELECT 
        f.*,
        COUNT(fl.id) as file_count,
        COALESCE(SUM(fl.file_size), 0) as total_size
      FROM folders f
      LEFT JOIN files fl ON fl.folder_id = f.id AND fl.uploaded_by = f.created_by
      WHERE f.created_by = ?
    `;
    const params = [req.user.id];

    if (category) {
      query += ` AND f.category = ? `;
      params.push(category);
    }

    query += ` GROUP BY f.id ORDER BY f.name ASC `;

    const folders = db.prepare(query).all(...params);
    res.json({ folders });
  } catch (err) {
    console.error('[Get Folders Error]', err);
    res.status(500).json({ error: 'Failed to fetch folders: ' + err.message });
  }
});

// GET single folder with its files
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const folder = db.prepare('SELECT * FROM folders WHERE id = ? AND created_by = ?').get(req.params.id, req.user.id);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const files = db.prepare(`
      SELECT f.*, p.title as poc_title
      FROM files f
      LEFT JOIN pocs p ON f.poc_id = p.id
      WHERE f.folder_id = ? AND f.uploaded_by = ?
      ORDER BY f.original_name ASC
    `).all(folder.id, req.user.id);

    res.json({ folder, files });
  } catch (err) {
    console.error('[Get Folder Error]', err);
    res.status(500).json({ error: 'Failed to fetch folder' });
  }
});

// CREATE Folder
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, description, color, category } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Folder name is required' });
    }

    const cleanName = name.trim();
    const folderCategory = category || 'pdf';
    const folderColor = color || 'rose';

    // Check if folder with same name already exists in category for this user
    const existing = db.prepare('SELECT id FROM folders WHERE LOWER(name) = ? AND category = ? AND created_by = ?').get(cleanName.toLowerCase(), folderCategory, req.user.id);
    if (existing) {
      return res.status(400).json({ error: `A folder named "${cleanName}" already exists.` });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO folders (id, name, description, color, category, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, cleanName, description ? description.trim() : null, folderColor, folderCategory, req.user.id, now, now);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'FOLDER_CREATED',
      entityType: 'FOLDER',
      entityId: id,
      details: `Created folder: ${cleanName}`,
      req
    });

    const created = db.prepare('SELECT * FROM folders WHERE id = ?').get(id);
    res.status(201).json({ message: 'Folder created successfully', folder: { ...created, file_count: 0, total_size: 0 } });
  } catch (err) {
    console.error('[Create Folder Error]', err);
    res.status(500).json({ error: 'Failed to create folder: ' + err.message });
  }
});

// UPDATE Folder
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { name, description, color } = req.body;
    const folder = db.prepare('SELECT * FROM folders WHERE id = ? AND created_by = ?').get(req.params.id, req.user.id);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const updatedName = name && name.trim() ? name.trim() : folder.name;
    const updatedDesc = description !== undefined ? (description ? description.trim() : null) : folder.description;
    const updatedColor = color || folder.color;

    // Check duplicate name for this user
    const existing = db.prepare('SELECT id FROM folders WHERE LOWER(name) = ? AND category = ? AND id != ? AND created_by = ?').get(updatedName.toLowerCase(), folder.category, folder.id, req.user.id);
    if (existing) {
      return res.status(400).json({ error: `Another folder named "${updatedName}" already exists.` });
    }

    db.prepare(`
      UPDATE folders
      SET name = ?, description = ?, color = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND created_by = ?
    `).run(updatedName, updatedDesc, updatedColor, folder.id, req.user.id);

    // Also update folder_name in files table for this user's files
    db.prepare('UPDATE files SET folder_name = ? WHERE folder_id = ? AND uploaded_by = ?').run(updatedName, folder.id, req.user.id);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'FOLDER_UPDATED',
      entityType: 'FOLDER',
      entityId: folder.id,
      details: `Updated folder: ${updatedName}`,
      req
    });

    const updated = db.prepare(`
      SELECT 
        f.*,
        COUNT(fl.id) as file_count,
        COALESCE(SUM(fl.file_size), 0) as total_size
      FROM folders f
      LEFT JOIN files fl ON fl.folder_id = f.id AND fl.uploaded_by = f.created_by
      WHERE f.id = ? AND f.created_by = ?
      GROUP BY f.id
    `).get(folder.id, req.user.id);

    res.json({ message: 'Folder updated successfully', folder: updated });
  } catch (err) {
    console.error('[Update Folder Error]', err);
    res.status(500).json({ error: 'Failed to update folder: ' + err.message });
  }
});

// DELETE Folder
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const folder = db.prepare('SELECT * FROM folders WHERE id = ? AND created_by = ?').get(req.params.id, req.user.id);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Unlink files from this folder (files are not deleted, just uncategorized)
    db.prepare('UPDATE files SET folder_id = NULL, folder_name = NULL WHERE folder_id = ? AND uploaded_by = ?').run(folder.id, req.user.id);

    // Delete folder
    db.prepare('DELETE FROM folders WHERE id = ? AND created_by = ?').run(folder.id, req.user.id);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'FOLDER_DELETED',
      entityType: 'FOLDER',
      entityId: folder.id,
      details: `Deleted folder: ${folder.name}`,
      req
    });

    res.json({ message: `Folder "${folder.name}" deleted successfully` });
  } catch (err) {
    console.error('[Delete Folder Error]', err);
    res.status(500).json({ error: 'Failed to delete folder: ' + err.message });
  }
});

// ASSIGN Files to Folder
router.post('/:id/assign', authenticateToken, (req, res) => {
  try {
    const { fileIds } = req.body;
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ error: 'fileIds array is required' });
    }

    const folder = db.prepare('SELECT * FROM folders WHERE id = ? AND created_by = ?').get(req.params.id, req.user.id);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const updateStmt = db.prepare('UPDATE files SET folder_id = ?, folder_name = ? WHERE id = ? AND uploaded_by = ?');
    const updateMany = db.transaction((ids) => {
      for (const fid of ids) {
        updateStmt.run(folder.id, folder.name, fid, req.user.id);
      }
    });

    updateMany(fileIds);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'FILES_ASSIGNED_TO_FOLDER',
      entityType: 'FOLDER',
      entityId: folder.id,
      details: `Assigned ${fileIds.length} file(s) to folder "${folder.name}"`,
      req
    });

    res.json({ message: `${fileIds.length} file(s) assigned to "${folder.name}" successfully` });
  } catch (err) {
    console.error('[Assign Files to Folder Error]', err);
    res.status(500).json({ error: 'Failed to assign files: ' + err.message });
  }
});

// REMOVE Files from Folder (Unassign)
router.post('/unassign', authenticateToken, (req, res) => {
  try {
    const { fileIds } = req.body;
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ error: 'fileIds array is required' });
    }

    const updateStmt = db.prepare('UPDATE files SET folder_id = NULL, folder_name = NULL WHERE id = ? AND uploaded_by = ?');
    const updateMany = db.transaction((ids) => {
      for (const fid of ids) {
        updateStmt.run(fid, req.user.id);
      }
    });

    updateMany(fileIds);

    res.json({ message: `${fileIds.length} file(s) unassigned from folders` });
  } catch (err) {
    console.error('[Unassign Files Error]', err);
    res.status(500).json({ error: 'Failed to unassign files: ' + err.message });
  }
});

module.exports = router;
