import React, { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import LocationSelector from './components/LocationSelector';
import ReportSubmission from './components/ReportSubmission';
import './App.css';

function App() {
  const [step, setStep] = useState(1);
  const [reportData, setReportData] = useState({
    incidentPhoto: null,
    facePhoto: null,
    location: null,
    governorate: null,
    region: null,
    description: ''
  });

  const updateReportData = (data) => {
    setReportData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const resetForm = () => {
    setStep(1);
    setReportData({
      incidentPhoto: null,
      facePhoto: null,
      location: null,
      governorate: null,
      region: null,
      description: ''
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <SimpleCameraCapture
            reportData={reportData}
            updateReportData={updateReportData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <LocationSelector
            reportData={reportData}
            updateReportData={updateReportData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <ReportSubmission
            reportData={reportData}
            updateReportData={updateReportData}
            prevStep={prevStep}
            resetForm={resetForm}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>🚑 Emergency Incident Reporter</h1>
          <p>Report emergencies with photo verification and location tracking</p>
        </header>

        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Photos</div>
          </div>
          <div className={`progress-line ${step > 1 ? 'completed' : ''}`}></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Location</div>
          </div>
          <div className={`progress-line ${step > 2 ? 'completed' : ''}`}></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Submit</div>
          </div>
        </div>

        <div className="step-content">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default App;
