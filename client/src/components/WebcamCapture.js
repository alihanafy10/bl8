import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import './CameraCapture.css';

function WebcamCapture({ reportData, updateReportData, nextStep }) {
  const [currentCapture, setCurrentCapture] = useState('incident');
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState('');
  const webcamRef = useRef(null);

  const videoConstraints = {
    facingMode: currentCapture === 'face' ? 'user' : { exact: 'environment' }
  };

  const videoConstraintsFallback = {
    facingMode: 'user'
  };

  const [constraints, setConstraints] = useState(videoConstraints);

  const startCamera = () => {
    setError('');
    setShowCamera(true);
    setConstraints(videoConstraints);
  };

  const stopCamera = () => {
    setShowCamera(false);
  };

  const handleUserMediaError = useCallback((error) => {
    console.log('Camera error:', error);
    // If rear camera fails, try front camera
    if (currentCapture === 'incident' && error.name === 'OverconstrainedError') {
      console.log('Rear camera not available, using front camera');
      setConstraints(videoConstraintsFallback);
    } else {
      setError('Camera not available. Please check permissions.');
    }
  }, [currentCapture, videoConstraintsFallback]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `${currentCapture}-photo.jpg`, { type: 'image/jpeg' });
          
          if (currentCapture === 'incident') {
            updateReportData({ incidentPhoto: file });
            setCurrentCapture('face');
            setShowCamera(false);
          } else {
            updateReportData({ facePhoto: file });
            setShowCamera(false);
          }
          setError('');
        })
        .catch(err => {
          console.error('Error creating file:', err);
          setError('Failed to capture photo. Please try again.');
        });
    }
  }, [webcamRef, currentCapture, updateReportData]);

  const retakePhoto = (type) => {
    if (type === 'incident') {
      updateReportData({ incidentPhoto: null });
      setCurrentCapture('incident');
    } else {
      updateReportData({ facePhoto: null });
      setCurrentCapture('face');
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
              {currentCapture === 'incident' && showCamera ? (
                <div className="camera-view">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={constraints}
                    onUserMediaError={handleUserMediaError}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div className="camera-controls">
                    <button className="btn btn-primary" onClick={capture}>
                      📷 Capture Incident
                    </button>
                    <button className="btn btn-secondary" onClick={stopCamera}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="start-camera">
                  <div className="placeholder-icon">🏥</div>
                  <button className="btn btn-primary" onClick={startCamera}>
                    Start Camera
                  </button>
                </div>
              )}
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
              {currentCapture === 'face' && showCamera ? (
                <div className="camera-view">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: 'user' }}
                    onUserMediaError={handleUserMediaError}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div className="camera-controls">
                    <button className="btn btn-primary" onClick={capture}>
                      📷 Capture Face
                    </button>
                    <button className="btn btn-secondary" onClick={stopCamera}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="start-camera">
                  <div className="placeholder-icon">👤</div>
                  {reportData.incidentPhoto ? (
                    <button className="btn btn-primary" onClick={startCamera}>
                      Start Camera
                    </button>
                  ) : (
                    <p className="disabled-text">Capture incident photo first</p>
                  )}
                </div>
              )}
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

export default WebcamCapture;
