const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('./db');

// Get dispatch details for driver
router.get('/dispatch/:dispatchId', async (req, res) => {
  try {
    const { Dispatch } = await connectToDatabase();
    
    const dispatch = await Dispatch.findById(req.params.dispatchId)
      .populate('report')
      .populate('station')
      .populate('ambulance');

    if (!dispatch) {
      return res.status(404).json({ error: 'Dispatch not found' });
    }

    res.json({
      dispatch: {
        id: dispatch._id,
        status: dispatch.status,
        priority: dispatch.priority,
        distance: dispatch.distance,
        estimatedArrival: dispatch.estimatedArrival,
        timeline: dispatch.timeline,
        station: {
          name: dispatch.station.name,
          address: dispatch.station.address,
          phone: dispatch.station.contactPhone,
        },
        incident: {
          location: dispatch.report.location,
          notes: dispatch.report.notes,
          photos: {
            incident: dispatch.report.incidentPhoto,
            reporter: dispatch.report.faceVerificationPhoto,
          },
          reportedAt: dispatch.report.createdAt,
        },
        ambulance: dispatch.ambulance ? {
          vehicleNumber: dispatch.ambulance.vehicleNumber,
          driver: dispatch.ambulance.driver,
        } : null,
      },
    });
  } catch (error) {
    console.error('Error fetching dispatch:', error);
    res.status(500).json({ error: 'Failed to fetch dispatch details' });
  }
});

// Driver accepts dispatch
router.post('/dispatch/:dispatchId/accept', async (req, res) => {
  try {
    const { Dispatch, Ambulance, Report } = await connectToDatabase();
    
    const dispatch = await Dispatch.findById(req.params.dispatchId);
    
    if (!dispatch) {
      return res.status(404).json({ error: 'Dispatch not found' });
    }

    if (dispatch.status !== 'assigned' && dispatch.status !== 'pending') {
      return res.status(400).json({ error: 'Dispatch cannot be accepted in current state' });
    }

    // Update dispatch status
    dispatch.status = 'accepted';
    dispatch.timeline.accepted = new Date();
    await dispatch.save();

    // Update ambulance status
    if (dispatch.ambulance) {
      await Ambulance.findByIdAndUpdate(dispatch.ambulance, {
        status: 'dispatched',
      });
    }

    // Update report status
    await Report.findByIdAndUpdate(dispatch.report, {
      dispatchStatus: 'dispatched',
    });

    res.json({
      success: true,
      message: 'Dispatch accepted',
      dispatch: {
        id: dispatch._id,
        status: dispatch.status,
        timeline: dispatch.timeline,
      },
    });
  } catch (error) {
    console.error('Error accepting dispatch:', error);
    res.status(500).json({ error: 'Failed to accept dispatch' });
  }
});

// Driver departs for incident
router.post('/dispatch/:dispatchId/depart', async (req, res) => {
  try {
    const { Dispatch, Ambulance, Report } = await connectToDatabase();
    
    const dispatch = await Dispatch.findById(req.params.dispatchId);
    
    if (!dispatch) {
      return res.status(404).json({ error: 'Dispatch not found' });
    }

    // Update dispatch status
    dispatch.status = 'en_route';
    dispatch.timeline.departed = new Date();
    await dispatch.save();

    // Update ambulance status
    if (dispatch.ambulance) {
      await Ambulance.findByIdAndUpdate(dispatch.ambulance, {
        status: 'en_route',
      });
    }

    // Update report status
    await Report.findByIdAndUpdate(dispatch.report, {
      dispatchStatus: 'en_route',
    });

    res.json({
      success: true,
      message: 'Ambulance departed',
      dispatch: {
        id: dispatch._id,
        status: dispatch.status,
        timeline: dispatch.timeline,
      },
    });
  } catch (error) {
    console.error('Error updating departure:', error);
    res.status(500).json({ error: 'Failed to update departure status' });
  }
});

// Driver arrives at incident scene
router.post('/dispatch/:dispatchId/arrive', async (req, res) => {
  try {
    const { driverNotes } = req.body;
    const { Dispatch, Ambulance, Report } = await connectToDatabase();
    
    const dispatch = await Dispatch.findById(req.params.dispatchId);
    
    if (!dispatch) {
      return res.status(404).json({ error: 'Dispatch not found' });
    }

    // Update dispatch status
    dispatch.status = 'arrived';
    dispatch.timeline.arrived = new Date();
    if (driverNotes) {
      dispatch.driverNotes = driverNotes;
    }
    await dispatch.save();

    // Update ambulance status
    if (dispatch.ambulance) {
      await Ambulance.findByIdAndUpdate(dispatch.ambulance, {
        status: 'at_scene',
      });
    }

    // Update report status
    await Report.findByIdAndUpdate(dispatch.report, {
      dispatchStatus: 'arrived',
      status: 'completed',
    });

    res.json({
      success: true,
      message: 'Arrival confirmed - Management notified',
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

// Driver completes dispatch
router.post('/dispatch/:dispatchId/complete', async (req, res) => {
  try {
    const { driverNotes, patientTransported } = req.body;
    const { Dispatch, Ambulance, Report, AmbulanceStation } = await connectToDatabase();
    
    const dispatch = await Dispatch.findById(req.params.dispatchId)
      .populate('ambulance')
      .populate('station');
    
    if (!dispatch) {
      return res.status(404).json({ error: 'Dispatch not found' });
    }

    // Update dispatch status
    dispatch.status = 'completed';
    dispatch.timeline.completed = new Date();
    if (driverNotes) {
      dispatch.driverNotes = driverNotes;
    }
    await dispatch.save();

    // Update ambulance - return to available
    if (dispatch.ambulance) {
      await Ambulance.findByIdAndUpdate(dispatch.ambulance._id, {
        status: 'available',
        currentDispatch: null,
      });

      // Release ambulance back to station
      const station = await AmbulanceStation.findById(dispatch.station._id);
      if (station) {
        await station.releaseAmbulance();
      }
    }

    // Update report status
    await Report.findByIdAndUpdate(dispatch.report, {
      dispatchStatus: 'completed',
      status: 'completed',
    });

    res.json({
      success: true,
      message: 'Dispatch completed successfully',
      dispatch: {
        id: dispatch._id,
        status: dispatch.status,
        timeline: dispatch.timeline,
      },
    });
  } catch (error) {
    console.error('Error completing dispatch:', error);
    res.status(500).json({ error: 'Failed to complete dispatch' });
  }
});

// Get all active dispatches for a specific ambulance
router.get('/ambulance/:ambulanceId/dispatches', async (req, res) => {
  try {
    const { Dispatch } = await connectToDatabase();
    
    const dispatches = await Dispatch.find({
      ambulance: req.params.ambulanceId,
      status: { $in: ['assigned', 'accepted', 'en_route', 'arrived'] },
    })
      .populate('report')
      .populate('station')
      .sort({ createdAt: -1 });

    res.json({ dispatches });
  } catch (error) {
    console.error('Error fetching ambulance dispatches:', error);
    res.status(500).json({ error: 'Failed to fetch dispatches' });
  }
});

// Update ambulance location (for tracking)
router.post('/ambulance/:ambulanceId/location', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const { Ambulance } = await connectToDatabase();
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.ambulanceId,
      {
        currentLocation: {
          latitude,
          longitude,
          lastUpdated: new Date(),
        },
      },
      { new: true }
    );

    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    res.json({
      success: true,
      message: 'Location updated',
      location: ambulance.currentLocation,
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

module.exports = router;
