export interface WeatherData {
  id?: number;
  location: {
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
  };
  current: {
    temperature: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    visibility: number;
    weatherDescription: string;
    icon: string;
  };
  marine?: {
    waveHeight: number;
    swellHeight: number;
    windWaveHeight: number;
    waveDirection: number;
    wavePeriod: number;
    seaTemperature: number;
  };
  timestamp: Date;
}

export interface Forecast {
  id?: number;
  location: {
    latitude: number;
    longitude: number;
  };
  forecasts: ForecastPeriod[];
  generatedAt: Date;
}

export interface ForecastPeriod {
  datetime: Date;
  temperature: {
    min: number;
    max: number;
    current: number;
  };
  wind: {
    speed: number;
    direction: number;
    gust?: number;
  };
  marine: {
    waveHeight: number;
    swellHeight: number;
    seaTemperature: number;
  };
  conditions: {
    description: string;
    icon: string;
    precipitation: number;
    humidity: number;
  };
}

export interface Port {
  id?: number;
  name: string;
  code: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  type: 'commercial' | 'fishing' | 'military' | 'recreational';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ShippingRoute {
  id?: number;
  name: string;
  description: string;
  origin: Port;
  destination: Port;
  waypoints: Array<{
    latitude: number;
    longitude: number;
    name?: string;
  }>;
  distance: number; // in nautical miles
  estimatedDuration: number; // in hours
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WeatherAlert {
  id?: number;
  type: 'storm' | 'fog' | 'high_waves' | 'high_wind' | 'ice' | 'warning';
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  title: string;
  description: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  source: string;
  affectedPorts?: string[];
  affectedRoutes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}