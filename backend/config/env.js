// Backend Environment Configuration and Validation
// This file centralizes all environment variable access and validation for the backend

const crypto = require('crypto');

// Helper function to parse boolean environment variables
const parseBoolean = (value, defaultValue = false) => {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

// Helper function to parse array environment variables
const parseArray = (value, defaultValue = []) => {
  if (!value) return defaultValue;
  return value.split(',').map(item => item.trim());
};

// Helper function to parse integer environment variables
const parseInt = (value, defaultValue = 0) => {
  const parsed = global.parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Main configuration object
const config = {
  // Server Configuration
  port: parseInt(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  host: process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'),

  // Database Configuration
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/swap-learn-thrive',
  dbName: process.env.DB_NAME || 'swap-learn-thrive',

  // Authentication Configuration
  jwtSecret: process.env.JWT_SECRET || 'development-jwt-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'development-refresh-secret-change-in-production',
  sessionSecret: process.env.SESSION_SECRET || 'development-session-secret-change-in-production',

  // File Upload Configuration
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 5242880), // 5MB default
  allowedFileTypes: parseArray(
    process.env.ALLOWED_FILE_TYPES,
    ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  ),

  // Email Configuration (Optional)
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromEmail: process.env.FROM_EMAIL,
  },

  // Redis Configuration (Optional)
  redisUrl: process.env.REDIS_URL,

  // External Services
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  // Monitoring & Logging
  sentryDsn: process.env.SENTRY_DSN,
  logLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warn' : 'info'),

  // Security Configuration
  corsOrigin: parseArray(
    process.env.CORS_ORIGIN,
    ['http://localhost:8080', 'http://localhost:3000']
  ),
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW, 15), // minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 100), // requests per window

  // Admin Configuration
  adminEmail: process.env.ADMIN_EMAIL || 'admin@localhost',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123',

  // Frontend URLs (for CORS and redirects)
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  frontendUrl2: process.env.FRONTEND_URL_2,
  frontendUrl3: process.env.FRONTEND_URL_3,
  frontendUrl4: process.env.FRONTEND_URL_4,
};

// Required environment variables for different environments
const requiredDevelopmentEnvVars = [
  'JWT_SECRET',
  'MONGODB_URI',
  'PORT',
];

const requiredProductionEnvVars = [
  'JWT_SECRET',
  'REFRESH_TOKEN_SECRET',
  'SESSION_SECRET',
  'MONGODB_URI',
  'PORT',
  'CORS_ORIGIN',
];

// Recommended environment variables for production
const recommendedProductionEnvVars = [
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'FROM_EMAIL',
  'SENTRY_DSN',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'REDIS_URL',
];

// Security validation functions
const validateJwtSecret = (secret) => {
  if (!secret || secret === 'development-jwt-secret-change-in-production') {
    return 'JWT secret is not set or using development default';
  }
  if (secret.length < 32) {
    return 'JWT secret should be at least 32 characters long';
  }
  return null;
};

const validateSessionSecret = (secret) => {
  if (!secret || secret === 'development-session-secret-change-in-production') {
    return 'Session secret is not set or using development default';
  }
  if (secret.length < 32) {
    return 'Session secret should be at least 32 characters long';
  }
  return null;
};

const validateMongoUri = (uri) => {
  if (!uri) {
    return 'MongoDB URI is required';
  }
  if (config.nodeEnv === 'production' && uri.includes('localhost')) {
    return 'Production should not use localhost MongoDB';
  }
  return null;
};

const validateCorsOrigins = (origins) => {
  if (config.nodeEnv === 'production') {
    const hasLocalhost = origins.some(origin => origin.includes('localhost'));
    if (hasLocalhost) {
      return 'Production CORS should not include localhost origins';
    }
    const hasHttp = origins.some(origin => origin.startsWith('http://'));
    if (hasHttp) {
      return 'Production CORS should use HTTPS origins only';
    }
  }
  return null;
};

// Main validation function
const validateEnvironment = () => {
  const errors = [];
  const warnings = [];

  // Check required variables based on environment
  const requiredVars = config.nodeEnv === 'production' 
    ? requiredProductionEnvVars 
    : requiredDevelopmentEnvVars;

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });

  // Check recommended variables for production
  if (config.nodeEnv === 'production') {
    recommendedProductionEnvVars.forEach(varName => {
      if (!process.env[varName]) {
        warnings.push(`Missing recommended environment variable: ${varName}`);
      }
    });
  }

  // Security validations
  const jwtSecretError = validateJwtSecret(config.jwtSecret);
  if (jwtSecretError) {
    if (config.nodeEnv === 'production') {
      errors.push(jwtSecretError);
    } else {
      warnings.push(jwtSecretError);
    }
  }

  const sessionSecretError = validateSessionSecret(config.sessionSecret);
  if (sessionSecretError) {
    if (config.nodeEnv === 'production') {
      errors.push(sessionSecretError);
    } else {
      warnings.push(sessionSecretError);
    }
  }

  const mongoUriError = validateMongoUri(config.mongodbUri);
  if (mongoUriError) {
    if (config.nodeEnv === 'production') {
      errors.push(mongoUriError);
    } else {
      warnings.push(mongoUriError);
    }
  }

  const corsError = validateCorsOrigins(config.corsOrigin);
  if (corsError) {
    if (config.nodeEnv === 'production') {
      errors.push(corsError);
    } else {
      warnings.push(corsError);
    }
  }

  // Additional validations
  if (config.maxFileSize > 10 * 1024 * 1024) {
    warnings.push('Max file size is quite large (> 10MB)');
  }

  if (config.adminPassword === 'admin123' && config.nodeEnv === 'production') {
    errors.push('Admin password is using default value in production');
  }

  if (config.rateLimitMax < 10) {
    warnings.push('Rate limit is very restrictive (< 10 requests per window)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

// Generate secure secrets helper
const generateSecrets = () => {
  return {
    jwtSecret: crypto.randomBytes(64).toString('hex'),
    refreshTokenSecret: crypto.randomBytes(64).toString('hex'),
    sessionSecret: crypto.randomBytes(32).toString('hex'),
    adminPassword: crypto.randomBytes(16).toString('base64'),
  };
};

// Initialize and validate environment
const validation = validateEnvironment();

// Log validation results
if (!validation.valid) {
  console.error('❌ Environment Configuration Errors:');
  validation.errors.forEach(error => console.error(`  • ${error}`));
  
  if (config.nodeEnv === 'production') {
    console.error('🚨 Cannot start server with invalid configuration in production');
    process.exit(1);
  } else {
    console.error('⚠️  Server starting with configuration errors (development mode)');
  }
}

if (validation.warnings.length > 0) {
  console.warn('⚠️ Environment Configuration Warnings:');
  validation.warnings.forEach(warning => console.warn(`  • ${warning}`));
}

// Log configuration in development
if (config.nodeEnv === 'development') {
  console.log('🔧 Backend Environment Configuration:', {
    environment: config.nodeEnv,
    port: config.port,
    host: config.host,
    database: config.mongodbUri.replace(/\/\/.*:.*@/, '//***:***@'), // Hide credentials
    corsOrigins: config.corsOrigin,
    uploadDir: config.uploadDir,
    features: {
      email: !!config.smtp.host,
      redis: !!config.redisUrl,
      cloudinary: !!config.cloudinary.cloudName,
      monitoring: !!config.sentryDsn,
    }
  });
}

// Helper functions
const isProduction = () => config.nodeEnv === 'production';
const isDevelopment = () => config.nodeEnv === 'development';
const isEmailConfigured = () => !!(config.smtp.host && config.smtp.user && config.smtp.pass);
const isCloudinaryConfigured = () => !!(config.cloudinary.cloudName && config.cloudinary.apiKey);
const isRedisConfigured = () => !!config.redisUrl;

// Export configuration and utilities
module.exports = {
  config,
  validateEnvironment,
  generateSecrets,
  validation,
  
  // Utility functions
  isProduction,
  isDevelopment,
  isEmailConfigured,
  isCloudinaryConfigured,
  isRedisConfigured,
  
  // Environment info for debugging
  getEnvironmentInfo: () => ({
    config: {
      ...config,
      // Hide sensitive information
      jwtSecret: config.jwtSecret ? '***' : undefined,
      refreshTokenSecret: config.refreshTokenSecret ? '***' : undefined,
      sessionSecret: config.sessionSecret ? '***' : undefined,
      adminPassword: config.adminPassword ? '***' : undefined,
      mongodbUri: config.mongodbUri.replace(/\/\/.*:.*@/, '//***:***@'),
      smtp: {
        ...config.smtp,
        user: config.smtp.user ? '***' : undefined,
        pass: config.smtp.pass ? '***' : undefined,
      },
      cloudinary: {
        ...config.cloudinary,
        apiKey: config.cloudinary.apiKey ? '***' : undefined,
        apiSecret: config.cloudinary.apiSecret ? '***' : undefined,
      }
    },
    validation,
    environment: process.env
  })
};