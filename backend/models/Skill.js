const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Language', 'Art', 'Music', 'Sports', 'Cooking', 'Other']
  },
  offeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  yearsExperience: {
    type: Number,
    min: 0,
    max: 50,
    default: 0
  },
  availability: {
    type: String,
    enum: ['Available', 'Unavailable'],
    default: 'Available'
  },
  availabilityDescription: {
    type: String,
    trim: true,
    maxlength: 500
  },
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);
