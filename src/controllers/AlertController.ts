import { Request, Response } from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { ApiResponse, WeatherAlert, PaginatedResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

export class AlertController {
  private db: any;

  constructor() {
    this.db = DatabaseService.getInstance().getDatabase();
  }

  public async getAlerts(req: Request, res: Response): Promise<void> {
    try {
      const { severity, type, lat, lon, radius = '50', page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const offset = (pageNum - 1) * limitNum;

      let sql = 'SELECT * FROM weather_alerts WHERE is_active = 1';
      const params: any[] = [];

      if (severity) {
        sql += ' AND severity = ?';
        params.push(severity);
      }

      if (type) {
        sql += ' AND type = ?';
        params.push(type);
      }

      if (lat && lon) {
        const latitude = parseFloat(lat as string);
        const longitude = parseFloat(lon as string);
        const radiusKm = parseFloat(radius as string);

        if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(radiusKm)) {
          const latRange = radiusKm / 111;
          const lonRange = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

          sql += ` AND latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?`;
          params.push(
            latitude - latRange, latitude + latRange,
            longitude - lonRange, longitude + lonRange
          );
        }
      }

      sql += ' ORDER BY severity DESC, created_at DESC LIMIT ? OFFSET ?';
      params.push(limitNum, offset);

      const alerts = await this.queryDatabase(sql, params);
      const total = await this.getAlertsCount(severity as string, type as string);

      const response: PaginatedResponse<WeatherAlert> = {
        success: true,
        data: alerts.map(this.mapAlert),
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
      throw new AppError('Failed to fetch alerts', 500);
    }
  }

  public async getAlertById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const alertId = parseInt(id, 10);

      if (isNaN(alertId)) {
        throw new AppError('Invalid alert ID', 400);
      }

      const alerts = await this.queryDatabase('SELECT * FROM weather_alerts WHERE id = ?', [alertId]);

      if (alerts.length === 0) {
        throw new AppError('Alert not found', 404);
      }

      const response: ApiResponse<WeatherAlert> = {
        success: true,
        data: this.mapAlert(alerts[0]),
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch alert', 500);
    }
  }

  public async createAlert(req: Request, res: Response): Promise<void> {
    try {
      const {
        type,
        severity,
        title,
        description,
        location,
        validFrom,
        validUntil,
        source,
        affectedPorts = [],
        affectedRoutes = [],
      } = req.body;

      if (!type || !severity || !title || !description || !location || !validFrom || !validUntil || !source) {
        throw new AppError('Missing required fields', 400);
      }

      const validTypes = ['storm', 'fog', 'high_waves', 'high_wind', 'ice', 'warning'];
      const validSeverities = ['low', 'moderate', 'high', 'extreme'];

      if (!validTypes.includes(type)) {
        throw new AppError('Invalid alert type', 400);
      }

      if (!validSeverities.includes(severity)) {
        throw new AppError('Invalid severity level', 400);
      }

      const sql = `
        INSERT INTO weather_alerts (
          type, severity, title, description, location_name, latitude, longitude, radius,
          valid_from, valid_until, source, affected_ports, affected_routes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        type,
        severity,
        title,
        description,
        location.name,
        location.latitude,
        location.longitude,
        location.radius,
        validFrom,
        validUntil,
        source,
        JSON.stringify(affectedPorts),
        JSON.stringify(affectedRoutes),
      ];

      const result: any = await new Promise((resolve, reject) => {
        if (!this.db) {
          resolve({ lastID: null });
          return;
        }
        
        this.db.run(sql, params, function(this: any, err: Error) {
          if (err) {
            reject(err);
          } else {
            resolve({ lastID: this.lastID, changes: this.changes });
          }
        });
      });
      
      const alertId = result.lastID;

      // Fetch the created alert
      const createdAlert = await this.queryDatabase('SELECT * FROM weather_alerts WHERE id = ?', [alertId]);

      const response: ApiResponse<WeatherAlert> = {
        success: true,
        data: this.mapAlert(createdAlert[0]),
        message: 'Alert created successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create alert', 500);
    }
  }

  public async updateAlert(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const alertId = parseInt(id, 10);

      if (isNaN(alertId)) {
        throw new AppError('Invalid alert ID', 400);
      }

      const updates = req.body;
      const allowedFields = [
        'type', 'severity', 'title', 'description', 'valid_from', 'valid_until',
        'is_active', 'source', 'affected_ports', 'affected_routes'
      ];

      const updateFields = Object.keys(updates).filter(field => allowedFields.includes(field));
      
      if (updateFields.length === 0) {
        throw new AppError('No valid fields to update', 400);
      }

      const sql = `UPDATE weather_alerts SET ${updateFields.map(field => `${field} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      const params = [...updateFields.map(field => {
        if (field === 'affected_ports' || field === 'affected_routes') {
          return JSON.stringify(updates[field]);
        }
        return updates[field];
      }), alertId];

      await this.runDatabase(sql, params);

      // Fetch the updated alert
      const updatedAlert = await this.queryDatabase('SELECT * FROM weather_alerts WHERE id = ?', [alertId]);

      if (updatedAlert.length === 0) {
        throw new AppError('Alert not found', 404);
      }

      const response: ApiResponse<WeatherAlert> = {
        success: true,
        data: this.mapAlert(updatedAlert[0]),
        message: 'Alert updated successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update alert', 500);
    }
  }

  public async deleteAlert(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const alertId = parseInt(id, 10);

      if (isNaN(alertId)) {
        throw new AppError('Invalid alert ID', 400);
      }

      // Soft delete - set is_active to false
      const sql = 'UPDATE weather_alerts SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      await this.runDatabase(sql, [alertId]);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Alert deleted successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete alert', 500);
    }
  }

  public async getPortAlerts(req: Request, res: Response): Promise<void> {
    try {
      const { portId } = req.params;
      const id = parseInt(portId, 10);

      if (isNaN(id)) {
        throw new AppError('Invalid port ID', 400);
      }

      // Get port information
      const ports = await this.queryDatabase('SELECT * FROM ports WHERE id = ?', [id]);
      
      if (ports.length === 0) {
        throw new AppError('Port not found', 404);
      }

      const port = ports[0];
      
      // Find alerts affecting this port (by location proximity or explicit mention)
      const sql = `
        SELECT * FROM weather_alerts 
        WHERE is_active = 1 
        AND (
          affected_ports LIKE ? OR
          (
            6371 * acos(
              cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) +
              sin(radians(?)) * sin(radians(latitude))
            )
          ) <= radius
        )
        ORDER BY severity DESC, created_at DESC
      `;

      const alerts = await this.queryDatabase(sql, [
        `%"${port.code}"%`,
        port.latitude, port.longitude, port.latitude
      ]);

      const response: ApiResponse<WeatherAlert[]> = {
        success: true,
        data: alerts.map(this.mapAlert),
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch port alerts', 500);
    }
  }

  public async getRouteAlerts(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;
      const id = parseInt(routeId, 10);

      if (isNaN(id)) {
        throw new AppError('Invalid route ID', 400);
      }

      // Get route information
      const routes = await this.queryDatabase('SELECT * FROM shipping_routes WHERE id = ?', [id]);
      
      if (routes.length === 0) {
        throw new AppError('Route not found', 404);
      }

      // Find alerts affecting this route
      const sql = `
        SELECT * FROM weather_alerts 
        WHERE is_active = 1 
        AND affected_routes LIKE ?
        ORDER BY severity DESC, created_at DESC
      `;

      const alerts = await this.queryDatabase(sql, [`%"${id}"%`]);

      const response: ApiResponse<WeatherAlert[]> = {
        success: true,
        data: alerts.map(this.mapAlert),
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch route alerts', 500);
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

  private async runDatabase(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      this.db.run(sql, params, (err: Error, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  private async getAlertsCount(severity?: string, type?: string): Promise<number> {
    let sql = 'SELECT COUNT(*) as count FROM weather_alerts WHERE is_active = 1';
    const params: any[] = [];

    if (severity) {
      sql += ' AND severity = ?';
      params.push(severity);
    }

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    const result = await this.queryDatabase(sql, params);
    return result[0]?.count || 0;
  }

  private mapAlert(row: any): WeatherAlert {
    return {
      id: row.id,
      type: row.type,
      severity: row.severity,
      title: row.title,
      description: row.description,
      location: {
        name: row.location_name,
        latitude: row.latitude,
        longitude: row.longitude,
        radius: row.radius,
      },
      validFrom: new Date(row.valid_from),
      validUntil: new Date(row.valid_until),
      isActive: Boolean(row.is_active),
      source: row.source,
      affectedPorts: row.affected_ports ? JSON.parse(row.affected_ports) : [],
      affectedRoutes: row.affected_routes ? JSON.parse(row.affected_routes) : [],
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}