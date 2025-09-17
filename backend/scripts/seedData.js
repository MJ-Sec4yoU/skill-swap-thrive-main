const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

// Load environment variables from backend directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import models
const User = require('../models/UserEnhanced');
const Skill = require('../models/Skill');
const Message = require('../models/Message');
const Schedule = require('../models/Schedule');
const Rating = require('../models/Rating');
const SkillMatch = require('../models/SkillMatch');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    skillsTeaching: [
      { skill: 'JavaScript', level: 'Advanced', experience: 5, isActive: true },
      { skill: 'React', level: 'Advanced', experience: 4, isActive: true },
      { skill: 'Node.js', level: 'Intermediate', experience: 3, isActive: true }
    ],
    skillsLearning: [
      { skill: 'Python', currentLevel: 'Beginner', targetLevel: 'Intermediate', urgency: 'Medium' },
      { skill: 'Machine Learning', currentLevel: 'Absolute Beginner', targetLevel: 'Beginner', urgency: 'High' }
    ],
    profile: {
      bio: 'Full-stack developer with 5 years of experience. Love sharing knowledge about web development.',
      location: 'New York, NY',
      profileCompletion: 85
    }
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
    skillsTeaching: [
      { skill: 'Python', level: 'Expert', experience: 8, isActive: true },
      { skill: 'Data Science', level: 'Advanced', experience: 6, isActive: true },
      { skill: 'Machine Learning', level: 'Advanced', experience: 5, isActive: true }
    ],
    skillsLearning: [
      { skill: 'React', currentLevel: 'Beginner', targetLevel: 'Advanced', urgency: 'Medium' },
      { skill: 'TypeScript', currentLevel: 'Beginner', targetLevel: 'Intermediate', urgency: 'Low' }
    ],
    profile: {
      bio: 'Data scientist passionate about AI and machine learning. Happy to teach Python basics.',
      location: 'San Francisco, CA',
      profileCompletion: 90
    }
  },
  {
    name: 'Carol Williams',
    email: 'carol@example.com',
    password: 'password123',
    skillsTeaching: [
      { skill: 'Spanish', level: 'Expert', experience: 12, isActive: true },
      { skill: 'Guitar', level: 'Advanced', experience: 8, isActive: true },
      { skill: 'Cooking', level: 'Intermediate', experience: 4, isActive: true }
    ],
    skillsLearning: [
      { skill: 'Photography', currentLevel: 'Beginner', targetLevel: 'Intermediate', urgency: 'Medium' },
      { skill: 'Yoga', currentLevel: 'Absolute Beginner', targetLevel: 'Beginner', urgency: 'Low' }
    ],
    profile: {
      bio: 'Language teacher and musician. Love connecting with people through teaching.',
      location: 'Austin, TX',
      profileCompletion: 75
    }
  },
  {
    name: 'David Brown',
    email: 'david@example.com',
    password: 'password123',
    skillsTeaching: [
      { skill: 'Photography', level: 'Expert', experience: 12, isActive: true },
      { skill: 'Photoshop', level: 'Advanced', experience: 10, isActive: true },
      { skill: 'Video Editing', level: 'Advanced', experience: 8, isActive: true }
    ],
    skillsLearning: [
      { skill: 'Guitar', currentLevel: 'Beginner', targetLevel: 'Intermediate', urgency: 'Low' },
      { skill: 'Spanish', currentLevel: 'Beginner', targetLevel: 'Advanced', urgency: 'High' }
    ],
    profile: {
      bio: 'Professional photographer with 10+ years experience. Love teaching creative skills.',
      location: 'Los Angeles, CA',
      profileCompletion: 95
    }
  },
  {
    name: 'Eva Davis',
    email: 'eva@example.com',
    password: 'password123',
    skillsTeaching: [
      { skill: 'Yoga', level: 'Expert', experience: 7, isActive: true },
      { skill: 'Meditation', level: 'Advanced', experience: 5, isActive: true },
      { skill: 'Fitness', level: 'Intermediate', experience: 4, isActive: true }
    ],
    skillsLearning: [
      { skill: 'Cooking', currentLevel: 'Beginner', targetLevel: 'Intermediate', urgency: 'Medium' },
      { skill: 'JavaScript', currentLevel: 'Absolute Beginner', targetLevel: 'Beginner', urgency: 'High' }
    ],
    profile: {
      bio: 'Certified yoga instructor and wellness coach. Helping people find balance.',
      location: 'Denver, CO',
      profileCompletion: 80
    }
  },
  {
    name: 'Frank Wilson',
    email: 'frank@example.com',
    password: 'password123',
    skillsTeaching: [
      { skill: 'Java', level: 'Expert', experience: 10, isActive: true },
      { skill: 'Spring Boot', level: 'Advanced', experience: 6, isActive: true },
      { skill: 'Database Design', level: 'Advanced', experience: 8, isActive: true }
    ],
    skillsLearning: [
      { skill: 'Cloud Computing', currentLevel: 'Intermediate', targetLevel: 'Advanced', urgency: 'High' },
      { skill: 'DevOps', currentLevel: 'Beginner', targetLevel: 'Advanced', urgency: 'Medium' }
    ],
    profile: {
      bio: 'Senior software engineer specializing in enterprise applications.',
      location: 'Chicago, IL',
      profileCompletion: 70
    }
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    skillsTeaching: [],
    skillsLearning: [],
    profile: {
      bio: 'Platform administrator',
      location: 'Remote',
      profileCompletion: 100
    },
    isAdmin: true
  }
];

