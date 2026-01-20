const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  color: { type: String, default: 'blue' }, // Tailwind color name like 'blue', 'red'
  icon: { type: String, default: '📦' }, // Emoji or icon identifier
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
