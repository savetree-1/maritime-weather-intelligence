import { Request, Response } from 'express';
import { WeatherService } from '../services/WeatherService';
import { DatabaseService } from '../services/DatabaseService';
import { ApiResponse, WeatherData, ForecastPeriod } from '../types';
import { AppError } from '../middleware/errorHandler';

export class WeatherController {
  private weatherService: WeatherService;
  private db: any;

  constructor() {
    this.weatherService = new WeatherService();
    this.db = DatabaseService.getInstance().getDatabase();
  }

  public async getCurrentWeather(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lon } = req.query;

      if (!lat || !lon) {
        throw new AppError('Latitude and longitude are required', 400);
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new AppError('Invalid latitude or longitude', 400);
      }

      const weatherData = await this.weatherService.getCurrentWeather(latitude, longitude);
      
      // Store weather data in database
      await this.storeWeatherData(weatherData);

      const response: ApiResponse<WeatherData> = {
        success: true,
        data: weatherData,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch weather data', 500);
    }
  }

  public async getMarineWeather(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lon } = req.query;

      if (!lat || !lon) {
        throw new AppError('Latitude and longitude are required', 400);
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new AppError('Invalid latitude or longitude', 400);
      }

      const weatherData = await this.weatherService.getMarineWeather(latitude, longitude);
      
      const response: ApiResponse<WeatherData> = {
        success: true,
        data: weatherData,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch marine weather data', 500);
    }
  }

  public async getForecast(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lon, days = '5' } = req.query;

      if (!lat || !lon) {
        throw new AppError('Latitude and longitude are required', 400);
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      const forecastDays = parseInt(days as string, 10);

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new AppError('Invalid latitude or longitude', 400);
      }

      if (isNaN(forecastDays) || forecastDays < 1 || forecastDays > 10) {
        throw new AppError('Days must be between 1 and 10', 400);
      }

      const forecast = await this.weatherService.getForecast(latitude, longitude, forecastDays);

      const response: ApiResponse<ForecastPeriod[]> = {
        success: true,
        data: forecast,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch forecast data', 500);
    }
  }

  public async getWeatherHistory(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lon, limit = '50' } = req.query;

      if (!lat || !lon) {
        throw new AppError('Latitude and longitude are required', 400);
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      const limitNum = parseInt(limit as string, 10);

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new AppError('Invalid latitude or longitude', 400);
      }

      const history = await this.getWeatherHistoryFromDb(latitude, longitude, limitNum);

      const response: ApiResponse<WeatherData[]> = {
        success: true,
        data: history,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch weather history', 500);
    }
  }

  private async storeWeatherData(weatherData: WeatherData): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      const sql = `
        INSERT INTO weather_data (
          location_name, latitude, longitude, country, temperature, humidity, pressure,
          wind_speed, wind_direction, visibility, weather_description, icon,
          wave_height, swell_height, wind_wave_height, wave_direction, wave_period, sea_temperature
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        weatherData.location.name,
        weatherData.location.latitude,
        weatherData.location.longitude,
        weatherData.location.country,
        weatherData.current.temperature,
        weatherData.current.humidity,
        weatherData.current.pressure,
        weatherData.current.windSpeed,
        weatherData.current.windDirection,
        weatherData.current.visibility,
        weatherData.current.weatherDescription,
        weatherData.current.icon,
        weatherData.marine?.waveHeight,
        weatherData.marine?.swellHeight,
        weatherData.marine?.windWaveHeight,
        weatherData.marine?.waveDirection,
        weatherData.marine?.wavePeriod,
        weatherData.marine?.seaTemperature,
      ];

      this.db.run(sql, params, (err: Error) => {
        if (err) {
          console.error('Error storing weather data:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private async getWeatherHistoryFromDb(latitude: number, longitude: number, limit: number): Promise<WeatherData[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve([]);
        return;
      }

      const sql = `
        SELECT * FROM weather_data 
        WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?
        ORDER BY timestamp DESC 
        LIMIT ?
      `;

      const latRange = 0.1; // ~11km
      const lonRange = 0.1;

      this.db.all(sql, [
        latitude - latRange, latitude + latRange,
        longitude - lonRange, longitude + lonRange,
        limit
      ], (err: Error, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const weatherHistory = rows.map((row) => ({
            id: row.id,
            location: {
              name: row.location_name,
              latitude: row.latitude,
              longitude: row.longitude,
              country: row.country,
            },
            current: {
              temperature: row.temperature,
              humidity: row.humidity,
              pressure: row.pressure,
              windSpeed: row.wind_speed,
              windDirection: row.wind_direction,
              visibility: row.visibility,
              weatherDescription: row.weather_description,
              icon: row.icon,
            },
            marine: row.wave_height ? {
              waveHeight: row.wave_height,
              swellHeight: row.swell_height,
              windWaveHeight: row.wind_wave_height,
              waveDirection: row.wave_direction,
              wavePeriod: row.wave_period,
              seaTemperature: row.sea_temperature,
            } : undefined,
            timestamp: new Date(row.timestamp),
          }));
          resolve(weatherHistory);
        }
      });
    });
  }
}