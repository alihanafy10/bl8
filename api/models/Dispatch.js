const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true,
  },
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AmbulanceStation',
    required: true,
  },
  ambulance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambulance',
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'accepted', 'en_route', 'arrived', 'completed', 'cancelled'],
    default: 'pending',
    index: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high',
  },
  timeline: {
    dispatched: {
      type: Date,
      default: Date.now,
    },
    assigned: Date,
    accepted: Date,
    departed: Date,
    arrived: Date,
    completed: Date,
  },
  distance: {
    type: Number, // in kilometers
    default: 0,
  },
  estimatedArrival: {
    type: Number, // in minutes
    default: 0,
  },
  driverNotes: {
    type: String,
    maxlength: 1000,
  },
  dispatchNotes: {
    type: String,
    maxlength: 1000,
  },
}, {
  timestamps: true,
});

// Index for quick status and report queries
dispatchSchema.index({ status: 1, createdAt: -1 });
dispatchSchema.index({ report: 1 });

module.exports = mongoose.model('Dispatch', dispatchSchema);
