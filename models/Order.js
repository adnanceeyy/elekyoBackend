// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerDetails: {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' }
    }
  },
  orderedItems: [{
    productId: { type: String, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    image: String
  }],
  paymentSummary: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    total: { type: Number, required: true }
  },
  status: { type: String, default: 'pending' }, // pending, confirmed, shipped, etc.
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);