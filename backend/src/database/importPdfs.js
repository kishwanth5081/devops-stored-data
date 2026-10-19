const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');
const config = require('../config/env');

function importWorkspacePdfs() {
  console.log('[Import] Checking for workspace PDF documents to register...');

  const workspaceRoot = path.resolve(__dirname, '../../../..');
  const pdfFiles = [
    {
      fileName: 'POC-7 NGINX_WEB_SERVER_DEPLOYMENT_DOCUMENTATION.pdf',
      pocSlug: 'poc-07-nginx-web-server-deployment',
      category: 'PDF Document'
    },
    {
      fileName: 'POC-8_Multi-Region_High_Availability_Architecture.pdf',
      pocSlug: 'poc-08-multi-region-ha-architecture',
      category: 'PDF Document'
    },
    {
      fileName: 'POC-10_Linux_Server_Security_Hardening.pdf',
      pocSlug: 'poc-10-linux-server-security-hardening',
      category: 'PDF Document'
    },
    {
      fileName: 'Production_Server_Failure_and_Recovery_Documentation.pdf',
      pocSlug: 'poc-11-domain-ssl-dns-monitor',
      category: 'PDF Document'
    }
  ];

  const admin = db.prepare("SELECT id, name FROM users WHERE role = 'admin' LIMIT 1").get();
  const adminId = admin ? admin.id : null;
  const adminName = admin ? admin.name : 'System Administrator';

  for (const item of pdfFiles) {
    const srcPath = path.join(workspaceRoot, item.fileName);
    if (!fs.existsSync(srcPath)) {
      continue;
    }

    // Check if already registered
    const existing = db.prepare('SELECT id FROM files WHERE original_name = ?').get(item.fileName);
    if (existing) {
      console.log(`[Import] ${item.fileName} already imported.`);
      continue;
    }

    // Copy to uploads
    const ext = path.extname(item.fileName);
    const storedName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    const destPath = path.join(config.UPLOADS_DIR, storedName);

    fs.copyFileSync(srcPath, destPath);
    const stats = fs.statSync(destPath);

    // Find linked POC
    let pocId = null;
    if (item.pocSlug) {
      const poc = db.prepare('SELECT id FROM pocs WHERE slug LIKE ?').get(`%${item.pocSlug}%`);
      if (poc) pocId = poc.id;
    }

    const id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO files (id, poc_id, original_name, stored_name, file_path, file_size, file_type, mime_type, category, tags, uploaded_by, uploaded_by_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      pocId,
      item.fileName,
      storedName,
      destPath,
      stats.size,
      '.pdf',
      'application/pdf',
      'PDF Document',
      JSON.stringify(['PDF', 'Documentation', 'POC']),
      adminId,
      adminName
    );

    console.log(`[Import] Registered PDF: ${item.fileName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  }
}

if (require.main === module) {
  importWorkspacePdfs();
}

module.exports = importWorkspacePdfs;
