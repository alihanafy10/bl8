const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Egyptian governorates data
const egyptianGovernorates = require('./data/governorates');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get all governorates
app.get('/api/governorates', (req, res) => {
  try {
    res.json({ success: true, data: egyptianGovernorates });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get regions by governorate
app.get('/api/governorates/:governorate/regions', (req, res) => {
  try {
    const governorate = egyptianGovernorates.find(
      g => g.name_en.toLowerCase() === req.params.governorate.toLowerCase() ||
           g.name_ar === req.params.governorate
    );

    if (!governorate) {
      return res.status(404).json({ success: false, error: 'Governorate not found' });
    }

    res.json({ success: true, data: governorate.regions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit incident report
app.post('/api/report', upload.fields([
  { name: 'incidentPhoto', maxCount: 1 },
  { name: 'facePhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      governorate,
      region,
      description,
      timestamp
    } = req.body;

    // Validate required fields
    if (!latitude || !longitude || !governorate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: latitude, longitude, governorate'
      });
    }

    // Check if files were uploaded
    if (!req.files || !req.files.incidentPhoto || !req.files.facePhoto) {
      return res.status(400).json({
        success: false,
        error: 'Both incident photo and face photo are required'
      });
    }

    // Prepare report data
    const reportData = {
      timestamp: timestamp || new Date().toISOString(),
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        governorate: governorate,
        region: region || 'Not specified'
      },
      description: description || 'No description provided',
      photos: {
        incident: req.files.incidentPhoto[0].filename,
        face: req.files.facePhoto[0].filename
      },
      reportId: `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };

    // Send to ambulance service API
    try {
      if (process.env.AMBULANCE_API_URL) {
        const headers = {};
        if (process.env.AMBULANCE_API_KEY) {
          headers['Authorization'] = `Bearer ${process.env.AMBULANCE_API_KEY}`;
        }

        const apiResponse = await axios.post(
          process.env.AMBULANCE_API_URL,
          reportData,
          { headers }
        );

        console.log('Report sent to ambulance service:', apiResponse.data);
      } else {
        console.log('Mock mode - Report data:', JSON.stringify(reportData, null, 2));
      }
    } catch (apiError) {
      console.error('Error sending to ambulance API:', apiError.message);
      // Continue even if API fails - we still want to confirm the report was received
    }

    // Save report to local storage (optional backup)
    const reportsFile = path.join(__dirname, '../reports.json');
    let reports = [];
    if (fs.existsSync(reportsFile)) {
      const fileContent = fs.readFileSync(reportsFile, 'utf8');
      reports = JSON.parse(fileContent);
    }
    reports.push(reportData);
    fs.writeFileSync(reportsFile, JSON.stringify(reports, null, 2));

    res.json({
      success: true,
      message: 'Report submitted successfully',
      reportId: reportData.reportId,
      data: reportData
    });

  } catch (error) {
    console.error('Error processing report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process report: ' + error.message
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Only listen on port if not in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Ambulance API URL: ${process.env.AMBULANCE_API_URL || 'Not configured (Mock mode)'}`);
  });
}

// Export for Vercel serverless
module.exports = app;
