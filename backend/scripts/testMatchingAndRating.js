const axios = require('axios');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api`;

// Test user credentials
const testUsers = [
  { email: 'alice@example.com', password: 'password123', name: 'Alice' },
  { email: 'bob@example.com', password: 'password123', name: 'Bob' },
  { email: 'carol@example.com', password: 'password123', name: 'Carol' }
];

let authTokens = {};

// Helper function to log test results
const logTest = (testName, success, details = '') => {
  const status = success ? '✅' : '❌';
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] ${status} ${testName}`);
  if (details) console.log(`    ${details}`);
  if (!success) console.log(''); // Empty line after failures for readability
};

// Login all test users
const loginUsers = async () => {
  console.log('🔐 Logging in test users...\n');
  
  for (const user of testUsers) {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: user.email,
        password: user.password
      });
      
      authTokens[user.name] = response.data.token;
      logTest(`Login ${user.name}`, true, `Token: ${response.data.token.substring(0, 20)}...`);
    } catch (error) {
      logTest(`Login ${user.name}`, false, error.response?.data?.message || error.message);
      throw error;
    }
  }
  console.log('');
};

// Test match generation
const testMatchGeneration = async () => {
  console.log('🎯 Testing Match Generation...\n');
  
  try {
    const response = await axios.post(
      `${BASE_URL}/matching/generate`,
      {},
      {
        headers: { Authorization: `Bearer ${authTokens.Alice}` }
      }
    );
    
    logTest('Generate matches for Alice', true, 
      `Generated ${response.data.matchCount} matches`);
    
  } catch (error) {
    logTest('Generate matches', false, error.response?.data?.message || error.message);
  }
  
  console.log('');
};

// Test getting matches
const testGetMatches = async () => {
  console.log('📋 Testing Get Matches...\n');
  
  try {
    const response = await axios.get(
      `${BASE_URL}/matching/matches?limit=5&minScore=20`,
      {
        headers: { Authorization: `Bearer ${authTokens.Alice}` }
      }
    );
    
    const matches = response.data.matches;
    logTest('Get matches for Alice', true, 
      `Found ${matches.length} matches, top score: ${matches[0]?.matchScore || 'N/A'}`);
    
    // Test with category filter
    const categoryResponse = await axios.get(
      `${BASE_URL}/matching/matches?category=Technology`,
      {
        headers: { Authorization: `Bearer ${authTokens.Alice}` }
      }
    );
    
    logTest('Get Technology matches', true, 
      `Found ${categoryResponse.data.matches.length} technology matches`);
    
    return matches[0]; // Return first match for later tests
  } catch (error) {
    logTest('Get matches', false, error.response?.data?.message || error.message);
    return null;
  }
  
  console.log('');
};

// Test expressing interest
const testExpressInterest = async (match) => {
  console.log('💫 Testing Express Interest...\n');
  
  if (!match) {
    logTest('Express interest', false, 'No match available for testing');
    console.log('');
    return;
  }
  
  try {
    const response = await axios.post(
      `${BASE_URL}/matching/matches/${match._id}/interested`,
      {},
      {
        headers: { Authorization: `Bearer ${authTokens.Alice}` }
      }
    );
    
    logTest('Express interest', true, 'Alice expressed interest in match');
    
  } catch (error) {
    logTest('Express interest', false, error.response?.data?.message || error.message);
  }
  
  console.log('');
};

// Test teacher viewing interested students
const testInterestedStudents = async () => {
  console.log('👨‍🏫 Testing Interested Students View...\n');
  
  try {
    const response = await axios.get(
      `${BASE_URL}/matching/interested-students`,
      {
        headers: { Authorization: `Bearer ${authTokens.Bob}` }
      }
    );
    
    const interested = response.data.interestedStudents;
    logTest('Get interested students for Bob', true, 
      `Found ${interested.length} interested students`);
    
    return interested[0]; // Return first for acceptance test
  } catch (error) {
    logTest('Get interested students', false, error.response?.data?.message || error.message);
    return null;
  }
  
  console.log('');
};

