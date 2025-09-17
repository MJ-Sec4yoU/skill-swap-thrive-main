# Skill Swap Backend

A Node.js/Express backend for the Skill Swap application with MongoDB integration.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
npm run setup
```

This interactive script will help you configure:
- MongoDB connection string (Atlas or local)
- JWT secret for authentication
- Server port
- Environment mode

### 3. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## Environment Configuration

### Required Variables

Create a `.env` file in the backend directory with:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillswap?retryWrites=true&w=majority

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### MongoDB Setup Options

#### Option 1: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string from the Atlas dashboard
4. Whitelist your IP address in Network Access
5. Use the connection string in your `.env` file

#### Option 2: Local MongoDB
1. Install MongoDB Community Server
2. Start the MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/skillswap`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/search` - Search users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Skills
- `GET /api/skills` - Get all skills (with filtering)
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Messages
- `GET /api/messages` - Get user messages
- `POST /api/messages` - Send message

### Schedules
- `GET /api/schedules` - Get user schedules
- `POST /api/schedules` - Create schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

## Database Models

- **User**: User accounts with profiles and skills
- **Skill**: Skills that users can teach/learn
- **Message**: Communication between users
- **Schedule**: Meeting schedules
- **AuditLog**: System audit trail

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- File upload restrictions
- Admin role management

## Development

### File Structure
```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Authentication & audit middleware
├── uploads/         # File uploads directory
├── server.js        # Main server file
├── setup-env.js     # Environment setup script
└── .env             # Environment variables (create this)
```

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run setup` - Interactive environment setup

## Troubleshooting

### MongoDB Connection Issues
1. Check your connection string format
2. Verify network access (for Atlas)
3. Ensure MongoDB service is running (for local)
4. Check firewall settings

### Authentication Issues
1. Verify JWT_SECRET is set
2. Check token expiration
3. Ensure user exists in database

### File Upload Issues
1. Check uploads directory permissions
2. Verify file size limits
3. Check allowed file types

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Configure proper CORS origins
4. Set up SSL/TLS
5. Use environment-specific MongoDB cluster
6. Configure proper logging
7. Set up monitoring and backups

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the environment setup guide
3. Verify all environment variables are set correctly
