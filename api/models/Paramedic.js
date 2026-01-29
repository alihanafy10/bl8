const mongoose = require('mongoose');

const paramedicSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  ambulance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambulance',
    default: null,
  },
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AmbulanceStation',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date,
  },
}, {
  timestamps: true,
});

module.exports = paramedicSchema;
