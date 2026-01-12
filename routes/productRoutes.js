const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product by custom id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Add new product(s) (single or bulk)
router.post('/', async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const products = await Product.insertMany(req.body);
      res.status(201).json({
        message: `Successfully added ${products.length} products! 🎉`,
        products
      });
    } else {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json({
        message: "Product added successfully!",
        product
      });
    }
  } catch (err) {
    res.status(400).json({ 
      message: "Error adding products",
      error: err.message 
    });
  }
});

// PUT - Update a product by custom id
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true } // Return the updated document
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({
      message: "Product updated successfully!",
      product: updatedProduct
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Delete a product by custom id
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: Number(req.params.id) });
    
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({ 
      message: "Product deleted successfully! 🗑️",
      deletedProduct 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;