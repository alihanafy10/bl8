# 📦 Installation Guide

Complete step-by-step installation instructions for the Emergency Incident Reporter.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Install (Automated)](#quick-install-automated)
3. [Manual Installation](#manual-installation)
4. [Post-Installation](#post-installation)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher) - comes with Node.js
- **Git** (optional, for cloning repository)

### Check Installed Versions
```bash
node -v    # Should show v14+ or higher
npm -v     # Should show v6+ or higher
```

### Install Node.js
If not installed, download from: https://nodejs.org/

**Recommended:** Download the LTS (Long Term Support) version

---

## Quick Install (Automated)

### Option 1: Windows (PowerShell)

```powershell
# Navigate to project directory
cd path\to\incident-reporter

# Run automated installer
.\install.ps1

# Start the application
npm run dev
```

### Option 2: Mac/Linux (Bash)

```bash
# Navigate to project directory
cd path/to/incident-reporter

# Make script executable
chmod +x install.sh

# Run automated installer
./install.sh

# Start the application
npm run dev
```

### What the Automated Installer Does:
1. ✅ Checks Node.js and npm installation
2. ✅ Installs backend dependencies
3. ✅ Installs frontend dependencies
4. ✅ Creates models directory
5. ✅ Downloads face detection models
6. ✅ Creates .env configuration file
7. ✅ Creates uploads directory

**Time Required:** 3-5 minutes (depending on internet speed)

---

## Manual Installation

If automated installation fails or you prefer manual setup:

### Step 1: Install Backend Dependencies (2 minutes)

```bash
# In project root directory
npm install
```

This installs:
- express
- cors
- dotenv
- multer
- axios
- nodemon
- concurrently

### Step 2: Install Frontend Dependencies (2 minutes)

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Return to root
cd ..
```

This installs:
- react
- react-dom
- react-scripts
- axios
- face-api.js

### Step 3: Download Face Detection Models (1 minute)

**Option A: Using curl (Mac/Linux/Windows with Git Bash)**

```bash
# Create models directory
mkdir -p client/public/models

# Navigate to models directory
cd client/public/models

# Download model files
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json

curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

# Return to root
cd ../../..
```

**Option B: Using wget (Linux)**

```bash
# Create models directory
mkdir -p client/public/models

# Navigate to models directory
cd client/public/models

# Download model files
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json

wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

# Return to root
cd ../../..
```

**Option C: Using PowerShell (Windows)**

```powershell
# Create models directory
New-Item -ItemType Directory -Force -Path "client/public/models"

# Navigate to models directory
Set-Location client/public/models

# Download model files
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json" -OutFile "tiny_face_detector_model-weights_manifest.json"

Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1" -OutFile "tiny_face_detector_model-shard1"

# Return to root
Set-Location ../../..
```

**Option D: Manual Download**

1. Visit: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
2. Download these two files:
   - `tiny_face_detector_model-weights_manifest.json`
   - `tiny_face_detector_model-shard1`
3. Place them in: `client/public/models/`

### Step 4: Create Configuration File (30 seconds)

```bash
# Copy example environment file
cp .env.example .env
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

### Step 5: Create Required Directories (30 seconds)

```bash
# Create uploads directory
mkdir uploads
```

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Force -Path "uploads"
```

---

## Post-Installation

### Configuration

Edit the `.env` file:

**For Development/Testing (Mock Mode):**
```env
PORT=5000
NODE_ENV=development
# Leave API settings commented out
```

**For Production (Real API):**
```env
PORT=5000
NODE_ENV=production
AMBULANCE_API_URL=https://your-ambulance-api.com/reports
AMBULANCE_API_KEY=your_secret_api_key_here
```

### Starting the Application

**Development Mode (Recommended for Testing):**
```bash
npm run dev
```

This starts both frontend and backend concurrently:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

**Separate Processes:**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

**Production Mode:**
```bash
# Build frontend
npm run build

# Start production server
NODE_ENV=production npm start
```

---

## Verification

### 1. Check Installation

After installation, verify these directories and files exist:

```
incident-reporter/
├── node_modules/           ✓ Should exist
├── client/
│   ├── node_modules/       ✓ Should exist
│   └── public/
│       └── models/
│           ├── tiny_face_detector_model-weights_manifest.json  ✓
│           └── tiny_face_detector_model-shard1                 ✓
├── server/
├── uploads/                ✓ Should exist
├── .env                    ✓ Should exist
└── package.json            ✓ Should exist
```

### 2. Test Backend

```bash
# Start backend
npm run server

# In another terminal or browser, visit:
# http://localhost:5000/api/health
# Should return: {"status":"ok","message":"Server is running"}
```

### 3. Test Frontend

```bash
# Start frontend
cd client
npm start

# Browser should automatically open to:
# http://localhost:3000
# You should see the Emergency Incident Reporter homepage
```

### 4. Test Complete Application

```bash
# From root directory
npm run dev

# Visit http://localhost:3000
# Test the following:
```

**Checklist:**
- [ ] Homepage loads without errors
- [ ] Can click "Start Camera" (allow camera permission)
- [ ] Camera preview shows
- [ ] Can capture incident photo
- [ ] Can capture face photo
- [ ] Face detection shows "Face detected ✓"
- [ ] Can click "Get My Location" (allow location permission)
- [ ] GPS coordinates display
- [ ] Governorate dropdown is populated
- [ ] Can select governorate
- [ ] Region dropdown updates with regions
- [ ] Can submit report
- [ ] Receive Report ID confirmation

---

## Troubleshooting

### Issue: "npm: command not found"

**Solution:**
- Node.js/npm not installed
- Install from: https://nodejs.org/
- Restart terminal after installation

### Issue: "Cannot find module 'express'" or similar

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# For frontend
cd client
rm -rf node_modules
npm install
cd ..
```

### Issue: Face detection models not loading (404 errors in console)

**Solution:**
```bash
# Verify models exist
ls -la client/public/models/

# Should show:
# tiny_face_detector_model-weights_manifest.json
# tiny_face_detector_model-shard1

# If missing, re-download:
cd client/public/models
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
cd ../../..
```

### Issue: Camera not working

**Possible Causes & Solutions:**

1. **Permission Denied**
   - Allow camera permission in browser
   - Check browser settings

2. **HTTPS Required**
   - Camera API requires HTTPS in production
   - Use `localhost` for development (HTTP allowed)
   - For production, configure SSL/HTTPS

3. **Camera in Use**
   - Close other applications using camera
   - Restart browser

4. **Browser Not Supported**
   - Use Chrome, Firefox, Safari, or Edge
   - Update browser to latest version

### Issue: Location not working

**Possible Causes & Solutions:**

1. **Permission Denied**
   - Allow location permission in browser
   - Check browser settings

2. **Location Services Disabled**
   - Enable location services on device
   - Check system settings

3. **HTTPS Required**
   - Geolocation API requires HTTPS in production
   - Use `localhost` for development (HTTP allowed)

### Issue: Port already in use

**Solution:**

Backend (port 5000):
```bash
# Find process using port 5000
# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Frontend (port 3000):
```bash
# Find process using port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "EACCES" permission errors

**Solution:**
```bash
# Don't use sudo with npm
# Fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Reinstall dependencies
npm install
```

### Issue: Slow installation

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Use faster registry (optional)
npm config set registry https://registry.npmjs.org/

# Reinstall
npm install
```

### Issue: Module build failed

**Solution:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# For frontend
cd client
rm -rf node_modules package-lock.json
npm install
cd ..
```

---

## Platform-Specific Notes

### Windows
- Use PowerShell (not CMD) for best compatibility
- Some scripts may need execution policy adjustment:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```

### macOS
- May need to install Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

### Linux
- May need build-essential package:
  ```bash
  sudo apt-get install build-essential
  ```

---

## Updating

To update dependencies:

```bash
# Update backend
npm update

# Update frontend
cd client
npm update
cd ..
```

To update to latest versions:

```bash
# Backend
npm install express@latest cors@latest dotenv@latest multer@latest axios@latest

# Frontend
cd client
npm install react@latest react-dom@latest axios@latest
cd ..
```

---

## Uninstallation

To remove the application:

```bash
# Remove dependencies
rm -rf node_modules
rm -rf client/node_modules

# Remove generated files
rm -rf uploads
rm reports.json
rm .env

# Remove build files
rm -rf client/build
```

Keep source code and documentation files.

---

## Next Steps

After successful installation:

1. ✅ **Test the application** - Complete a full report submission
2. ✅ **Configure API** - Set up your ambulance service API in .env
3. ✅ **Customize** - Adjust branding, colors, or functionality
4. ✅ **Deploy** - Deploy to production hosting platform
5. ✅ **Monitor** - Set up logging and monitoring

---

## Additional Resources

- **Complete Documentation:** See `README.md`
- **Quick Start:** See `QUICK_START.md`
- **API Integration:** See `API_INTEGRATION.md`
- **Features:** See `FEATURES.md`
- **Project Structure:** See `PROJECT_TREE.txt`

---

## Support

If you encounter issues not covered here:

1. Check browser console (F12) for errors
2. Check terminal/server logs
3. Verify Node.js and npm versions
4. Try reinstalling dependencies
5. Check file permissions
6. Review environment configuration

---

**Installation Complete! 🎉**

You're now ready to use the Emergency Incident Reporter!
