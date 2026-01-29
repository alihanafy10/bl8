/**
 * Smart Dispatch Service
 * Finds the nearest ambulance station with available ambulances
 */

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Estimate arrival time based on distance (average speed 60 km/h in emergencies)
function estimateArrivalTime(distanceKm) {
  const averageSpeedKmh = 60;
  const timeHours = distanceKm / averageSpeedKmh;
  const timeMinutes = Math.ceil(timeHours * 60);
  return timeMinutes;
}

/**
 * Find the best ambulance station for dispatch
 * Priority: Same governorate > Has available ambulances > Nearest distance
 */
async function findBestStation(reportLocation, governorate, AmbulanceStation) {
  try {
    // Step 1: Try to find stations in the same governorate with available ambulances
    let stations = await AmbulanceStation.find({
      governorate: governorate,
      isActive: true,
      availableAmbulances: { $gt: 0 },
    });

    // Step 2: If no stations in same governorate, search all active stations
    if (stations.length === 0) {
      console.log(`No available ambulances in ${governorate}, searching other governorates...`);
      stations = await AmbulanceStation.find({
        isActive: true,
        availableAmbulances: { $gt: 0 },
      });
    }

    if (stations.length === 0) {
      throw new Error('No ambulance stations with available ambulances found');
    }

    // Step 3: Calculate distances and find nearest
    const stationsWithDistance = stations.map(station => {
      const distance = calculateDistance(
        reportLocation.latitude,
        reportLocation.longitude,
        station.location.latitude,
        station.location.longitude
      );

      return {
        station,
        distance,
        estimatedArrival: estimateArrivalTime(distance),
      };
    });

    // Sort by distance (nearest first)
    stationsWithDistance.sort((a, b) => a.distance - b.distance);

    return stationsWithDistance[0];
  } catch (error) {
    console.error('Error finding best station:', error);
    throw error;
  }
}

/**
 * Create a dispatch and assign to station
 */
async function createDispatch(report, Dispatch, AmbulanceStation, Ambulance, Paramedic) {
  try {
    // Find best station
    const bestMatch = await findBestStation(
      report.location,
      report.location.governorate,
      AmbulanceStation
    );

    if (!bestMatch) {
      throw new Error('No suitable ambulance station found');
    }

    const { station, distance, estimatedArrival } = bestMatch;

    // Reserve an ambulance from the station
    const reserved = await station.reserveAmbulance();
    if (!reserved) {
      throw new Error('Failed to reserve ambulance');
    }

    // Find an available ambulance at the station
    const ambulance = await Ambulance.findOne({
      station: station._id,
      status: 'available',
    });

    // Find paramedic assigned to this ambulance
    let paramedic = null;
    if (ambulance && Paramedic) {
      paramedic = await Paramedic.findOne({
        ambulance: ambulance._id,
        isActive: true,
      });
    }

    // Create dispatch record
    const dispatch = new Dispatch({
      report: report._id,
      station: station._id,
      ambulance: ambulance ? ambulance._id : null,
      paramedic: paramedic ? paramedic._id : null,
      status: ambulance ? 'dispatched' : 'pending',
      priority: 'high',
      distance: distance.toFixed(2),
      estimatedArrival: estimatedArrival,
      timeline: {
        dispatched: new Date(),
      },
    });

    await dispatch.save();

    // Update ambulance status if assigned
    if (ambulance) {
      ambulance.status = 'dispatched';
      ambulance.currentDispatch = report._id;
      await ambulance.save();
    }

    // Update report with dispatch info
    report.dispatch = dispatch._id;
    report.dispatchStatus = 'dispatched';
    report.ambulanceNotified = true;
    report.status = 'dispatched';
    await report.save();

    return {
      success: true,
      dispatch,
      station: {
        name: station.name,
        address: station.address,
        phone: station.contactPhone,
        governorate: station.governorate,
      },
      ambulance: ambulance ? {
        vehicleNumber: ambulance.vehicleNumber,
        driver: ambulance.driver,
      } : null,
      distance: distance.toFixed(2),
      estimatedArrival,
    };
  } catch (error) {
    console.error('Error creating dispatch:', error);
    throw error;
  }
}

module.exports = {
  findBestStation,
  createDispatch,
  calculateDistance,
  estimateArrivalTime,
};
