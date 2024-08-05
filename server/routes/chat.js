const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/:userId', auth, async (req, res) => {
    try {
      const chats = await Chat.find({
        $or: [
          { sender: req.user._id, receiver: req.params.userId },
          { sender: req.params.userId, receiver: req.user._id }
        ]
      }).sort({ createdAt: 1 });
      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/', auth, upload.single('attachment'), async (req, res) => {
    try {
      const { receiver, message } = req.body;
      const attachment = req.file ? req.file.path : null;
      const attachmentType = req.file ? req.file.mimetype.split('/')[0] : null;
  
      console.log('Received chat data:', { receiver, message, attachment, attachmentType });
  
      const chat = new Chat({
        sender: req.user._id,
        receiver,   
        message,
        attachment,
        attachmentType
      });
  
      console.log('Created chat object:', chat);
  
      const savedChat = await chat.save();
      console.log('Saved chat to database:', savedChat);
  
      res.status(201).json(savedChat);
    } catch (error) {
      console.error('Error in POST /chat:', error);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
  });

module.exports = router;