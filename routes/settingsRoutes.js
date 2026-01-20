const express = require("express");
const router = express.Router();
const SiteSettings = require("../models/SiteSettings");

// GET settings
router.get("/", async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ id: 'global_settings' });
    if (!settings) {
      // Create default if not exists
      settings = new SiteSettings({ id: 'global_settings' });
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE settings
router.put("/", async (req, res) => {
  try {
    const updateData = req.body;
    let settings = await SiteSettings.findOne({ id: 'global_settings' });
    
    if (!settings) {
        settings = new SiteSettings({ id: 'global_settings' });
    }

    // List of allowed fields to update
    const allowedFields = [
      'homePageOfferImage', 
      'bannerTitle', 
      'bannerSubtitle', 
      'offerTitle', 
      'offerSubtitle', 
      'offerImage', 
      'offerLink',
      'promotions',
      'storeName',
      'contactEmail',
      'contactPhone',
      'storeAddress'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        settings[field] = updateData[field];
      }
    });

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
