import React, { useState } from 'react';
import axios from 'axios';
import './ReportSubmission.css';

function ReportSubmission({ reportData, prevStep, resetForm }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [reportId, setReportId] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('incidentPhoto', reportData.incidentPhoto);
      formData.append('facePhoto', reportData.facePhoto);
      formData.append('latitude', reportData.location.latitude);
      formData.append('longitude', reportData.location.longitude);
      formData.append('governorate', reportData.governorate);
      formData.append('region', reportData.region || '');
      formData.append('description', reportData.description || '');
      formData.append('timestamp', new Date().toISOString());

      // Submit to backend
      const response = await axios.post('/api/report', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setReportId(response.data.reportId);
        setSubmitted(true);
      } else {
        throw new Error(response.data.error || 'Failed to submit report');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="report-submission">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Report Submitted Successfully!</h2>
          <p className="success-message">
            Your emergency report has been sent to the ambulance service.
          </p>
          
          <div className="report-id">
            <strong>Report ID:</strong>
            <div className="report-id-value">{reportId}</div>
          </div>

          <div className="info-message">
            <strong>What happens next?</strong>
            <ul>
              <li>Emergency services have been notified</li>
              <li>An ambulance will be dispatched to your location</li>
              <li>Keep your phone nearby for any follow-up calls</li>
              <li>Save your Report ID for reference</li>
            </ul>
          </div>

          <button className="btn btn-primary" onClick={resetForm}>
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-submission">
      <h2 className="step-title">📋 Review & Submit</h2>
      <p className="step-description">
        Please review your report before submitting to emergency services.
      </p>

      <div className="review-section">
        <h3>Photos</h3>
        <div className="photo-review">
          <div className="photo-item">
            <img src={URL.createObjectURL(reportData.incidentPhoto)} alt="Incident" />
            <span>Incident Photo</span>
          </div>
          <div className="photo-item">
            <img src={URL.createObjectURL(reportData.facePhoto)} alt="Face verification" />
            <span>Face Verification</span>
          </div>
        </div>
      </div>

      <div className="review-section">
        <h3>Location Details</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">GPS Coordinates:</span>
            <span className="info-value">
              {reportData.location.latitude.toFixed(6)}, {reportData.location.longitude.toFixed(6)}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Governorate:</span>
            <span className="info-value">{reportData.governorate}</span>
          </div>
          {reportData.region && (
            <div className="info-item">
              <span className="info-label">Region:</span>
              <span className="info-value">{reportData.region}</span>
            </div>
          )}
          {reportData.description && (
            <div className="info-item full-width">
              <span className="info-label">Description:</span>
              <span className="info-value">{reportData.description}</span>
            </div>
          )}
        </div>
      </div>

      <div className="warning-box">
        ⚠️ <strong>Important:</strong> This report will be sent directly to emergency services. 
        Please ensure all information is accurate. False reports may result in legal consequences.
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="button-group">
        <button 
          className="btn btn-secondary" 
          onClick={prevStep}
          disabled={submitting}
        >
          ← Back
        </button>
        <button 
          className="btn btn-success" 
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner-small"></span> Submitting...
            </>
          ) : (
            <>🚑 Submit to Emergency Services</>
          )}
        </button>
      </div>
    </div>
  );
}

export default ReportSubmission;
