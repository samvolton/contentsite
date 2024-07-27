const express = require('express');
   const multer = require('multer');
   const mongoose = require('mongoose');
   const { GridFSBucket } = require('mongodb');
   const router = express.Router();

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
   router.post('/', upload.any(), (req, res) => {
     if (!req.files || req.files.length === 0) {
       return res.status(400).json({ error: 'No file uploaded' });
     }

     const file = req.files[0];  // Get the first file
     const { buffer, originalname, mimetype } = file;

     const writestream = bucket.openUploadStream(originalname, { contentType: mimetype });

     writestream.end(buffer);

     writestream.on('finish', () => {
       res.status(200).json({ fileId: writestream.id });
     });

     writestream.on('error', (err) => {
       res.status(500).json({ error: 'An error occurred while uploading the file', details: err.message });
     });
   });

   module.exports = router;