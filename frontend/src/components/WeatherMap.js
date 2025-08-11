import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const WeatherOverlay = ({ weatherData }) => {
  const map = useMap();

  useEffect(() => {
    if (!weatherData) return;

    // Add weather visualization layer (simplified example)
    const weatherLayer = L.layerGroup();

    // Add wind arrows, temperature colors, etc.
    // This is a simplified implementation
    weatherData.forEach((point) => {
      const { lat, lng, windSpeed, temperature } = point;
      
      // Add wind direction marker
      if (windSpeed && windSpeed > 5) {
        const marker = L.circleMarker([lat, lng], {
          radius: 3 + windSpeed / 5,
          fillColor: getWindColor(windSpeed),
          color: '#ffffff',
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.6,
        }).bindPopup(`Wind: ${windSpeed} m/s<br/>Temp: ${temperature}°C`);
        
        weatherLayer.addLayer(marker);
      }
    });

    weatherLayer.addTo(map);

    return () => {
      map.removeLayer(weatherLayer);
    };
  }, [map, weatherData]);

  return null;
};

const getWindColor = (windSpeed) => {
  if (windSpeed < 5) return '#4ade80'; // Green - light wind
  if (windSpeed < 10) return '#fbbf24'; // Yellow - moderate wind
  if (windSpeed < 15) return '#f97316'; // Orange - strong wind
  return '#ef4444'; // Red - very strong wind
};

const WeatherMap = ({ 
  center = [50.5, -2.5], 
  zoom = 6, 
  showWeatherOverlay = false,
  className = '',
  style = {},
  onMapClick = null
}) => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    if (showWeatherOverlay) {
      // Generate mock weather data points
      const mockData = generateMockWeatherData(center, zoom);
      setWeatherData(mockData);
    }
  }, [center, zoom, showWeatherOverlay]);

  const generateMockWeatherData = (centerCoords, zoomLevel) => {
    const data = [];
    const [centerLat, centerLon] = centerCoords;
    const range = 10 / zoomLevel; // Adjust range based on zoom

    for (let i = 0; i < 50; i++) {
      const lat = centerLat + (Math.random() - 0.5) * range;
      const lng = centerLon + (Math.random() - 0.5) * range;
      const windSpeed = Math.random() * 20;
      const temperature = 10 + Math.random() * 20;

      data.push({
        lat,
        lng,
        windSpeed,
        temperature,
        humidity: 60 + Math.random() * 30,
        pressure: 1000 + Math.random() * 50,
      });
    }

    return data;
  };

  return (
    <div className={`relative ${className}`} style={style}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full rounded-lg"
        onClick={onMapClick}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {showWeatherOverlay && <WeatherOverlay weatherData={weatherData} />}
      </MapContainer>
      
      {/* Map legend for weather overlay */}
      {showWeatherOverlay && (
        <div className="absolute bottom-4 left-4 glass-card p-3 text-sm">
          <h4 className="font-semibold text-white mb-2">Wind Speed</h4>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
              <span className="text-white/80">0-5 m/s</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
              <span className="text-white/80">5-10 m/s</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
              <span className="text-white/80">10-15 m/s</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
              <span className="text-white/80">15+ m/s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherMap;