// Environment Configuration and Validation
// This file centralizes all environment variable access and validation

interface AppConfig {
  // API Configuration
  apiUrl: string;
  apiTimeout: number;
  
  // Application Configuration
  appName: string;
  appVersion: string;
  environment: 'development' | 'production' | 'test';
  
  // Authentication Configuration
  jwtExpiry: string;
  
  // File Upload Configuration
  maxFileSize: number;
  allowedFileTypes: string[];
  
  // Feature Flags
  enableAdmin: boolean;
  enableMessaging: boolean;
  enableScheduling: boolean;
  
  // Analytics & Monitoring (Optional)
  analyticsId?: string;
  sentryDsn?: string;
  
  // Social Login (Optional)
  googleClientId?: string;
  githubClientId?: string;
}

// Helper function to parse boolean environment variables
const parseBoolean = (value: string | undefined, defaultValue: boolean = false): boolean => {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

// Helper function to parse array environment variables
const parseArray = (value: string | undefined, defaultValue: string[] = []): string[] => {
  if (!value) return defaultValue;
  return value.split(',').map(item => item.trim());
};

// Main configuration object
export const config: AppConfig = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  
  // Application Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Skill Swap & Thrive',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: (import.meta.env.VITE_APP_ENV as AppConfig['environment']) || 'development',
  
  // Authentication Configuration
  jwtExpiry: import.meta.env.VITE_JWT_EXPIRY || '24h',
  
  // File Upload Configuration
  maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880'), // 5MB default
  allowedFileTypes: parseArray(
    import.meta.env.VITE_ALLOWED_FILE_TYPES,
    ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  ),
  
  // Feature Flags
  enableAdmin: parseBoolean(import.meta.env.VITE_ENABLE_ADMIN, true),
  enableMessaging: parseBoolean(import.meta.env.VITE_ENABLE_MESSAGING, true),
  enableScheduling: parseBoolean(import.meta.env.VITE_ENABLE_SCHEDULING, true),
  
  // Analytics & Monitoring (Optional)
  analyticsId: import.meta.env.VITE_ANALYTICS_ID,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  
  // Social Login (Optional)
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  githubClientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
};

// Required environment variables for production
const requiredProductionEnvVars: Array<keyof typeof import.meta.env> = [
  'VITE_API_URL',
  'VITE_APP_NAME',
  'VITE_APP_ENV',
];

// Optional but recommended for production
const recommendedProductionEnvVars: Array<keyof typeof import.meta.env> = [
  'VITE_ANALYTICS_ID',
  'VITE_SENTRY_DSN',
];

// Validation function
export const validateEnvironment = (): { valid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  if (config.environment === 'production') {
    requiredProductionEnvVars.forEach(varName => {
      if (!import.meta.env[varName]) {
        errors.push(`Missing required environment variable: ${varName}`);
      }
    });

    // Check recommended variables
    recommendedProductionEnvVars.forEach(varName => {
      if (!import.meta.env[varName]) {
        warnings.push(`Missing recommended environment variable: ${varName}`);
      }
    });

    // Validate API URL format
    if (config.apiUrl && !config.apiUrl.startsWith('https://') && config.environment === 'production') {
      warnings.push('API URL should use HTTPS in production');
    }
  }

  // Validate configuration values
  if (config.maxFileSize < 1024) {
    warnings.push('Max file size seems very small (< 1KB)');
  }

  if (config.maxFileSize > 10 * 1024 * 1024) {
    warnings.push('Max file size is quite large (> 10MB), consider reducing for better performance');
  }

  if (config.apiTimeout < 5000) {
    warnings.push('API timeout is quite short (< 5s), may cause issues with slow connections');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

// Initialize and validate environment on module load
const validation = validateEnvironment();

if (!validation.valid) {
  console.error('❌ Environment Configuration Errors:');
  validation.errors.forEach(error => console.error(`  • ${error}`));
  
  if (config.environment === 'production') {
    // In production, we might want to prevent the app from starting
    throw new Error('Invalid environment configuration');
  }
}

if (validation.warnings.length > 0) {
  console.warn('⚠️ Environment Configuration Warnings:');
  validation.warnings.forEach(warning => console.warn(`  • ${warning}`));
}

// Log current configuration in development
if (config.environment === 'development') {
  console.log('🔧 Environment Configuration:', {
    environment: config.environment,
    apiUrl: config.apiUrl,
    appName: config.appName,
    featuresEnabled: {
      admin: config.enableAdmin,
      messaging: config.enableMessaging,
      scheduling: config.enableScheduling,
    }
  });
}

// Export environment info for debugging
export const getEnvironmentInfo = () => ({
  config,
  validation,
  allEnvVars: import.meta.env,
});

// Utility functions for common environment checks
export const isProduction = () => config.environment === 'production';
export const isDevelopment = () => config.environment === 'development';
export const isFeatureEnabled = (feature: 'admin' | 'messaging' | 'scheduling') => {
  const featureMap = {
    admin: config.enableAdmin,
    messaging: config.enableMessaging,
    scheduling: config.enableScheduling,
  };
  return featureMap[feature];
};

// Export config as default
export default config;