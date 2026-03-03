const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  notes: String,
  meetingLink: String,
  description: String
}, {
  timestamps: true
});

// Index for efficient querying
scheduleSchema.index({ student: 1, date: 1 });
scheduleSchema.index({ teacher: 1, date: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);
