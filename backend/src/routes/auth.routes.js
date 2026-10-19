const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const db = require('../database/db');
const config = require('../config/env');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { logAudit } = require('../services/auditService');
const upload = require('../middleware/upload');

const router = express.Router();

// Login (Supports Username or Email)
router.post('/login', authLimiter, (req, res) => {
  try {
    const identifier = (req.body.username || req.body.email || '').trim().toLowerCase();
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(name) = ?').get(identifier, identifier);
    if (!user) {
      logAudit({ userId: null, userEmail: identifier, action: 'LOGIN_FAILED', entityType: 'USER', details: 'User not found', req });
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      logAudit({ userId: user.id, userEmail: user.email, action: 'LOGIN_FAILED', entityType: 'USER', details: 'Incorrect password', req });
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    logAudit({ userId: user.id, userEmail: user.email, action: 'LOGIN_SUCCESS', entityType: 'USER', entityId: user.id, details: 'User logged in', req });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      }
    });
  } catch (err) {
    console.error('[Auth Login Error]', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Register: Create new account
router.post('/register', authLimiter, (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Full name / username is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ? OR LOWER(name) = ?').get(cleanEmail, cleanName.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email or username already exists' });
    }

    const id = crypto.randomUUID();
    const hash = bcrypt.hashSync(password, 10);
    const role = 'engineer';

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, cleanName, cleanEmail, hash, role);

    const token = jwt.sign(
      { id, email: cleanEmail, role, name: cleanName },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    logAudit({
      userId: id,
      userEmail: cleanEmail,
      action: 'USER_REGISTERED',
      entityType: 'USER',
      entityId: id,
      details: `New account created: ${cleanName} (${cleanEmail})`,
      req
    });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id,
        email: cleanEmail,
        name: cleanName,
        role,
        avatar: null
      }
    });
  } catch (err) {
    console.error('[Register Error]', err);
    res.status(500).json({ error: 'Internal server error during account creation' });
  }
});

// Current User Profile
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Upload / Update Profile Picture (Avatar)
router.post('/avatar', authenticateToken, upload.single('avatar'), (req, res) => {
  try {
    let avatarUrl = null;
    if (req.file) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const mime = req.file.mimetype || 'image/png';
        avatarUrl = `data:${mime};base64,${fileBuffer.toString('base64')}`;
      } catch (readErr) {
        avatarUrl = `/uploads/${req.file.filename}`;
      }
    } else if (req.body && req.body.avatar) {
      avatarUrl = req.body.avatar;
    } else {
      return res.status(400).json({ error: 'No image file or avatar data provided' });
    }

    db.prepare('UPDATE users SET avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(avatarUrl, req.user.id);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'AVATAR_UPDATED',
      entityType: 'USER',
      entityId: req.user.id,
      details: 'User updated profile picture',
      req
    });

    const updatedUser = db.prepare('SELECT id, name, email, role, avatar FROM users WHERE id = ?').get(req.user.id);
    const token = jwt.sign(
      { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role, name: updatedUser.name },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    res.json({ message: 'Profile picture updated successfully', user: updatedUser, token, avatar: avatarUrl });
  } catch (err) {
    console.error('[Avatar Upload Error]', err);
    res.status(500).json({ error: 'Failed to update profile picture: ' + err.message });
  }
});

// Remove Profile Picture (Avatar)
router.delete('/avatar', authenticateToken, (req, res) => {
  try {
    db.prepare('UPDATE users SET avatar = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(req.user.id);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'AVATAR_REMOVED',
      entityType: 'USER',
      entityId: req.user.id,
      details: 'User removed profile picture',
      req
    });

    const updatedUser = db.prepare('SELECT id, name, email, role, avatar FROM users WHERE id = ?').get(req.user.id);
    res.json({ message: 'Profile picture removed successfully', user: updatedUser });
  } catch (err) {
    console.error('[Avatar Delete Error]', err);
    res.status(500).json({ error: 'Failed to remove profile picture: ' + err.message });
  }
});

