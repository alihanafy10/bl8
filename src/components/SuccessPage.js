import React from 'react';
import './SuccessPage.css';

const SuccessPage = ({ reportData, onNewReport }) => {
  return (
    <div className="success-page">
      <div className="success-icon">✓</div>
      <h1>Report Submitted Successfully!</h1>
      
      <div className="success-message">
        <p>Your incident report has been received and forwarded to emergency services.</p>
        {reportData?.ambulanceNotified && (
          <p className="ambulance-status">
            🚑 <strong>Ambulance service has been notified</strong>
          </p>
        )}
      </div>

      <div className="report-details">
        <h3>Report Details</h3>
        <div className="detail-item">
          <span className="detail-label">Report ID:</span>
          <span className="detail-value">{reportData?.reportId}</span>
        </div>
        <p className="help-info">
          Emergency responders will use your location information to reach you quickly.
        </p>
      </div>

      <div className="next-steps">
        <h3>What to do next:</h3>
        <ul>
          <li>📞 Stay calm and remain at the location if safe</li>
          <li>🚨 Keep your phone available for emergency calls</li>
          <li>👥 Provide first aid if trained and it's safe to do so</li>
          <li>⚠️ Move to a safe location if there's immediate danger</li>
        </ul>
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={onNewReport}>
          Submit Another Report
        </button>
      </div>

      <div className="emergency-contact">
        <p>For immediate assistance, call emergency services directly</p>
        <a href="tel:911" className="emergency-number">📞 911</a>
      </div>
    </div>
  );
};

export default SuccessPage;
