# 🚑 Emergency Incident Reporter

A full-stack web application that allows users to report emergency incidents with photo verification and automatic ambulance service notification. The application captures incident photos, user face verification, and location data to ensure authentic and actionable reports.

## ✨ Features

- **📸 Dual Photo Capture**: Capture incident scene and reporter's face for verification
- **🎥 React Webcam Integration**: Uses `react-webcam` for seamless photo capture
- **📍 Automatic Geolocation**: Captures user's GPS coordinates
- **🗺️ Reverse Geocoding**: Automatically detects governorate and district
- **🚑 Ambulance Integration**: Forwards reports to emergency services API
- **💾 MongoDB Database**: Stores all reports with full details
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🔒 Secure**: Photo verification ensures report authenticity

## 🏗️ Tech Stack

### Frontend
- React 18
- React Webcam
- Axios
- CSS3 (Custom styling)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Helmet (Security)
- Compression
- CORS

### Deployment
- Railway (recommended)
- GitHub integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud instance like MongoDB Atlas)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd incident-reporter
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```
   Or manually:
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/incident-reporter
   GEOCODING_API_KEY=your_opencage_api_key
   AMBULANCE_API_URL=https://your-ambulance-service.com/api
   AMBULANCE_API_KEY=your_ambulance_api_key
   CLIENT_URL=http://localhost:3000
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```
   
   This starts:
   - Backend server on `http://localhost:5000`
   - React dev server on `http://localhost:3000`

5. **Access the application**
   
   Open your browser to `http://localhost:3000`

## 🌐 API Endpoints

### Reports API

#### Create Report
```http
POST /api/reports
Content-Type: application/json

{
  "incidentPhoto": "data:image/jpeg;base64,...",
  "faceVerificationPhoto": "data:image/jpeg;base64,...",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "governorate": "New York",
    "district": "Manhattan"
  },
  "notes": "Optional description"
}
```

#### Get Report by ID
```http
GET /api/reports/:id
```

#### List Reports
```http
GET /api/reports?page=1&limit=10
```

### Health Check
```http
GET /api/health
```

## 🚂 Railway Deployment

### Step 1: Prepare Your Code

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Emergency Incident Reporter"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### Step 2: Deploy to Railway

1. **Sign up/Login to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Add MongoDB**
   - Click "New" → "Database" → "Add MongoDB"
   - Railway will automatically provision a MongoDB instance
   - Copy the connection string

4. **Configure Environment Variables**
   
   In Railway dashboard, go to your service → Variables:
   ```env
   NODE_ENV=production
   MONGODB_URI=<railway-mongodb-connection-string>
   GEOCODING_API_KEY=<your-opencage-api-key>
   AMBULANCE_API_URL=<your-ambulance-service-url>
   AMBULANCE_API_KEY=<your-ambulance-api-key>
   CLIENT_URL=<your-railway-app-url>
   ```

5. **Deploy**
   - Railway will automatically build and deploy
   - Your app will be available at `https://your-app.railway.app`

### Step 3: Get API Keys

#### OpenCage Geocoding API (Free Tier)
1. Sign up at [opencagedata.com](https://opencagedata.com/api)
2. Get your free API key (2,500 requests/day)
3. Add to Railway environment variables

#### Alternative: Google Maps Geocoding
1. Sign up at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Geocoding API
3. Get API key
4. Uncomment Google Maps code in `server/services/geocodingService.js`

## 📁 Project Structure

```
incident-reporter/
├── client/                      # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── IncidentReporter.js
│   │   │   ├── IncidentReporter.css
│   │   │   ├── SuccessPage.js
│   │   │   └── SuccessPage.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                      # Node.js backend
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── models/
│   │   └── Report.js           # Report schema
│   ├── routes/
│   │   └── reports.js          # API routes
│   ├── services/
│   │   ├── ambulanceService.js # Ambulance notification
│   │   └── geocodingService.js # Reverse geocoding
│   └── index.js                # Express server
├── .env.example                # Example environment variables
├── .gitignore
├── package.json
├── railway.json                # Railway configuration
├── nixpacks.toml              # Nixpacks build config
└── README.md
```

## 🔧 Configuration

### Geocoding Service

The app uses OpenCage Geocoding API by default. To switch to Google Maps:

1. Uncomment the Google Maps function in `server/services/geocodingService.js`
2. Update the `reverseGeocode` export
3. Add Google Maps API key to environment variables

### Ambulance Service Integration

Configure your ambulance service endpoint in `.env`:

```env
AMBULANCE_API_URL=https://ambulance-service.example.com/api/reports
AMBULANCE_API_KEY=your_api_key
```

The payload sent to the ambulance service:
```json
{
  "reportId": "mongodb_object_id",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "governorate": "New York",
    "district": "Manhattan",
    "address": "Full address string"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "priority": "high",
  "notes": "Additional details"
}
```

## 📱 Usage Guide

### For Users

1. **Allow Permissions**
   - Grant camera access when prompted
   - Allow location access for accurate reporting

2. **Capture Incident Photo**
   - Point camera at the incident
   - Click "Capture Photo"
   - Review and continue or retake

3. **Face Verification**
   - Camera switches to front-facing
   - Capture clear photo of your face
   - Review and continue

4. **Review & Submit**
   - Review both photos
   - Add optional notes
   - Verify location is detected
   - Click "Submit Report"

5. **Confirmation**
   - Receive report ID
   - Ambulance notification status
   - Emergency instructions

## 🔐 Security Features

- **Helmet.js**: HTTP security headers
- **CORS**: Configured cross-origin requests
- **Photo Verification**: Dual photo system prevents fake reports
- **Geolocation**: Ensures accurate incident location
- **Request Validation**: Server-side input validation
- **Error Handling**: Secure error messages in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review Railway deployment logs

## 🎯 Future Enhancements

- [ ] SMS notifications to reporters
- [ ] Real-time ambulance tracking
- [ ] Admin dashboard for report management
- [ ] Multi-language support
- [ ] Voice notes recording
- [ ] Automatic incident type detection (AI)
- [ ] PWA support for offline capability

---

Built with ❤️ for emergency response teams
