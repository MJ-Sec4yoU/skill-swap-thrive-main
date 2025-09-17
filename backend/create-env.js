#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Creating .env file for SkillSwap Backend...');

const envContent = `# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/skillswap

# JWT Secret for authentication
JWT_SECRET=skillswap-super-secret-jwt-key-change-in-production-2024

# Server Configuration
PORT=5000
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log(`📁 Location: ${envPath}`);
  console.log('\n🚀 You can now start the server with: npm run dev');
  console.log('\n⚠️  Important: Never commit the .env file to version control!');
  console.log('\n📝 Note: This is a basic setup. For production, please:');
  console.log('   1. Use MongoDB Atlas or a secure MongoDB instance');
  console.log('   2. Change the JWT_SECRET to a secure random string');
  console.log('   3. Set NODE_ENV=production');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
}
