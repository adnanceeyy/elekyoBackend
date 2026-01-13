const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallbacksecret', {
    expiresIn: '30d',
  });
};

// Register User
router.post('/', async (req, res) => {
  const { name, email, password, profileImage } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage,
      loginHistory: [{ timestamp: new Date(), ip: req.ip }]
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Record login time
      user.loginHistory.push({ timestamp: new Date(), ip: req.ip });
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Google Login
router.post('/google-login', async (req, res) => {
  const { token } = req.body;
  
  try {
    // Verify token with Google's API using axios
    const googleResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    
    if (googleResponse.status !== 200) {
      return res.status(400).json({ message: "Invalid Google Token" });
    }
    
    const payload = googleResponse.data;
    
    const { email, name, sub: googleId, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // Update existing user with googleId if missing
      if (!user.googleId) user.googleId = googleId;
      // Record login
      user.loginHistory.push({ timestamp: new Date(), ip: req.ip });
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        profileImage: picture,
        password: '', // No password for google auth
        loginHistory: [{ timestamp: new Date(), ip: req.ip }]
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
        
  } catch (error) {
    console.error('Google Login Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Google login failed', 
      error: error.response?.data?.error_description || error.message 
    });
  }
});

// Update Profile
router.put('/profile/:id', async (req, res) => {
  const { name, phone, address, profileImage } = req.body;
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ message: error.message || 'Profile update failed' });
  }
});

module.exports = router;
