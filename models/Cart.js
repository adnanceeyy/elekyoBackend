const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  items: [{
    id: String, // Product ID
    name: String,
    price: Number,
    image: String,
    qty: { type: Number, default: 1 },
    // store other product details if needed to avoid populating
  }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
