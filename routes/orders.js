// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET /api/orders - Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;

    // Basic validation (you can expand this)
    if (!orderData.customerDetails || !orderData.orderedItems || !orderData.paymentSummary) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const order = new Order(orderData);
    await order.save();

    // Respond with success
    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order._id
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message || 'Server error', error: error.message });
  }
});

// GET /api/orders/user/:email - Get orders for a specific user
router.get('/user/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const orders = await Order.find({ 'customerDetails.email': new RegExp(`^${email}$`, 'i') }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
