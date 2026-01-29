const mongoose = require('mongoose');

let cachedDb = null;
let Report = null;
let AmbulanceStation = null;
let Ambulance = null;
let Dispatch = null;
let Admin = null;
let Paramedic = null;

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
  paramedic: { type: mongoose.Schema.Types.ObjectId, ref: 'Paramedic', default: null },
  status: {
    type: String,
    enum: ['pending', 'dispatched', 'arrived', 'completed', 'cancelled'],
    default: 'pending'
  },
  timeline: {
    dispatched: { type: Date, default: Date.now },
    arrived: Date,
    completed: Date,
  },
  distance: { type: Number, default: 0 },
  estimatedArrival: { type: Number, default: 0 },
  paramedicNotes: String,
}, { timestamps: true });

// Admin Schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin', enum: ['admin', 'super_admin'] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Paramedic Schema
const paramedicSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  ambulance: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance', default: null },
  station: { type: mongoose.Schema.Types.ObjectId, ref: 'AmbulanceStation', default: null },
  isActive: { type: Boolean, default: true },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date,
  },
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
    if (!Admin) {
      Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
    }
    if (!Paramedic) {
      Paramedic = mongoose.models.Paramedic || mongoose.model('Paramedic', paramedicSchema);
    }

    console.log('MongoDB Connected');
    return { Report, AmbulanceStation, Ambulance, Dispatch, Admin, Paramedic };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };
