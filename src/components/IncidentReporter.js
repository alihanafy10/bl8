import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import API_BASE_URL from '../config';
import './IncidentReporter.css';

const IncidentReporter = ({ onSubmitSuccess }) => {
  const [step, setStep] = useState(1); // 1: incident photo, 2: face verification, 3: review
  const [incidentPhoto, setIncidentPhoto] = useState(null);
  const [facePhoto, setFacePhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');
  const webcamRef = useRef(null);

  // Get user location on component mount
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (step === 1) {
      setIncidentPhoto(imageSrc);
      setStep(2);
    } else if (step === 2) {
      setFacePhoto(imageSrc);
      setStep(3);
    }
  };

  const retakePhoto = () => {
    if (step === 2) {
      setIncidentPhoto(null);
      setStep(1);
    } else if (step === 3) {
      setFacePhoto(null);
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!incidentPhoto || !facePhoto) {
      setError('Both photos are required');
      return;
    }

    if (!location) {
      setError('Location is required. Please enable location services and try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/reports`, {
        incidentPhoto,
        faceVerificationPhoto: facePhoto,
        location,
        notes,
      });

      if (response.data.success) {
        onSubmitSuccess(response.data);
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.error || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: step === 1 ? 'environment' : 'user', // Back camera for incident, front for face
  };

  return (
    <div className="incident-reporter">
      <div className="steps-indicator">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Incident Photo</span>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Face Verification</span>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Review & Submit</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {locationError && <div className="warning-message">{locationError}</div>}

      {step < 3 ? (
        <div className="camera-container">
          <h2>
            {step === 1 ? '📸 Capture Incident Photo' : '👤 Verify Your Identity'}
          </h2>
          <p className="instruction">
            {step === 1
              ? 'Take a clear photo of the incident scene'
              : 'Take a clear photo of your face for verification'}
          </p>

          <div className="webcam-wrapper">
            {step === 1 && !incidentPhoto && (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="webcam"
              />
            )}
            {step === 1 && incidentPhoto && (
              <img src={incidentPhoto} alt="Incident" className="captured-photo" />
            )}
            {step === 2 && !facePhoto && (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="webcam"
              />
            )}
            {step === 2 && facePhoto && (
              <img src={facePhoto} alt="Face verification" className="captured-photo" />
            )}
          </div>

          <div className="button-group">
            {((step === 1 && !incidentPhoto) || (step === 2 && !facePhoto)) && (
              <button className="btn btn-primary" onClick={capturePhoto}>
                📷 Capture Photo
              </button>
            )}
            {((step === 1 && incidentPhoto) || (step === 2 && facePhoto)) && (
              <>
                <button className="btn btn-secondary" onClick={retakePhoto}>
                  🔄 Retake
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setStep(step + 1)}
                >
                  ✓ Continue
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="review-container">
          <h2>📋 Review Your Report</h2>

          <div className="review-photos">
            <div className="review-photo-item">
              <h3>Incident Photo</h3>
              <img src={incidentPhoto} alt="Incident" />
              <button className="btn-small" onClick={() => setStep(1)}>
                Retake
              </button>
            </div>
            <div className="review-photo-item">
              <h3>Face Verification</h3>
              <img src={facePhoto} alt="Face" />
              <button className="btn-small" onClick={() => setStep(2)}>
                Retake
              </button>
            </div>
          </div>

          <div className="location-info">
            <h3>📍 Location Information</h3>
            {location ? (
              <div className="location-details">
                <p>
                  <strong>Coordinates:</strong> {location.latitude.toFixed(6)},{' '}
                  {location.longitude.toFixed(6)}
                </p>
                <p className="location-note">
                  Your governorate and district will be automatically detected
                </p>
              </div>
            ) : (
              <div className="location-error">
                <p>⚠️ Location not available</p>
                <button className="btn-small" onClick={getLocation}>
                  Retry Location
                </button>
              </div>
            )}
          </div>

          <div className="notes-section">
            <label htmlFor="notes">
              <h3>📝 Additional Notes (Optional)</h3>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide any additional details about the incident..."
              maxLength={500}
              rows={4}
            />
            <small>{notes.length}/500 characters</small>
          </div>

          <div className="button-group">
            <button
              className="btn btn-secondary"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              ← Start Over
            </button>
            <button
              className="btn btn-primary btn-submit"
              onClick={handleSubmit}
              disabled={loading || !location}
            >
              {loading ? '⏳ Submitting...' : '🚑 Submit Report'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentReporter;
