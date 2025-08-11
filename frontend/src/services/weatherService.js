import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class WeatherService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });
  }

  /**
   * Get current weather for a location
   */
  async getCurrentWeather(lat, lon) {
    try {
      const response = await this.api.get('/v1/weather/realtime', {
        params: { lat, lon }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      // Return mock data if API is not available
      return this.getMockCurrentWeather(lat, lon);
    }
  }

  /**
   * Get weather forecast for a location
   */
  async getForecast(lat, lon, hours = 240) {
    try {
      const response = await this.api.get('/v1/weather/forecast', {
        params: { lat, lon, hours }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return this.getMockForecast(lat, lon, hours);
    }
  }

  /**
   * Get weather data for a route
   */
  async getRouteWeather(routeId, departureTime) {
    try {
      const response = await this.api.get('/v1/weather/route', {
        params: { route_id: routeId, departure_time: departureTime }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching route weather:', error);
      return this.getMockRouteWeather(routeId, departureTime);
    }
  }

  /**
   * Mock current weather data (fallback)
   */
  getMockCurrentWeather(lat, lon) {
    return {
      latitude: lat,
      longitude: lon,
      timestamp: new Date().toISOString(),
      temperature: 15 + Math.random() * 10,
      humidity: 60 + Math.random() * 30,
      pressure: 1000 + Math.random() * 50,
      wind_speed: Math.random() * 15,
      wind_direction: Math.random() * 360,
      visibility: 5 + Math.random() * 15,
      cloud_cover: Math.random() * 100,
      precipitation: Math.random() * 2,
      weather_code: Math.floor(Math.random() * 10),
      sources: ['mock'],
    };
  }

  /**
   * Mock forecast data (fallback)
   */
  getMockForecast(lat, lon, hours) {
    const forecast = [];
    const now = new Date();

    for (let i = 0; i < hours; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      forecast.push({
        timestamp: time.toISOString(),
        temperature: 15 + Math.random() * 10,
        humidity: 60 + Math.random() * 30,
        pressure: 1000 + Math.random() * 50,
        wind_speed: Math.random() * 15,
        wind_direction: Math.random() * 360,
        visibility: 5 + Math.random() * 15,
        cloud_cover: Math.random() * 100,
        precipitation: Math.random() * 2,
        weather_code: Math.floor(Math.random() * 10),
      });
    }

    return {
      latitude: lat,
      longitude: lon,
      forecast_hours: hours,
      forecast,
      sources: ['mock'],
    };
  }

  /**
   * Mock route weather data (fallback)
   */
  getMockRouteWeather(routeId, departureTime) {
    const weatherData = [];
    const pointCount = 10;

    for (let i = 0; i < pointCount; i++) {
      const hoursFromStart = (i / pointCount) * 24;
      const pointTime = new Date(new Date(departureTime).getTime() + hoursFromStart * 60 * 60 * 1000);

      weatherData.push({
        point_index: i,
        latitude: 50.5 + (Math.random() - 0.5) * 2,
        longitude: -2.5 + (Math.random() - 0.5) * 4,
        estimated_time: pointTime.toISOString(),
        weather: {
          timestamp: pointTime.toISOString(),
          temperature: 15 + Math.random() * 10,
          humidity: 60 + Math.random() * 30,
          pressure: 1000 + Math.random() * 50,
          wind_speed: Math.random() * 15,
          wind_direction: Math.random() * 360,
          visibility: 5 + Math.random() * 15,
          cloud_cover: Math.random() * 100,
          precipitation: Math.random() * 2,
        },
      });
    }

    return {
      route_id: routeId,
      departure_time: departureTime,
      weather_data: weatherData,
      summary: {
        temperature_range: {
          min: 12,
          max: 22,
          avg: 17,
        },
        wind_speed_range: {
          min: 2,
          max: 12,
          avg: 7,
        },
        total_precipitation: 5,
        conditions_summary: 'Moderate winds expected along route. Generally favorable conditions.',
      },
    };
  }

  /**
   * Format weather condition based on code
   */
  getWeatherCondition(code) {
    const conditions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow fall',
      95: 'Thunderstorm',
    };

    return conditions[code] || 'Unknown';
  }

  /**
   * Get wind direction text
   */
  getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  /**
   * Convert wind speed from m/s to knots
   */
  msToKnots(ms) {
    return ms * 1.943844;
  }

  /**
   * Convert temperature from Celsius to Fahrenheit
   */
  celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
  }

  /**
   * Get severity level for wind speed
   */
  getWindSeverity(windSpeed) {
    if (windSpeed < 5) return 'light';
    if (windSpeed < 10) return 'moderate';
    if (windSpeed < 15) return 'strong';
    return 'severe';
  }

  /**
   * Get visibility level description
   */
  getVisibilityLevel(visibility) {
    if (visibility < 1) return 'very poor';
    if (visibility < 3) return 'poor';
    if (visibility < 5) return 'moderate';
    if (visibility < 10) return 'good';
    return 'excellent';
  }
}

export const weatherService = new WeatherService();