const sampleSkills = [
  {
    name: 'JavaScript',
    description: 'Learn modern JavaScript programming from basics to advanced concepts',
    category: 'Technology',
    level: 'Intermediate',
    tags: ['programming', 'web development', 'frontend']
  },
  {
    name: 'Python',
    description: 'Python programming for beginners and data science applications',
    category: 'Technology',
    level: 'Beginner',
    tags: ['programming', 'data science', 'backend']
  },
  {
    name: 'React',
    description: 'Build modern web applications with React and hooks',
    category: 'Technology',
    level: 'Advanced',
    tags: ['frontend', 'web development', 'javascript']
  },
  {
    name: 'Spanish',
    description: 'Learn conversational Spanish for travel and business',
    category: 'Language',
    level: 'Beginner',
    tags: ['language', 'conversation', 'culture']
  },
  {
    name: 'Guitar',
    description: 'Acoustic and electric guitar lessons for all skill levels',
    category: 'Music',
    level: 'Beginner',
    tags: ['music', 'instrument', 'acoustic']
  },
  {
    name: 'Photography',
    description: 'Digital photography techniques and composition',
    category: 'Art',
    level: 'Intermediate',
    tags: ['art', 'digital', 'composition']
  },
  {
    name: 'Yoga',
    description: 'Hatha and Vinyasa yoga for flexibility and mindfulness',
    category: 'Sports',
    level: 'Beginner',
    tags: ['fitness', 'wellness', 'mindfulness']
  },
  {
    name: 'Cooking',
    description: 'International cuisine and cooking fundamentals',
    category: 'Cooking',
    level: 'Beginner',
    tags: ['food', 'international', 'basics']
  }
];

const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Message.deleteMany({});
    await Schedule.deleteMany({});
    await Rating.deleteMany({});
    await SkillMatch.deleteMany({});
    console.log('Cleared existing data');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

const seedUsers = async () => {
  try {
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      const savedUser = await user.save();
      users.push(savedUser);
    }
    console.log(`Created ${users.length} users`);
    return users;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

const seedSkills = async (users) => {
  try {
    const skills = [];
    for (let i = 0; i < sampleSkills.length; i++) {
      const skillData = sampleSkills[i];
      // Assign skills to different users
      const userIndex = i % (users.length - 1); // Exclude admin user
      const skill = new Skill({
        ...skillData,
        offeredBy: users[userIndex]._id
      });
      const savedSkill = await skill.save();
      skills.push(savedSkill);
    }
    console.log(`Created ${skills.length} skills`);
    return skills;
  } catch (error) {
    console.error('Error seeding skills:', error);
    throw error;
  }
};

const seedMessages = async (users) => {
  try {
    const messages = [];
    const messageTemplates = [
      "Hi! I'm interested in learning {skill}. Are you available for lessons?",
      "Thanks for offering to teach {skill}. When would be a good time to start?",
      "I really enjoyed our {skill} session. Same time next week?",
      "Can we reschedule tomorrow's {skill} lesson? Something came up.",
      "Your {skill} teaching method is excellent! I'm learning so much."
    ];

    for (let i = 0; i < 20; i++) {
      const sender = users[Math.floor(Math.random() * (users.length - 1))];
      let receiver = users[Math.floor(Math.random() * (users.length - 1))];
      
      // Ensure sender and receiver are different
      while (receiver._id.equals(sender._id)) {
        receiver = users[Math.floor(Math.random() * (users.length - 1))];
      }

      const template = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
      const randomSkill = sender.skillsTeaching[0] || receiver.skillsLearning[0] || 'programming';
      const content = template.replace('{skill}', randomSkill);

      const message = new Message({
        sender: sender._id,
        receiver: receiver._id,
        content,
        isRead: Math.random() > 0.3, // 70% read rate
        readAt: Math.random() > 0.3 ? new Date() : null
      });

      const savedMessage = await message.save();
      messages.push(savedMessage);
    }

    console.log(`Created ${messages.length} messages`);
    return messages;
  } catch (error) {
    console.error('Error seeding messages:', error);
    throw error;
  }
};

const seedSchedules = async (users, skills) => {
  try {
    const schedules = [];
    const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    
    for (let i = 0; i < 15; i++) {
      const skill = skills[Math.floor(Math.random() * skills.length)];
      const teacher = await User.findById(skill.offeredBy);
      let student = users[Math.floor(Math.random() * (users.length - 1))];
      
      // Ensure student and teacher are different
      while (student._id.equals(teacher._id)) {
        student = users[Math.floor(Math.random() * (users.length - 1))];
      }

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30)); // Next 30 days

      const schedule = new Schedule({
        student: student._id,
        teacher: teacher._id,
        skill: skill._id,
        date: futureDate,
        startTime: `${9 + Math.floor(Math.random() * 8)}:00`, // 9 AM to 4 PM
        endTime: `${10 + Math.floor(Math.random() * 8)}:00`, // 10 AM to 5 PM
        status: statuses[Math.floor(Math.random() * statuses.length)],
        notes: `${skill.name} lesson scheduled`,
        meetingLink: Math.random() > 0.5 ? 'https://zoom.us/j/example' : null
      });

      const savedSchedule = await schedule.save();
      schedules.push(savedSchedule);
    }

    console.log(`Created ${schedules.length} schedules`);
    return schedules;
  } catch (error) {
    console.error('Error seeding schedules:', error);
    throw error;
  }
};

