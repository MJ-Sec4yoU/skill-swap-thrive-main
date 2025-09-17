const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const { auditAction } = require('../middleware/audit');
const User = require('../models/UserEnhanced');
const Skill = require('../models/Skill');
const Schedule = require('../models/Schedule');
const Message = require('../models/Message');
const AuditLog = require('../models/AuditLog');

const router = express.Router();

// All routes require authenticated admin
router.use(auth, adminAuth);

// Users: list
router.get('/users', async (_req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Users: toggle isAdmin
router.put('/users/:id/admin', auditAction('USER_ADMIN_GRANTED', 'User', null, 'Admin status changed'), async (req, res) => {
  try {
    const { isAdmin } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isAdmin = !!isAdmin;
    await user.save();
    const plain = user.toObject();
    delete plain.password;
    res.json(plain);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Users: ban/unban (soft delete flag)
router.put('/users/:id/ban', auditAction('USER_BANNED', 'User', null, 'User banned'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.profile = user.profile || {};
    user.profile.isBanned = true;
    await user.save();
    const plain = user.toObject();
    delete plain.password;
    res.json(plain);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Users: unban
router.put('/users/:id/unban', auditAction('USER_UNBANNED', 'User', null, 'User unbanned'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.profile = user.profile || {};
    user.profile.isBanned = false;
    await user.save();
    const plain = user.toObject();
    delete plain.password;
    res.json(plain);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Skills: list
router.get('/skills', async (_req, res) => {
  try {
    const skills = await Skill.find().populate('offeredBy', 'name email').sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Skills: remove
router.delete('/skills/:id', auditAction('SKILL_DELETED', 'Skill', null, 'Skill deleted by admin'), async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    await skill.remove();
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Schedules: list all
router.get('/schedules', async (_req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('student', 'name email')
      .populate('teacher', 'name email')
      .populate('skill', 'name category')
      .sort({ createdAt: -1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Schedules: cancel/delete
router.delete('/schedules/:id', auditAction('SCHEDULE_DELETED', 'Schedule', null, 'Schedule deleted by admin'), async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    await schedule.remove();
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Messages: list all
router.get('/messages', async (_req, res) => {
  try {
    const messages = await Message.find()
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Messages: delete
router.delete('/messages/:id', auditAction('MESSAGE_DELETED', 'Message', null, 'Message deleted by admin'), async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    await message.remove();
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Audit logs: get all
router.get('/audit-logs', async (req, res) => {
  try {
    const { page = 1, limit = 50, action, admin } = req.query;
    const filter = {};
    if (action) filter.action = action;
    if (admin) filter.admin = admin;
    
    const logs = await AuditLog.find(filter)
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await AuditLog.countDocuments(filter);
    
    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [userCount, skillCount, scheduleCount, messageCount, recentLogs] = await Promise.all([
      User.countDocuments(),
      Skill.countDocuments(),
      Schedule.countDocuments(),
      Message.countDocuments(),
      AuditLog.find().populate('admin', 'name').sort({ createdAt: -1 }).limit(5)
    ]);
    
    res.json({
      userCount,
      skillCount,
      scheduleCount,
      messageCount,
      recentLogs
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;


