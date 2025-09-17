const express = require('express');
const { auth } = require('../middleware/auth');
const { skillValidation } = require('../middleware/validation');
const Skill = require('../models/Skill');
const router = express.Router();

// Get current user's skills
router.get('/my-skills', auth, async (req, res) => {
  try {
    const skills = await Skill.find({ offeredBy: req.user._id })
      .populate('offeredBy', 'name email profile')
      .sort({ createdAt: -1 });
    
    res.json({ skills });
  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// List all skills with search, filtering, and sorting
router.get('/', skillValidation.search, async (req, res) => {
  try {
    const {
      search,
      category,
      level,
      availability,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build query object
    let query = {};

    // Search functionality
    if (search) {
      // Escape special regex characters to prevent invalid regex patterns
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
        { tags: { $in: [new RegExp(escapedSearch, 'i')] } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Level filter
    if (level && level !== 'all') {
      query.level = level;
    }

    // Availability filter
    if (availability && availability !== 'all') {
      query.availability = availability;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const skills = await Skill.find(query)
      .populate('offeredBy', 'name email profile')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Skill.countDocuments(query);

    res.json({
      skills,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Offer a new skill
router.post('/', auth, skillValidation.create, async (req, res) => {
  try {
    const skillData = req.body;
    skillData.offeredBy = req.user._id;
    const skill = new Skill(skillData);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get skill details
router.get('/:id', skillValidation.getById, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('offeredBy', 'name email');
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update skill
router.put('/:id', auth, skillValidation.update, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    if (!skill.offeredBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    Object.assign(skill, req.body);
    await skill.save();
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete skill
router.delete('/:id', auth, skillValidation.delete, async (req, res) => {
  try {
    console.log('Delete skill request for ID:', req.params.id);
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      console.log('Skill not found:', req.params.id);
      return res.status(404).json({ message: 'Skill not found' });
    }
    if (!skill.offeredBy.equals(req.user._id)) {
      console.log('Unauthorized delete attempt by user:', req.user._id, 'for skill:', req.params.id);
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Use deleteOne() instead of deprecated remove()
    await skill.deleteOne();
    console.log('Skill deleted successfully:', req.params.id);
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
