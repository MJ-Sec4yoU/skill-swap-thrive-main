#!/usr/bin/env node

const https = require('https');

console.log('🌐 Getting your public IP address for MongoDB Atlas whitelist...\n');

// Get public IP address
https.get('https://api.ipify.org', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const ip = data.trim();
    console.log('📍 Your public IP address is:', ip);
    console.log('');
    console.log('🔧 Next steps:');
    console.log('1. Go to MongoDB Atlas: https://cloud.mongodb.com/');
    console.log('2. Click "Network Access" in the left sidebar');
    console.log('3. Click "Add IP Address"');
    console.log('4. Add this IP:', ip);
    console.log('5. Click "Confirm"');
    console.log('');
    console.log('🚀 Then run: npm run dev');
  });
}).on('error', (err) => {
  console.error('❌ Error getting IP address:', err.message);
  console.log('');
  console.log('🔧 Manual steps:');
  console.log('1. Go to https://whatismyipaddress.com/');
  console.log('2. Copy your IP address');
  console.log('3. Add it to MongoDB Atlas Network Access');
});
