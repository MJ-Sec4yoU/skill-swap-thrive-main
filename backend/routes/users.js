// ... previous code unchanged ...

const express = require('express');
const { auth } = require('../middleware/auth');
const { userValidation } = require('../middleware/validation');
const User = require('../models/UserEnhanced');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Helper to compute profile completion
function computeProfileCompletion(user) {
  if (!user) return 0;
  const hasBio = !!(user.profile && user.profile.bio && String(user.profile.bio).trim().length > 0);
  const hasTeach = Array.isArray(user.skillsTeaching) && user.skillsTeaching.length > 0;
  const hasLearn = Array.isArray(user.skillsLearning) && user.skillsLearning.length > 0;
  const hasAvatar = !!(user.profile && user.profile.avatar && String(user.profile.avatar).trim().length > 0);
  let completion = 0;
  if (hasBio) completion += 25;
  if (hasTeach) completion += 25;
  if (hasLearn) completion += 25;
  if (hasAvatar) completion += 25;
  return completion;
}

// Get current user's profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const plain = user.toObject();
    // Normalize avatar path for client
    if (plain.profile && plain.profile.avatar) {
      const current = plain.profile.avatar;
      plain.profile.avatar = current.startsWith('uploads/') ? current : `uploads/${current}`;
    }
    // Ensure profileCompletion is populated
    plain.profile = plain.profile || {};
    plain.profile.profileCompletion = computeProfileCompletion(plain);
    res.json(plain);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Search users with filtering and sorting
