const axios = require('axios');

/**
 * Reverse geocode coordinates to get address details
 * Uses OpenCage Geocoding API (free tier available)
 * Alternative: Google Maps Geocoding API
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} - Address details including governorate and district
 */
async function reverseGeocode(latitude, longitude) {
  const apiKey = process.env.GEOCODING_API_KEY;

  if (!apiKey) {
    console.warn('GEOCODING_API_KEY not configured. Using provided location data.');
    return null;
  }

  try {
    // Using OpenCage Geocoding API
    const url = `https://api.opencagedata.com/geocode/v1/json`;
    const response = await axios.get(url, {
      params: {
        q: `${latitude},${longitude}`,
        key: apiKey,
        language: 'en',
      },
      timeout: 5000,
    });

    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      const components = result.components;

      return {
        governorate: components.state || components.province || components.region || 'Unknown',
        district: components.county || components.city || components.town || components.village || 'Unknown',
        fullAddress: result.formatted,
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw error;
  }
}

/**
 * Alternative: Google Maps Geocoding API
 * Uncomment this if you prefer Google Maps
 */
/*
async function reverseGeocodeGoogle(latitude, longitude) {
  const apiKey = process.env.GEOCODING_API_KEY;
  
  if (!apiKey) {
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json`;
    const response = await axios.get(url, {
      params: {
        latlng: `${latitude},${longitude}`,
        key: apiKey,
      },
      timeout: 5000,
    });

    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      const components = result.address_components;

      const getComponent = (types) => {
        const component = components.find(c => 
          types.some(type => c.types.includes(type))
        );
        return component ? component.long_name : 'Unknown';
      };

      return {
        governorate: getComponent(['administrative_area_level_1']),
        district: getComponent(['administrative_area_level_2', 'locality']),
        fullAddress: result.formatted_address,
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw error;
  }
}
*/

module.exports = { reverseGeocode };
