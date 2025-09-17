const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(express.json());

// In-memory data storage
let users = [];
let skills = [];
let schedules = [];
let messages = [];

// Mock data
const mockSkills = [
  {
    _id: '1',
    name: 'React Development',
    description: 'Learn modern React with hooks, context, and best practices',
    category: 'Technology',
    level: 'Intermediate',
    availability: 'Available',
    tags: ['React', 'JavaScript', 'Frontend'],
    offeredBy: { _id: '1', name: 'Sarah Chen', email: 'sarah@example.com' },
    createdAt: new Date()
  },
  {
    _id: '2',
    name: 'Python Programming',
    description: 'Master Python from basics to advanced concepts',
    category: 'Technology',
    level: 'Beginner',
    availability: 'Available',
    tags: ['Python', 'Programming', 'Backend'],
    offeredBy: { _id: '2', name: 'David Rodriguez', email: 'david@example.com' },
    createdAt: new Date()
  }
];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Skill Swap API (In-Memory Mode)' });
});

// Skills endpoint
app.get('/api/skills', (req, res) => {
  const { search, category, level, availability, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 20 } = req.query;
  
  let filteredSkills = [...mockSkills];
  
  // Apply filters
  if (search) {
    filteredSkills = filteredSkills.filter(skill => 
      skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.description.toLowerCase().includes(search.toLowerCase()) ||
      skill.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );
  }
  
  if (category && category !== 'all') {
    filteredSkills = filteredSkills.filter(skill => skill.category === category);
  }
  
  if (level && level !== 'all') {
    filteredSkills = filteredSkills.filter(skill => skill.level === level);
  }
  
  if (availability && availability !== 'all') {
    filteredSkills = filteredSkills.filter(skill => skill.availability === availability);
  }
  
  // Apply sorting
  filteredSkills.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
  
  // Apply pagination
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;
  const paginatedSkills = filteredSkills.slice(skip, skip + limitNum);
  
  res.json({
    skills: paginatedSkills,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(filteredSkills.length / limitNum),
      totalItems: filteredSkills.length,
      itemsPerPage: limitNum
    }
  });
});

// Users search endpoint
app.get('/api/users/search', (req, res) => {
  const mockUsers = [
    {
      _id: '1',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      skillsTeaching: ['React', 'JavaScript'],
      skillsLearning: ['Python'],
      profile: {
        bio: 'Full-stack developer with 5+ years experience',
        location: 'San Francisco, CA',
        profileCompletion: 100
      }
    },
    {
      _id: '2',
      name: 'David Rodriguez',
      email: 'david@example.com',
      skillsTeaching: ['Python', 'Machine Learning'],
      skillsLearning: ['React'],
      profile: {
        bio: 'Data scientist specializing in ML',
        location: 'New York, NY',
        profileCompletion: 90
      }
    }
  ];
  
  res.json({
    users: mockUsers,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: mockUsers.length,
      itemsPerPage: 20
    }
  });
});

// Auth endpoints (mock)
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  const newUser = {
    _id: Date.now().toString(),
    name,
    email,
    password: 'hashed_password',
    createdAt: new Date()
  };
  users.push(newUser);
  res.json({ token: 'mock_token', user: { id: newUser._id, name, email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  res.json({ token: 'mock_token', user: { id: '1', name: 'Test User', email } });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (In-Memory Mode)`);
  console.log(`📊 Mock data loaded: ${mockSkills.length} skills`);
});
