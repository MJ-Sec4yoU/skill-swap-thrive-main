const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Schedule = require('../models/Schedule');
const User = require('../models/UserEnhanced');
const { auth } = require('../middleware/auth');

// Get ratings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    const ratings = await Rating.find({ rated: userId })
      .populate({
        path: 'rater',
        select: 'name profile.avatar'
      })
      .populate({
        path: 'skill',
        select: 'name category'
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Rating.countDocuments({ rated: userId });
    const averageStats = await Rating.getAverageRating(userId);
    
    res.json({
      ratings,
      averageStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new rating
router.post('/', auth, async (req, res) => {
  try {
    const raterId = req.user.userId;
    const {
      ratedUserId,
      skillId,
      scheduleId,
      rating,
      review,
      teachingQuality,
      communication,
      punctuality
    } = req.body;
    
    // Validate required fields
    if (!ratedUserId || !skillId || !scheduleId || !rating) {
      return res.status(400).json({ 
        message: 'Missing required fields: ratedUserId, skillId, scheduleId, rating' 
      });
    }
    
    // Verify the schedule exists and involves both users
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    // Check if the rating user was part of this schedule
    const isStudent = schedule.student.toString() === raterId;
    const isTeacher = schedule.teacher.toString() === raterId;
    
    if (!isStudent && !isTeacher) {
      return res.status(403).json({ message: 'You can only rate users from your own sessions' });
    }
    
    // Verify the rated user was the other party in the schedule
    const expectedRatedUser = isStudent ? schedule.teacher.toString() : schedule.student.toString();
    if (expectedRatedUser !== ratedUserId) {
      return res.status(403).json({ message: 'Invalid rated user for this schedule' });
    }
    
    // Check if rating already exists
    const existingRating = await Rating.findOne({
      rater: raterId,
      schedule: scheduleId
    });
    
    if (existingRating) {
      return res.status(409).json({ message: 'You have already rated this session' });
    }
    
    // Only allow rating if schedule is completed
    if (schedule.status !== 'Completed') {
      return res.status(400).json({ message: 'Can only rate completed sessions' });
    }
    
    // Validate rating values
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const ratingData = {
      rater: raterId,
      rated: ratedUserId,
      skill: skillId,
      schedule: scheduleId,
      rating,
      review: review || ''
    };
    
    // Add optional detailed ratings
    if (teachingQuality && teachingQuality >= 1 && teachingQuality <= 5) {
      ratingData.teachingQuality = teachingQuality;
    }
    if (communication && communication >= 1 && communication <= 5) {
      ratingData.communication = communication;
    }
    if (punctuality && punctuality >= 1 && punctuality <= 5) {
      ratingData.punctuality = punctuality;
    }
    
    const newRating = new Rating(ratingData);
    const savedRating = await newRating.save();
    
    // Populate the saved rating before returning
    await savedRating.populate([
      { path: 'rater', select: 'name profile.avatar' },
      { path: 'rated', select: 'name' },
      { path: 'skill', select: 'name category' }
    ]);
    
    res.status(201).json({
      message: 'Rating created successfully',
      rating: savedRating
    });
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a rating (only by the original rater)
router.put('/:ratingId', auth, async (req, res) => {
  try {
    const { ratingId } = req.params;
    const userId = req.user.userId;
    const {
      rating,
      review,
      teachingQuality,
      communication,
      punctuality
    } = req.body;
    
    const existingRating = await Rating.findById(ratingId);
    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    // Only allow the original rater to update
    if (existingRating.rater.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update your own ratings' });
    }
    
    // Validate rating value
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Update fields
    if (rating) existingRating.rating = rating;
    if (review !== undefined) existingRating.review = review;
    if (teachingQuality && teachingQuality >= 1 && teachingQuality <= 5) {
      existingRating.teachingQuality = teachingQuality;
    }
    if (communication && communication >= 1 && communication <= 5) {
      existingRating.communication = communication;
    }
    if (punctuality && punctuality >= 1 && punctuality <= 5) {
      existingRating.punctuality = punctuality;
    }
    
    const updatedRating = await existingRating.save();
    
    await updatedRating.populate([
      { path: 'rater', select: 'name profile.avatar' },
      { path: 'rated', select: 'name' },
      { path: 'skill', select: 'name category' }
    ]);
    
    res.json({
      message: 'Rating updated successfully',
      rating: updatedRating
    });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a rating (only by the original rater or admin)
router.delete('/:ratingId', auth, async (req, res) => {
  try {
    const { ratingId } = req.params;
    const userId = req.user.userId;
    
    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    // Check if user is the rater or an admin
    const user = await User.findById(userId);
    const isOwner = rating.rater.toString() === userId;
    const isAdmin = user && user.isAdmin;
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'You can only delete your own ratings' });
    }
    
    await Rating.findByIdAndDelete(ratingId);
    
    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get rating statistics for a skill
router.get('/skill/:skillId/stats', async (req, res) => {
  try {
    const { skillId } = req.params;
    
    const stats = await Rating.aggregate([
      { $match: { skill: new (require('mongoose')).Types.ObjectId(skillId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
          averageTeaching: { $avg: '$teachingQuality' },
          averageCommunication: { $avg: '$communication' },
          averagePunctuality: { $avg: '$punctuality' },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);
    
    let ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    if (stats.length > 0 && stats[0].ratingDistribution) {
      stats[0].ratingDistribution.forEach(rating => {
        ratingBreakdown[rating] = (ratingBreakdown[rating] || 0) + 1;
      });
    }
    
    res.json({
      skillId,
      stats: stats[0] || {
        averageRating: 0,
        totalRatings: 0,
        averageTeaching: 0,
        averageCommunication: 0,
        averagePunctuality: 0
      },
      ratingBreakdown
    });
  } catch (error) {
    console.error('Get skill rating stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ratings that user can create (completed schedules without ratings)
router.get('/pending', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Find completed schedules where user participated
    const completedSchedules = await Schedule.find({
      $or: [
        { student: userId },
        { teacher: userId }
      ],
      status: 'Completed'
    }).populate([
      { path: 'student', select: 'name profile.avatar' },
      { path: 'teacher', select: 'name profile.avatar' },
      { path: 'skill', select: 'name category' }
    ]);
    
    // Check which ones don't have ratings yet
    const pendingRatings = [];
    
    for (const schedule of completedSchedules) {
      const existingRating = await Rating.findOne({
        rater: userId,
        schedule: schedule._id
      });
      
      if (!existingRating) {
        const isStudent = schedule.student._id.toString() === userId;
        const otherUser = isStudent ? schedule.teacher : schedule.student;
        
        pendingRatings.push({
          schedule: {
            _id: schedule._id,
            date: schedule.date,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            notes: schedule.notes
          },
          skill: schedule.skill,
          userToRate: {
            _id: otherUser._id,
            name: otherUser.name,
            avatar: otherUser.profile?.avatar
          },
          userRole: isStudent ? 'student' : 'teacher'
        });
      }
    }
    
    res.json({ pendingRatings });
  } catch (error) {
    console.error('Get pending ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;