// Test teacher accepting student
const testAcceptStudent = async (match) => {
  console.log('✅ Testing Student Acceptance...\n');
  
  if (!match) {
    logTest('Accept student', false, 'No interested student for testing');
    console.log('');
    return;
  }
  
  try {
    const response = await axios.post(
      `${BASE_URL}/matching/students/${match._id}/accept`,
      {},
      {
        headers: { Authorization: `Bearer ${authTokens.Bob}` }
      }
    );
    
    logTest('Accept student', true, 'Bob accepted interested student');
    
  } catch (error) {
    logTest('Accept student', false, error.response?.data?.message || error.message);
  }
  
  console.log('');
};

// Test advanced search
const testAdvancedSearch = async () => {
  console.log('🔍 Testing Advanced Search...\n');
  
  try {
    const searchData = {
      skills: ['Python', 'JavaScript'],
      categories: ['Technology'],
      locations: ['San Francisco'],
      minRating: 0,
      limit: 10
    };
    
    const response = await axios.post(
      `${BASE_URL}/matching/advanced-search`,
      searchData,
      {
        headers: { Authorization: `Bearer ${authTokens.Alice}` }
      }
    );
    
    const matches = response.data.matches;
    logTest('Advanced search', true, 
      `Found ${matches.length}/${response.data.totalFound} matches with filters`);
    
  } catch (error) {
    logTest('Advanced search', false, error.response?.data?.message || error.message);
  }
  
  console.log('');
};

// Test matching statistics
const testMatchingStats = async () => {
  console.log('📊 Testing Matching Statistics...\n');
  
  try {
    const response = await axios.get(
      `${BASE_URL}/matching/stats`,
      {
        headers: { Authorization: `Bearer ${authTokens.Alice}` }
      }
    );
    
    const stats = response.data;
    logTest('Get matching stats', true, 
      `Total: ${stats.totalMatches}, Interest rate: ${stats.interestRate}%`);
    
  } catch (error) {
    logTest('Get matching stats', false, error.response?.data?.message || error.message);
  }
  
  console.log('');
};

// Test creating a schedule (needed for rating tests)
const createTestSchedule = async () => {
  console.log('📅 Creating test schedule for rating tests...\n');
  
  try {
    // Get a skill for the schedule
    const skillsResponse = await axios.get(`${BASE_URL}/skills?limit=1`);
    const skill = skillsResponse.data.skills[0];
    
    if (!skill) {
      logTest('Create schedule', false, 'No skills available');
      return null;
    }
    
    const scheduleData = {
      teacherId: skill.offeredBy,
      skillId: skill._id,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      startTime: '10:00',
      endTime: '11:00',
      notes: 'Test schedule for rating'
    };
    
    const response = await axios.post(
      `${BASE_URL}/schedules`,
      scheduleData,
      {
        headers: { Authorization: `Bearer ${authTokens.Alice}` }
      }
    );
    
    logTest('Create test schedule', true, `Schedule ID: ${response.data.schedule._id}`);
    
    // Update schedule to completed status for rating test
    const updateResponse = await axios.put(
      `${BASE_URL}/schedules/${response.data.schedule._id}`,
      { status: 'Completed' },
      {
        headers: { Authorization: `Bearer ${authTokens.Alice}` }
      }
    );
    
    logTest('Mark schedule completed', true, 'Schedule marked as completed');
    
    return {
      schedule: response.data.schedule,
      skill: skill
    };
    
  } catch (error) {
    logTest('Create schedule', false, error.response?.data?.message || error.message);
    return null;
  }
  
  console.log('');
};

