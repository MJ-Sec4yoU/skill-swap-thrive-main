---
description: Repository Information Overview
alwaysApply: true
---

# Repository Information Overview

## Repository Summary
Skill Swap is a platform that facilitates skill exchange between users. The application allows users to register, offer skills they can teach, find skills they want to learn, and connect with other users for skill exchange sessions.

## Repository Structure
- **frontend**: React TypeScript application with Vite, shadcn/ui, and Tailwind CSS
- **backend**: Express.js API server with MongoDB database
- **tests**: Playwright end-to-end tests for the application

### Main Repository Components
- **Frontend (root)**: React SPA with TypeScript, Vite, and Tailwind CSS
- **Backend (/backend)**: Express.js REST API with MongoDB
- **Testing (/tests)**: Playwright automated testing

## Projects

### Frontend (React Application)
**Configuration File**: package.json, vite.config.ts, tsconfig.json

#### Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.8.3
**Build System**: Vite 5.4.19
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- React 18.3.1
- React Router 6.30.1
- TanStack Query 5.83.0
- shadcn/ui components (Radix UI)
- Tailwind CSS 3.4.17
- Zod 3.25.76 (validation)
- DOMPurify 3.2.6 (security)

#### Build & Installation
```bash
npm install
npm run dev    # Development server
npm run build  # Production build
npm run preview  # Preview production build
```

#### Testing
**Framework**: Playwright
**Test Location**: /tests
**Naming Convention**: *.spec.js
**Run Command**:
```bash
npx playwright test
```

### Backend (Express API)
**Configuration File**: /backend/package.json, /backend/server.js

#### Language & Runtime
**Language**: JavaScript (Node.js)
**Version**: Node.js (Express 4.21.2)
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- Express 4.21.2
- Mongoose 8.18.1
- JWT 9.0.2
- bcrypt 6.0.0
- Express Validator 7.2.1
- Helmet 8.1.0 (security)
- Express Rate Limit 8.1.0
- DOMPurify 3.2.6 (security)
- Multer 2.0.2 (file uploads)

**Development Dependencies**:
- Nodemon 3.1.10

#### Build & Installation
```bash
cd backend
npm install
npm run setup  # Configure environment variables
npm run dev    # Development with auto-reload
npm start      # Production server
```

#### Environment Setup
**Configuration Files**: 
- `.env.example` - Template for environment variables
- `setup-env.js` - Interactive setup script
- `fix-mongodb-connection.js` - MongoDB connection troubleshooting

**Required Variables**:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token generation
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

#### Database
**Type**: MongoDB
**Connection**: Environment variable MONGODB_URI
**Models**: User, Skill, Message, Schedule, AuditLog
**Setup Scripts**:
```bash
npm run setup        # Interactive environment setup
npm run fix-mongodb  # Fix MongoDB connection issues
npm run create-user  # Create a new MongoDB user
```

#### Security Features
- Rate limiting
- Input sanitization
- MongoDB query sanitization
- Security headers (Helmet)
- JWT authentication
- Password hashing (bcrypt)
- CORS protection
- File upload restrictions

#### API Routes
- /api/auth - Authentication endpoints
- /api/users - User management
- /api/skills - Skill management
- /api/messages - Messaging system
- /api/schedules - Scheduling system
- /api/matching - Skill matching algorithm
- /api/admin - Admin dashboard endpoints