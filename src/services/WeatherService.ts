import axios from 'axios';
import { WeatherData, ForecastPeriod } from '../types';

export class WeatherService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
    this.baseUrl = process.env.WEATHER_API_BASE_URL || 'https://api.openweathermap.org/data/2.5';
    
    if (!this.apiKey) {
      console.warn('⚠️ OpenWeather API key not found. Weather data will be mocked.');
    }
  }

  public async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
    if (!this.apiKey) {
      return this.getMockWeatherData(latitude, longitude);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const data = response.data;
      
      return {
        location: {
          name: data.name,
          latitude: data.coord.lat,
          longitude: data.coord.lon,
          country: data.sys.country
        },
        current: {
          temperature: data.main.temp,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          windSpeed: data.wind?.speed || 0,
          windDirection: data.wind?.deg || 0,
          visibility: data.visibility || 10000,
          weatherDescription: data.weather[0].description,
          icon: data.weather[0].icon
        },
        marine: {
          waveHeight: Math.random() * 3 + 0.5, // Mock marine data
          swellHeight: Math.random() * 2 + 0.3,
          windWaveHeight: Math.random() * 1.5 + 0.2,
          waveDirection: Math.random() * 360,
          wavePeriod: Math.random() * 10 + 5,
          seaTemperature: data.main.temp - Math.random() * 5
        },
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return this.getMockWeatherData(latitude, longitude);
    }
  }

  public async getMarineWeather(latitude: number, longitude: number): Promise<WeatherData> {
    // For marine-specific data, we'll enhance the current weather with marine conditions
    const weather = await this.getCurrentWeather(latitude, longitude);
    
    // Enhance with more detailed marine data (in a real implementation, this would come from a marine weather API)
    weather.marine = {
      waveHeight: Math.random() * 4 + 0.5,
      swellHeight: Math.random() * 3 + 0.3,
      windWaveHeight: Math.random() * 2 + 0.2,
      waveDirection: Math.random() * 360,
      wavePeriod: Math.random() * 12 + 4,
      seaTemperature: weather.current.temperature - Math.random() * 3
    };

    return weather;
  }

  public async getForecast(latitude: number, longitude: number, days: number = 5): Promise<ForecastPeriod[]> {
    if (!this.apiKey) {
      return this.getMockForecast(latitude, longitude, days);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8 // 8 forecasts per day (every 3 hours)
        }
      });

      const forecasts: ForecastPeriod[] = response.data.list.map((item: any) => ({
        datetime: new Date(item.dt * 1000),
        temperature: {
          min: item.main.temp_min,
          max: item.main.temp_max,
          current: item.main.temp
        },
        wind: {
          speed: item.wind?.speed || 0,
          direction: item.wind?.deg || 0,
          gust: item.wind?.gust || undefined
        },
        marine: {
          waveHeight: Math.random() * 3 + 0.5,
          swellHeight: Math.random() * 2 + 0.3,
          seaTemperature: item.main.temp - Math.random() * 3
        },
        conditions: {
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          precipitation: item.rain?.['3h'] || item.snow?.['3h'] || 0,
          humidity: item.main.humidity
        }
      }));

      return forecasts;
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      return this.getMockForecast(latitude, longitude, days);
    }
  }

  private getMockWeatherData(latitude: number, longitude: number): WeatherData {
    return {
      location: {
        name: `Location ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
        latitude,
        longitude,
        country: 'Unknown'
      },
      current: {
        temperature: Math.random() * 30 + 5,
        humidity: Math.random() * 100,
        pressure: Math.random() * 100 + 1000,
        windSpeed: Math.random() * 20,
        windDirection: Math.random() * 360,
        visibility: Math.random() * 10000 + 5000,
        weatherDescription: 'Clear sky',
        icon: '01d'
      },
      marine: {
        waveHeight: Math.random() * 3 + 0.5,
        swellHeight: Math.random() * 2 + 0.3,
        windWaveHeight: Math.random() * 1.5 + 0.2,
        waveDirection: Math.random() * 360,
        wavePeriod: Math.random() * 10 + 5,
        seaTemperature: Math.random() * 25 + 10
      },
      timestamp: new Date()
    };
  }

  private getMockForecast(latitude: number, longitude: number, days: number): ForecastPeriod[] {
    const forecasts: ForecastPeriod[] = [];
    const now = new Date();

    for (let i = 0; i < days * 8; i++) {
      const datetime = new Date(now.getTime() + (i * 3 * 60 * 60 * 1000)); // 3-hour intervals
      const baseTemp = Math.random() * 20 + 10;

      forecasts.push({
        datetime,
        temperature: {
          min: baseTemp - 3,
          max: baseTemp + 3,
          current: baseTemp
        },
        wind: {
          speed: Math.random() * 15 + 2,
          direction: Math.random() * 360
        },
        marine: {
          waveHeight: Math.random() * 3 + 0.5,
          swellHeight: Math.random() * 2 + 0.3,
          seaTemperature: baseTemp - Math.random() * 3
        },
        conditions: {
          description: 'Partly cloudy',
          icon: '02d',
          precipitation: Math.random() * 5,
          humidity: Math.random() * 40 + 40
        }
      });
    }

    return forecasts;
  }
}