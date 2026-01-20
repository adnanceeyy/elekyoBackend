const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Your custom id from JSON
  name: { type: String, required: true },
  productDetailedName: String, // Long name like "Boat rokerz 550..."
  description: { type: String, required: true },
  productRating: Number,
  totalSale: Number,
  price: { type: Number, required: true }, // Current offer price
  mrPrice: Number, // Original MRP
  isNew: Boolean,
  color: String,
  off: String, // e.g., "10%"
  image: { type: String, required: true },
  images: [String], // Array of additional image URLs
  category: String,
  countInStock: { type: Number, default: 0 },
  catogeryId: Number, // Your category number (1, 2, 3...)
  brand: String,
  model: String,
  warranty: String
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Product', productSchema);