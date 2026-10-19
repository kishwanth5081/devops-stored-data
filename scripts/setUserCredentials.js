const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../backend/src/database/db');

const args = process.argv.slice(2);
const email = args[0];
const password = args[1];
const name = args[2] || 'DevOps Administrator';

if (!email || !password) {
  console.log('----------------------------------------------------');
  console.log('DevOps Stored Data - Set Personal Credentials Utility');
  console.log('----------------------------------------------------');
  console.log('Usage: node scripts/setUserCredentials.js <email> <password> [name]');
  console.log('Example: node scripts/setUserCredentials.js myemail@example.com MyPass@2026 "My Name"');
  console.log('----------------------------------------------------');
  process.exit(1);
}

const cleanEmail = email.trim().toLowerCase();
const hash = bcrypt.hashSync(password, 10);

try {
  // Check if a user with this email already exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);

  if (existing) {
    db.prepare(`
      UPDATE users 
      SET password_hash = ?, name = ?, role = 'admin', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(hash, name, existing.id);
    console.log(`[Success] Credentials updated for existing account: ${cleanEmail}`);
  } else {
    // Replace the default admin@devops.local or update first admin
    const defaultAdmin = db.prepare("SELECT id FROM users WHERE email = 'admin@devops.local'").get();
    if (defaultAdmin) {
      db.prepare(`
        UPDATE users 
        SET email = ?, password_hash = ?, name = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(cleanEmail, hash, name, defaultAdmin.id);
      console.log(`[Success] Default admin account replaced with personal email: ${cleanEmail}`);
    } else {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at) 
        VALUES (?, ?, ?, ?, 'admin', ?, ?)
      `).run(id, cleanEmail, hash, name, now, now);
      console.log(`[Success] Created personal administrator account for: ${cleanEmail}`);
    }
  }

  // Print all registered users
  const allUsers = db.prepare('SELECT id, name, email, role FROM users').all();
  console.log('\nCurrent Active Users in Database:');
  console.table(allUsers);
} catch (err) {
  console.error('[Error] Failed to set user credentials:', err.message);
  process.exit(1);
}
