import React, { useState } from 'react';
import './CameraCapture.css';

function SimpleCameraCapture({ reportData, updateReportData, nextStep }) {
  const [error, setError] = useState('');

  // Handle file input for incident photo
  const handleIncidentPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateReportData({ incidentPhoto: file });
      setError('');
    }
  };

  // Handle file input for face photo
  const handleFacePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateReportData({ facePhoto: file });
      setError('');
    }
  };

  // Retake photo
  const retakePhoto = (type) => {
    if (type === 'incident') {
      updateReportData({ incidentPhoto: null });
    } else {
      updateReportData({ facePhoto: null });
    }
  };

  const canProceed = reportData.incidentPhoto && reportData.facePhoto;

  return (
    <div className="camera-capture">
      <h2 className="step-title">📸 Capture Photos</h2>
      <p className="step-description">
        Take a photo of the incident and a selfie for verification.
      </p>

      <div className="capture-container">
        {/* Incident Photo */}
        <div className="capture-section">
          <h3>1. Incident Photo</h3>
          {!reportData.incidentPhoto ? (
            <div className="photo-placeholder">
              <div className="start-camera">
                <div className="placeholder-icon">🏥</div>
                <label htmlFor="incident-photo-input" className="btn btn-primary" style={{ cursor: 'pointer' }}>
                  📷 Take Photo
                </label>
                <input
                  id="incident-photo-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleIncidentPhotoChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          ) : (
            <div className="photo-preview">
              <img src={URL.createObjectURL(reportData.incidentPhoto)} alt="Incident" />
              <button className="btn btn-secondary" onClick={() => retakePhoto('incident')}>
                Retake
              </button>
            </div>
          )}
        </div>

        {/* Face Photo */}
        <div className="capture-section">
          <h3>2. Your Face (Verification)</h3>
          {!reportData.facePhoto ? (
            <div className="photo-placeholder">
              <div className="start-camera">
                <div className="placeholder-icon">👤</div>
                {reportData.incidentPhoto ? (
                  <>
                    <label htmlFor="face-photo-input" className="btn btn-primary" style={{ cursor: 'pointer' }}>
                      📷 Take Selfie
                    </label>
                    <input
                      id="face-photo-input"
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={handleFacePhotoChange}
                      style={{ display: 'none' }}
                    />
                  </>
                ) : (
                  <p className="disabled-text">Capture incident photo first</p>
                )}
              </div>
            </div>
          ) : (
            <div className="photo-preview">
              <img src={URL.createObjectURL(reportData.facePhoto)} alt="Face verification" />
              <button className="btn btn-secondary" onClick={() => retakePhoto('face')}>
                Retake
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="button-group">
        <button 
          className="btn btn-primary" 
          onClick={nextStep}
          disabled={!canProceed}
        >
          Next: Location →
        </button>
      </div>
    </div>
  );
}

export default SimpleCameraCapture;
