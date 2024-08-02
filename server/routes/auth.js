const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../services/emailService');


// User Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, token } = req.body;

    const user = await User.findOne({ email, verificationToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Geçersiz veya süresi dolmuş token' });
    }

    if (user.paymentStatus !== 'completed') {
      return res.status(400).json({ error: 'Ödeme doğrulanmadı. Lütfen ödeme işlemini tamamlayın.' });
    }

    user.password = password;
    user.isVerified = true;
    user.isPaid = true;
    user.verificationToken = undefined;
    await user.save();

    const authToken = await user.generateAuthToken();
    res.status(201).send({ user, token: authToken });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({ error: 'Kayıt sırasında sunucu hatası oluştu' });
  }
});

// Initiate payment and send verification email
router.post('/initiate-payment', async (req, res) => {
  try {
    console.log('Received payment initiation request:', req.body);
    const { email, amount } = req.body;
    const verificationToken = crypto.randomBytes(32).toString('hex');

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    user = new User({
      email,
      verificationToken,
      isVerified: false,
      isPaid: false,
      paymentAmount: amount,
      paymentStatus: 'pending'
    });
    await user.save();

    try {
      console.log('Attempting to send verification email...');
      await sendVerificationEmail(email, verificationToken, amount);
      console.log('Verification email sent successfully to:', email);
      res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      await User.findByIdAndDelete(user._id);
      res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: 'Server error during payment initiation' });
  }
});

  // Send Verification Email

  router.post('/send-verification-email', async (req, res) => {
    try {
      const { email, amount } = req.body;
      const verificationToken = crypto.randomBytes(32).toString('hex');
  
      // Save the email and token to your database here
  
      await sendVerificationEmail(email, verificationToken, amount);
  
      res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
      console.error('Error sending verification email:', error);
      res.status(500).json({ error: 'Failed to send verification email' });
    }
  });


// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'No user found with this email' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Incorrect password' });
    }

    if (!user.isVerified || !user.isPaid) {
      return res.status(400).send({ error: 'Account not verified or payment not confirmed' });
    }

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ error: 'Server error during login' });
  }
});

// User Logout
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

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

    res.status(200).json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Server error during payment verification' });
  }
});

// Get User Profile
router.get('/profile', auth, async (req, res) => {
    res.send(req.user);
});

// Update User Profile
router.patch('/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;

