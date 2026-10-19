const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const config = require('../config/env');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow all DevOps config, script, doc, archive, and image formats
  // Disallow dangerous Windows execute-in-place binaries (.exe, .msi, .dll, .bat - or allow .bat/.ps1 with preview/download flag)
  const ext = path.extname(file.originalname).toLowerCase();
  const disallowed = ['.exe', '.dll', '.so', '.dylib', '.com', '.vbs', '.scr'];
  if (disallowed.includes(ext)) {
    return cb(new Error(`File type ${ext} is restricted for security reasons.`));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE,
  },
  fileFilter,
});

module.exports = upload;
