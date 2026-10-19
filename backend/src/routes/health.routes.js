const express = require('express');
const os = require('os');
const db = require('../database/db');
const config = require('../config/env');

const router = express.Router();
const startTime = Date.now();

// Standard Healthcheck
router.get('/health', (req, res) => {
  let dbStatus = 'healthy';
  try {
    db.prepare('SELECT 1').get();
  } catch (err) {
    dbStatus = 'unhealthy: ' + err.message;
  }

  const memory = process.memoryUsage();
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  const isOk = dbStatus === 'healthy';
  res.status(isOk ? 200 : 503).json({
    status: isOk ? 'UP' : 'DOWN',
    app: 'DevOps Stored Data',
    version: config.APP_VERSION,
    timestamp: new Date().toISOString(),
    uptime_seconds: uptimeSeconds,
    database: dbStatus,
    system: {
      platform: os.platform(),
      release: os.release(),
      total_memory_bytes: os.totalmem(),
      free_memory_bytes: os.freemem(),
      process_rss_bytes: memory.rss,
      process_heap_used_bytes: memory.heapUsed,
    }
  });
});

// Prometheus Metrics Endpoint
router.get('/metrics', (req, res) => {
  try {
    const memory = process.memoryUsage();
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

    const totalPocs = db.prepare('SELECT COUNT(*) as c FROM pocs').get().c;
    const totalTasks = db.prepare('SELECT COUNT(*) as c FROM tasks').get().c;
    const totalFiles = db.prepare('SELECT COUNT(*) as c FROM files').get().c;
    const totalStorage = db.prepare('SELECT COALESCE(SUM(file_size), 0) as s FROM files').get().s;

    const metrics = [
      '# HELP devops_stored_data_uptime_seconds Application uptime in seconds',
      '# TYPE devops_stored_data_uptime_seconds gauge',
      `devops_stored_data_uptime_seconds ${uptimeSeconds}`,
      '',
      '# HELP devops_stored_data_memory_heap_bytes Memory heap used in bytes',
      '# TYPE devops_stored_data_memory_heap_bytes gauge',
      `devops_stored_data_memory_heap_bytes ${memory.heapUsed}`,
      '',
      '# HELP devops_stored_data_pocs_total Total number of registered POCs',
      '# TYPE devops_stored_data_pocs_total gauge',
      `devops_stored_data_pocs_total ${totalPocs}`,
      '',
      '# HELP devops_stored_data_tasks_total Total number of tasks',
      '# TYPE devops_stored_data_tasks_total gauge',
      `devops_stored_data_tasks_total ${totalTasks}`,
      '',
      '# HELP devops_stored_data_files_total Total number of uploaded files',
      '# TYPE devops_stored_data_files_total gauge',
      `devops_stored_data_files_total ${totalFiles}`,
      '',
      '# HELP devops_stored_data_storage_bytes Total file storage used in bytes',
      '# TYPE devops_stored_data_storage_bytes gauge',
      `devops_stored_data_storage_bytes ${totalStorage}`,
      ''
    ].join('\n');

    res.setHeader('Content-Type', 'text/plain; version=0.0.4');
    res.send(metrics);
  } catch (err) {
    res.status(500).send('# Error collecting metrics\n');
  }
});

module.exports = router;
