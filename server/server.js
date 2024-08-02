// server.js (Complete, Updated Version)
const dotenv = require('dotenv');
const path = require('path');
// Load environment variables FIRST
dotenv.config({ path: path.join(__dirname, '.env') }); 

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

console.log('Server starting...');
console.log('MAILGUN_API_KEY:', process.env.MAILGUN_API_KEY);
console.log('MAILGUN_DOMAIN:', process.env.MAILGUN_DOMAIN);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

const app = express();
const port = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contentSiteDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());  // Enable CORS for all routes
app.use(express.json());
app.use('/files', filesRouter); 

// Initialize GridFSBucket
const conn = mongoose.connection;
let bucket;

conn.once('open', () => {
  bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
  console.log('MongoDB connected and GridFSBucket initialized');
});

// Routes
app.use('/upload', auth, upload); 
app.use('/auth', authRoutes);  

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
    res.status(500).send(error); // Send a 500 error if there's an issue fetching media
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

// Admin route
app.get('/admin', auth, role(['admin']), (req, res) => {
  res.send('This is an admin route!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).send('Something broke!'); // Send a generic error response to the client
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

console.log('JWT_SECRET:', process.env.JWT_SECRET);


















/*


const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
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


// Load environment variables

console.log('Server starting...');
console.log('MAILGUN_API_KEY:', process.env.MAILGUN_API_KEY);
console.log('MAILGUN_DOMAIN:', process.env.MAILGUN_DOMAIN);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);


const app = express();
const port = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contentSiteDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use('/files', filesRouter);

// Initialize GridFSBucket
const conn = mongoose.connection;
let bucket;

conn.once('open', () => {
  bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
  console.log('MongoDB connected and GridFSBucket initialized');
});

// Routes
app.use('/upload', auth, upload);
app.use('/auth', authRoutes);
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

// Admin route
app.get('/admin', auth, role(['admin']), (req, res) => {
  res.send('This is an admin route!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


console.log('JWT_SECRET:', process.env.JWT_SECRET);


*/