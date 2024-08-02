const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendPaymentConfirmationEmail } = require('../services/emailService');
const router = express.Router();

// Admin route to verify payment
router.post('/verify-payment', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.paymentStatus = 'completed';
    user.isPaid = true;
    await user.save();

    // Send payment confirmation email
    await sendPaymentConfirmationEmail(user.email, user.verificationToken);

    res.status(200).json({ message: 'Payment verified successfully and confirmation email sent' });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Server error during payment verification' });
  }
});

// Add more admin routes as needed

module.exports = router;