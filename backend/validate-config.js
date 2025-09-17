// Configuration Validation Script
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

console.log('🔍 Configuration Validation Check\n');

// Load backend environment
const backendEnvPath = path.join(__dirname, '.env');
if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
  console.log('✅ Backend .env file found');
} else {
  console.log('❌ Backend .env file not found');
}

// Validation functions
const checkRequired = (varName, value) => {
  if (!value) {
    console.log(`❌ ${varName}: MISSING`);
    return false;
  }
  console.log(`✅ ${varName}: SET`);
  return true;
};

const checkLength = (varName, value, minLength) => {
  if (!value || value.length < minLength) {
    console.log(`❌ ${varName}: Too short (minimum ${minLength} characters)`);
    return false;
  }
  console.log(`✅ ${varName}: Good length (${value.length} chars)`);
  return true;
};

const checkUrl = (varName, value) => {
  try {
    new URL(value);
    console.log(`✅ ${varName}: Valid URL format`);
    return true;
  } catch {
    console.log(`❌ ${varName}: Invalid URL format`);
    return false;
  }
};

console.log('🔧 Backend Configuration:');
console.log('-'.repeat(40));

let allValid = true;

// Check required environment variables
allValid &= checkRequired('MONGODB_URI', process.env.MONGODB_URI);
allValid &= checkRequired('JWT_SECRET', process.env.JWT_SECRET);
allValid &= checkRequired('PORT', process.env.PORT);
allValid &= checkRequired('NODE_ENV', process.env.NODE_ENV);

// Check security requirements
allValid &= checkLength('JWT_SECRET', process.env.JWT_SECRET, 32);

// Check URLs
if (process.env.MONGODB_URI) {
  allValid &= checkUrl('MONGODB_URI', process.env.MONGODB_URI);
}

if (process.env.FRONTEND_URL) {
  allValid &= checkUrl('FRONTEND_URL', process.env.FRONTEND_URL);
}

console.log('\n📧 Email Configuration:');
console.log('-'.repeat(40));

const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_SERVICE;
if (emailConfigured) {
  console.log('✅ Email service: Configured');
  checkRequired('EMAIL_SERVICE', process.env.EMAIL_SERVICE);
  checkRequired('EMAIL_USER', process.env.EMAIL_USER);
  checkRequired('EMAIL_PASSWORD', process.env.EMAIL_PASSWORD);
} else {
  console.log('⚠️  Email service: Not fully configured (optional)');
}

console.log('\n🌐 CORS Configuration:');
console.log('-'.repeat(40));

const frontendUrls = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  process.env.FRONTEND_URL_3,
  process.env.FRONTEND_URL_4
].filter(Boolean);

console.log(`✅ Frontend URLs configured: ${frontendUrls.length}`);
frontendUrls.forEach((url, index) => {
  console.log(`   ${index + 1}. ${url}`);
});

console.log('\n📁 File System:');
console.log('-'.repeat(40));

// Check uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  console.log('✅ Uploads directory: Exists');
} else {
  console.log('❌ Uploads directory: Missing');
  allValid = false;
}

// Check frontend .env
const frontendEnvPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(frontendEnvPath)) {
  console.log('✅ Frontend .env file: Exists');
  
  // Read and check frontend config
  const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
  const hasApiUrl = frontendEnv.includes('VITE_API_URL=http://localhost:5000/api');
  console.log(hasApiUrl ? '✅ Frontend API URL: Correctly configured' : '❌ Frontend API URL: Incorrect');
} else {
  console.log('❌ Frontend .env file: Missing');
  allValid = false;
}

console.log('\n🔐 Security Check:');
console.log('-'.repeat(40));

// Check for development defaults in production
if (process.env.NODE_ENV === 'production') {
  if (process.env.JWT_SECRET === 'development-jwt-secret-change-in-production') {
    console.log('❌ JWT Secret: Using development default in production');
    allValid = false;
  }
  
  if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('localhost')) {
    console.log('❌ MongoDB: Using localhost in production');
    allValid = false;
  }
} else {
  console.log('✅ Development environment: Security checks relaxed');
}

console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('🎉 ALL CONFIGURATIONS ARE VALID!');
  console.log('✅ Ready to start servers');
} else {
  console.log('⚠️  SOME CONFIGURATIONS NEED ATTENTION');
  console.log('🔧 Please fix the issues above');
}
console.log('='.repeat(50));

// Quick connection test
console.log('\n🧪 Quick Tests:');
console.log('-'.repeat(40));

// Test MongoDB connection string format
if (process.env.MONGODB_URI) {
  try {
    const url = new URL(process.env.MONGODB_URI);
    console.log(`✅ MongoDB protocol: ${url.protocol}`);
    console.log(`✅ MongoDB host: ${url.hostname}`);
    console.log(`✅ MongoDB database: ${url.pathname.slice(1) || 'default'}`);
  } catch (error) {
    console.log(`❌ MongoDB URL parsing failed: ${error.message}`);
  }
}

console.log('\n📋 Startup Commands:');
console.log('-'.repeat(40));
console.log('Backend: cd backend && npm start');
console.log('Frontend: npm run dev');
console.log('Both should be accessible at:');
console.log('- Backend: http://localhost:5000');
console.log('- Frontend: http://localhost:8080');