const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const router = express.Router();
const Media = require('./models/media'); // Adjusted path
const auth = require('./middleware/auth'); // Adjusted path

// Initialize GridFSBucket
const conn = mongoose.connection;
let bucket;

conn.once('open', () => {
  bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
});

// Set up Multer storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    cb(null, true); // Accept all files
  }
});

// Handle file upload
router.post('/', auth, upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.files[0];  // Get the first file
  const { buffer, originalname, mimetype } = file;

  const writestream = bucket.openUploadStream(originalname, { contentType: mimetype });

  writestream.end(buffer);

  writestream.on('finish', async () => {
    try {
      const media = new Media({
        filename: originalname,
        contentType: mimetype,
        length: buffer.length,
        uploadDate: new Date(),
        fileId: writestream.id,
        userId: req.user ? req.user._id : null // Associate the upload with a user if authenticated
      });
      await media.save();
      res.status(200).json({ fileId: writestream.id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save media info to the database', details: error.message });
    }
  });

  writestream.on('error', (err) => {
    res.status(500).json({ error: 'An error occurred while uploading the file', details: err.message });
  });
});

module.exports = router;