#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Create New MongoDB User - Simple Solution');
console.log('============================================\n');

console.log('📋 Current issue: User permissions in MongoDB Atlas');
console.log('✅ Solution: Create a new user with proper permissions\n');

console.log('🔧 Steps to follow:');
console.log('1. Go to: https://cloud.mongodb.com/');
console.log('2. Click "Database Access"');
console.log('3. Click "Add New Database User"');
console.log('4. Use these credentials:');
console.log('   - Username: skillswap_user');
console.log('   - Password: skillswap123');
console.log('   - Permissions: "Read and write to any database"');
console.log('5. Click "Add User"\n');

rl.question('Press Enter after creating the user in MongoDB Atlas...', () => {
  // Create new connection string
  const newConnectionString = 'mongodb+srv://skillswap_user:skillswap123@cluster07.b3ukkqd.mongodb.net/skillswap?retryWrites=true&w=majority&appName=Cluster07';
  
  // Read current .env file
  const envPath = '.env';
  let envContent = '';
  
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.log('❌ Error reading .env file:', error.message);
    rl.close();
    return;
  }

  // Replace the MONGODB_URI
  const updatedContent = envContent.replace(
    /MONGODB_URI=.*/,
    `MONGODB_URI=${newConnectionString}`
  );

  // Write updated content
  try {
    fs.writeFileSync(envPath, updatedContent);
    console.log('✅ New user credentials saved!');
    console.log('🔗 New connection string:', newConnectionString.replace(/\/\/.*@/, '//***:***@'));
    console.log('');
    console.log('🚀 Now test the connection:');
    console.log('npm start');
  } catch (error) {
    console.log('❌ Error writing .env file:', error.message);
  }

  rl.close();
});