// Test rating creation
const testCreateRating = async (scheduleData) => {
  console.log('⭐ Testing Rating Creation...\n');
  
  if (!scheduleData) {
    logTest('Create rating', false, 'No schedule data for testing');
    console.log('');
    return null;
  }
  
  try {
    const ratingData = {
      ratedUserId: scheduleData.skill.offeredBy,
      skillId: scheduleData.skill._id,
      scheduleId: scheduleData.schedule._id,
      rating: 5,
      review: 'Excellent teacher! Very patient and knowledgeable.',
      teachingQuality: 5,
      communication: 4,
      punctuality: 5
    };
    
    const response = await axios.post(
      `${BASE_URL}/ratings`,
      ratingData,
      {
        headers: { Authorization: `Bearer ${authTokens.Alice}` }
      }
    );
    
    logTest('Create rating', true, 
      `Rating created: ${response.data.rating.rating} stars`);
    
    return response.data.rating;
    
  } catch (error) {
    logTest('Create rating', false, error.response?.data?.message || error.message);
    return null;
  }
  
  console.log('');
};

// Test getting user ratings
const testGetUserRatings = async (userId) => {
  console.log('📖 Testing Get User Ratings...\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/ratings/user/${userId}?limit=5`);
    
    const ratings = response.data.ratings;
    const avgStats = response.data.averageStats;
    
    logTest('Get user ratings', true, 
      `Found ${ratings.length} ratings, avg: ${avgStats.averageRating?.toFixed(1) || 0} stars`);
    
  } catch (error) {
    logTest('Get user ratings', false, error.response?.data?.message || error.message);
  }
  
  console.log('');
};

// Test pending ratings
const testPendingRatings = async () => {
  console.log('⏳ Testing Pending Ratings...\n');
  
  try {
    const response = await axios.get(
      `${BASE_URL}/ratings/pending`,
      {
        headers: { Authorization: `Bearer ${authTokens.Alice}` }
      }
    );
    
    const pending = response.data.pendingRatings;
    logTest('Get pending ratings', true, `Found ${pending.length} pending ratings`);
    
  } catch (error) {
    logTest('Get pending ratings', false, error.response?.data?.message || error.message);
  }
  
  console.log('');
};

// Test skill rating statistics
const testSkillRatingStats = async (skillId) => {
  console.log('📈 Testing Skill Rating Statistics...\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/ratings/skill/${skillId}/stats`);
    
    const stats = response.data.stats;
    logTest('Get skill rating stats', true, 
      `Avg rating: ${stats.averageRating?.toFixed(1) || 0}, Total: ${stats.totalRatings}`);
    
  } catch (error) {
    logTest('Get skill rating stats', false, error.response?.data?.message || error.message);
  }
  
  console.log('');
};

// Main test execution
const runAllTests = async () => {
  try {
    console.log('🚀 Starting Comprehensive Matching & Rating System Tests\n');
    console.log(`Testing against: ${BASE_URL}\n`);
    console.log('='.repeat(60) + '\n');

    await loginUsers();
    await testMatchGeneration();
    const firstMatch = await testGetMatches();
    await testExpressInterest(firstMatch);
    const interestedStudent = await testInterestedStudents();
    await testAcceptStudent(interestedStudent);
    await testAdvancedSearch();
    await testMatchingStats();
    
    // Rating system tests
    const scheduleData = await createTestSchedule();
    const rating = await testCreateRating(scheduleData);
    
    if (scheduleData) {
      await testGetUserRatings(scheduleData.skill.offeredBy);
      await testSkillRatingStats(scheduleData.skill._id);
    }
    
    await testPendingRatings();
    
    console.log('='.repeat(60));
    console.log('🎉 All matching and rating system tests completed!');
    console.log('');
    console.log('✨ System Features Tested:');
    console.log('   • Intelligent skill matching algorithms');
    console.log('   • Match generation and filtering');
    console.log('   • Student-teacher interest expression');
    console.log('   • Advanced search with multiple filters');
    console.log('   • Comprehensive rating and review system');
    console.log('   • Rating statistics and analytics');
    console.log('   • Pending ratings management');
    console.log('');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  }
};

// Run tests if called directly
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };