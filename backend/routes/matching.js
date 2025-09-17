const express = require('express');
const router = express.Router();
const User = require('../models/UserEnhanced');
const Skill = require('../models/Skill');
const SkillMatch = require('../models/SkillMatch');
const Rating = require('../models/Rating');
const { auth } = require('../middleware/auth');

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'Matching routes working!' });
});

// Get skill matches for current user
router.get('/matches', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10, page = 1, skillName, category, minScore = 30 } = req.query;
    
    const skip = (page - 1) * limit;
    
    // Build query filter
    const filter = { 
      student: userId, 
      matchScore: { $gte: parseInt(minScore) },
      status: { $in: ['Active', 'Contacted'] }  // Show both active and contacted matches
    };
    
    // If specific skill or category requested
    if (skillName || category) {
      let skillFilter = {};
      if (skillName) {
        // Escape special regex characters to prevent invalid regex patterns
        const escapedSkillName = skillName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        skillFilter.name = new RegExp(escapedSkillName, 'i');
      }
      if (category) skillFilter.category = category;
      
      const matchingSkills = await Skill.find(skillFilter);
      filter.skill = { $in: matchingSkills.map(s => s._id) };
    }
    
    const matches = await SkillMatch.find(filter)
      .populate({
        path: 'teacher',
        select: 'name email profile skillsTeaching',
        populate: {
          path: 'profile'
        }
      })
      .populate({
        path: 'skill',
        select: 'name description category level tags'
      })
      .sort({ matchScore: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    // Get teacher ratings for each match
    const enrichedMatches = await Promise.all(
      matches.map(async (match) => {
        const teacherRating = await Rating.getAverageRating(match.teacher._id);
        return {
          ...match.toObject(),
          teacher: {
            ...match.teacher.toObject(),
            rating: teacherRating
          }
        };
      })
    );
    
    const total = await SkillMatch.countDocuments(filter);
    
    res.json({
      matches: enrichedMatches,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate new matches for user
router.post('/generate', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Clear existing active matches for this user
    await SkillMatch.deleteMany({ student: userId, status: 'Active' });
    
    // Find skills user wants to learn
    const skillsToMatch = user.skillsLearning || [];
    
    if (skillsToMatch.length === 0) {
      return res.json({ message: 'No skills to match. Please update your learning interests.', error: 'NO_LEARNING_SKILLS' });
    }
    
    const newMatches = [];
    let totalAvailableSkills = 0;
    
    // For each skill the user wants to learn
    for (const skillItem of skillsToMatch) {
      // Extract skill name - handle both string format (legacy) and object format (new)
      let skillName;
      if (typeof skillItem === 'string') {
        skillName = skillItem;
      } else if (typeof skillItem === 'object' && skillItem.skill) {
        skillName = skillItem.skill;
      } else {
        console.warn('Invalid skill format:', skillItem);
        continue; // Skip invalid skill formats
      }
      
      // Find skills offered by other users
      // Escape special regex characters to prevent invalid regex patterns
      const escapedSkillName = skillName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const availableSkills = await Skill.find({
        name: new RegExp(escapedSkillName, 'i'),
        availability: 'Available',
        offeredBy: { $ne: userId } // Exclude user's own skills
      }).populate('offeredBy');
      
      totalAvailableSkills += availableSkills.length;
      
      // Generate matches for each available skill
      for (const skill of availableSkills) {
        const teacher = skill.offeredBy;
        
        // Skip if teacher is banned
        if (teacher.profile?.isBanned) continue;
        
        // Calculate match score
        const matchData = SkillMatch.calculateMatchScore(user, teacher, skill);
        
        // Only create matches with decent scores
        if (matchData.score >= 30) {
          const match = new SkillMatch({
            student: userId,
            teacher: teacher._id,
            skill: skill._id,
            matchScore: matchData.score,
            factors: matchData.factors
          });
          
          const savedMatch = await match.save();
          newMatches.push(savedMatch);
        }
      }
    }
    
    // If no available skills were found for any of the learning interests
    if (totalAvailableSkills === 0) {
      return res.json({ 
        message: 'No available skills found matching your learning interests. Try adding different learning interests.', 
        error: 'NO_AVAILABLE_SKILLS' 
      });
    }
    
    // If skills were found but no matches met the minimum score threshold
    if (totalAvailableSkills > 0 && newMatches.length === 0) {
      return res.json({ 
        message: 'Found skills matching your interests, but none met our quality threshold. Try adjusting your profile or adding different learning interests.', 
        error: 'NO_QUALITY_MATCHES' 
      });
    }
    
    res.json({
      message: `Generated ${newMatches.length} new matches`,
      matchCount: newMatches.length
    });
  } catch (error) {
    console.error('Generate matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Express interest in a match
router.post('/matches/:matchId/interested', auth, async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user._id;
    
    const match = await SkillMatch.findOne({ 
      _id: matchId, 
      student: userId 
    });
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    match.studentInterested = true;
    match.lastContactDate = new Date();
    
    // If both parties are interested, update status
    if (match.teacherInterested) {
      match.status = 'Contacted';
    }
    
    await match.save();
    
    res.json({ message: 'Interest recorded', match });
  } catch (error) {
    console.error('Express interest error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Decline a match
router.post('/matches/:matchId/decline', auth, async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user._id;
    
    const match = await SkillMatch.findOne({ 
      _id: matchId, 
      student: userId 
    });
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    match.status = 'Declined';
    await match.save();
    
    res.json({ message: 'Match declined' });
  } catch (error) {
    console.error('Decline match error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get matching statistics for user
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await SkillMatch.aggregate([
      { $match: { student: new (require('mongoose')).Types.ObjectId(String(userId)) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgScore: { $avg: '$matchScore' }
        }
      }
    ]);
    
    const totalMatches = await SkillMatch.countDocuments({ student: userId });
    const interestedMatches = await SkillMatch.countDocuments({ 
      student: userId, 
      studentInterested: true 
    });
    
    res.json({
      totalMatches,
      interestedMatches,
      statusBreakdown: stats,
      interestRate: totalMatches > 0 ? (interestedMatches / totalMatches * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// For teachers - get students interested in their skills
router.get('/interested-students', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const matches = await SkillMatch.find({
      teacher: userId,
      studentInterested: true,
      status: { $in: ['Active', 'Contacted'] }
    })
    .populate({
      path: 'student',
      select: 'name email profile skillsLearning'
    })
    .populate({
      path: 'skill',
      select: 'name description category'
    })
    .sort({ lastContactDate: -1, matchScore: -1 });
    
    res.json({ interestedStudents: matches });
  } catch (error) {
    console.error('Get interested students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Teacher expresses interest back
router.post('/students/:matchId/accept', auth, async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user._id;
    
    const match = await SkillMatch.findOne({
      _id: matchId,
      teacher: userId,
      studentInterested: true
    });
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    match.teacherInterested = true;
    match.status = 'Contacted';
    match.lastContactDate = new Date();
    
    await match.save();
    
    res.json({ message: 'Student accepted', match });
  } catch (error) {
    console.error('Accept student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Advanced matching with filters
router.post('/advanced-search', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      skills = [],
      categories = [],
      locations = [],
      levels = [],
      minRating = 0,
      maxDistance = null,
      availability = null,
      limit = 20
    } = req.body;
    
    // Build skill filter
    let skillFilter = { availability: 'Available', offeredBy: { $ne: userId } };
    
    if (skills.length > 0) {
      // Escape special regex characters to prevent invalid regex patterns
      const escapedSkills = skills.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      skillFilter.name = { $in: escapedSkills.map(s => new RegExp(s, 'i')) };
    }
    
    if (categories.length > 0) {
      skillFilter.category = { $in: categories };
    }
    
    if (levels.length > 0) {
      skillFilter.level = { $in: levels };
    }
    
    // Find matching skills
    const matchingSkills = await Skill.find(skillFilter)
      .populate({
        path: 'offeredBy',
        match: {
          'profile.isBanned': { $ne: true }
        }
      });
    
    // Filter by location and rating
    const potentialMatches = [];
    const user = await User.findById(userId);
    
    for (const skill of matchingSkills) {
      if (!skill.offeredBy) continue;
      
      const teacher = skill.offeredBy;
      
      // Location filter
      if (locations.length > 0 && teacher.profile?.location) {
        const teacherLocation = teacher.profile.location.toLowerCase();
        const hasMatchingLocation = locations.some(loc => 
          teacherLocation.includes(loc.toLowerCase())
        );
        if (!hasMatchingLocation) continue;
      }
      
      // Rating filter
      if (minRating > 0) {
        const teacherRating = await Rating.getAverageRating(teacher._id);
        if (teacherRating.averageRating < minRating) continue;
      }
      
      // Calculate match score
      const matchData = SkillMatch.calculateMatchScore(user, teacher, skill);
      
      potentialMatches.push({
        skill,
        teacher,
        matchScore: matchData.score,
        factors: matchData.factors
      });
    }
    
    // Sort by match score
    potentialMatches.sort((a, b) => b.matchScore - a.matchScore);
    
    // Limit results
    const results = potentialMatches.slice(0, limit);
    
    res.json({
      matches: results,
      totalFound: potentialMatches.length,
      searchCriteria: req.body
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;