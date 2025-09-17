const express = require('express');
const router = express.Router();
const User = require('../models/UserEnhanced');
const Skill = require('../models/Skill');

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'Matching routes working!' });
});

// Get all users (simple test)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().limit(5);
    res.json({ users: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;