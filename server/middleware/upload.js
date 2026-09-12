const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const MAX_MB = Number(process.env.MAX_UPLOAD_MB) || 5;
const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(new Error('INVALID_FILE_TYPE'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
});

// Wraps multer's single-file middleware to turn its errors into the
// friendly, user-facing messages the spec requires instead of a stack trace.
function handleComplaintImageUpload(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Image size must be less than 5 MB.' });
      }
      if (err.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ message: 'Only JPG, JPEG and PNG images are allowed.' });
      }
      return res.status(400).json({ message: 'Unable to upload image. Please try again.' });
    }
    next();
  });
}

module.exports = { handleComplaintImageUpload, UPLOAD_DIR };
