import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import './DriverInterface.css';

const DriverInterface = () => {
  const [ambulanceId, setAmbulanceId] = useState(localStorage.getItem('ambulanceId') || '');
  const [dispatch, setDispatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [driverNotes, setDriverNotes] = useState('');

  useEffect(() => {
    if (ambulanceId) {
      loadActiveDispatch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambulanceId]);

  const loadActiveDispatch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/driver/ambulance/${ambulanceId}/dispatches`);
      if (response.data.dispatches && response.data.dispatches.length > 0) {
        setDispatch(response.data.dispatches[0]);
      }
    } catch (err) {
      setError('Failed to load dispatch information');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAmbulanceId = () => {
    localStorage.setItem('ambulanceId', ambulanceId);
    loadActiveDispatch();
  };

  const handleAccept = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/driver/dispatch/${dispatch._id}/accept`);
      setError('');
      loadActiveDispatch();
      alert('Dispatch accepted! Prepare to depart.');
    } catch (err) {
      setError('Failed to accept dispatch');
    } finally {
      setLoading(false);
    }
  };

  const handleDepart = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/driver/dispatch/${dispatch._id}/depart`);
      setError('');
      loadActiveDispatch();
      alert('Departure confirmed. Drive safely!');
    } catch (err) {
      setError('Failed to update departure status');
    } finally {
      setLoading(false);
    }
  };

  const handleArrive = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/driver/dispatch/${dispatch._id}/arrive`, {
        driverNotes,
      });
      setError('');
      setDriverNotes('');
      loadActiveDispatch();
      alert('Arrival confirmed! Management has been notified.');
    } catch (err) {
      setError('Failed to confirm arrival');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!window.confirm('Mark this dispatch as completed?')) return;
    
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/driver/dispatch/${dispatch._id}/complete`, {
        driverNotes,
      });
      setError('');
      setDriverNotes('');
      setDispatch(null);
      alert('Dispatch completed successfully!');
    } catch (err) {
      setError('Failed to complete dispatch');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      assigned: '#ffc107',
      accepted: '#17a2b8',
      en_route: '#007bff',
      arrived: '#28a745',
    };
    return colors[status] || '#6c757d';
  };

  const getNextAction = () => {
    if (!dispatch) return null;
    
    switch (dispatch.status) {
      case 'assigned':
      case 'pending':
        return { label: 'Accept Dispatch', action: handleAccept, color: '#28a745' };
      case 'accepted':
        return { label: 'Depart to Scene', action: handleDepart, color: '#007bff' };
      case 'en_route':
        return { label: 'Arrived at Scene', action: handleArrive, color: '#ffc107' };
      case 'arrived':
        return { label: 'Complete Dispatch', action: handleComplete, color: '#dc3545' };
      default:
        return null;
    }
  };

  if (!ambulanceId || !localStorage.getItem('ambulanceId')) {
    return (
      <div className="driver-interface">
        <div className="login-container">
          <h2>🚑 Driver Login</h2>
          <p>Enter your ambulance ID to continue</p>
          <input
            type="text"
            value={ambulanceId}
            onChange={(e) => setAmbulanceId(e.target.value)}
            placeholder="Ambulance ID"
            className="input-field"
          />
          <button onClick={handleSaveAmbulanceId} className="btn btn-primary">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-interface">
      <div className="driver-header">
        <h1>🚑 Driver Interface</h1>
        <p>Ambulance ID: <strong>{ambulanceId}</strong></p>
        <button 
          onClick={() => {
            localStorage.removeItem('ambulanceId');
            setAmbulanceId('');
            setDispatch(null);
          }}
          className="btn btn-logout"
        >
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">Loading...</div>}

      {!loading && !dispatch && (
        <div className="no-dispatch">
          <h2>✅ No Active Dispatches</h2>
          <p>Waiting for emergency calls...</p>
          <button onClick={loadActiveDispatch} className="btn btn-secondary">
            Refresh
          </button>
        </div>
      )}

      {!loading && dispatch && (
        <div className="dispatch-details">
          <div className="status-badge" style={{ backgroundColor: getStatusColor(dispatch.status) }}>
            Status: {dispatch.status.toUpperCase().replace('_', ' ')}
          </div>

          <div className="dispatch-section">
            <h3>📍 Incident Location</h3>
            <p><strong>Governorate:</strong> {dispatch.report.location.governorate}</p>
            <p><strong>District:</strong> {dispatch.report.location.district}</p>
            <p><strong>Address:</strong> {dispatch.report.location.fullAddress || 'See coordinates'}</p>
            <p><strong>Coordinates:</strong> {dispatch.report.location.latitude}, {dispatch.report.location.longitude}</p>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${dispatch.report.location.latitude},${dispatch.report.location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-map"
            >
              🗺️ Open in Google Maps
            </a>
          </div>

          <div className="dispatch-section">
            <h3>📊 Dispatch Information</h3>
            <p><strong>Distance:</strong> {dispatch.distance} km</p>
            <p><strong>Estimated Arrival:</strong> {dispatch.estimatedArrival} minutes</p>
            <p><strong>Priority:</strong> {dispatch.priority.toUpperCase()}</p>
            <p><strong>Dispatched:</strong> {new Date(dispatch.timeline.dispatched).toLocaleString()}</p>
          </div>

          {dispatch.report.notes && (
            <div className="dispatch-section">
              <h3>📝 Reporter Notes</h3>
              <p>{dispatch.report.notes}</p>
            </div>
          )}

          <div className="dispatch-section">
            <h3>🏥 Station</h3>
            <p><strong>Name:</strong> {dispatch.station.name}</p>
            <p><strong>Phone:</strong> {dispatch.station.contactPhone}</p>
            <p><strong>Address:</strong> {dispatch.station.address}</p>
          </div>

          {(dispatch.status === 'en_route' || dispatch.status === 'arrived') && (
            <div className="dispatch-section">
              <h3>💬 Driver Notes</h3>
              <textarea
                value={driverNotes}
                onChange={(e) => setDriverNotes(e.target.value)}
                placeholder="Add any notes about the incident or patient condition..."
                rows={4}
                className="notes-input"
              />
            </div>
          )}

          <div className="timeline">
            <h3>⏱️ Timeline</h3>
            <div className="timeline-item">
              <span className="timeline-label">Dispatched:</span>
              <span>{new Date(dispatch.timeline.dispatched).toLocaleString()}</span>
            </div>
            {dispatch.timeline.accepted && (
              <div className="timeline-item completed">
                <span className="timeline-label">Accepted:</span>
                <span>{new Date(dispatch.timeline.accepted).toLocaleString()}</span>
              </div>
            )}
            {dispatch.timeline.departed && (
              <div className="timeline-item completed">
                <span className="timeline-label">Departed:</span>
                <span>{new Date(dispatch.timeline.departed).toLocaleString()}</span>
              </div>
            )}
            {dispatch.timeline.arrived && (
              <div className="timeline-item completed">
                <span className="timeline-label">Arrived:</span>
                <span>{new Date(dispatch.timeline.arrived).toLocaleString()}</span>
              </div>
            )}
          </div>

          {getNextAction() && (
            <div className="action-button">
              <button
                onClick={getNextAction().action}
                className="btn btn-action"
                style={{ backgroundColor: getNextAction().color }}
                disabled={loading}
              >
                {loading ? 'Processing...' : getNextAction().label}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverInterface;
