import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LocationSelector.css';

function LocationSelector({ reportData, updateReportData, nextStep, prevStep }) {
  const [governorates, setGovernorates] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  // Load governorates on mount
  useEffect(() => {
    fetchGovernorates();
  }, []);

  const fetchGovernorates = async () => {
    try {
      const response = await axios.get('/api/governorates');
      if (response.data.success) {
        setGovernorates(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching governorates:', err);
      setError('Failed to load governorates');
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    setGettingLocation(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateReportData({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
        setGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Unable to get your location. Please enable location services.');
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Handle governorate selection
  const handleGovernorateChange = async (e) => {
    const governorateName = e.target.value;
    updateReportData({ governorate: governorateName, region: null });
    
    if (governorateName) {
      try {
        setLoading(true);
        const response = await axios.get(`/api/governorates/${governorateName}/regions`);
        if (response.data.success) {
          setRegions(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching regions:', err);
        setError('Failed to load regions');
        setLoading(false);
      }
    } else {
      setRegions([]);
    }
  };

  const handleRegionChange = (e) => {
    updateReportData({ region: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    updateReportData({ description: e.target.value });
  };

  const canProceed = reportData.location && reportData.governorate;

  return (
    <div className="location-selector">
      <h2 className="step-title">📍 Location Information</h2>
      <p className="step-description">
        Share your location and select your governorate and region.
      </p>

      {/* GPS Location */}
      <div className="form-group">
        <label>GPS Location</label>
        {!reportData.location ? (
          <button 
            className="btn btn-primary location-btn"
            onClick={getCurrentLocation}
            disabled={gettingLocation}
          >
            {gettingLocation ? (
              <>
                <span className="spinner-small"></span> Getting location...
              </>
            ) : (
              <>📍 Get My Location</>
            )}
          </button>
        ) : (
          <div className="location-display">
            <div className="location-info">
              <span className="location-icon">✓</span>
              <div className="location-coords">
                <div>Latitude: {reportData.location.latitude.toFixed(6)}</div>
                <div>Longitude: {reportData.location.longitude.toFixed(6)}</div>
              </div>
            </div>
            <button 
              className="btn btn-secondary btn-small"
              onClick={getCurrentLocation}
            >
              Update
            </button>
          </div>
        )}
      </div>

      {/* Governorate Selection */}
      <div className="form-group">
        <label htmlFor="governorate">Governorate *</label>
        <select
          id="governorate"
          className="form-control"
          value={reportData.governorate || ''}
          onChange={handleGovernorateChange}
        >
          <option value="">Select Governorate</option>
          {governorates.map((gov) => (
            <option key={gov.id} value={gov.name_en}>
              {gov.name_en} ({gov.name_ar})
            </option>
          ))}
        </select>
      </div>

      {/* Region Selection */}
      <div className="form-group">
        <label htmlFor="region">Region / City</label>
        <select
          id="region"
          className="form-control"
          value={reportData.region || ''}
          onChange={handleRegionChange}
          disabled={!reportData.governorate || loading}
        >
          <option value="">Select Region (Optional)</option>
          {regions.map((region, index) => (
            <option key={index} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">Incident Description (Optional)</label>
        <textarea
          id="description"
          className="form-control"
          rows="4"
          placeholder="Briefly describe the incident..."
          value={reportData.description || ''}
          onChange={handleDescriptionChange}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="button-group">
        <button className="btn btn-secondary" onClick={prevStep}>
          ← Back
        </button>
        <button 
          className="btn btn-primary" 
          onClick={nextStep}
          disabled={!canProceed}
        >
          Next: Review & Submit →
        </button>
      </div>
    </div>
  );
}

export default LocationSelector;
