const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Get cart by email
router.get('/:email', async (req, res) => {
  try {
    const cart = await Cart.findOne({ email: req.params.email });
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add/Update cart
router.post('/', async (req, res) => {
  const { email, productId, quantity, productData } = req.body;
  
  try {
    let cart = await Cart.findOne({ email });
    
    if (!cart) {
      cart = new Cart({ email, items: [] });
    }

    const itemIndex = cart.items.findIndex(p => p.id === productId);

    if (itemIndex > -1) {
      // Product exists, update qty
      cart.items[itemIndex].qty += quantity;
    } else {
      // Add new
      cart.items.push({
        id: productId,
        name: productData.name,
        price: productData.price,
        image: productData.image,
        qty: quantity
      });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Merge guest cart
router.post('/merge', async (req, res) => {
  const { email, guestItems } = req.body;
  try {
     let cart = await Cart.findOne({ email });
    if (!cart) {
      cart = new Cart({ email, items: [] });
    }

    guestItems.forEach(guestItem => {
       const existing = cart.items.find(i => i.id === guestItem.id);
       if (existing) {
         existing.qty += guestItem.qty;
       } else {
         cart.items.push(guestItem);
       }
    });

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update full cart items
router.put('/', async (req, res) => {
  const { email, items } = req.body;
  try {
    let cart = await Cart.findOne({ email });
    if (!cart) {
      cart = new Cart({ email, items });
    } else {
      cart.items = items;
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear Cart
router.delete('/:email', async (req, res) => {
  try {
    await Cart.findOneAndDelete({ email: req.params.email });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
