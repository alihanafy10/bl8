import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import './CameraCapture.css';

function CameraCapture({ reportData, updateReportData, nextStep }) {
  const [currentCapture, setCurrentCapture] = useState('incident'); // 'incident' or 'face'
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState('');

  const videoRef = useRef(null);

  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = process.env.PUBLIC_URL + '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setIsModelLoaded(true);
      } catch (err) {
        console.error('Error loading face detection models:', err);
        setIsModelLoaded(true); // Continue anyway, face detection will be disabled
      }
    };
    loadModels();
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: currentCapture === 'face' ? 'user' : 'environment' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Detect face in video
  const detectFace = async () => {
    if (!videoRef.current || !isModelLoaded) return false;

    try {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );
      
      return detections.length > 0;
    } catch (err) {
      console.error('Face detection error:', err);
      return true; // Allow capture even if detection fails
    }
  };

  // Capture photo
  const capturePhoto = async () => {
    if (!videoRef.current) return;

    setError('');
    setDetectionStatus('');

    // If capturing face, check for face detection
    if (currentCapture === 'face') {
      setDetectionStatus('Detecting face...');
      const faceDetected = await detectFace();
      
      if (!faceDetected) {
        setError('No face detected. Please position your face in the frame.');
        setDetectionStatus('');
        return;
      }
      setDetectionStatus('Face detected! ✓');
    }

    // Create canvas and capture image
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `${currentCapture}-photo.jpg`, { type: 'image/jpeg' });
        
        if (currentCapture === 'incident') {
          updateReportData({ incidentPhoto: file });
          setCurrentCapture('face');
          stopCamera();
          setDetectionStatus('');
        } else {
          updateReportData({ facePhoto: file });
          stopCamera();
        }
      }
    }, 'image/jpeg', 0.9);
  };

  // Retake photo
  const retakePhoto = (type) => {
    if (type === 'incident') {
      updateReportData({ incidentPhoto: null });
      setCurrentCapture('incident');
    } else {
      updateReportData({ facePhoto: null });
      setCurrentCapture('face');
    }
    stopCamera();
    setDetectionStatus('');
  };

  const canProceed = reportData.incidentPhoto && reportData.facePhoto;

  return (
    <div className="camera-capture">
      <h2 className="step-title">📸 Capture Photos</h2>
      <p className="step-description">
        First, photograph the incident. Then, take a selfie to verify your identity.
      </p>

      <div className="capture-container">
        {/* Incident Photo */}
        <div className="capture-section">
          <h3>1. Incident Photo</h3>
          {!reportData.incidentPhoto ? (
            <div className="photo-placeholder">
              {currentCapture === 'incident' && isCameraActive ? (
                <div className="camera-view">
                  <video ref={videoRef} autoPlay playsInline />
                  <div className="camera-controls">
                    <button className="btn btn-primary" onClick={capturePhoto}>
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
              {currentCapture === 'face' && isCameraActive ? (
                <div className="camera-view">
                  <video ref={videoRef} autoPlay playsInline />
                  {detectionStatus && (
                    <div className="detection-status">{detectionStatus}</div>
                  )}
                  <div className="camera-controls">
                    <button className="btn btn-primary" onClick={capturePhoto}>
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

export default CameraCapture;
