const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  id: { type: String, default: 'global_settings', unique: true }, // Singleton ID
  homePageOfferImage: { type: String, default: '' }, // Hero Image
  bannerTitle: { type: String, default: 'Upgrade Your Digital Life' },
  bannerSubtitle: { type: String, default: 'Experience superior performance with our latest collection of premium gadgets and accessories.' },
  
  // Summer Sale / Offer Box Section
  offerTitle: { type: String, default: 'Summer Sale is Live' },
  offerSubtitle: { type: String, default: 'Get up to 50% off on premium headphones and smartwatches. Limited time offer.' },
  offerImage: { type: String, default: '' },
  offerLink: { type: String, default: '/allProduct' },

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
