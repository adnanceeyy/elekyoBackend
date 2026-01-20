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
    const { homePageOfferImage, promotions } = req.body;
    let settings = await SiteSettings.findOne({ id: 'global_settings' });
    
    if (!settings) {
        settings = new SiteSettings({ id: 'global_settings' });
    }

    if (homePageOfferImage !== undefined) settings.homePageOfferImage = homePageOfferImage;
    if (promotions !== undefined) settings.promotions = promotions;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
