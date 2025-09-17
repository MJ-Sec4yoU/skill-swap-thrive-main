#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 MongoDB Connection Fix Tool');
console.log('=============================\n');

console.log('This tool will help you fix MongoDB connection issues.\n');

const questions = [
  {
    key: 'connection_type',
    question: 'Choose your MongoDB setup:\n1. MongoDB Atlas (Cloud)\n2. Local MongoDB\n3. Use default local connection\n\nEnter choice (1-3):',
    default: '3'
  }
];

function askQuestion(index) {
  if (index >= questions.length) {
    handleConnectionType();
    return;
  }

  const q = questions[index];
  
  rl.question(`${q.question} `, (answer) => {
    const choice = answer.trim() || q.default;
    
    if (index === 0) {
      handleConnectionChoice(choice);
    }
  });
}

function handleConnectionChoice(choice) {
  switch (choice) {
    case '1':
      setupAtlasConnection();
      break;
    case '2':
      setupLocalConnection();
      break;
    case '3':
      setupDefaultConnection();
      break;
    default:
      console.log('Invalid choice. Using default local connection.');
      setupDefaultConnection();
  }
}

function setupAtlasConnection() {
  console.log('\n🌐 MongoDB Atlas Setup');
  console.log('=====================\n');
  
  rl.question('Enter your MongoDB Atlas connection string: ', (connectionString) => {
    if (!connectionString.trim()) {
      console.log('❌ No connection string provided. Using default local connection.');
      setupDefaultConnection();
      return;
    }
    
    // Validate connection string
    if (!connectionString.includes('mongodb+srv://') && !connectionString.includes('mongodb://')) {
      console.log('❌ Invalid connection string format. Using default local connection.');
      setupDefaultConnection();
      return;
    }
    
    createEnvFile(connectionString.trim());
  });
}

function setupLocalConnection() {
  console.log('\n💻 Local MongoDB Setup');
  console.log('=====================\n');
  
  rl.question('Enter MongoDB host (default: localhost): ', (host) => {
    rl.question('Enter MongoDB port (default: 27017): ', (port) => {
      rl.question('Enter database name (default: skillswap): ', (dbName) => {
        const finalHost = host.trim() || 'localhost';
        const finalPort = port.trim() || '27017';
        const finalDbName = dbName.trim() || 'skillswap';
        
        const connectionString = `mongodb://${finalHost}:${finalPort}/${finalDbName}`;
        createEnvFile(connectionString);
      });
    });
  });
}

function setupDefaultConnection() {
  console.log('\n🔧 Using Default Local Connection');
  console.log('=================================\n');
  
  const connectionString = 'mongodb://localhost:27017/skillswap';
  createEnvFile(connectionString);
}

function createEnvFile(connectionString) {
  const envContent = `# MongoDB Configuration
MONGODB_URI=${connectionString}

# JWT Secret for authentication
JWT_SECRET=skillswap-super-secret-jwt-key-change-in-production-2024

# Server Configuration
PORT=5000
NODE_ENV=development
`;

  const envPath = path.join(__dirname, '.env');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');
    console.log(`📁 Location: ${envPath}`);
    console.log(`🔗 Connection: ${connectionString.replace(/\/\/.*@/, '//***:***@')}`);
    
    if (connectionString.includes('mongodb+srv://')) {
      console.log('\n⚠️  MongoDB Atlas Setup Notes:');
      console.log('   1. Make sure your IP address is whitelisted in Atlas');
      console.log('   2. Verify your username and password are correct');
      console.log('   3. Check that your cluster is running (not paused)');
      console.log('   4. Run: npm run get-ip (to get your current IP)');
    } else {
      console.log('\n💻 Local MongoDB Setup Notes:');
      console.log('   1. Make sure MongoDB is installed and running');
      console.log('   2. Start MongoDB service: mongod');
      console.log('   3. Or use: brew services start mongodb-community (macOS)');
    }
    
    console.log('\n🚀 You can now start the server with: npm run dev');
    console.log('\n⚠️  Important: Never commit the .env file to version control!');
    
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }
  
  rl.close();
}

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  rl.question('⚠️  .env file already exists. Overwrite? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      askQuestion(0);
    } else {
      console.log('Setup cancelled.');
      rl.close();
    }
  });
} else {
  askQuestion(0);
}
