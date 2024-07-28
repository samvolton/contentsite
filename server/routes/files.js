const express = require('express');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const router = express.Router();
const Media = require('../models/media'); // Import the Media model

let bucket;
mongoose.connection.once('open', () => {
  bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
});

// New route to get all media
router.get('/api/media', async (req, res) => {
  try {
    const mediaFiles = await Media.find();
    console.log('Sending media data:', mediaFiles);
    res.json(mediaFiles);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/files/:filename', (req, res) => {
  const file = bucket.openDownloadStreamByName(req.params.filename);
  
  file.on('error', (error) => {
    console.error('Error accessing file:', error);
    return res.status(404).json({ error: 'File not found' });
  });

  file.on('file', (file) => {
    res.set('Content-Type', file.contentType);
  });

  file.pipe(res);
});

module.exports = router;