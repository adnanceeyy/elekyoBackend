const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  time: { type: Date, default: Date.now },
  type: { type: String, enum: ['order', 'payment', 'alert', 'user'], default: 'order' },
  unread: { type: Boolean, default: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
