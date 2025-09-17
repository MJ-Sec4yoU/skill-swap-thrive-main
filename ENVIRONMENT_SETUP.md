# Environment Configuration Setup Guide

## 🔧 Quick Setup

### Development Setup:
```bash
# 1. Copy environment templates
cp .env.example .env.local
cp backend/.env.example backend/.env

# 2. Update values in the files for your local setup
# 3. Start the application
npm run dev  # Frontend
cd backend && npm start  # Backend
```

### Production Setup:
```bash
# 1. Copy production templates  
cp .env.production.example .env.production
cp backend/.env.production.example backend/.env.production

# 2. Generate secure secrets (see Security section below)
# 3. Update all URLs and credentials for production
# 4. Set environment variables in your deployment platform
```

## 🔑 Required Environment Variables

### Frontend (Vite - prefixed with VITE_)
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API endpoint | `https://api.yourapp.com/api` | ✅ Yes |
| `VITE_APP_NAME` | Application name | `Skill Swap & Thrive` | ✅ Yes |
| `VITE_APP_ENV` | Environment name | `production` | ✅ Yes |
| `VITE_MAX_FILE_SIZE` | Max upload size (bytes) | `5242880` | ✅ Yes |

### Backend (Node.js)
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | Database connection | `mongodb+srv://...` | ✅ Yes |
| `JWT_SECRET` | JWT signing secret | `64+ character string` | ✅ Yes |
| `CORS_ORIGIN` | Allowed origins | `https://yourapp.com` | ✅ Yes |
| `PORT` | Server port | `5000` | ✅ Yes |

## 🛡️ Security Best Practices

### Secret Generation:
```bash
# Generate secure JWT secret (64+ characters)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate session secret  
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate admin password
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

### Security Checklist:
- [ ] JWT secrets are 64+ characters long
- [ ] Different secrets for JWT and refresh tokens  
- [ ] Strong admin passwords
- [ ] CORS origins restricted to your domains
- [ ] HTTPS URLs in production
- [ ] Database credentials secured
- [ ] API keys stored securely

## 🚀 Deployment Platform Configuration

### Vercel (Frontend):
```bash
# Install Vercel CLI
npm i -g vercel

# Set environment variables
vercel env add VITE_API_URL production
vercel env add VITE_APP_NAME production  
# ... add all VITE_ variables
```

### Railway (Backend):
```bash
# Install Railway CLI  
npm i -g @railway/cli

# Set environment variables
railway variables set MONGODB_URI=mongodb+srv://...
railway variables set JWT_SECRET=your-64-char-secret
# ... add all backend variables
```

### Render (Backend):
1. Go to Render dashboard
2. Create new Web Service
3. Connect GitHub repository
4. Add environment variables in dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CORS_ORIGIN`
   - etc.

### Heroku (Backend):
```bash
# Install Heroku CLI
# Set environment variables
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-64-char-secret
# ... add all backend variables
```

## 📱 Environment-Specific Configuration

### Development:
- Local MongoDB or MongoDB Atlas free tier
- HTTP URLs (http://localhost:...)  
- Relaxed CORS settings
- Detailed logging enabled
- File uploads to local directory

### Production:
- MongoDB Atlas production cluster
- HTTPS URLs only
- Restricted CORS origins
- Error logging only
- Cloud storage (Cloudinary) recommended
- Email service configured
- Monitoring enabled (Sentry)

## 🔍 Environment Validation

### Frontend Validation:
```typescript
// src/config/env.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  appName: import.meta.env.VITE_APP_NAME || 'Skill Swap',
  environment: import.meta.env.VITE_APP_ENV || 'development',
  maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880'),
};

// Validate required environment variables
const requiredEnvVars = ['VITE_API_URL', 'VITE_APP_NAME'];
const missing = requiredEnvVars.filter(key => !import.meta.env[key]);

if (missing.length > 0) {
  console.error('Missing required environment variables:', missing);
}
```

### Backend Validation:
```javascript
// backend/config/env.js
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET', 
  'CORS_ORIGIN',
  'PORT'
];

const missing = requiredEnvVars.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('Missing required environment variables:', missing);
  process.exit(1);
}
```

## 🚨 Common Issues & Solutions

### Issue: "API calls failing in production"
**Solution:** Check `VITE_API_URL` points to correct production backend

### Issue: "CORS errors in production"  
**Solution:** Update `CORS_ORIGIN` to include production frontend URL

### Issue: "JWT tokens not working"
**Solution:** Ensure `JWT_SECRET` is same between deployments

### Issue: "Database connection failed"
**Solution:** Check `MONGODB_URI` and network access in MongoDB Atlas

### Issue: "File uploads not working"
**Solution:** Configure cloud storage or ensure upload directory exists

## ✅ Environment Setup Checklist

### Development:
- [ ] Copy .env.example files
- [ ] Update API URLs for local development
- [ ] Set up local MongoDB or Atlas connection
- [ ] Generate development JWT secrets
- [ ] Test all functionality locally

### Production:
- [ ] Generate secure production secrets (64+ chars)
- [ ] Set up production MongoDB Atlas cluster
- [ ] Configure production API URLs  
- [ ] Set up email service (SendGrid, etc.)
- [ ] Configure cloud storage (Cloudinary)
- [ ] Set up monitoring (Sentry)
- [ ] Configure CORS for production domains
- [ ] Test production deployment
- [ ] Set up CI/CD environment variables

## 📞 Support

If you encounter issues:
1. Check the console for specific error messages
2. Verify all required environment variables are set
3. Ensure URLs are accessible from your deployment
4. Check logs in your deployment platform
5. Validate MongoDB connection and permissions

---

🔒 **Remember: Never commit .env files with real secrets to version control!**