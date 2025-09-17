#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 MongoDB Atlas - Create New User Guide');
console.log('========================================\n');

console.log('📋 Current connection string:');
console.log('mongodb+srv://cristioronaldo90_db_user:x*)_k.%24SnV6Z8Hy@cluster07.b3ukkqd.mongodb.net/skillswap\n');

console.log('🔧 Let\'s create a new user in MongoDB Atlas:');
console.log('');
console.log('1. Go to: https://cloud.mongodb.com/');
console.log('2. Click "Database Access" in the left sidebar');
console.log('3. Click "Add New Database User"');
console.log('4. Choose "Password" authentication');
console.log('5. Username: skillswap_user');
console.log('6. Password: Click "Autogenerate Secure Password"');
console.log('7. Database User Privileges: "Read and write to any database"');
console.log('8. Click "Add User"');
console.log('');

rl.question('Enter the new username: ', (username) => {
  rl.question('Enter the new password: ', (password) => {
    if (!username.trim() || !password.trim()) {
      console.log('❌ Username and password cannot be empty');
      rl.close();
      return;
    }

    // URL encode the password
    const encodedPassword = encodeURIComponent(password.trim());
    
    // Create new connection string
    const newConnectionString = `mongodb+srv://${username.trim()}:${encodedPassword}@cluster07.b3ukkqd.mongodb.net/skillswap?retryWrites=true&w=majority&appName=Cluster07`;
    
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
      console.log('npm run dev');
    } catch (error) {
      console.log('❌ Error writing .env file:', error.message);
    }

    rl.close();
  });
});
