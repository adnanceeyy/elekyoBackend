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

// Helper to find product by id or _id
const findProduct = async (idParam) => {
  let product = null;
  // Try custom numeric ID first
  if (!isNaN(idParam)) {
    product = await Product.findOne({ id: Number(idParam) });
  }
  // Fallback to MongoDB _id
  if (!product && mongoose.isValidObjectId(idParam)) {
    product = await Product.findById(idParam);
  }
  return product;
};

// GET single product by custom id or _id
router.get("/:id", async (req, res) => {
  try {
    const product = await findProduct(req.params.id);
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
      // Auto-generate ID if not provided
      if (!req.body.id) {
        const lastProduct = await Product.findOne().sort({ id: -1 });
        req.body.id = lastProduct && lastProduct.id ? lastProduct.id + 1 : 1;
      }

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

// UPDATE product by custom id or _id
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    let product = await findProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update fields
    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE product by custom id or _id
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const product = await findProduct(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.deleteOne({ _id: product._id });

    res.json({
      message: "Product deleted successfully",
      deletedProduct: product,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
