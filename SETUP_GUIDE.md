# 🚀 Quick Setup Guide

This guide will help you get the Emergency Incident Reporter running in minutes.

## Step-by-Step Setup

### 1️⃣ Install Dependencies (5 minutes)

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2️⃣ Download Face Detection Models (2 minutes)

**Option A: Automatic Download (Recommended)**

```bash
# Create models directory
mkdir -p client/public/models

# Download models using curl
cd client/public/models
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
cd ../../..
```

**Option B: Manual Download**

1. Go to: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
2. Download these files:
   - `tiny_face_detector_model-weights_manifest.json`
   - `tiny_face_detector_model-shard1`
3. Place them in `client/public/models/`

### 3️⃣ Configure Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env
```

**For Testing (Default):**
```env
PORT=5000
NODE_ENV=development
# Leave API settings commented for mock mode
```

**For Production (with real ambulance API):**
```env
PORT=5000
NODE_ENV=production
AMBULANCE_API_URL=https://your-ambulance-api.com/reports
AMBULANCE_API_KEY=your_api_key_here
```

### 4️⃣ Start the Application (1 minute)

```bash
# Development mode (both frontend and backend)
npm run dev
```

**OR run separately:**

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
cd client && npm start
```

### 5️⃣ Open in Browser

Navigate to: **http://localhost:3000**

---

## ✅ Verify Installation

1. **Home page loads** - You should see "Emergency Incident Reporter"
2. **Camera access works** - Click "Start Camera" button
3. **Location works** - Click "Get My Location" button
4. **Face detection** - Models should load without errors (check console)

---

## 🔧 Common Issues

### Issue: "Cannot find module 'express'"
**Solution:** Run `npm install` in root directory

### Issue: "Cannot find module 'react'"
**Solution:** Run `npm install` in client directory

### Issue: Camera not working
**Solution:** 
- Allow camera permission when prompted
- Use Chrome/Firefox/Safari
- For HTTPS requirement, use `ngrok` or deploy to hosting

### Issue: Face detection models not loading
**Solution:**
- Verify files exist in `client/public/models/`
- Check browser console for 404 errors
- Re-download models if corrupted

### Issue: Location not detected
**Solution:**
- Allow location permission when prompted
- Check if location services are enabled on device
- Try refreshing the page

---

## 📱 Testing the Application

### Test Flow:

1. **Capture Incident Photo**
   - Click "Start Camera"
   - Take photo of any object (simulating incident)
   - Click "Capture Incident"

2. **Capture Face Photo**
   - Camera switches to front camera
   - Position face in frame
   - Click "Capture Face"
   - Face detection validates a face is present

3. **Add Location**
   - Click "Get My Location"
   - Select governorate (e.g., "Cairo")
   - Select region (e.g., "Nasr City")
   - Add description (optional)

4. **Submit Report**
   - Review all information
   - Click "Submit to Emergency Services"
   - Note the Report ID generated

5. **Check Backend**
   - Reports are saved to `reports.json` in root directory
   - Photos saved in `uploads/` directory
   - Check console logs for API submission status

---

## 🌐 Accessing from Mobile

### Local Network Access:

1. **Find your computer's IP address:**
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)

   # Mac/Linux
   ifconfig
   # Look for inet address
   ```

2. **Update client package.json:**
   ```json
   "proxy": "http://YOUR_COMPUTER_IP:5000"
   ```

3. **Access from mobile:**
   - Open `http://YOUR_COMPUTER_IP:3000` on mobile browser
   - Ensure mobile is on same WiFi network

### Using ngrok (for HTTPS):

```bash
# Install ngrok
npm install -g ngrok

# Start your app
npm run dev

# In another terminal, create tunnel
ngrok http 3000

# Use the HTTPS URL provided by ngrok
```

---

## 🚀 Production Deployment

### Quick Deploy to Heroku:

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set AMBULANCE_API_URL=your_api_url
heroku config:set AMBULANCE_API_KEY=your_api_key

# Deploy
git push heroku main

# Open app
heroku open
```

### Deploy to Vercel (Frontend) + Heroku (Backend):

**Frontend (Vercel):**
```bash
cd client
npm install -g vercel
vercel
```

**Backend (Heroku):**
```bash
# Follow Heroku steps above
```

Update client proxy to point to Heroku backend URL.

---

## 📊 Monitoring

### Check Submitted Reports:

```bash
# View saved reports
cat reports.json

# View uploaded photos
ls uploads/
```

### Server Logs:

```bash
# Backend logs show:
# - Server startup
# - API requests
# - Ambulance API submissions
# - Errors and warnings
```

### Browser Console:

```bash
# Frontend console shows:
# - Face detection status
# - API responses
# - JavaScript errors
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS (required for camera/location)
- [ ] Secure API keys (never commit .env)
- [ ] Configure CORS appropriately
- [ ] Set up rate limiting
- [ ] Add authentication if needed
- [ ] Review file upload limits
- [ ] Set up logging and monitoring
- [ ] Configure backup for uploaded files
- [ ] Test on actual mobile devices

---

## 🎯 Next Steps

1. **Customize for your needs:**
   - Update branding and colors
   - Modify governorate data if needed
   - Add additional form fields
   - Customize API integration

2. **Enhance features:**
   - Add user authentication
   - Implement report tracking
   - Add email notifications
   - Create admin dashboard

3. **Deploy to production:**
   - Choose hosting provider
   - Configure SSL certificate
   - Set up domain name
   - Configure production API

---

## 💡 Tips

- **Development:** Use mock mode (no API configured) for testing
- **Testing:** Use Chrome DevTools device emulation for mobile testing
- **Debugging:** Check both browser console and terminal logs
- **Performance:** Face detection models are ~300KB, loads once
- **Offline:** App requires internet for API submission

---

## 📞 Need Help?

- Check README.md for detailed documentation
- Review troubleshooting section
- Check browser console for errors
- Verify all dependencies are installed
- Ensure models are downloaded correctly

**Happy Coding! 🚑**