// Update User Profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if email already used by another user
    const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(cleanEmail, req.user.id);
    if (existing) {
      return res.status(400).json({ error: 'This email is already in use by another account' });
    }

    db.prepare('UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(cleanName, cleanEmail, req.user.id);

    logAudit({
      userId: req.user.id,
      userEmail: cleanEmail,
      action: 'PROFILE_UPDATED',
      entityType: 'USER',
      entityId: req.user.id,
      details: `Profile updated: ${cleanName} (${cleanEmail})`,
      req
    });

    const updatedUser = db.prepare('SELECT id, name, email, role, avatar FROM users WHERE id = ?').get(req.user.id);
    const token = jwt.sign(
      { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role, name: updatedUser.name },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    res.json({ message: 'Profile updated successfully', user: updatedUser, token });
  } catch (err) {
    console.error('[Update Profile Error]', err);
    res.status(500).json({ error: 'Failed to update profile: ' + err.message });
  }
});

// List Users for task assignment
router.get('/users', authenticateToken, (req, res) => {
  const users = db.prepare('SELECT id, name, email, role FROM users ORDER BY name ASC').all();
  res.json({ users });
});

// Create new user (Admin only)
router.post('/users', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    const id = crypto.randomUUID();
    const hash = bcrypt.hashSync(password, 10);
    const userRole = ['admin', 'engineer', 'viewer'].includes(role) ? role : 'engineer';

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, name.trim(), email.trim().toLowerCase(), hash, userRole);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'USER_CREATED',
      entityType: 'USER',
      entityId: id,
      details: `Created user ${email} with role ${userRole}`,
      req
    });

    res.status(201).json({ message: 'User created successfully', userId: id });
  } catch (err) {
    console.error('[Create User Error]', err);
    res.status(500).json({ error: 'Internal server error creating user' });
  }
});

// Update user (Admin only)
router.put('/users/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const userToEdit = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!userToEdit) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedName = name ? name.trim() : userToEdit.name;
    const updatedEmail = email ? email.trim().toLowerCase() : userToEdit.email;
    const updatedRole = ['admin', 'engineer', 'viewer'].includes(role) ? role : userToEdit.role;

    // Check email uniqueness if email changed
    if (updatedEmail !== userToEdit.email) {
      const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(updatedEmail, req.params.id);
      if (existing) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }
    }

    if (password && password.trim().length >= 6) {
      const hash = bcrypt.hashSync(password.trim(), 10);
      db.prepare(`
        UPDATE users 
        SET name = ?, email = ?, role = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(updatedName, updatedEmail, updatedRole, hash, req.params.id);
    } else {
      db.prepare(`
        UPDATE users 
        SET name = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(updatedName, updatedEmail, updatedRole, req.params.id);
    }

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'USER_UPDATED',
      entityType: 'USER',
      entityId: req.params.id,
      details: `Updated user ${updatedEmail} (${updatedRole})`,
      req
    });

    const updated = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.params.id);
    res.json({ message: 'User updated successfully', user: updated });
  } catch (err) {
    console.error('[Update User Error]', err);
    res.status(500).json({ error: 'Failed to update user: ' + err.message });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own currently logged-in account' });
    }

    const userToDelete = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'USER_DELETED',
      entityType: 'USER',
      entityId: req.params.id,
      details: `Deleted user ${userToDelete.email} (${userToDelete.name})`,
      req
    });

    res.json({ message: `User ${userToDelete.email} deleted successfully` });
  } catch (err) {
    console.error('[Delete User Error]', err);
    res.status(500).json({ error: 'Failed to delete user: ' + err.message });
  }
});

// Change Password
router.post('/change-password', authenticateToken, (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    const isMatch = bcrypt.compareSync(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newHash, req.user.id);

    logAudit({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'PASSWORD_CHANGED',
      entityType: 'USER',
      entityId: req.user.id,
      details: 'Password updated',
      req
    });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('[Change Password Error]', err);
    res.status(500).json({ error: 'Internal server error updating password' });
  }
});

module.exports = router;
