import React, { useState } from 'react';
import './App.css';
import IncidentReporter from './components/IncidentReporter';
import SuccessPage from './components/SuccessPage';
import DriverInterface from './pages/DriverInterface';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [currentView, setCurrentView] = useState('reporter'); // reporter, driver, admin
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

  const renderView = () => {
    if (currentView === 'driver') {
      return <DriverInterface />;
    }
    
    if (currentView === 'admin') {
      return <AdminDashboard />;
    }

    // Default reporter view
    return (
      <div className="App">
        <header className="App-header">
          <h1>🚑 Emergency Incident Reporter</h1>
          <p>Report incidents with photo verification</p>
          <div className="nav-buttons">
            <button onClick={() => setCurrentView('driver')} className="nav-btn">
              👨‍✈️ Driver Portal
            </button>
            <button onClick={() => setCurrentView('admin')} className="nav-btn">
              🏥 Admin Dashboard
            </button>
          </div>
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
  };

  return (
    <>
      {currentView !== 'reporter' && (
        <div className="back-button-container">
          <button onClick={() => setCurrentView('reporter')} className="back-btn">
            ← Back to Reporter
          </button>
        </div>
      )}
      {renderView()}
    </>
  );
}

export default App;
