import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WeatherView from './pages/WeatherView';
import RouteOptimization from './pages/RouteOptimization';
import DocumentProcessing from './pages/DocumentProcessing';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-navy-900">
        <Navigation />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/weather" element={<WeatherView />} />
            <Route path="/optimization" element={<RouteOptimization />} />
            <Route path="/alerts" element={<div className="p-8 text-center">Alerts page - Coming Soon</div>} />
            <Route path="/documents" element={<DocumentProcessing />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;