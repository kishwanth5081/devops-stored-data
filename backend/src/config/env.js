const path = require('path');
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'devops-stored-data-super-secure-jwt-key-change-in-prod-2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DB_PATH: process.env.DB_PATH || path.join(__dirname, '../../data/devops_stored.sqlite'),
  UPLOADS_DIR: process.env.UPLOADS_DIR || path.join(__dirname, '../../uploads'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 50 * 1024 * 1024, // 50MB
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 mins
  RATE_LIMIT_MAX_AUTH: 20, // 20 attempts
  RATE_LIMIT_MAX_API: 500, // 500 requests per 15 min
  APP_VERSION: '1.0.0',
  HTTPS_PORT: parseInt(process.env.HTTPS_PORT, 10) || 5443,
  SSL_KEY_PATH: process.env.SSL_KEY_PATH || path.join(__dirname, '../../certs/server.key'),
  SSL_CERT_PATH: process.env.SSL_CERT_PATH || path.join(__dirname, '../../certs/server.crt'),
  ENABLE_HTTPS: process.env.ENABLE_HTTPS !== 'false',
};
