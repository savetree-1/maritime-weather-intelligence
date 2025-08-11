import React, { useState, useEffect } from 'react';
import { Cloud, Wind, Thermometer, Eye, Droplets, Clock } from 'lucide-react';
import WeatherMap from '../components/WeatherMap';
import { weatherService } from '../services/weatherService';

const WeatherView = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({ lat: 50.5, lon: -2.5 });
  const [timeSliderValue, setTimeSliderValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeatherData();
  }, [selectedLocation]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      
      const [current, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(selectedLocation.lat, selectedLocation.lon),
        weatherService.getForecast(selectedLocation.lat, selectedLocation.lon, 240)
      ]);

      setCurrentWeather(current);
      setForecast(forecastData);
    } catch (error) {
      console.error('Error loading weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setSelectedLocation({ lat, lon: lng });
  };

  const getCurrentForecastData = () => {
    if (!forecast || !forecast.forecast) return null;
    return forecast.forecast[timeSliderValue] || forecast.forecast[0];
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const WeatherCard = ({ icon: Icon, title, value, unit, description, color = 'text-teal-400' }) => (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white/80 text-sm font-medium">{title}</h3>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div className="mb-1">
        <span className={`text-2xl font-bold ${color}`}>
          {value !== null && value !== undefined ? `${value}${unit}` : '--'}
        </span>
      </div>
      {description && (
        <p className="text-white/60 text-xs">{description}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="spinner h-12 w-12"></div>
      </div>
    );
  }

  const displayWeather = getCurrentForecastData() || currentWeather;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Weather Intelligence</h1>
        <div className="text-white/60">
          Location: {selectedLocation.lat.toFixed(2)}°, {selectedLocation.lon.toFixed(2)}°
        </div>
      </div>

      {/* Time Slider */}
      {forecast && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-teal-400" />
              Forecast Timeline
            </h2>
            <span className="text-white/80">
              {displayWeather ? formatTime(displayWeather.timestamp) : 'Current'}
            </span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={Math.max(0, forecast.forecast.length - 1)}
              value={timeSliderValue}
              onChange={(e) => setTimeSliderValue(parseInt(e.target.value))}
              className="time-slider w-full"
            />
            <div className="flex justify-between text-white/60 text-sm">
              <span>Now</span>
              <span>{forecast.forecast_hours}h forecast</span>
            </div>
          </div>
        </div>
      )}

      {/* Weather Conditions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WeatherCard
          icon={Thermometer}
          title="Temperature"
          value={displayWeather?.temperature?.toFixed(1)}
          unit="°C"
          description={`Feels like ${(displayWeather?.temperature + 2)?.toFixed(1)}°C`}
          color="text-orange-400"
        />
        <WeatherCard
          icon={Wind}
          title="Wind"
          value={displayWeather?.wind_speed?.toFixed(1)}
          unit=" m/s"
          description={`${weatherService.getWindDirection(displayWeather?.wind_direction || 0)} direction`}
          color="text-blue-400"
        />
        <WeatherCard
          icon={Eye}
          title="Visibility"
          value={displayWeather?.visibility?.toFixed(1)}
          unit=" km"
          description={weatherService.getVisibilityLevel(displayWeather?.visibility || 10)}
          color="text-green-400"
        />
        <WeatherCard
          icon={Droplets}
          title="Humidity"
          value={displayWeather?.humidity?.toFixed(0)}
          unit="%"
          description={`Pressure: ${displayWeather?.pressure?.toFixed(0)} hPa`}
          color="text-cyan-400"
        />
        <WeatherCard
          icon={Cloud}
          title="Cloud Cover"
          value={displayWeather?.cloud_cover?.toFixed(0)}
          unit="%"
          description={weatherService.getWeatherCondition(displayWeather?.weather_code || 0)}
          color="text-gray-400"
        />
        <WeatherCard
          icon={Droplets}
          title="Precipitation"
          value={displayWeather?.precipitation?.toFixed(1)}
          unit=" mm/h"
          description={displayWeather?.precipitation > 0.5 ? 'Rain expected' : 'No precipitation'}
          color="text-blue-300"
        />
      </div>

      {/* Interactive Map */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Cloud className="h-5 w-5 mr-2 text-teal-400" />
          Interactive Weather Map
        </h2>
        <div className="full-screen-map">
          <WeatherMap
            center={[selectedLocation.lat, selectedLocation.lon]}
            zoom={8}
            showWeatherOverlay={true}
            onMapClick={handleMapClick}
            className="w-full h-full"
          />
        </div>
        <p className="text-white/60 text-sm mt-2">
          Click anywhere on the map to get weather data for that location
        </p>
      </div>

      {/* Forecast Chart Placeholder */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">10-Day Forecast</h2>
        <div className="h-64 flex items-center justify-center text-white/60">
          <div className="text-center">
            <Cloud className="h-16 w-16 mx-auto mb-4 text-teal-400/30" />
            <p>Forecast chart visualization coming soon</p>
            <p className="text-sm mt-2">Will display temperature, wind, and precipitation trends</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherView;