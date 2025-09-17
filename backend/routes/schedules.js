const express = require('express');
const { auth } = require('../middleware/auth');
const Schedule = require('../models/Schedule');
const router = express.Router();

// Get user's schedules
router.get('/', auth, async (req, res) => {
  try {
    const schedules = await Schedule.find({
      $or: [{ student: req.user._id }, { teacher: req.user._id }]
    })
    .populate('student', 'name email')
    .populate('teacher', 'name email')
    .populate('skill');
    res.json(schedules);
  } catch (error) {
    console.error('List schedules failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new schedule
router.post('/', auth, async (req, res) => {
  try {
    const { student, teacher, skill, date, startTime, endTime, status, notes, meetingLink } = req.body;
    
    // Validate required fields
    if (!student && !teacher) {
      return res.status(400).json({ message: 'Either student or teacher is required' });
    }
    if (!skill) {
      return res.status(400).json({ message: 'Skill is required' });
    }
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }
    if (!startTime) {
      return res.status(400).json({ message: 'Start time is required' });
    }
    if (!endTime) {
      return res.status(400).json({ message: 'End time is required' });
    }
    
    // Validate date format
    const scheduleDate = new Date(date);
    if (isNaN(scheduleDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    // Create schedule data object
    const scheduleData = {
      student: student || req.user._id,
      teacher: teacher || req.user._id,
      skill,
      date: scheduleDate,
      startTime,
      endTime,
      status: status || 'Pending',
      notes,
      meetingLink
    };
    
    const schedule = new Schedule(scheduleData);
    await schedule.save();
    await schedule.populate('student', 'name email');
    await schedule.populate('teacher', 'name email');
    await schedule.populate('skill');
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Create schedule failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update schedule
router.put('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    if (!schedule.student.equals(req.user._id) && !schedule.teacher.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Normalize status casing to match schema enum
    if (req.body && typeof req.body.status === 'string') {
      const statusMap = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        completed: 'Completed',
        cancelled: 'Cancelled',
        canceled: 'Cancelled'
      };
      const normalized = statusMap[req.body.status.toLowerCase()];
      if (normalized) {
        req.body.status = normalized;
      } else {
        delete req.body.status; // ignore invalid status
      }
    }

    Object.assign(schedule, req.body);
    await schedule.save();
    res.json(schedule);
  } catch (error) {
    console.error('Update schedule failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete schedule
router.delete('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    if (!schedule.student.equals(req.user._id) && !schedule.teacher.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await schedule.remove();
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    console.error('Delete schedule failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
