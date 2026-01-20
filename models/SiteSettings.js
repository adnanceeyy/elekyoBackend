const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  id: { type: String, default: 'global_settings', unique: true }, // Singleton ID
  homePageOfferImage: { type: String, default: '' }, // Base64 or URL
  promotions: [{
    title: String,
    subtitle: String,
    image: String,
    location: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
