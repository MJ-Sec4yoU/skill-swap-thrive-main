const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true
  },
  teachingQuality: {
    type: Number,
    min: 1,
    max: 5
  },
  communication: {
    type: Number,
    min: 1,
    max: 5
  },
  punctuality: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Ensure one rating per user per schedule
ratingSchema.index({ rater: 1, schedule: 1 }, { unique: true });

// Calculate average rating for user
ratingSchema.statics.getAverageRating = async function(userId) {
  const stats = await this.aggregate([
    { $match: { rated: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$rated',
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 },
        averageTeaching: { $avg: '$teachingQuality' },
        averageCommunication: { $avg: '$communication' },
        averagePunctuality: { $avg: '$punctuality' }
      }
    }
  ]);

  return stats[0] || { averageRating: 0, totalRatings: 0 };
};

module.exports = mongoose.model('Rating', ratingSchema);