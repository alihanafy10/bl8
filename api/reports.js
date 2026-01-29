const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('./db');
const { notifyAmbulanceService } = require('./services/ambulanceService');
const { reverseGeocode } = require('./services/geocodingService');
const { createDispatch } = require('./services/dispatchService');

// Submit a new report
router.post('/', async (req, res) => {
  try {
    const { incidentPhoto, faceVerificationPhoto, location, notes } = req.body;

    // Validate required fields
    if (!incidentPhoto || !faceVerificationPhoto || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields: incidentPhoto, faceVerificationPhoto, or location' 
      });
    }

    if (!location.latitude || !location.longitude) {
      return res.status(400).json({ 
        error: 'Location must include latitude and longitude' 
      });
    }

    // Connect to database
    const { Report, Dispatch, AmbulanceStation, Ambulance } = await connectToDatabase();

    // Reverse geocode to get address details
    let addressDetails = {
      governorate: location.governorate || 'Unknown',
      district: location.district || 'Unknown',
      fullAddress: location.fullAddress || ''
    };

    try {
      const geocodeResult = await reverseGeocode(location.latitude, location.longitude);
      if (geocodeResult) {
        addressDetails = { ...addressDetails, ...geocodeResult };
      }
    } catch (geocodeError) {
      console.error('Geocoding error:', geocodeError.message);
    }

    // Create report
    const report = new Report({
      incidentPhoto,
      faceVerificationPhoto,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        governorate: addressDetails.governorate,
        district: addressDetails.district,
        fullAddress: addressDetails.fullAddress,
      },
      notes: notes || '',
      reporterInfo: {
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
      },
    });

    await report.save();

    // Smart Dispatch: Find and assign nearest ambulance
    let dispatchInfo = null;
    try {
      dispatchInfo = await createDispatch(report, Dispatch, AmbulanceStation, Ambulance);
      console.log('Dispatch created successfully:', dispatchInfo);
    } catch (dispatchError) {
      console.error('Dispatch error:', dispatchError.message);
      // Continue even if dispatch fails
    }

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      reportId: report._id,
      ambulanceNotified: dispatchInfo ? true : false,
      dispatch: dispatchInfo ? {
        station: dispatchInfo.station,
        ambulance: dispatchInfo.ambulance,
        distance: dispatchInfo.distance,
        estimatedArrival: dispatchInfo.estimatedArrival,
      } : null,
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ 
      error: 'Failed to submit report',
      message: error.message 
    });
  }
});

// Get report by ID
router.get('/:id', async (req, res) => {
  try {
    const { Report } = await connectToDatabase();
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Get all reports (with pagination)
router.get('/', async (req, res) => {
  try {
    const { Report } = await connectToDatabase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-incidentPhoto -faceVerificationPhoto');

    const total = await Report.countDocuments();

    res.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

module.exports = router;
