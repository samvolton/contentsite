const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const User = require('../models/user');

// Get all users (for admin chat interface)
router.get('/users', auth, role(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, 'email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get flagged messages
router.get('/flagged-messages', auth, role(['admin']), async (req, res) => {
  try {
    const flaggedMessages = await Chat.find({ flagged: true });
    res.json(flaggedMessages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Moderate a message
router.post('/moderate-message/:messageId', auth, role(['admin']), async (req, res) => {
  try {
    const { messageId } = req.params;
    const { action } = req.body;

    if (action === 'approve') {
      await Chat.findByIdAndUpdate(messageId, { flagged: false });
    } else if (action === 'delete') {
      await Chat.findByIdAndDelete(messageId);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;