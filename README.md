# 🚑 Emergency Incident Reporter

A comprehensive web application for emergency incident reporting with photo capture, face verification, and location tracking. Built specifically for Egyptian emergency services.

## Features

- 📸 **Photo Capture**: Capture incident photos and selfie verification using device camera
- 👤 **Face Detection**: Automatic face detection for identity verification
- 📍 **GPS Location**: Automatic location detection with coordinates
- 🗺️ **Egyptian Locations**: Complete database of Egyptian governorates and regions
- 🚨 **Emergency Dispatch**: Direct API integration with ambulance services
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🔒 **Secure**: Photos and location data are securely transmitted

## Technology Stack

### Frontend
- React 18
- face-api.js for face detection
- Axios for API calls
- Native browser APIs (Camera, Geolocation)

### Backend
- Node.js with Express
- Multer for file uploads
- Axios for external API calls
- Complete Egyptian governorate database

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser with camera and location support
- HTTPS connection (required for camera/location APIs in production)

## Installation

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Download Face Detection Models

The application uses face-api.js for face detection. Download the models:

```bash
# Create models directory
mkdir -p client/public/models

# Download tiny face detector model (lightweight, ~300KB)
# Visit: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
# Download these files to client/public/models/:
# - tiny_face_detector_model-weights_manifest.json
# - tiny_face_detector_model-shard1
```

**Quick download using curl:**

```bash
cd client/public/models
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
cd ../../..
```

### 3. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your settings
```

**Environment Variables:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Ambulance Service API Configuration
AMBULANCE_API_URL=https://api.ambulance-service.example.com/reports
AMBULANCE_API_KEY=your_api_key_here

# Optional: Enable API authentication
API_AUTH_ENABLED=false
API_AUTH_TOKEN=your_auth_token_here
```

## Running the Application

### Development Mode

```bash
# Run both frontend and backend simultaneously
npm run dev

# OR run separately:

# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

```bash
# Build the React app
npm run build

# Start production server
NODE_ENV=production npm start
```

## API Endpoints

### Backend API

#### Health Check
```
GET /api/health
```

#### Get All Governorates
```
GET /api/governorates
```

#### Get Regions by Governorate
```
GET /api/governorates/:governorate/regions
```

#### Submit Incident Report
```
POST /api/report
Content-Type: multipart/form-data

Fields:
- incidentPhoto: File (required)
- facePhoto: File (required)
- latitude: Number (required)
- longitude: Number (required)
- governorate: String (required)
- region: String (optional)
- description: String (optional)
- timestamp: ISO String (optional)
```

## Usage Guide

### For End Users

1. **Step 1: Capture Photos**
   - Take a photo of the incident
   - Take a selfie for verification (face will be automatically detected)

2. **Step 2: Location Information**
   - Allow location access when prompted
   - Select your governorate from the dropdown
   - Optionally select your specific region/city
   - Add a brief description (optional)

3. **Step 3: Review & Submit**
   - Review all information
   - Submit report to emergency services
   - Save your Report ID for reference

### For Developers

#### Integrating with Ambulance Service API

The application sends reports in the following format:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "location": {
    "latitude": 30.0444,
    "longitude": 31.2357,
    "governorate": "Cairo",
    "region": "Nasr City"
  },
  "description": "Traffic accident on Ring Road",
  "photos": {
    "incident": "incident-1234567890.jpg",
    "face": "face-1234567890.jpg"
  },
  "reportId": "RPT-1234567890-ABC123"
}
```

Configure your API endpoint in the `.env` file:

```env
AMBULANCE_API_URL=https://your-api.com/endpoint
AMBULANCE_API_KEY=your_secret_key
```

## Project Structure

```
incident-reporter/
├── client/                     # React frontend
│   ├── public/
│   │   ├── models/            # Face detection models
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CameraCapture.js
│   │   │   ├── LocationSelector.js
│   │   │   └── ReportSubmission.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                     # Node.js backend
│   ├── data/
│   │   └── governorates.js    # Egyptian locations
│   └── index.js               # Express server
├── .env.example               # Environment template
├── .gitignore
├── package.json
└── README.md
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Required Browser Features:**
- Camera API (getUserMedia)
- Geolocation API
- ES6+ JavaScript support

## Security Considerations

1. **HTTPS Required**: Camera and geolocation APIs require HTTPS in production
2. **API Keys**: Never commit `.env` file with real API keys
3. **File Upload Limits**: Maximum 10MB per photo
4. **Validation**: All inputs are validated on both client and server
5. **CORS**: Configure CORS appropriately for production

## Troubleshooting

### Camera not working
- Ensure HTTPS is used (required for camera API)
- Check browser permissions
- Try a different browser

### Location not detected
- Enable location services on device
- Allow location permission in browser
- Check if GPS/location services are working

### Face detection not working
- Ensure models are downloaded correctly
- Check browser console for errors
- Face detection will allow capture even if it fails

### API submission fails
- Check `.env` configuration
- Verify API endpoint is accessible
- Check network connection
- Review server logs for errors

## Deployment

### Deploying to Production

1. **Prepare Environment**
   ```bash
   npm run build
   ```

2. **Configure Environment Variables**
   - Set `NODE_ENV=production`
   - Configure your ambulance API URL and key
   - Set appropriate PORT

3. **Deploy Options**
   - **Heroku**: Use Heroku buildpacks
   - **AWS**: Deploy to EC2 or Elastic Beanstalk
   - **DigitalOcean**: Use App Platform
   - **Docker**: Create Dockerfile for containerization

4. **SSL Certificate**
   - Camera and location APIs require HTTPS
   - Use Let's Encrypt or cloud provider SSL

### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review troubleshooting section

## Acknowledgments

- face-api.js for face detection
- Egyptian governorate data compiled from official sources
- Icons and emojis for UI elements

---

**Note**: This is an emergency reporting system. Please use responsibly and only for genuine emergencies.
