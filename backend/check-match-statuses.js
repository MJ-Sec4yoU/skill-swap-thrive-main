const mongoose = require('mongoose');
const User = require('./models/UserEnhanced');
const Skill = require('./models/Skill');
const SkillMatch = require('./models/SkillMatch');
require('dotenv').config();

async function checkMatchStatuses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find Alice first
    const alice = await User.findOne({ email: 'alice@example.com' });
    console.log('Alice ID:', alice._id);
    
    // Get all matches for Alice
    const aliceMatches = await SkillMatch.find({ 
      student: alice._id
    })
    .populate('student', 'name email')
    .populate('teacher', 'name email')
    .populate('skill', 'name');
    
    console.log('\n=== ALL ALICE\'S MATCHES (INCLUDING ALL STATUSES) ===');
    aliceMatches.forEach((match, index) => {
      console.log(`${index + 1}. ${match.skill.name} with ${match.teacher.name}`);
      console.log(`   Status: ${match.status}`);
      console.log(`   Student Interested: ${match.studentInterested}`);
      console.log(`   Teacher Interested: ${match.teacherInterested}`);
      console.log(`   Score: ${match.matchScore}`);
      console.log(`   ID: ${match._id}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkMatchStatuses();