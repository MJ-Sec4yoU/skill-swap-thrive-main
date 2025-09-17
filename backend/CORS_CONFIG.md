# CORS Configuration Guide

## Overview
The Skill Swap API uses environment-based CORS configuration to provide flexible security settings for development and production environments.

## Development Mode (NODE_ENV=development)
- **Automatic Origin Allowance**: All `localhost` and `127.0.0.1` origins are automatically allowed
- **No Configuration Needed**: Simply set `NODE_ENV=development` in your `.env` file
- **Supported Ports**: Common development ports (3000, 5173, 8080) are pre-configured
- **No-Origin Requests**: Allowed for testing tools like Postman, curl, mobile apps

## Production Mode (NODE_ENV=production)
- **Explicit Origin Control**: Only specified domains are allowed
- **Required Configuration**: Set `FRONTEND_URL` environment variables
- **Security Logging**: Blocked requests are logged for monitoring
- **Credential Support**: Full credential support for authenticated requests

## Environment Variables

### Required for Production
```bash
NODE_ENV=production
FRONTEND_URL=https://yourapp.com
```

### Optional for Production
```bash
FRONTEND_URL_2=https://www.yourapp.com
FRONTEND_URL_3=https://app.yourapp.com
FRONTEND_URL_4=https://staging.yourapp.com
```

## Configuration Examples

### Development Setup (.env)
```bash
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your-dev-jwt-secret
PORT=5000
```

### Production Setup (.env.production)
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skillswap
JWT_SECRET=your-production-jwt-secret
PORT=5000
FRONTEND_URL=https://skillswap.com
FRONTEND_URL_2=https://www.skillswap.com
```

## Security Features

### Development Security
- Localhost-only access
- Permissive for development tools
- Easy debugging and testing

### Production Security
- Explicit domain whitelisting
- Request origin logging
- Blocked request monitoring
- Secure credential handling

## Static File CORS
The `/uploads` endpoint has its own CORS configuration:
- Uses same origin validation as API endpoints
- Supports file access from allowed frontends
- Logs blocked static file requests in production

## Deployment Checklist

### Before Production Deployment:
1. ✅ Set `NODE_ENV=production`
2. ✅ Configure `FRONTEND_URL` with your domain
3. ✅ Add additional domains if needed (`FRONTEND_URL_2`, etc.)
4. ✅ Test CORS with your production domain
5. ✅ Monitor logs for blocked requests

### Common Production Domains to Configure:
- Main domain: `https://yourapp.com`
- www subdomain: `https://www.yourapp.com`  
- App subdomain: `https://app.yourapp.com`
- Staging environment: `https://staging.yourapp.com`

## Troubleshooting

### CORS Error in Production
1. Check `NODE_ENV` is set to `production`
2. Verify `FRONTEND_URL` matches your domain exactly
3. Ensure protocol (https) is correct
4. Check server logs for blocked request messages

### Development CORS Issues
1. Verify `NODE_ENV=development` 
2. Check if using localhost or 127.0.0.1
3. Confirm port is accessible
4. Try different port if blocked

## Monitoring

The server logs CORS information on startup:
```
🌐 CORS Configuration:
   Environment: Production
   Allowed origins: https://yourapp.com, https://www.yourapp.com
```

Blocked requests are logged in production:
```
🚫 CORS blocked request from origin: https://unauthorized-site.com
```

## Advanced Configuration

For more complex CORS needs, modify the `allowedOrigins` array in `server.js`:

```javascript
// Add dynamic origin validation
const productionOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  // Add your custom origins here
].filter(Boolean);
```