const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('./db');
const { verifyToken, verifyParamedic } = require('./auth');

// Get paramedic's current dispatch
router.get('/my-dispatch', verifyToken, verifyParamedic, async (req, res) => {
  try {
    const { Dispatch, Paramedic } = await connectToDatabase();
    
    // Get paramedic info
    const paramedic = await Paramedic.findById(req.user.id).populate('ambulance');
    
    if (!paramedic || !paramedic.ambulance) {
      return res.json({ dispatch: null, message: 'No ambulance assigned' });
    }

    // Find active dispatch for this paramedic/ambulance
    const dispatch = await Dispatch.findOne({
      $or: [
        { paramedic: paramedic._id },
        { ambulance: paramedic.ambulance._id }
      ],
      status: { $in: ['pending', 'dispatched'] },
    })
      .populate('report')
      .populate('station')
      .populate('ambulance')
      .sort({ createdAt: -1 });

    if (!dispatch) {
      return res.json({ dispatch: null, message: 'No active dispatch' });
    }

    res.json({
      dispatch: {
        id: dispatch._id,
        status: dispatch.status,
        distance: dispatch.distance,
        estimatedArrival: dispatch.estimatedArrival,
        timeline: dispatch.timeline,
        incident: {
          location: dispatch.report.location,
          notes: dispatch.report.notes,
          reportedAt: dispatch.report.createdAt,
        },
        station: {
          name: dispatch.station.name,
          phone: dispatch.station.contactPhone,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching dispatch:', error);
    res.status(500).json({ error: 'Failed to fetch dispatch' });
  }
});

// Update paramedic location
router.post('/update-location', verifyToken, verifyParamedic, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const { Paramedic } = await connectToDatabase();
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const paramedic = await Paramedic.findByIdAndUpdate(
      req.user.id,
      {
        currentLocation: {
          latitude,
          longitude,
          lastUpdated: new Date(),
        },
      },
      { new: true }
    );

    if (!paramedic) {
      return res.status(404).json({ error: 'Paramedic not found' });
    }

    res.json({
      success: true,
      message: 'Location updated',
      location: paramedic.currentLocation,
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Mark arrival at incident scene
router.post('/arrived', verifyToken, verifyParamedic, async (req, res) => {
  try {
    const { dispatchId, notes } = req.body;
    const { Dispatch, Report, Paramedic } = await connectToDatabase();
    
    if (!dispatchId) {
      return res.status(400).json({ error: 'Dispatch ID required' });
    }

    const dispatch = await Dispatch.findById(dispatchId);
    
    if (!dispatch) {
      return res.status(404).json({ error: 'Dispatch not found' });
    }

    // Verify this dispatch belongs to the paramedic
    const paramedic = await Paramedic.findById(req.user.id);
    if (dispatch.paramedic?.toString() !== req.user.id && 
        dispatch.ambulance?.toString() !== paramedic.ambulance?.toString()) {
      return res.status(403).json({ error: 'Unauthorized to update this dispatch' });
    }

    // Update dispatch
    dispatch.status = 'arrived';
    dispatch.timeline.arrived = new Date();
    if (notes) {
      dispatch.paramedicNotes = notes;
    }
    await dispatch.save();

    // Update report
    await Report.findByIdAndUpdate(dispatch.report, {
      dispatchStatus: 'arrived',
      status: 'completed',
    });

    res.json({
      success: true,
      message: 'Arrival confirmed - Admin notified',
      dispatch: {
        id: dispatch._id,
        status: dispatch.status,
        timeline: dispatch.timeline,
      },
    });
  } catch (error) {
    console.error('Error confirming arrival:', error);
    res.status(500).json({ error: 'Failed to confirm arrival' });
  }
});

// Get paramedic profile
router.get('/profile', verifyToken, verifyParamedic, async (req, res) => {
  try {
    const { Paramedic } = await connectToDatabase();
    
    const paramedic = await Paramedic.findById(req.user.id)
      .populate('ambulance')
      .populate('station')
      .select('-password');

    if (!paramedic) {
      return res.status(404).json({ error: 'Paramedic not found' });
    }

    res.json({ paramedic });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;
