import React, { useState } from 'react';
import PhotoCapture from './components/PhotoCapture';
import LocationForm from './components/LocationForm';
import ReportSubmit from './components/ReportSubmit';
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

  const updateData = (data) => {
    setReportData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
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
          {step === 1 && <PhotoCapture data={reportData} updateData={updateData} nextStep={nextStep} />}
          {step === 2 && <LocationForm data={reportData} updateData={updateData} nextStep={nextStep} prevStep={prevStep} />}
          {step === 3 && <ReportSubmit data={reportData} updateData={updateData} prevStep={prevStep} resetForm={resetForm} />}
        </div>
      </div>
    </div>
  );
}

export default App;
