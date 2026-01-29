const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
  },
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AmbulanceStation',
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'dispatched', 'en_route', 'at_scene', 'returning', 'out_of_service'],
    default: 'available',
    index: true,
  },
  driver: {
    name: String,
    phone: String,
    licenseNumber: String,
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date,
  },
  currentDispatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    default: null,
  },
  equipment: [{
    name: String,
    quantity: Number,
  }],
}, {
  timestamps: true,
});

// Index for quick status queries
ambulanceSchema.index({ status: 1, station: 1 });

module.exports = mongoose.model('Ambulance', ambulanceSchema);
