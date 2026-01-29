import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LocationForm.css';

function LocationForm({ data, updateData, nextStep, prevStep }) {
  const [governorates, setGovernorates] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/governorates')
      .then(res => setGovernorates(res.data.data || []))
      .catch(err => console.error(err));
  }, []);

  const getLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateData({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
        setLoading(false);
      },
      (error) => {
        console.error(error);
        alert('Unable to get location. Please enable location services.');
        setLoading(false);
      }
    );
  };

  const handleGovernorateChange = (e) => {
    const gov = e.target.value;
    updateData({ governorate: gov, region: null });
    
    if (gov) {
      axios.get(`/api/governorates/${gov}/regions`)
        .then(res => setRegions(res.data.data || []))
        .catch(err => console.error(err));
    } else {
      setRegions([]);
    }
  };

  const canProceed = data.location && data.governorate;

  return (
    <div className="location-form">
      <h2>📍 Location Information</h2>
      <p>Share your location and select your governorate.</p>

      <div className="form-group">
        <label>GPS Location</label>
        {!data.location ? (
          <button className="btn btn-location" onClick={getLocation} disabled={loading}>
            {loading ? 'Getting location...' : '📍 Get My Location'}
          </button>
        ) : (
          <div className="location-display">
            <span>✓ Location captured</span>
            <p>Lat: {data.location.latitude.toFixed(6)}, Lon: {data.location.longitude.toFixed(6)}</p>
            <button className="btn-link" onClick={getLocation}>Update</button>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Governorate *</label>
        <select
          value={data.governorate || ''}
          onChange={handleGovernorateChange}
          className="form-control"
        >
          <option value="">Select Governorate</option>
          {governorates.map(gov => (
            <option key={gov.id} value={gov.name_en}>
              {gov.name_en} ({gov.name_ar})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Region / City</label>
        <select
          value={data.region || ''}
          onChange={(e) => updateData({ region: e.target.value })}
          className="form-control"
          disabled={!data.governorate}
        >
          <option value="">Select Region (Optional)</option>
          {regions.map((region, idx) => (
            <option key={idx} value={region}>{region}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Incident Description (Optional)</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => updateData({ description: e.target.value })}
          className="form-control"
          rows="4"
          placeholder="Briefly describe the incident..."
        />
      </div>

      <div className="buttons">
        <button className="btn btn-secondary" onClick={prevStep}>
          ← Back
        </button>
        <button className="btn btn-next" onClick={nextStep} disabled={!canProceed}>
          Next: Review & Submit →
        </button>
      </div>
    </div>
  );
}

export default LocationForm;
