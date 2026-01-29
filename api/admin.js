const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('./db');

// Get all stations with availability
router.get('/stations', async (req, res) => {
  try {
    const { AmbulanceStation } = await connectToDatabase();
    
    const stations = await AmbulanceStation.find()
      .sort({ governorate: 1, name: 1 });

    res.json({ stations });
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
});

// Create new ambulance station
router.post('/stations', async (req, res) => {
  try {
    const { name, governorate, district, location, address, contactPhone, totalAmbulances } = req.body;
    const { AmbulanceStation } = await connectToDatabase();
    
    const station = new AmbulanceStation({
      name,
      governorate,
      district,
      location,
      address,
      contactPhone,
      totalAmbulances,
      availableAmbulances: totalAmbulances,
    });

    await station.save();

    res.status(201).json({
      success: true,
      message: 'Station created successfully',
      station,
    });
  } catch (error) {
    console.error('Error creating station:', error);
    res.status(500).json({ error: 'Failed to create station' });
  }
});

// Get all ambulances
router.get('/ambulances', async (req, res) => {
  try {
    const { Ambulance } = await connectToDatabase();
    
    const ambulances = await Ambulance.find()
      .populate('station')
      .populate('currentDispatch')
      .sort({ status: 1, vehicleNumber: 1 });

    res.json({ ambulances });
  } catch (error) {
    console.error('Error fetching ambulances:', error);
    res.status(500).json({ error: 'Failed to fetch ambulances' });
  }
});

// Create new ambulance
router.post('/ambulances', async (req, res) => {
  try {
    const { vehicleNumber, stationId, driver, equipment } = req.body;
    const { Ambulance } = await connectToDatabase();
    
    const ambulance = new Ambulance({
      vehicleNumber,
      station: stationId,
      driver,
      equipment,
      status: 'available',
    });

    await ambulance.save();

    res.status(201).json({
      success: true,
      message: 'Ambulance created successfully',
      ambulance,
    });
  } catch (error) {
    console.error('Error creating ambulance:', error);
    res.status(500).json({ error: 'Failed to create ambulance' });
  }
});

// Get all dispatches with filters
router.get('/dispatches', async (req, res) => {
  try {
    const { status, governorate, fromDate, toDate } = req.query;
    const { Dispatch } = await connectToDatabase();
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    const dispatches = await Dispatch.find(query)
      .populate('report')
      .populate('station')
      .populate('ambulance')
      .sort({ createdAt: -1 })
      .limit(100);

    // Filter by governorate if specified
    let filteredDispatches = dispatches;
    if (governorate) {
      filteredDispatches = dispatches.filter(d => 
        d.report.location.governorate === governorate
      );
    }

    res.json({ dispatches: filteredDispatches });
  } catch (error) {
    console.error('Error fetching dispatches:', error);
    res.status(500).json({ error: 'Failed to fetch dispatches' });
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const { Report, Dispatch, AmbulanceStation, Ambulance } = await connectToDatabase();
    
    // Total stats
    const totalReports = await Report.countDocuments();
    const totalStations = await AmbulanceStation.countDocuments();
    const totalAmbulances = await Ambulance.countDocuments();
    
    // Active dispatches
    const activeDispatches = await Dispatch.countDocuments({
      status: { $in: ['assigned', 'accepted', 'en_route', 'arrived'] },
    });
    
    // Available ambulances
    const availableAmbulances = await Ambulance.countDocuments({
      status: 'available',
    });
    
    // Reports by status
    const reportsByStatus = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    
    // Dispatches by status
    const dispatchesByStatus = await Dispatch.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    
    // Average response time (completed dispatches only)
    const completedDispatches = await Dispatch.find({
      status: 'completed',
      'timeline.arrived': { $exists: true },
      'timeline.dispatched': { $exists: true },
    }).limit(100);
    
    let avgResponseTime = 0;
    if (completedDispatches.length > 0) {
      const totalTime = completedDispatches.reduce((sum, dispatch) => {
        const responseTime = (dispatch.timeline.arrived - dispatch.timeline.dispatched) / (1000 * 60);
        return sum + responseTime;
      }, 0);
      avgResponseTime = Math.round(totalTime / completedDispatches.length);
    }
    
    // Stations by governorate
    const stationsByGovernorate = await AmbulanceStation.aggregate([
      { $group: { 
          _id: '$governorate', 
          count: { $sum: 1 },
          totalAmbulances: { $sum: '$totalAmbulances' },
          availableAmbulances: { $sum: '$availableAmbulances' },
        }
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      overview: {
        totalReports,
        totalStations,
        totalAmbulances,
        activeDispatches,
        availableAmbulances,
        avgResponseTimeMinutes: avgResponseTime,
      },
      reportsByStatus: reportsByStatus.reduce((obj, item) => {
        obj[item._id] = item.count;
        return obj;
      }, {}),
      dispatchesByStatus: dispatchesByStatus.reduce((obj, item) => {
        obj[item._id] = item.count;
        return obj;
      }, {}),
      stationsByGovernorate,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get real-time map data (all active dispatches with locations)
router.get('/map', async (req, res) => {
  try {
    const { Dispatch } = await connectToDatabase();
    
    const activeDispatches = await Dispatch.find({
      status: { $in: ['assigned', 'accepted', 'en_route', 'arrived'] },
    })
      .populate('report')
      .populate('station')
      .populate('ambulance');

    const mapData = activeDispatches.map(dispatch => ({
      dispatchId: dispatch._id,
      status: dispatch.status,
      incident: {
        location: dispatch.report.location,
        reportedAt: dispatch.report.createdAt,
      },
      station: {
        name: dispatch.station.name,
        location: dispatch.station.location,
      },
      ambulance: dispatch.ambulance ? {
        vehicleNumber: dispatch.ambulance.vehicleNumber,
        currentLocation: dispatch.ambulance.currentLocation,
      } : null,
      estimatedArrival: dispatch.estimatedArrival,
      distance: dispatch.distance,
    }));

    res.json({ activeDispatches: mapData });
  } catch (error) {
    console.error('Error fetching map data:', error);
    res.status(500).json({ error: 'Failed to fetch map data' });
  }
});

module.exports = router;
