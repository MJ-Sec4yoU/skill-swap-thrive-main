const express = require('express');
const { auth } = require('../middleware/auth');
const Message = require('../models/Message');
const router = express.Router();

// Get user's messages
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    // Support both receiver and recipientId for compatibility
    const receiver = req.body.receiver || req.body.recipientId;
    const { content } = req.body;
    if (!receiver || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }
    const message = new Message({
      sender: req.user._id,
      receiver,
      content
    });
    await message.save();
    await message.populate('sender', 'name email');
    await message.populate('receiver', 'name email');
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Mark message as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    if (!message.receiver.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    message.isRead = true;
    message.readAt = new Date();
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
