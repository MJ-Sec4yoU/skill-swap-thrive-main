#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 Fixing password encoding in connection string...\n');

// Read current .env file
const envPath = '.env';
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.log('❌ Error reading .env file:', error.message);
  process.exit(1);
}

// Extract the password from the connection string
const passwordMatch = envContent.match(/mongodb\+srv:\/\/cristioronaldo90_db_user:([^@]+)@/);
if (!passwordMatch) {
  console.log('❌ Could not find password in connection string');
  process.exit(1);
}

const originalPassword = passwordMatch[1];
const encodedPassword = encodeURIComponent(originalPassword);

console.log('📋 Original password:', originalPassword);
console.log('🔐 Encoded password:', encodedPassword);

// Replace the password with URL-encoded version
const updatedContent = envContent.replace(
  new RegExp(`mongodb\\+srv://cristioronaldo90_db_user:${originalPassword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}@`),
  `mongodb+srv://cristioronaldo90_db_user:${encodedPassword}@`
);

// Check if replacement was made
if (updatedContent === envContent) {
  console.log('❌ Could not update password in connection string');
  process.exit(1);
}

// Write updated content
try {
  fs.writeFileSync(envPath, updatedContent);
  console.log('✅ Password encoding fixed successfully!');
  console.log('🚀 You can now run: npm run dev');
} catch (error) {
  console.log('❌ Error writing .env file:', error.message);
}
