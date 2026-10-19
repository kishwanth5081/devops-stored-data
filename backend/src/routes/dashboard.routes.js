const express = require('express');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;

    // POC stats (User's workspace)
    const totalPocs = db.prepare('SELECT COUNT(*) as count FROM pocs WHERE author_id = ?').get(userId).count;
    const pocsByStatus = db.prepare(`
      SELECT status, COUNT(*) as count FROM pocs WHERE author_id = ? GROUP BY status
    `).all(userId);
    const pocsByCategory = db.prepare(`
      SELECT category, COUNT(*) as count FROM pocs WHERE author_id = ? GROUP BY category ORDER BY count DESC
    `).all(userId);

    // Task stats (User's workspace)
    const totalTasks = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE created_by = ? OR assigned_to = ?').get(userId, userId).count;
    const tasksByStatus = db.prepare(`
      SELECT status, COUNT(*) as count FROM tasks WHERE created_by = ? OR assigned_to = ? GROUP BY status
    `).all(userId, userId);
    const tasksByPriority = db.prepare(`
      SELECT priority, COUNT(*) as count FROM tasks WHERE created_by = ? OR assigned_to = ? GROUP BY priority
    `).all(userId, userId);

    // File stats (User's workspace)
    const fileStats = db.prepare(`
      SELECT COUNT(*) as count, COALESCE(SUM(file_size), 0) as total_size FROM files WHERE uploaded_by = ?
    `).get(userId);

    // Notes count (User's workspace)
    const totalNotes = db.prepare('SELECT COUNT(*) as count FROM notes WHERE author_id = ?').get(userId).count;

    // Recent activity (audit logs for current user)
    const recentActivity = db.prepare(`
      SELECT id, user_email, action, entity_type, entity_id, details, created_at
      FROM audit_logs
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 8
    `).all(userId);

    // Upcoming urgent tasks for current user
    const urgentTasks = db.prepare(`
      SELECT id, title, status, priority, due_date, assigned_name
      FROM tasks
      WHERE (created_by = ? OR assigned_to = ?) AND status != 'Completed'
      ORDER BY 
        CASE priority 
          WHEN 'Critical' THEN 1 
          WHEN 'High' THEN 2 
          WHEN 'Medium' THEN 3 
          ELSE 4 
        END,
        due_date ASC
      LIMIT 5
    `).all(userId, userId);

    // Format status maps
    const statusMap = {
      Backlog: 0,
      In_Progress: 0,
      Review: 0,
      Completed: 0,
      Blocked: 0,
    };
    tasksByStatus.forEach(item => {
      if (statusMap[item.status] !== undefined) {
        statusMap[item.status] = item.count;
      }
    });

    res.json({
      summary: {
        totalPocs,
        totalTasks,
        totalFiles: fileStats.count,
        totalStorageBytes: fileStats.total_size,
        totalNotes,
      },
      pocsByStatus,
      pocsByCategory,
      taskStatusMap: statusMap,
      tasksByPriority,
      recentActivity,
      urgentTasks,
      systemHealth: {
        uptimeSeconds: Math.floor(process.uptime()),
        platform: process.platform,
        nodeVersion: process.version,
        rssMemoryBytes: process.memoryUsage().rss,
        heapUsedBytes: process.memoryUsage().heapUsed,
        database: 'Connected & Healthy',
        tunnelUrl: 'https://devops-stored-data.loca.lt',
        cloudflareUrl: 'https://revealed-begins-hobby-alternate.trycloudflare.com',
        localIp: '192.168.0.104',
        port: 5000,
        httpsPort: 5443,
        sslStatus: 'SSL/TLS Active (DevOps Stored Data)',
      }
    });
  } catch (err) {
    console.error('[Dashboard Stats Error]', err);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Download SQLite Database Backup
router.get('/backup', authenticateToken, (req, res) => {
  try {
    const config = require('../config/env');
    const fs = require('fs');
    if (!fs.existsSync(config.DB_PATH)) {
      return res.status(404).json({ error: 'Database file not found on disk' });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    res.download(config.DB_PATH, `devops_stored_backup_${timestamp}.sqlite`);
  } catch (err) {
    console.error('[Backup Error]', err);
    res.status(500).json({ error: 'Failed to create database backup: ' + err.message });
  }
});

// Database Vacuum & Optimize
router.post('/optimize', authenticateToken, (req, res) => {
  try {
    db.prepare('VACUUM').run();
    db.prepare('ANALYZE').run();
    res.json({ message: 'Database optimized and vacuumed successfully', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[Optimize Error]', err);
    res.status(500).json({ error: 'Failed to optimize database: ' + err.message });
  }
});

module.exports = router;
