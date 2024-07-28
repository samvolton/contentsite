const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const upload = require('./upload');
const authRoutes = require('./routes/auth');
const Media = require('./models/media');
const { GridFSBucket } = require('mongodb');
const auth = require('./middleware/auth');
const role = require('./middleware/role');
const filesRouter = require('./routes/files');

const app = express();
const port = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contentSiteDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.json()); // Ensure JSON parsing is enabled
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS
app.use('/files', filesRouter);


// Initialize GridFSBucket
const conn = mongoose.connection;
let bucket;

conn.once('open', () => {
  bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
  console.log('MongoDB connected and GridFSBucket initialized');
});

// Routes
app.use('/upload', auth, upload); // Protect upload route with auth middleware
app.use('/auth', authRoutes); // Ensure this is included for auth routes
app.use('/files', filesRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Content Site API');
});

// Fetch media data
app.get('/api/media', async (req, res) => {
  try {
    const media = await Media.find({});
    console.log('Fetched media:', media);
    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).send(error);
  }
});

// Route to retrieve a file
app.get('/files/:filename', (req, res) => {
  const { filename } = req.params;
  const downloadStream = bucket.openDownloadStreamByName(filename);

  downloadStream.on('data', (chunk) => {
    res.write(chunk);
  });

  downloadStream.on('end', () => {
    res.end();
  });

  downloadStream.on('error', (err) => {
    res.status(404).send('File not found');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/admin', auth, role(['admin']), (req, res) => {
  res.send('This is an admin route!');
});
