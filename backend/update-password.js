#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 MongoDB Password Update Tool');
console.log('==============================\n');

console.log('📋 Current connection string:');
console.log('mongodb+srv://cristioronaldo90_db_user:<db_password>@cluster07.b3ukkqd.mongodb.net/skillswap\n');

console.log('🔧 To get your real password:');
console.log('1. Go to https://cloud.mongodb.com/');
console.log('2. Click "Database Access"');
console.log('3. Find user "cristioronaldo90_db_user"');
console.log('4. Click "Edit" → "Edit Password"');
console.log('5. Generate new password and copy it\n');

rl.question('Enter your MongoDB password: ', (password) => {
  if (!password.trim()) {
    console.log('❌ Password cannot be empty');
    rl.close();
    return;
  }

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

  // Replace the password placeholder
  const updatedContent = envContent.replace(
    /mongodb\+srv:\/\/cristioronaldo90_db_user:<db_password>@/,
    `mongodb+srv://cristioronaldo90_db_user:${password.trim()}@`
  );

  // Check if replacement was made
  if (updatedContent === envContent) {
    console.log('❌ Could not find password placeholder in .env file');
    console.log('Please check your .env file manually');
    rl.close();
    return;
  }

  // Write updated content
  try {
    fs.writeFileSync(envPath, updatedContent);
    console.log('✅ Password updated successfully!');
    console.log('🚀 You can now run: npm run dev');
  } catch (error) {
    console.log('❌ Error writing .env file:', error.message);
  }

  rl.close();
});
