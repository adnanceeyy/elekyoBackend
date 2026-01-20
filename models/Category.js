const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  color: { type: String, default: 'blue' }, // Tailwind color name like 'blue', 'red'
  icon: { type: String, default: '📦' }, // Emoji or icon identifier
  image: { type: String, default: '' }, // Cover Image (Base64 or URL)
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
