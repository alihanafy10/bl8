const axios = require('axios');

async function notifyAmbulanceService(report) {
  const ambulanceApiUrl = process.env.AMBULANCE_API_URL;
  const ambulanceApiKey = process.env.AMBULANCE_API_KEY;

  if (!ambulanceApiUrl) {
    console.warn('AMBULANCE_API_URL not configured. Skipping ambulance notification.');
    return { notified: false, reason: 'API not configured' };
  }

  try {
    const payload = {
      reportId: report._id,
      location: {
        latitude: report.location.latitude,
        longitude: report.location.longitude,
        governorate: report.location.governorate,
        district: report.location.district,
        address: report.location.fullAddress,
      },
      timestamp: report.createdAt,
      priority: 'high',
      notes: report.notes,
    };

    const response = await axios.post(ambulanceApiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        ...(ambulanceApiKey && { 'Authorization': `Bearer ${ambulanceApiKey}` }),
      },
      timeout: 10000,
    });

    return {
      notified: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to notify ambulance service:', error.message);
    throw new Error(`Ambulance notification failed: ${error.message}`);
  }
}

module.exports = { notifyAmbulanceService };