const seedRatings = async (schedules) => {
  try {
    const ratings = [];
    
    // Only create ratings for completed schedules
    const completedSchedules = schedules.filter(s => s.status === 'Completed');
    
    for (const schedule of completedSchedules) {
      const rating = new Rating({
        rater: schedule.student,
        rated: schedule.teacher,
        skill: schedule.skill,
        schedule: schedule._id,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 star ratings mostly
        review: [
          "Great teacher! Very patient and knowledgeable.",
          "Excellent lesson, learned a lot!",
          "Good teaching style, would recommend.",
          "Very helpful and encouraging.",
          "Clear explanations and good examples."
        ][Math.floor(Math.random() * 5)],
        teachingQuality: Math.floor(Math.random() * 2) + 4,
        communication: Math.floor(Math.random() * 2) + 4,
        punctuality: Math.floor(Math.random() * 2) + 4
      });

      const savedRating = await rating.save();
      ratings.push(savedRating);
    }

    console.log(`Created ${ratings.length} ratings`);
    return ratings;
  } catch (error) {
    console.error('Error seeding ratings:', error);
    throw error;
  }
};

const seedSkillMatches = async (users, skills) => {
  try {
    const matches = [];
    
    for (let i = 0; i < 25; i++) {
      const skill = skills[Math.floor(Math.random() * skills.length)];
      const teacher = await User.findById(skill.offeredBy);
      let student = users[Math.floor(Math.random() * (users.length - 1))];
      
      // Ensure student and teacher are different
      while (student._id.equals(teacher._id)) {
        student = users[Math.floor(Math.random() * (users.length - 1))];
      }

      const matchData = SkillMatch.calculateMatchScore(student, teacher, skill);
      
      const match = new SkillMatch({
        student: student._id,
        teacher: teacher._id,
        skill: skill._id,
        matchScore: matchData.score,
        factors: matchData.factors,
        status: ['Active', 'Contacted', 'Scheduled'][Math.floor(Math.random() * 3)],
        studentInterested: Math.random() > 0.4,
        teacherInterested: Math.random() > 0.3
      });

      const savedMatch = await match.save();
      matches.push(savedMatch);
    }

    console.log(`Created ${matches.length} skill matches`);
    return matches;
  } catch (error) {
    console.error('Error seeding skill matches:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    await connectDB();
    await clearDatabase();
    
    const users = await seedUsers();
    const skills = await seedSkills(users);
    const messages = await seedMessages(users);
    const schedules = await seedSchedules(users, skills);
    const ratings = await seedRatings(schedules);
    const matches = await seedSkillMatches(users, skills);
    
    console.log('\n=== SEEDING COMPLETED ===');
    console.log(`✓ ${users.length} users created`);
    console.log(`✓ ${skills.length} skills created`);
    console.log(`✓ ${messages.length} messages created`);
    console.log(`✓ ${schedules.length} schedules created`);
    console.log(`✓ ${ratings.length} ratings created`);
    console.log(`✓ ${matches.length} skill matches created`);
    
    console.log('\nSample login credentials:');
    console.log('Regular users: alice@example.com, bob@example.com, carol@example.com (password: password123)');
    console.log('Admin: admin@example.com (password: admin123)');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };