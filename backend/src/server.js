const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const config = require('./config/env');
const db = require('./database/db');
const seedDatabase = require('./database/seed');
const importWorkspacePdfs = require('./database/importPdfs');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const pocsRoutes = require('./routes/pocs.routes');
const tasksRoutes = require('./routes/tasks.routes');
const filesRoutes = require('./routes/files.routes');
const notesRoutes = require('./routes/notes.routes');
const auditRoutes = require('./routes/audit.routes');
const foldersRoutes = require('./routes/folders.routes');
const healthRoutes = require('./routes/health.routes');

const app = express();

// Trust reverse proxy (essential for Nginx X-Forwarded-For, rate limiting, and SSL)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allows flexible inline resources for code viewers & UI
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: config.CORS_ORIGIN === '*' ? true : config.CORS_ORIGIN.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health and monitoring endpoints (before rate limiters for load balancer probes)
app.use('/', healthRoutes);

// Apply API rate limiting
app.use('/api/', apiLimiter);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/pocs', pocsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/folders', foldersRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/audit', auditRoutes);

// Static uploads (protected download route is preferred, but allow previews)
app.use('/uploads', express.static(config.UPLOADS_DIR));

// Serve React production build if available
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

// Fallback to index.html for SPA routing (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/metrics') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(publicDir, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>DevOps Stored Data - API Running</title></head>
        <body style="font-family:sans-serif; background:#0f172a; color:#f8fafc; padding:40px; text-align:center;">
          <h1>DevOps Stored Data - API Server</h1>
          <p>Backend is active on port ${config.PORT}.</p>
          <p>Frontend static files can be built via <code>npm run build</code> in the frontend folder.</p>
          <p><a href="/health" style="color:#38bdf8;">View System Health Status</a></p>
        </body>
        </html>
      `);
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected server error occurred',
  });
});

// Seed DB on start
seedDatabase();
importWorkspacePdfs();

// Start HTTP Server
const httpServer = http.createServer(app);
httpServer.listen(config.PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 DevOps Stored Data HTTP Server running on port ${config.PORT}`);
  console.log(`🌐 Local HTTP:  http://localhost:${config.PORT}`);
  console.log(`🌐 IPv4 HTTP:   http://127.0.0.1:${config.PORT}`);
  console.log(`📦 Environment: ${config.NODE_ENV}`);
  console.log(`💾 SQLite DB:   ${config.DB_PATH}`);
  console.log(`📁 Uploads:     ${config.UPLOADS_DIR}`);
  console.log(`🩺 Healthcheck: http://localhost:${config.PORT}/health`);
  console.log(`====================================================`);
});

// Start Native SSL/TLS HTTPS Server
let httpsServer = null;
if (config.ENABLE_HTTPS && fs.existsSync(config.SSL_KEY_PATH) && fs.existsSync(config.SSL_CERT_PATH)) {
  try {
    const sslOptions = {
      key: fs.readFileSync(config.SSL_KEY_PATH),
      cert: fs.readFileSync(config.SSL_CERT_PATH),
    };
    httpsServer = https.createServer(sslOptions, app);
    const os = require('os');
    const netInterfaces = os.networkInterfaces();
    let networkIp = '127.0.0.1';
    for (const name of Object.keys(netInterfaces)) {
      for (const net of netInterfaces[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          networkIp = net.address;
          break;
        }
      }
    }
    httpsServer.listen(config.HTTPS_PORT, '0.0.0.0', () => {
      console.log(`🔒 SSL/TLS HTTPS Server running on port ${config.HTTPS_PORT}`);
      console.log(`🔐 Local HTTPS:   https://localhost:${config.HTTPS_PORT}`);
      console.log(`🔐 IPv4 HTTPS:    https://127.0.0.1:${config.HTTPS_PORT}`);
      console.log(`🔐 Network HTTPS: https://${networkIp}:${config.HTTPS_PORT}`);
      console.log(`📜 SSL Cert:      ${config.SSL_CERT_PATH}`);
      console.log(`🔑 SSL Key:       ${config.SSL_KEY_PATH}`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('[SSL/TLS Error] Failed to initialize HTTPS server:', err.message);
  }
} else {
  console.log(`ℹ️ SSL/TLS certificates not detected at ${config.SSL_CERT_PATH}. HTTPS disabled.`);
}

// Graceful Shutdown
function shutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
  httpServer.close(() => {
    console.log('[Server] HTTP server closed.');
    if (httpsServer) {
      httpsServer.close(() => {
        console.log('[Server] HTTPS server closed.');
      });
    }
    try {
      db.close();
      console.log('[Server] SQLite database connection closed.');
    } catch (e) {
      console.error('[Server] Error closing database:', e.message);
    }
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = { app, server: httpServer, httpsServer };
