const mongoose = require('mongoose');

const ambulanceStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  governorate: {
    type: String,
    required: true,
    index: true,
  },
  district: {
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
  },
  address: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  totalAmbulances: {
    type: Number,
    required: true,
    default: 0,
  },
  availableAmbulances: {
    type: Number,
    required: true,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  operatingHours: {
    opens: {
      type: String,
      default: '00:00',
    },
    closes: {
      type: String,
      default: '23:59',
    },
  },
}, {
  timestamps: true,
});

// Index for geospatial queries
ambulanceStationSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

// Method to check if station has available ambulances
ambulanceStationSchema.methods.hasAvailableAmbulances = function() {
  return this.availableAmbulances > 0 && this.isActive;
};

// Method to reserve an ambulance
ambulanceStationSchema.methods.reserveAmbulance = async function() {
  if (this.availableAmbulances > 0) {
    this.availableAmbulances -= 1;
    await this.save();
    return true;
  }
  return false;
};

// Method to release an ambulance
ambulanceStationSchema.methods.releaseAmbulance = async function() {
  if (this.availableAmbulances < this.totalAmbulances) {
    this.availableAmbulances += 1;
    await this.save();
    return true;
  }
  return false;
};

module.exports = mongoose.model('AmbulanceStation', ambulanceStationSchema);
