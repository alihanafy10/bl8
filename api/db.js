const mongoose = require('mongoose');

let cachedDb = null;
let Report = null;
let AmbulanceStation = null;
let Ambulance = null;
let Dispatch = null;

// Report Schema (Updated with dispatch tracking)
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
  dispatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dispatch',
    default: null,
  },
  dispatchStatus: {
    type: String,
    enum: ['pending', 'dispatched', 'en_route', 'arrived', 'completed'],
    default: 'pending',
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

// Ambulance Station Schema
const ambulanceStationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  governorate: { type: String, required: true, index: true },
  district: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  address: { type: String, required: true },
  contactPhone: { type: String, required: true },
  totalAmbulances: { type: Number, required: true, default: 0 },
  availableAmbulances: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Ambulance Schema
const ambulanceSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  station: { type: mongoose.Schema.Types.ObjectId, ref: 'AmbulanceStation', required: true },
  status: { 
    type: String, 
    enum: ['available', 'dispatched', 'en_route', 'at_scene', 'returning', 'out_of_service'],
    default: 'available'
  },
  driver: {
    name: String,
    phone: String,
  },
  currentDispatch: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', default: null },
}, { timestamps: true });

// Dispatch Schema
const dispatchSchema = new mongoose.Schema({
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
  station: { type: mongoose.Schema.Types.ObjectId, ref: 'AmbulanceStation', required: true },
  ambulance: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance', default: null },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'accepted', 'en_route', 'arrived', 'completed', 'cancelled'],
    default: 'pending'
  },
  timeline: {
    dispatched: { type: Date, default: Date.now },
    assigned: Date,
    accepted: Date,
    departed: Date,
    arrived: Date,
    completed: Date,
  },
  distance: { type: Number, default: 0 },
  estimatedArrival: { type: Number, default: 0 },
  driverNotes: String,
}, { timestamps: true });

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return { Report, AmbulanceStation, Ambulance, Dispatch };
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
    
    // Create or get models
    if (!Report) {
      Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
    }
    if (!AmbulanceStation) {
      AmbulanceStation = mongoose.models.AmbulanceStation || mongoose.model('AmbulanceStation', ambulanceStationSchema);
    }
    if (!Ambulance) {
      Ambulance = mongoose.models.Ambulance || mongoose.model('Ambulance', ambulanceSchema);
    }
    if (!Dispatch) {
      Dispatch = mongoose.models.Dispatch || mongoose.model('Dispatch', dispatchSchema);
    }

    console.log('MongoDB Connected');
    return { Report, AmbulanceStation, Ambulance, Dispatch };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };
