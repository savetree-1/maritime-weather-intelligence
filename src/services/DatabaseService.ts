import sqlite3 from 'sqlite3';
import path from 'path';

export class DatabaseService {
  private static instance: DatabaseService;
  private db: sqlite3.Database | null = null;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public static initialize(): void {
    const instance = DatabaseService.getInstance();
    instance.connect();
    instance.createTables();
  }

  private connect(): void {
    const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../../maritime_weather.sqlite');
    
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('📁 Connected to SQLite database');
      }
    });
  }

  private createTables(): void {
    if (!this.db) return;

    const tables = [
      `CREATE TABLE IF NOT EXISTS ports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        country TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        timezone TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('commercial', 'fishing', 'military', 'recreational')),
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS weather_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location_name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        country TEXT,
        temperature REAL NOT NULL,
        humidity REAL NOT NULL,
        pressure REAL NOT NULL,
        wind_speed REAL NOT NULL,
        wind_direction REAL NOT NULL,
        visibility REAL NOT NULL,
        weather_description TEXT NOT NULL,
        icon TEXT NOT NULL,
        wave_height REAL,
        swell_height REAL,
        wind_wave_height REAL,
        wave_direction REAL,
        wave_period REAL,
        sea_temperature REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS weather_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK (type IN ('storm', 'fog', 'high_waves', 'high_wind', 'ice', 'warning')),
        severity TEXT NOT NULL CHECK (severity IN ('low', 'moderate', 'high', 'extreme')),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        location_name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        radius REAL NOT NULL,
        valid_from DATETIME NOT NULL,
        valid_until DATETIME NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        source TEXT NOT NULL,
        affected_ports TEXT,
        affected_routes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS shipping_routes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        origin_port_id INTEGER,
        destination_port_id INTEGER,
        waypoints TEXT,
        distance REAL NOT NULL,
        estimated_duration REAL NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (origin_port_id) REFERENCES ports (id),
        FOREIGN KEY (destination_port_id) REFERENCES ports (id)
      )`
    ];

    tables.forEach((sql) => {
      this.db!.run(sql, (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        }
      });
    });

    // Insert some sample data
    this.insertSampleData();
  }

  private insertSampleData(): void {
    if (!this.db) return;

    // Sample ports
    const samplePorts = [
      ['Port of Hamburg', 'DEHAM', 'Germany', 53.5511, 9.9937, 'Europe/Berlin', 'commercial'],
      ['Port of Rotterdam', 'NLRTM', 'Netherlands', 51.9244, 4.4777, 'Europe/Amsterdam', 'commercial'],
      ['Port of Singapore', 'SGSIN', 'Singapore', 1.2966, 103.8764, 'Asia/Singapore', 'commercial'],
      ['Port of Shanghai', 'CNSHA', 'China', 31.2304, 121.4737, 'Asia/Shanghai', 'commercial'],
      ['Port of Los Angeles', 'USLAX', 'United States', 33.7370, -118.2644, 'America/Los_Angeles', 'commercial']
    ];

    const insertPort = this.db.prepare(`
      INSERT OR IGNORE INTO ports (name, code, country, latitude, longitude, timezone, type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    samplePorts.forEach((port) => {
      insertPort.run(port);
    });

    insertPort.finalize();
    
    console.log('📊 Sample data inserted');
  }

  public getDatabase(): sqlite3.Database | null {
    return this.db;
  }

  public close(): void {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}