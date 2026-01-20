const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const jwt = require("jsonwebtoken");

/* ================================
   ADMIN AUTH MIDDLEWARE
================================ */
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret');

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// GET all notifications
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH mark as read
router.patch('/:id/read', verifyAdmin, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { unread: false },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE all notifications
router.delete('/clear-all', verifyAdmin, async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.json({ message: 'All notifications cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
