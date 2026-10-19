const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const config = require('../config/env');

// Ensure data directory exists
const dbDir = path.dirname(config.DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Ensure uploads directory exists
if (!fs.existsSync(config.UPLOADS_DIR)) {
  fs.mkdirSync(config.UPLOADS_DIR, { recursive: true });
}

// Auto-populate persistent cloud volume from bundled repository seed if volume is empty
const defaultBundledDb = path.resolve(__dirname, '../../data/devops_stored.sqlite');
const targetDb = path.resolve(config.DB_PATH);
if (targetDb !== defaultBundledDb && !fs.existsSync(targetDb) && fs.existsSync(defaultBundledDb)) {
  try {
    fs.copyFileSync(defaultBundledDb, targetDb);
    console.log('[Database] Pre-populated cloud persistent volume with bundled database.');
  } catch (err) {
    console.warn('[Database] Could not pre-populate persistent DB volume:', err.message);
  }
}

const defaultBundledUploads = path.resolve(__dirname, '../../uploads');
const targetUploads = path.resolve(config.UPLOADS_DIR);
if (targetUploads !== defaultBundledUploads && fs.existsSync(defaultBundledUploads)) {
  try {
    const files = fs.readdirSync(defaultBundledUploads);
    for (const f of files) {
      const src = path.join(defaultBundledUploads, f);
      const dest = path.join(targetUploads, f);
      if (!fs.existsSync(dest) && fs.statSync(src).isFile()) {
        fs.copyFileSync(src, dest);
      }
    }
  } catch (err) {
    console.warn('[Uploads] Could not pre-populate persistent uploads volume:', err.message);
  }
}

const db = new Database(config.DB_PATH, {
  // verbose: config.NODE_ENV === 'development' ? console.log : null,
});

// Enable SQLite WAL mode and foreign keys for high concurrent throughput & data integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize database schema
function initSchema() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'engineer',
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pocs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      summary TEXT,
      description TEXT,
      category TEXT NOT NULL DEFAULT 'Infrastructure',
      status TEXT NOT NULL DEFAULT 'Validated',
      environment TEXT NOT NULL DEFAULT 'Multi-Cloud',
      tags TEXT DEFAULT '[]',
      repository_url TEXT,
      author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      author_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      poc_id TEXT REFERENCES pocs(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'Backlog',
      priority TEXT NOT NULL DEFAULT 'Medium',
      assigned_to TEXT REFERENCES users(id) ON DELETE SET NULL,
      assigned_name TEXT,
      category TEXT DEFAULT 'DevOps',
      tags TEXT DEFAULT '[]',
      due_date TEXT,
      created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      poc_id TEXT REFERENCES pocs(id) ON DELETE SET NULL,
      task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
      original_name TEXT NOT NULL,
      stored_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_type TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Script',
      tags TEXT DEFAULT '[]',
      uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      uploaded_by_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      poc_id TEXT REFERENCES pocs(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'Documentation',
      tags TEXT DEFAULT '[]',
      author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      author_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_email TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS folders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      color TEXT DEFAULT 'rose',
      category TEXT DEFAULT 'pdf',
      created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_pocs_category ON pocs(category);
    CREATE INDEX IF NOT EXISTS idx_pocs_status ON pocs(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
    CREATE INDEX IF NOT EXISTS idx_tasks_poc_id ON tasks(poc_id);
    CREATE INDEX IF NOT EXISTS idx_files_poc_id ON files(poc_id);
    CREATE INDEX IF NOT EXISTS idx_files_category ON files(category);
    CREATE INDEX IF NOT EXISTS idx_notes_poc_id ON notes(poc_id);
    CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
  `;

  db.exec(schema);

  // Migration: Add folder_id and folder_name to files table if not already present
  try {
    const fileColumns = db.prepare('PRAGMA table_info(files)').all().map(c => c.name);
    if (!fileColumns.includes('folder_id')) {
      db.exec('ALTER TABLE files ADD COLUMN folder_id TEXT REFERENCES folders(id) ON DELETE SET NULL;');
    }
    if (!fileColumns.includes('folder_name')) {
      db.exec('ALTER TABLE files ADD COLUMN folder_name TEXT;');
    }
  } catch (err) {
    console.warn('[DB Migration Warning]', err.message);
  }
}

initSchema();

module.exports = db;
