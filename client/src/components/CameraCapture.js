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
      
      // Try with preferred camera first
      let constraints = {
        video: { facingMode: currentCapture === 'face' ? 'user' : 'environment' },
        audio: false
      };
      
      let mediaStream;
      
      try {
        // Try preferred camera (rear for incident, front for face)
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (firstError) {
        console.log('Preferred camera not available, trying any camera...', firstError);
        
        // Fallback: try any available camera
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        } catch (secondError) {
          // Last resort: try front camera explicitly
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
          });
        }
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
            setError('Camera started but video preview failed. Try refreshing the page.');
          });
        };
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      
      // Provide specific error messages
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access in your browser settings and refresh the page.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please ensure your device has a camera connected.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is in use by another application. Please close other apps using the camera.');
      } else {
        setError('Unable to access camera: ' + err.message);
      }
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
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    console.log('Capture photo clicked');
    
    if (!videoRef.current) {
      console.error('Video ref not available');
      setError('Camera not ready. Please try again.');
      return;
    }

    // Check if video is actually playing
    if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      console.error('Video not ready yet');
      setError('Camera is loading. Please wait a moment and try again.');
      return;
    }

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

    try {
      // Create canvas and capture image
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      // Ensure we have valid dimensions
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          console.log('Photo captured successfully', blob.size, 'bytes');
          const file = new File([blob], `${currentCapture}-photo.jpg`, { type: 'image/jpeg' });
          
          if (currentCapture === 'incident') {
            updateReportData({ incidentPhoto: file });
            setCurrentCapture('face');
            stopCamera();
            setDetectionStatus('');
            setError(''); // Clear any errors
          } else {
            updateReportData({ facePhoto: file });
            stopCamera();
            setError(''); // Clear any errors
          }
        } else {
          console.error('Failed to create blob');
          setError('Failed to capture photo. Please try again.');
        }
      }, 'image/jpeg', 0.9);
    } catch (err) {
      console.error('Error capturing photo:', err);
      setError('Failed to capture photo: ' + err.message);
    }
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
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
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
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
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
