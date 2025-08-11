import { Request, Response } from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { WeatherService } from '../services/WeatherService';
import { ApiResponse, Port, ShippingRoute, PaginatedResponse, WeatherData } from '../types';
import { AppError } from '../middleware/errorHandler';

export class MaritimeController {
  private db: any;
  private weatherService: WeatherService;

  constructor() {
    this.db = DatabaseService.getInstance().getDatabase();
    this.weatherService = new WeatherService();
  }

  public async getPorts(req: Request, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '20', country } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const offset = (pageNum - 1) * limitNum;

      let sql = 'SELECT * FROM ports WHERE is_active = 1';
      const params: any[] = [];

      if (country) {
        sql += ' AND country = ?';
        params.push(country);
      }

      sql += ' ORDER BY name LIMIT ? OFFSET ?';
      params.push(limitNum, offset);

      const ports = await this.queryDatabase(sql, params);
      const total = await this.getPortsCount(country as string);

      const response: PaginatedResponse<Port> = {
        success: true,
        data: ports.map(this.mapPort),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      throw new AppError('Failed to fetch ports', 500);
    }
  }

  public async getPortById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const portId = parseInt(id, 10);

      if (isNaN(portId)) {
        throw new AppError('Invalid port ID', 400);
      }

      const ports = await this.queryDatabase('SELECT * FROM ports WHERE id = ?', [portId]);

      if (ports.length === 0) {
        throw new AppError('Port not found', 404);
      }

      const response: ApiResponse<Port> = {
        success: true,
        data: this.mapPort(ports[0]),
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch port', 500);
    }
  }

  public async getPortWeather(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const portId = parseInt(id, 10);

      if (isNaN(portId)) {
        throw new AppError('Invalid port ID', 400);
      }

      const ports = await this.queryDatabase('SELECT * FROM ports WHERE id = ?', [portId]);

      if (ports.length === 0) {
        throw new AppError('Port not found', 404);
      }

      const port = this.mapPort(ports[0]);
      const weatherData = await this.weatherService.getMarineWeather(
        port.latitude,
        port.longitude
      );

      const response: ApiResponse<{ port: Port; weather: WeatherData }> = {
        success: true,
        data: {
          port,
          weather: weatherData,
        },
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch port weather', 500);
    }
  }

  public async getRoutes(req: Request, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const offset = (pageNum - 1) * limitNum;

      const sql = `
        SELECT r.*, 
               op.name as origin_name, op.code as origin_code, op.latitude as origin_lat, op.longitude as origin_lon,
               dp.name as dest_name, dp.code as dest_code, dp.latitude as dest_lat, dp.longitude as dest_lon
        FROM shipping_routes r
        LEFT JOIN ports op ON r.origin_port_id = op.id
        LEFT JOIN ports dp ON r.destination_port_id = dp.id
        WHERE r.is_active = 1
        ORDER BY r.name
        LIMIT ? OFFSET ?
      `;

      const routes = await this.queryDatabase(sql, [limitNum, offset]);
      const total = await this.getRoutesCount();

      const response: PaginatedResponse<ShippingRoute> = {
        success: true,
        data: routes.map(this.mapRoute),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      throw new AppError('Failed to fetch routes', 500);
    }
  }

  public async getRouteById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const routeId = parseInt(id, 10);

      if (isNaN(routeId)) {
        throw new AppError('Invalid route ID', 400);
      }

      const sql = `
        SELECT r.*, 
               op.name as origin_name, op.code as origin_code, op.latitude as origin_lat, op.longitude as origin_lon,
               dp.name as dest_name, dp.code as dest_code, dp.latitude as dest_lat, dp.longitude as dest_lon
        FROM shipping_routes r
        LEFT JOIN ports op ON r.origin_port_id = op.id
        LEFT JOIN ports dp ON r.destination_port_id = dp.id
        WHERE r.id = ?
      `;

      const routes = await this.queryDatabase(sql, [routeId]);

      if (routes.length === 0) {
        throw new AppError('Route not found', 404);
      }

      const response: ApiResponse<ShippingRoute> = {
        success: true,
        data: this.mapRoute(routes[0]),
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch route', 500);
    }
  }

  public async getRouteWeather(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const routeId = parseInt(id, 10);

      if (isNaN(routeId)) {
        throw new AppError('Invalid route ID', 400);
      }

      const sql = `
        SELECT r.*, 
               op.name as origin_name, op.code as origin_code, op.latitude as origin_lat, op.longitude as origin_lon,
               dp.name as dest_name, dp.code as dest_code, dp.latitude as dest_lat, dp.longitude as dest_lon
        FROM shipping_routes r
        LEFT JOIN ports op ON r.origin_port_id = op.id
        LEFT JOIN ports dp ON r.destination_port_id = dp.id
        WHERE r.id = ?
      `;

      const routes = await this.queryDatabase(sql, [routeId]);

      if (routes.length === 0) {
        throw new AppError('Route not found', 404);
      }

      const route = this.mapRoute(routes[0]);
      
      // Get weather for origin, destination, and waypoints
      const weatherPromises = [];
      
      // Origin weather
      weatherPromises.push(
        this.weatherService.getMarineWeather(route.origin.latitude, route.origin.longitude)
      );
      
      // Destination weather
      weatherPromises.push(
        this.weatherService.getMarineWeather(route.destination.latitude, route.destination.longitude)
      );
      
      // Waypoint weather (sample a few points along the route)
      const sampleWaypoints = route.waypoints.slice(0, 3); // Limit to first 3 waypoints
      for (const waypoint of sampleWaypoints) {
        weatherPromises.push(
          this.weatherService.getMarineWeather(waypoint.latitude, waypoint.longitude)
        );
      }

      const weatherData = await Promise.all(weatherPromises);

      const response: ApiResponse<{
        route: ShippingRoute;
        weather: {
          origin: WeatherData;
          destination: WeatherData;
          waypoints: WeatherData[];
        };
      }> = {
        success: true,
        data: {
          route,
          weather: {
            origin: weatherData[0],
            destination: weatherData[1],
            waypoints: weatherData.slice(2),
          },
        },
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch route weather', 500);
    }
  }

  public async getNearbyPorts(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lon, radius = '100' } = req.query;

      if (!lat || !lon) {
        throw new AppError('Latitude and longitude are required', 400);
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);
      const radiusKm = parseFloat(radius as string);

      if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm)) {
        throw new AppError('Invalid coordinates or radius', 400);
      }

      // Simple distance calculation using latitude/longitude degrees
      // Note: This is approximate and suitable for small distances
      const latRange = radiusKm / 111; // 1 degree ≈ 111 km
      const lonRange = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

      const sql = `
        SELECT *, 
        (
          6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(latitude))
          )
        ) AS distance
        FROM ports 
        WHERE is_active = 1
        AND latitude BETWEEN ? AND ?
        AND longitude BETWEEN ? AND ?
        HAVING distance <= ?
        ORDER BY distance
        LIMIT 20
      `;

      const params = [
        latitude, longitude, latitude,
        latitude - latRange, latitude + latRange,
        longitude - lonRange, longitude + lonRange,
        radiusKm
      ];

      const ports = await this.queryDatabase(sql, params);

      const response: ApiResponse<Array<Port & { distance: number }>> = {
        success: true,
        data: ports.map((port: any) => ({
          ...this.mapPort(port),
          distance: Math.round(port.distance * 100) / 100, // Round to 2 decimal places
        })),
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to find nearby ports', 500);
    }
  }

  private async queryDatabase(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve([]);
        return;
      }

      this.db.all(sql, params, (err: Error, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  private async getPortsCount(country?: string): Promise<number> {
    let sql = 'SELECT COUNT(*) as count FROM ports WHERE is_active = 1';
    const params: any[] = [];

    if (country) {
      sql += ' AND country = ?';
      params.push(country);
    }

    const result = await this.queryDatabase(sql, params);
    return result[0]?.count || 0;
  }

  private async getRoutesCount(): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM shipping_routes WHERE is_active = 1';
    const result = await this.queryDatabase(sql);
    return result[0]?.count || 0;
  }

  private mapPort(row: any): Port {
    return {
      id: row.id,
      name: row.name,
      code: row.code,
      country: row.country,
      latitude: row.latitude,
      longitude: row.longitude,
      timezone: row.timezone,
      type: row.type,
      isActive: Boolean(row.is_active),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  private mapRoute(row: any): ShippingRoute {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      origin: {
        id: row.origin_port_id,
        name: row.origin_name,
        code: row.origin_code,
        latitude: row.origin_lat,
        longitude: row.origin_lon,
        country: '', // Not included in this query
        timezone: '',
        type: 'commercial',
        isActive: true,
      },
      destination: {
        id: row.destination_port_id,
        name: row.dest_name,
        code: row.dest_code,
        latitude: row.dest_lat,
        longitude: row.dest_lon,
        country: '',
        timezone: '',
        type: 'commercial',
        isActive: true,
      },
      waypoints: row.waypoints ? JSON.parse(row.waypoints) : [],
      distance: row.distance,
      estimatedDuration: row.estimated_duration,
      isActive: Boolean(row.is_active),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}