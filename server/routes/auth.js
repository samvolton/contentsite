const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = express.Router();
const bcrypt = require('bcryptjs');

// User Registration
router.post('/register', async (req, res) => {
    try {
        console.log('Received registration request:', req.body);
        const {  email, password } = req.body;

        // Validate input
        const errors = {};
        if (!email) errors.email = 'Email is required';
        if (!password) errors.password = 'Password is required';

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ error: 'Validation failed', errors });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }]  });
        if (existingUser) {
            if (existingUser.email === email) {
                errors.email = 'Email already in use';
            }
         
            return res.status(400).json({ error: 'User already exists', errors });
        }

        const user = new User({ email, password });
        await user.save();
        console.log('User saved successfully:', user);
        const token = await user.generateAuthToken();
        console.log('Auth token generated:', token);
        res.status(201).send({ user, token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send({ error: 'Server error during registration' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        console.log('Received login request:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Login failed: Email or password missing');
            return res.status(400).send({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('Login failed: No user found with email:', email);
            return res.status(400).send({ error: 'No user found with this email' });
        }

        console.log('Comparing passwords...');
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch ? 'Yes' : 'No');

        if (!isMatch) {
            console.log('Login failed: Incorrect password for email:', email);
            return res.status(400).send({ error: 'Incorrect password' });
        }

        const token = await user.generateAuthToken();
        console.log('Login successful. Token generated:', token);
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
