const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { GridFSBucket } = require('mongodb');

// Routes and middleware
const authRoutes = require('./routes/auth');
const filesRouter = require('./routes/files');
const uploadRouter = require('./upload');
const auth = require('./middleware/auth');
const role = require('./middleware/role');

// Models
const Media = require('./models/media');

console.log('Server starting...');
console.log('MAILGUN_API_KEY:', process.env.MAILGUN_API_KEY);
console.log('MAILGUN_DOMAIN:', process.env.MAILGUN_DOMAIN);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/contentSiteDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use('/files', filesRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize GridFSBucket
const conn = mongoose.connection;
let bucket;

conn.once('open', () => {
  bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
  console.log('MongoDB connected and GridFSBucket initialized');
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/media', uploadRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Content Site API');
});

// Fetch all media data (consider paginating this in the future)
app.get('/api/media/all', async (req, res) => {
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

  downloadStream.on('error', (err) => {
    res.status(404).send('File not found');
  });

  downloadStream.on('end', () => {
    res.end();
  });
});

// Admin route
app.get('/admin', auth, role(['admin']), (req, res) => {
  res.send('This is an admin route!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'An error occurred on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

console.log('JWT_SECRET:', process.env.JWT_SECRET);