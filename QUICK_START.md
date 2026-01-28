# ⚡ Quick Start - 5 Minutes to Running

Get the Emergency Incident Reporter running in 5 minutes!

## Prerequisites Check ✓

- ✅ Node.js installed? Run: `node -v` (need v14+)
- ✅ npm installed? Run: `npm -v`

If not installed: Download from [nodejs.org](https://nodejs.org/)

---

## Option 1: Automated Install (Easiest)

### Windows (PowerShell)
```powershell
.\install.ps1
npm run dev
```

### Mac/Linux (Bash)
```bash
chmod +x install.sh
./install.sh
npm run dev
```

**That's it!** Open http://localhost:3000

---

## Option 2: Manual Install (5 Steps)

### Step 1: Install Dependencies (2 min)
```bash
npm install
cd client && npm install && cd ..
```

### Step 2: Download Face Detection Models (1 min)
```bash
mkdir -p client/public/models
cd client/public/models

# Download models
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

cd ../../..
```

### Step 3: Create Config File (30 sec)
```bash
cp .env.example .env
```

### Step 4: Start Application (30 sec)
```bash
npm run dev
```

### Step 5: Open Browser
Go to: **http://localhost:3000**

---

## Test the Application

### Quick Test (1 minute)
1. **Allow camera** when prompted
2. **Take any photo** (test with any object)
3. **Take selfie** (face detection will validate)
4. **Click "Get My Location"** and allow
5. **Select Cairo** from governorate dropdown
6. **Submit report** and get Report ID

✅ **Success!** You should see a confirmation with a Report ID.

---

## What's Next?

### For Testing/Development
- Reports saved to: `reports.json`
- Photos saved to: `uploads/`
- Check browser console for logs
- Check terminal for server logs

### For Production
1. **Configure your ambulance API:**
   ```bash
   # Edit .env file
   AMBULANCE_API_URL=https://your-api.com/reports
   AMBULANCE_API_KEY=your_secret_key
   ```

2. **Deploy to production:**
   - See `README.md` for deployment options
   - Requires HTTPS for camera/location APIs
   - Configure SSL certificate

---

## Troubleshooting

### "Camera not working"
- ✅ Allow camera permission in browser
- ✅ Use Chrome, Firefox, or Safari
- ✅ HTTPS required in production

### "Models not loading"
- ✅ Check `client/public/models/` has 2 files
- ✅ Re-run download commands above
- ✅ Check browser console for 404 errors

### "Location not working"
- ✅ Allow location permission in browser
- ✅ Enable location services on device
- ✅ Try refreshing the page

### "npm install fails"
- ✅ Update Node.js to latest LTS
- ✅ Clear npm cache: `npm cache clean --force`
- ✅ Delete `node_modules` and retry

---

## File Structure

```
incident-reporter/
├── 📄 README.md              ← Full documentation
├── 📄 SETUP_GUIDE.md         ← Detailed setup
├── 📄 API_INTEGRATION.md     ← API integration guide
├── 📄 FEATURES.md            ← Feature list
├── 🚀 install.sh/ps1         ← Auto installer
├── 🚀 start.sh/ps1           ← Quick start script
├── ⚙️  package.json          ← Backend dependencies
├── ⚙️  .env                  ← Configuration (create this)
├── 📁 server/               ← Backend code
│   ├── index.js             ← Express server
│   └── data/governorates.js ← Egyptian locations
├── 📁 client/               ← Frontend code
│   ├── package.json         ← Frontend dependencies
│   ├── public/
│   │   ├── index.html
│   │   └── models/          ← Face detection models
│   └── src/
│       ├── App.js           ← Main app component
│       ├── components/      ← React components
│       │   ├── CameraCapture.js
│       │   ├── LocationSelector.js
│       │   └── ReportSubmission.js
│       └── *.css            ← Styles
├── 📁 uploads/              ← Photo storage (auto-created)
└── 📄 reports.json          ← Report backup (auto-created)
```

---

## Key Features

✅ **Photo Capture** - Incident + Selfie with face detection  
✅ **GPS Location** - Automatic coordinates  
✅ **Egyptian Locations** - 27 governorates, 100+ regions  
✅ **API Integration** - Direct to ambulance service  
✅ **Mobile Responsive** - Works on all devices  
✅ **Offline Photos** - Stores locally before upload  

---

## Commands Reference

```bash
# Development (runs both frontend & backend)
npm run dev

# Backend only
npm run server

# Frontend only
npm run client

# Production build
npm run build
NODE_ENV=production npm start

# Install everything
npm run install-all
```

---

## Configuration Quick Reference

### Development (Mock Mode)
```env
PORT=5000
NODE_ENV=development
# No API URL = mock mode
```

### Production (Real API)
```env
PORT=5000
NODE_ENV=production
AMBULANCE_API_URL=https://api.ambulance.com/reports
AMBULANCE_API_KEY=secret_key_here
```

---

## Getting Help

1. **Check console** - Browser DevTools (F12)
2. **Check terminal** - Server logs show errors
3. **Read docs** - See README.md for details
4. **Test API** - Use mock mode first
5. **Verify models** - Check models directory

---

## Success Checklist

- [ ] Node.js and npm installed
- [ ] Dependencies installed (`npm install`)
- [ ] Face detection models downloaded
- [ ] .env file created
- [ ] Server starts without errors
- [ ] Browser opens to http://localhost:3000
- [ ] Camera works (can take photos)
- [ ] Location works (can get GPS)
- [ ] Can submit test report
- [ ] Report ID generated

---

**🎉 Congratulations!** You're all set up!

**Need more details?** See `README.md` and `SETUP_GUIDE.md`

**Ready for production?** See `API_INTEGRATION.md`