router.get('/search', userValidation.search, async (req, res) => {
  try {
    const {
      search,
      skill,
      location,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build query object
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.bio': { $regex: search, $options: 'i' } }
      ];
    }

    // Skill filter (users who teach specific skill)
    if (skill) {
      // Escape special regex characters to prevent invalid regex patterns
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.skillsTeaching = { $in: [new RegExp(escapedSkill, 'i')] };
    }

    // Location filter
    if (location) {
      // Escape special regex characters to prevent invalid regex patterns
      const escapedLocation = location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query['profile.location'] = { $regex: escapedLocation, $options: 'i' };
    }

    // Exclude banned users
    query['profile.isBanned'] = { $ne: true };

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const users = await User.find(query)
      .select('-password')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Process users to normalize avatar paths and add profile completion
    const processedUsers = users.map(user => {
      const plain = user.toObject();
      if (plain.profile && plain.profile.avatar) {
        const current = plain.profile.avatar;
        plain.profile.avatar = current.startsWith('uploads/') ? current : `uploads/${current}`;
      }
      plain.profile = plain.profile || {};
      plain.profile.profileCompletion = computeProfileCompletion(plain);
      return plain;
    });

    res.json({
      users: processedUsers,
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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Middleware to conditionally apply multer only for multipart/form-data
const conditionalUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.startsWith('multipart/form-data')) {
    upload.single('avatar')(req, res, next);
  } else {
    next();
  }
};

// Update user profile
router.put('/profile', auth, conditionalUpload, userValidation.updateProfile, async (req, res) => {
  try {
    const incoming = req.body;
    console.log('Received updates:', incoming);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Avatar: only update when a new file is uploaded
    if (req.file) {
      user.profile = user.profile || {};
      // Strip 'uploads/' prefix if present in filename
      let filename = req.file.filename;
      if (filename.startsWith('uploads/')) {
        filename = filename.substring('uploads/'.length);
      }
      user.profile.avatar = filename;
      console.log('Avatar uploaded successfully:', filename, 'for user:', user._id);
    }

    // Bio
    if (typeof incoming.bio === 'string') {
      user.profile = user.profile || {};
      user.profile.bio = incoming.bio;
    }

    // Optional profile payload (JSON)
    let profilePayload = incoming.profile;
    if (profilePayload && typeof profilePayload === 'string') {
      try { profilePayload = JSON.parse(profilePayload); } catch (_) { profilePayload = undefined; }
    }
    if (profilePayload && typeof profilePayload === 'object') {
      user.profile = user.profile || {};
      Object.keys(profilePayload).forEach((key) => {
        if (key === 'avatar') return; // do not overwrite avatar here
        user.profile[key] = profilePayload[key];
      });
    }

    // Skills - Transform string arrays to object arrays for UserEnhanced model
    let skillsTeaching = incoming.skillsTeaching;
    if (typeof skillsTeaching === 'string') { 
      try { 
        skillsTeaching = JSON.parse(skillsTeaching); 
      } catch { 
        skillsTeaching = undefined; 
      } 
    }
    if (Array.isArray(skillsTeaching)) { 
      // Transform simple strings to objects expected by UserEnhanced model
      user.skillsTeaching = skillsTeaching.map(skill => {
        if (typeof skill === 'string') {
          return {
            skill: skill,
            level: 'Intermediate', // default level
            experience: 1, // default experience
            isActive: true
          };
        }
        return skill; // if already an object, keep as is
      });
    }

    let skillsLearning = incoming.skillsLearning;
    if (typeof skillsLearning === 'string') { 
      try { 
        skillsLearning = JSON.parse(skillsLearning); 
      } catch { 
        skillsLearning = undefined; 
      } 
    }
    if (Array.isArray(skillsLearning)) { 
      // Transform simple strings to objects expected by UserEnhanced model
      user.skillsLearning = skillsLearning.map(skill => {
        if (typeof skill === 'string') {
          return {
            skill: skill,
            currentLevel: 'Beginner', // default current level
            targetLevel: 'Intermediate', // default target level
            urgency: 'Medium' // default urgency
          };
        }
        return skill; // if already an object, keep as is
      });
    }

    // Name/Email
    if (typeof incoming.name === 'string') user.name = incoming.name;
    if (typeof incoming.email === 'string') user.email = incoming.email;

    // Compute profile completion (bio, skillsTeaching, skillsLearning, avatar)
    {
      const hasBio = !!(user.profile && user.profile.bio && String(user.profile.bio).trim().length > 0);
      const hasTeach = Array.isArray(user.skillsTeaching) && user.skillsTeaching.length > 0;
      const hasLearn = Array.isArray(user.skillsLearning) && user.skillsLearning.length > 0;
      const hasAvatar = !!(user.profile && user.profile.avatar && String(user.profile.avatar).trim().length > 0);
      let completion = 0;
      if (hasBio) completion += 25;
      if (hasTeach) completion += 25;
      if (hasLearn) completion += 25;
      if (hasAvatar) completion += 25;
      user.profile = user.profile || {};
      user.profile.profileCompletion = completion;
    }

    await user.save();

    // Prepare response without password and with normalized avatar path
    const plain = user.toObject();
    delete plain.password;
    if (plain.profile && plain.profile.avatar) {
      const current = plain.profile.avatar;
      plain.profile.avatar = current.startsWith('uploads/') ? current : `uploads/${current}`;
    }

    console.log('Updated user:', plain);
    res.json(plain);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by ID
router.get('/:id', auth, userValidation.getUserById, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
// Bootstrap: one-time admin promotion if no admins exist
// WARNING: This endpoint is only effective when there are zero admins; otherwise it returns 403.
// It promotes the earliest created user or a user specified by email in the body.
router.post('/bootstrap-admin', userValidation.bootstrapAdmin, async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ isAdmin: true });
    if (adminCount > 0) {
      return res.status(403).json({ message: 'Admins already exist' });
    }

    let user;
    if (req.body && typeof req.body.email === 'string') {
      user = await User.findOne({ email: req.body.email.toLowerCase() });
    }
    if (!user) {
      user = await User.findOne().sort({ createdAt: 1 });
    }
    if (!user) {
      return res.status(404).json({ message: 'No users found to promote' });
    }
    user.isAdmin = true;
    await user.save();
    const plain = user.toObject();
    delete plain.password;
    return res.json({ message: 'Admin promoted', user: plain });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});
