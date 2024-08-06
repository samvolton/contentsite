const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const router = express.Router();
const Media = require('./models/media');
const auth = require('./middleware/auth');

const conn = mongoose.connection;
let bucket;

conn.once('open', () => {
  bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
});

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 * 512}, // Limit file size to 500MB
  fileFilter: (req, file, cb) => {
    cb(null, true); // Accept all files
  }
});

// Modified general upload route
router.post('/', auth, upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const category = req.body.category || 'general';
  const file = req.files[0];
  const { buffer, originalname, mimetype } = file;
  const isAnasayfa = req.body.isAnasayfa === 'true'; // Add this line to get isAnasayfa from request body

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
        userId: req.user ? req.user._id : null,
        category: category,
        isAnasayfa: category === 'anasayfa'
      });
      await media.save();
      res.status(200).json({ fileId: writestream.id, isAnasayfa: isAnasayfa });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save media info to the database', details: error.message });
    }
  });

  writestream.on('error', (err) => {
    res.status(500).json({ error: 'An error occurred while uploading the file', details: err.message });
  });
});


// Route for Anasayfa content
router.post('/anasayfa', auth, upload.any(), (req, res) => {
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
        userId: req.user ? req.user._id : null,
        category: 'anasayfa',
        isAnasayfa: true
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

// Route to fetch Anasayfa content
router.get('/anasayfa', async (req, res, page) => {
  try {
    const anasayfaContent = await Media.find({ category: 'anasayfa' }).sort({ uploadDate: -1 }).limit(32);
    res.json(anasayfaContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Anasayfa content' });
  }
});

// Route to fetch paginated Foto content
router.get('/foto', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 16;
  const skip = (page - 1) * limit;

  try {
    const photos = await Media.find({ 
      contentType: { $regex: /^image/ },
      category: { $ne: 'anasayfa' }
    }).sort({ uploadDate: -1 }).skip(skip).limit(limit);
    
    const total = await Media.countDocuments({ 
      contentType: { $regex: /^image/ },
      category: { $ne: 'anasayfa' }
    });

    res.json({
      photos,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// Route to fetch paginated Video content
router.get('/video', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 16;
  const skip = (page - 1) * limit;

  try {
    const videos = await Media.find({ 
      contentType: { $regex: /^video/ },
      category: { $ne: 'anasayfa' }
    }).sort({ uploadDate: -1 }).skip(skip).limit(limit);
    
    const total = await Media.countDocuments({ 
      contentType: { $regex: /^video/ },
      category: { $ne: 'anasayfa' }
    });

    res.json({
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

module.exports = router;