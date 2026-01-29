const axios = require('axios');

async function reverseGeocode(latitude, longitude) {
  const apiKey = process.env.GEOCODING_API_KEY;

  if (!apiKey) {
    console.warn('GEOCODING_API_KEY not configured. Using provided location data.');
    return null;
  }

  try {
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

module.exports = { reverseGeocode };
