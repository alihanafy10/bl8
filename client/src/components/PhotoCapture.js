import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import './PhotoCapture.css';

function PhotoCapture({ data, updateData, nextStep }) {
  const [showCamera, setShowCamera] = useState(false);
  const [currentType, setCurrentType] = useState('incident'); // 'incident' or 'face'
  const [error, setError] = useState('');
  const webcamRef = useRef(null);

  const startCamera = (type) => {
    setCurrentType(type);
    setShowCamera(true);
    setError('');
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Convert base64 to blob and then to File
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], `${currentType}.jpg`, { type: 'image/jpeg' });
            
            if (currentType === 'incident') {
              updateData({ incidentPhoto: file });
            } else {
              updateData({ facePhoto: file });
            }
            
            setShowCamera(false);
            setError('');
          });
      }
    }
  };

  const retake = (type) => {
    if (type === 'incident') {
      updateData({ incidentPhoto: null });
    } else {
      updateData({ facePhoto: null });
    }
  };

  const videoConstraints = currentType === 'face' 
    ? { facingMode: 'user' }
    : { facingMode: { ideal: 'environment' } };

  const canProceed = data.incidentPhoto && data.facePhoto;

  return (
    <div className="photo-capture">
      <h2>📸 Capture Photos</h2>
      <p>Take a photo of the incident and a selfie for verification.</p>

      <div className="photos-grid">
        {/* Incident Photo */}
        <div className="photo-box">
          <h3>1. Incident Photo</h3>
          {!data.incidentPhoto ? (
            showCamera && currentType === 'incident' ? (
              <div className="camera-container">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="webcam"
                />
                <div className="camera-buttons">
                  <button className="btn btn-capture" onClick={capturePhoto}>
                    📷 Capture
                  </button>
                  <button className="btn btn-cancel" onClick={() => setShowCamera(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="placeholder">
                <div className="icon">🏥</div>
                <button className="btn btn-primary" onClick={() => startCamera('incident')}>
                  Start Camera
                </button>
              </div>
            )
          ) : (
            <div className="preview">
              <img src={URL.createObjectURL(data.incidentPhoto)} alt="Incident" />
              <button className="btn btn-small" onClick={() => retake('incident')}>
                Retake
              </button>
            </div>
          )}
        </div>

        {/* Face Photo */}
        <div className="photo-box">
          <h3>2. Face Photo (Selfie)</h3>
          {!data.facePhoto ? (
            showCamera && currentType === 'face' ? (
              <div className="camera-container">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="webcam"
                />
                <div className="camera-buttons">
                  <button className="btn btn-capture" onClick={capturePhoto}>
                    📷 Capture
                  </button>
                  <button className="btn btn-cancel" onClick={() => setShowCamera(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="placeholder">
                <div className="icon">👤</div>
                {data.incidentPhoto ? (
                  <button className="btn btn-primary" onClick={() => startCamera('face')}>
                    Start Camera
                  </button>
                ) : (
                  <p className="disabled">Capture incident photo first</p>
                )}
              </div>
            )
          ) : (
            <div className="preview">
              <img src={URL.createObjectURL(data.facePhoto)} alt="Face" />
              <button className="btn btn-small" onClick={() => retake('face')}>
                Retake
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="buttons">
        <button className="btn btn-next" onClick={nextStep} disabled={!canProceed}>
          Next: Location →
        </button>
      </div>
    </div>
  );
}

export default PhotoCapture;
