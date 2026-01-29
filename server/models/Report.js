const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  incidentPhoto: {
    type: String,
    required: true,
  },
  faceVerificationPhoto: {
    type: String,
    required: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    governorate: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    fullAddress: {
      type: String,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'dispatched', 'completed', 'cancelled'],
    default: 'pending',
  },
  ambulanceNotified: {
    type: Boolean,
    default: false,
  },
  ambulanceResponse: {
    type: Object,
    default: null,
  },
  reporterInfo: {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: String,
    userAgent: String,
  },
  notes: {
    type: String,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Index for location queries
reportSchema.index({ 'location.governorate': 1, 'location.district': 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
