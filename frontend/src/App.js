import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState('Loading...');
  const [mlStatus, setMlStatus] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:3001/api/status')
      .then(res => res.json())
      .then(data => setBackendStatus(data.status || 'Error'))
      .catch(() => setBackendStatus('Error'));

    fetch('http://localhost:8000/api/ml-status')
      .then(res => res.json())
      .then(data => setMlStatus(data.status || 'Error'))
      .catch(() => setMlStatus('Error'));
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: 'auto' }}>
      <h1>Maritime Weather Intelligence Demo</h1>
      <div style={{ marginTop: 20, background: '#f0f4f8', padding: 20, borderRadius: 8 }}>
        <h3>Service Status</h3>
        <ul>
          <li>Backend API: <b style={{ color: backendStatus === 'Backend running' ? 'green' : 'red' }}>{backendStatus}</b></li>
          <li>ML Service: <b style={{ color: mlStatus === 'ML service running' ? 'green' : 'red' }}>{mlStatus}</b></li>
        </ul>
      </div>
      <div style={{ marginTop: 40, background: '#eaf7ea', padding: 20, borderRadius: 8 }}>
        <h3>Demo Features</h3>
        <ul>
          <li>Checks backend and ML service status</li>
          <li>Shows color-coded status (green for running, red for error)</li>
          <li>Ready for further UI and API integration</li>
        </ul>
      </div>
      <div style={{ marginTop: 40 }}>
        <h3>Instructions</h3>
        <p>Start all services and reload this page to see live status.<br />
        You can now extend this UI with weather data, alerts, and more.</p>
      </div>
    </div>
  );
}

export default App;
