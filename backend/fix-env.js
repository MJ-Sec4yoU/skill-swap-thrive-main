#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 Fixing .env file...\n');

const envContent = `MONGODB_URI=mongodb+srv://cristioronaldo90_db_user:x*)_k.%24SnV6Z8Hy@cluster07.b3ukkqd.mongodb.net/skillswap?retryWrites=true&w=majority&appName=Cluster07
JWT_SECRET=ad775b22eb20195ff66a16ad75a34cad63724a99b51cfe42f0ae458df91597cb27fa75f2a27026542e013e487fc01bd5711f403e0034f3bd0ae13527cbc8703e
PORT=5000
NODE_ENV=development`;

try {
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created successfully!');
  console.log('📋 Contents:');
  console.log(envContent);
  console.log('\n🚀 Now test the connection:');
  console.log('npm run dev');
} catch (error) {
  console.log('❌ Error creating .env file:', error.message);
}
