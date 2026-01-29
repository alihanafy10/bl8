import React, { useState } from 'react';
import './App.css';
import IncidentReporter from './components/IncidentReporter';
import SuccessPage from './components/SuccessPage';

function App() {
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleReportSubmit = (data) => {
    setReportData(data);
    setReportSubmitted(true);
  };

  const handleNewReport = () => {
    setReportSubmitted(false);
    setReportData(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚑 Emergency Incident Reporter</h1>
        <p>Report incidents with photo verification</p>
      </header>
      
      <main className="App-main">
        {!reportSubmitted ? (
          <IncidentReporter onSubmitSuccess={handleReportSubmit} />
        ) : (
          <SuccessPage reportData={reportData} onNewReport={handleNewReport} />
        )}
      </main>

      <footer className="App-footer">
        <p>Emergency Services • Available 24/7</p>
      </footer>
    </div>
  );
}

export default App;
