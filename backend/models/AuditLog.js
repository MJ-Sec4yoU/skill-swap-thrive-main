const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'USER_BANNED', 'USER_UNBANNED', 'USER_ADMIN_GRANTED', 'USER_ADMIN_REVOKED',
      'SKILL_DELETED', 'SCHEDULE_DELETED', 'MESSAGE_DELETED',
      'LOGIN', 'LOGOUT', 'PROFILE_UPDATED'
    ]
  },
  targetType: {
    type: String,
    enum: ['User', 'Skill', 'Schedule', 'Message', 'System'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  details: {
    type: String,
    required: false
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
