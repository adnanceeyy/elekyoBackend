const express = require('express');
const router = express.Router();
const VariantGroup = require('../models/VariantGroup');
const Product = require('../models/Product'); // To update products if needed

// GET all groups
router.get('/', async (req, res) => {
  try {
    const groups = await VariantGroup.find().sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE group
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await VariantGroup.findOne({ name });
    if (existing) {
       return res.status(400).json({ message: 'Group with this name already exists' });
    }
    const group = new VariantGroup({ name, description });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE group
router.delete('/:id', async (req, res) => {
  try {
    const group = await VariantGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    // Optional: Unlink products? Or keep them? 
    // User said "removed on refresh time", so likely they want persistent groups.
    // If we delete group, we should probably unset the variantGroup field on products.
    await Product.updateMany({ variantGroup: group.name }, { $unset: { variantGroup: "" } });
    
    await VariantGroup.findByIdAndDelete(req.params.id);
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
