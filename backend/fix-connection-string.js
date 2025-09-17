#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 Fixing MongoDB connection string...\n');

// The password that works in MongoDB Compass
const password = 'x*)_k.$SnV6Z8Hy';
const encodedPassword = encodeURIComponent(password);

console.log('📋 Original password:', password);
console.log('🔐 Encoded password:', encodedPassword);

// Create the correct connection string
const connectionString = `mongodb+srv://cristioronaldo90_db_user:${encodedPassword}@cluster07.b3ukkqd.mongodb.net/skillswap?retryWrites=true&w=majority&appName=Cluster07`;

console.log('🔗 New connection string:', connectionString.replace(/\/\/.*@/, '//***:***@'));

// Read current .env file
const envPath = '.env';
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.log('❌ Error reading .env file:', error.message);
  process.exit(1);
}

// Replace the MONGODB_URI line
const updatedContent = envContent.replace(
  /MONGODB_URI=.*/,
  `MONGODB_URI=${connectionString}`
);

// Check if replacement was made
if (updatedContent === envContent) {
  console.log('❌ Could not find MONGODB_URI in .env file');
  process.exit(1);
}

// Write updated content
try {
  fs.writeFileSync(envPath, updatedContent);
  console.log('✅ Connection string updated successfully!');
  console.log('🚀 Now test the connection: npm start');
} catch (error) {
  console.log('❌ Error writing .env file:', error.message);
}
