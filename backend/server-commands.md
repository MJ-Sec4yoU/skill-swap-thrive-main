# Server Management Commands

## Quick Commands (Copy & Paste)

### 🛑 STOP SERVER
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 🚀 START SERVER
```powershell
npm start
```

### 🔄 RESTART SERVER (Stop then Start)
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force; Start-Sleep -Seconds 3; npm start
```

### 🔍 CHECK SERVER STATUS
```powershell
try { $r = Invoke-WebRequest -Uri "http://localhost:5000/" -UseBasicParsing -TimeoutSec 3; Write-Host "✅ Server running - Status: $($r.StatusCode)" -ForegroundColor Green } catch { Write-Host "❌ Server not running" -ForegroundColor Red }
```

### 🎯 TEST MATCHING SYSTEM
```powershell
try { $r = Invoke-WebRequest -Uri "http://localhost:5000/api/matching/matches" -UseBasicParsing; Write-Host "✅ Matching system working - Status: $($r.StatusCode)" -ForegroundColor Green } catch { Write-Host "❌ Matching system issue" -ForegroundColor Red }
```

## 🚨 Emergency Fix for Port 5000 Error

If you get `EADDRINUSE: address already in use :::5000`:

```powershell
# 1. Stop all Node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Wait 3 seconds
Start-Sleep -Seconds 3

# 3. Check if port is free
netstat -ano | Select-String ":5000"

# 4. Start server
npm start
```

## 📝 Usage Notes

1. **Only run ONE server at a time** - Don't start multiple instances
2. **Always stop before starting** - Use stop command before starting new instance
3. **If signup validation fails** - The server is likely not running, use the status check
4. **Server runs in foreground** - Keep the terminal window open while testing

## 🎯 Current Status

Your server is configured with:
- ✅ Express 4.x (compatibility fixed)
- ✅ Full matching routes enabled  
- ✅ Auth middleware fixed
- ✅ MongoDB connection working
- ✅ All security middleware active

## 🔧 Troubleshooting

**Problem**: Port 5000 error during signup
**Solution**: Server was stopped, just run `npm start`

**Problem**: Multiple servers running
**Solution**: Use the stop command, then start once

**Problem**: Server not responding
**Solution**: Check status, then restart if needed