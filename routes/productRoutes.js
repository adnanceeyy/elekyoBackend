const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ================================
   PUBLIC ROUTES (FRONTEND)
================================ */

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product by custom id
router.get("/:id", async (req, res) => {
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

/* ================================
   ADMIN ROUTES
================================ */

// ADD product (single or bulk)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const products = await Product.insertMany(req.body);
      res.status(201).json({
        message: `Successfully added ${products.length} products`,
        products,
      });
    } else {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json({
        message: "Product added successfully",
        product,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Error adding product",
      error: err.message,
    });
  }
});

// UPDATE product by custom id
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE product by custom id
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      id: Number(req.params.id),
    });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
