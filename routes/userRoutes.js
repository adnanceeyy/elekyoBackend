const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Helper to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallbacksecret', {
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
        role: user.role, // Added role
        token: generateToken(user._id, user.role),
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
        role: user.role, // Added role
        token: generateToken(user._id, user.role),
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
      role: user.role, // Added role
      token: generateToken(user._id, user.role),
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
      return res.status(404).json({ message: 'User identity not found in database. 🕵️' });
    }

    // Update fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    // Generate fresh token
    const token = generateToken(user._id, user.role);

    // Return the FULL user object to keep frontend state complete
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      profileImage: user.profileImage,
      role: user.role,
      googleId: user.googleId,
      token: token
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ message: error.message || 'Identity synchronization failed' });
  }
});

// verifyAdmin Middleware
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret');
    if (decoded.role !== 'admin') {
       return res.status(403).json({ message: 'Admin access only' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// GET all users (Admin only)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE user (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
