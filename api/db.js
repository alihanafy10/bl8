const mongoose = require('mongoose');

let cachedDb = null;
let Report = null;

// Report Schema
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

reportSchema.index({ 'location.governorate': 1, 'location.district': 1 });
reportSchema.index({ createdAt: -1 });

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return { Report };
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable');
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cachedDb = connection;
    
    // Create or get model
    if (!Report) {
      Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
    }

    console.log('MongoDB Connected');
    return { Report };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };
