const AuditLog = require('../models/AuditLog');

const auditAction = (action, targetType, targetId = null, details = null) => {
  return async (req, res, next) => {
    // Store original res.json to intercept response
    const originalJson = res.json;
    
    res.json = function(data) {
      // Only log if the action was successful (status 200-299)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Log the action asynchronously (don't wait for it)
        AuditLog.create({
          admin: req.user._id,
          action,
          targetType,
          targetId,
          details,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent')
        }).catch(err => {
          console.error('Audit log error:', err);
        });
      }
      
      // Call original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
};

module.exports = { auditAction };
