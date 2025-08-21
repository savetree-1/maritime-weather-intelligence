import React, { useEffect, useState } from 'react';

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
    <div style={{ padding: 40, fontFamily: 'Arial, sans-serif' }}>
      <h1>Maritime Weather Intelligence Demo</h1>
      <div style={{ marginTop: 20 }}>
        <h3>Service Status</h3>
        <ul>
          <li>Backend API: <b>{backendStatus}</b></li>
          <li>ML Service: <b>{mlStatus}</b></li>
        </ul>
      </div>
      <div style={{ marginTop: 40 }}>
        <h3>Instructions</h3>
        <p>This demo UI checks the status of your backend and ML services.<br />
        Make sure both are running before loading this page.</p>
      </div>
    </div>
  );
}

export default App;
