import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [stations, setStations] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, stationsRes, ambulancesRes, dispatchesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/stats`),
        axios.get(`${API_BASE_URL}/admin/stations`),
        axios.get(`${API_BASE_URL}/admin/ambulances`),
        axios.get(`${API_BASE_URL}/admin/dispatches?status=assigned,accepted,en_route,arrived`),
      ]);

      setStats(statsRes.data);
      setStations(stationsRes.data.stations);
      setAmbulances(ambulancesRes.data.ambulances);
      setDispatches(dispatchesRes.data.dispatches);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-dashboard loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>🏥 Emergency Management Dashboard</h1>
        <button onClick={loadData} className="btn btn-refresh">
          🔄 Refresh
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab ${activeTab === 'dispatches' ? 'active' : ''}`}
          onClick={() => setActiveTab('dispatches')}
        >
          🚨 Active Dispatches
        </button>
        <button
          className={`tab ${activeTab === 'stations' ? 'active' : ''}`}
          onClick={() => setActiveTab('stations')}
        >
          🏥 Stations
        </button>
        <button
          className={`tab ${activeTab === 'ambulances' ? 'active' : ''}`}
          onClick={() => setActiveTab('ambulances')}
        >
          🚑 Ambulances
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && stats && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-value">{stats.overview.totalReports}</div>
                <div className="stat-label">Total Reports</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🚨</div>
                <div className="stat-value">{stats.overview.activeDispatches}</div>
                <div className="stat-label">Active Dispatches</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🚑</div>
                <div className="stat-value">{stats.overview.availableAmbulances}</div>
                <div className="stat-label">Available Ambulances</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-value">{stats.overview.avgResponseTimeMinutes} min</div>
                <div className="stat-label">Avg Response Time</div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Reports by Status</h3>
                <div className="status-list">
                  {Object.entries(stats.reportsByStatus).map(([status, count]) => (
                    <div key={status} className="status-item">
                      <span className="status-name">{status}</span>
                      <span className="status-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card">
                <h3>Dispatches by Status</h3>
                <div className="status-list">
                  {Object.entries(stats.dispatchesByStatus).map(([status, count]) => (
                    <div key={status} className="status-item">
                      <span className="status-name">{status}</span>
                      <span className="status-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="governorate-stats">
              <h3>Stations by Governorate</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Governorate</th>
                    <th>Stations</th>
                    <th>Total Ambulances</th>
                    <th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.stationsByGovernorate.map((gov) => (
                    <tr key={gov._id}>
                      <td>{gov._id}</td>
                      <td>{gov.count}</td>
                      <td>{gov.totalAmbulances}</td>
                      <td className="available-count">{gov.availableAmbulances}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'dispatches' && (
          <div className="dispatches-tab">
            <h2>Active Dispatches ({dispatches.length})</h2>
            {dispatches.length === 0 ? (
              <p className="no-data">No active dispatches</p>
            ) : (
              <div className="dispatches-grid">
                {dispatches.map((dispatch) => (
                  <div key={dispatch._id} className="dispatch-card">
                    <div className="dispatch-header">
                      <span className={`dispatch-status status-${dispatch.status}`}>
                        {dispatch.status.toUpperCase()}
                      </span>
                      <span className="dispatch-priority">
                        Priority: {dispatch.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="dispatch-body">
                      <p><strong>Location:</strong> {dispatch.report.location.governorate}, {dispatch.report.location.district}</p>
                      <p><strong>Station:</strong> {dispatch.station.name}</p>
                      {dispatch.ambulance && (
                        <p><strong>Ambulance:</strong> {dispatch.ambulance.vehicleNumber}</p>
                      )}
                      <p><strong>Distance:</strong> {dispatch.distance} km</p>
                      <p><strong>ETA:</strong> {dispatch.estimatedArrival} minutes</p>
                      <p><strong>Dispatched:</strong> {new Date(dispatch.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stations' && (
          <div className="stations-tab">
            <h2>Ambulance Stations ({stations.length})</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Governorate</th>
                  <th>District</th>
                  <th>Total Ambulances</th>
                  <th>Available</th>
                  <th>Status</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station) => (
                  <tr key={station._id}>
                    <td>{station.name}</td>
                    <td>{station.governorate}</td>
                    <td>{station.district}</td>
                    <td>{station.totalAmbulances}</td>
                    <td className="available-count">{station.availableAmbulances}</td>
                    <td>
                      <span className={`status-badge ${station.isActive ? 'active' : 'inactive'}`}>
                        {station.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{station.contactPhone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'ambulances' && (
          <div className="ambulances-tab">
            <h2>Ambulances ({ambulances.length})</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vehicle Number</th>
                  <th>Station</th>
                  <th>Status</th>
                  <th>Driver</th>
                  <th>Driver Phone</th>
                  <th>Current Dispatch</th>
                </tr>
              </thead>
              <tbody>
                {ambulances.map((ambulance) => (
                  <tr key={ambulance._id}>
                    <td><strong>{ambulance.vehicleNumber}</strong></td>
                    <td>{ambulance.station.name}</td>
                    <td>
                      <span className={`status-badge status-${ambulance.status}`}>
                        {ambulance.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{ambulance.driver?.name || 'N/A'}</td>
                    <td>{ambulance.driver?.phone || 'N/A'}</td>
                    <td>
                      {ambulance.currentDispatch ? (
                        <span className="has-dispatch">Active</span>
                      ) : (
                        <span className="no-dispatch">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
