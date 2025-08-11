import React, { useState, useEffect } from 'react';
import { Cloud, Wind, Thermometer, Eye, Droplets, Activity } from 'lucide-react';
import WeatherMap from '../components/WeatherMap';
import { weatherService } from '../services/weatherService';

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default location (English Channel)
  const defaultLocation = { lat: 50.5, lon: -2.5 };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load current weather for default location
      const weather = await weatherService.getCurrentWeather(
        defaultLocation.lat, 
        defaultLocation.lon
      );
      setWeatherData(weather);

      // Load alerts (mock data for now)
      setAlerts([
        {
          id: 1,
          type: 'weather',
          severity: 'high',
          title: 'High Wind Warning',
          message: 'Winds expected to reach 25+ knots in the English Channel',
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          type: 'safety',
          severity: 'medium',
          title: 'Heavy Traffic Area',
          message: 'Increased vessel traffic near Dover Strait',
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const WeatherCard = ({ icon: Icon, title, value, unit, color = 'text-teal-400' }) => (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>
            {value !== null ? `${value}${unit}` : '--'}
          </p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );

  const AlertCard = ({ alert }) => {
    const severityColors = {
      low: 'alert-low',
      medium: 'alert-medium', 
      high: 'alert-high',
      critical: 'alert-critical',
    };

    return (
      <div className={`glass-card p-4 border-l-4 ${severityColors[alert.severity]}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-white">{alert.title}</h3>
            <p className="text-white/80 text-sm mt-1">{alert.message}</p>
            <p className="text-white/50 text-xs mt-2">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${severityColors[alert.severity]}`}>
            {alert.severity.toUpperCase()}
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="spinner h-12 w-12"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Maritime Dashboard</h1>
        <div className="text-white/60">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Weather Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WeatherCard
          icon={Thermometer}
          title="Temperature"
          value={weatherData?.temperature}
          unit="°C"
          color="text-orange-400"
        />
        <WeatherCard
          icon={Wind}
          title="Wind Speed"
          value={weatherData?.wind_speed}
          unit=" m/s"
          color="text-blue-400"
        />
        <WeatherCard
          icon={Eye}
          title="Visibility"
          value={weatherData?.visibility}
          unit=" km"
          color="text-green-400"
        />
        <WeatherCard
          icon={Droplets}
          title="Humidity"
          value={weatherData?.humidity}
          unit="%"
          color="text-cyan-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Map */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Cloud className="h-5 w-5 mr-2 text-teal-400" />
              Weather Overview
            </h2>
            <div className="map-container">
              <WeatherMap 
                center={[defaultLocation.lat, defaultLocation.lon]}
                zoom={6}
                showWeatherOverlay={true}
              />
            </div>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-coral-500" />
            Active Alerts ({alerts.length})
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))
            ) : (
              <p className="text-white/60 text-center py-8">No active alerts</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-teal-400">12</p>
            <p className="text-white/60 text-sm">Active Routes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">8</p>
            <p className="text-white/60 text-sm">Vessels Tracked</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">94%</p>
            <p className="text-white/60 text-sm">Optimization Success</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">2.3</p>
            <p className="text-white/60 text-sm">Avg Fuel Savings (%)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;