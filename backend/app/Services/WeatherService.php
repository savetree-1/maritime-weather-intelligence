<?php

namespace App\Services;

use App\Models\WeatherSample;
use App\Models\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class WeatherService
{
    protected $openWeatherApiKey;
    protected $openMeteoBaseUrl = 'https://api.open-meteo.com/v1';
    protected $cacheTtl = 300; // 5 minutes

    public function __construct()
    {
        $this->openWeatherApiKey = env('OPENWEATHER_API_KEY');
    }

    /**
     * Get real-time weather data for a location
     */
    public function getRealTimeWeather(float $lat, float $lon): array
    {
        $cacheKey = "weather_realtime_{$lat}_{$lon}";
        
        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($lat, $lon) {
            $data = [];

            // Fetch from OpenWeatherMap if API key is available
            if ($this->openWeatherApiKey) {
                $data['openweather'] = $this->fetchOpenWeatherCurrent($lat, $lon);
            }

            // Fetch from Open-Meteo (free, no key required)
            $data['openmeteo'] = $this->fetchOpenMeteoCurrent($lat, $lon);

            // Normalize and merge the data
            return $this->normalizeCurrentWeatherData($data, $lat, $lon);
        });
    }

    /**
     * Get weather forecast for a location
     */
    public function getForecast(float $lat, float $lon, int $hours = 240): array
    {
        $cacheKey = "weather_forecast_{$lat}_{$lon}_{$hours}";
        
        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($lat, $lon, $hours) {
            $data = [];

            // Fetch from Open-Meteo (supports up to 16 days)
            $data['openmeteo'] = $this->fetchOpenMeteoForecast($lat, $lon, $hours);

            if ($this->openWeatherApiKey) {
                $data['openweather'] = $this->fetchOpenWeatherForecast($lat, $lon, min($hours, 120)); // 5-day limit
            }

            return $this->normalizeForecastData($data, $lat, $lon, $hours);
        });
    }

    /**
     * Get weather data for all points along a route
     */
    public function getRouteWeather(int $routeId, string $departureTime): array
    {
        $route = Route::findOrFail($routeId);
        $samplePoints = $route->sample_points;
        $departureTime = Carbon::parse($departureTime);
        
        $weatherData = [];
        $estimatedSpeed = 12; // knots, default assumption for timing
        
        foreach ($samplePoints as $index => $point) {
            // Calculate estimated time at this point
            $hoursFromStart = ($index / count($samplePoints)) * ($route->estimated_duration_hours ?? 24);
            $pointTime = $departureTime->copy()->addHours($hoursFromStart);
            
            // Get forecast for this point and time
            $forecast = $this->getForecastAtTime($point['lat'], $point['lng'], $pointTime);
            
            $weatherData[] = [
                'point_index' => $index,
                'latitude' => $point['lat'],
                'longitude' => $point['lng'],
                'estimated_time' => $pointTime->toISOString(),
                'weather' => $forecast,
            ];
        }

        return [
            'route_id' => $routeId,
            'departure_time' => $departureTime->toISOString(),
            'weather_data' => $weatherData,
            'summary' => $this->generateWeatherSummary($weatherData),
        ];
    }

    /**
     * Fetch current weather from OpenWeatherMap
     */
    protected function fetchOpenWeatherCurrent(float $lat, float $lon): ?array
    {
        try {
            $response = Http::get('https://api.openweathermap.org/data/2.5/weather', [
                'lat' => $lat,
                'lon' => $lon,
                'appid' => $this->openWeatherApiKey,
                'units' => 'metric',
            ]);

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('OpenWeatherMap API error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Fetch current weather from Open-Meteo
     */
    protected function fetchOpenMeteoCurrent(float $lat, float $lon): ?array
    {
        try {
            $response = Http::get($this->openMeteoBaseUrl . '/forecast', [
                'latitude' => $lat,
                'longitude' => $lon,
                'current' => 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
                'timezone' => 'UTC',
            ]);

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('Open-Meteo API error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Fetch forecast from Open-Meteo
     */
    protected function fetchOpenMeteoForecast(float $lat, float $lon, int $hours): ?array
    {
        try {
            $response = Http::get($this->openMeteoBaseUrl . '/forecast', [
                'latitude' => $lat,
                'longitude' => $lon,
                'hourly' => 'temperature_2m,relative_humidity_2m,precipitation,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
                'forecast_days' => min(16, ceil($hours / 24)),
                'timezone' => 'UTC',
            ]);

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('Open-Meteo forecast API error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Fetch forecast from OpenWeatherMap
     */
    protected function fetchOpenWeatherForecast(float $lat, float $lon, int $hours): ?array
    {
        try {
            $response = Http::get('https://api.openweathermap.org/data/2.5/forecast', [
                'lat' => $lat,
                'lon' => $lon,
                'appid' => $this->openWeatherApiKey,
                'units' => 'metric',
                'cnt' => min(40, ceil($hours / 3)), // 3-hour intervals, max 40 (5 days)
            ]);

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('OpenWeatherMap forecast API error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Normalize current weather data from multiple sources
     */
    protected function normalizeCurrentWeatherData(array $sources, float $lat, float $lon): array
    {
        $normalized = [
            'latitude' => $lat,
            'longitude' => $lon,
            'timestamp' => now()->toISOString(),
            'temperature' => null,
            'humidity' => null,
            'pressure' => null,
            'wind_speed' => null,
            'wind_direction' => null,
            'visibility' => null,
            'cloud_cover' => null,
            'precipitation' => null,
            'weather_code' => null,
            'sources' => array_keys($sources),
        ];

        // Prefer Open-Meteo data, fallback to OpenWeather
        if (isset($sources['openmeteo']['current'])) {
            $current = $sources['openmeteo']['current'];
            $normalized['temperature'] = $current['temperature_2m'] ?? null;
            $normalized['humidity'] = $current['relative_humidity_2m'] ?? null;
            $normalized['pressure'] = $current['pressure_msl'] ?? null;
            $normalized['wind_speed'] = $current['wind_speed_10m'] ?? null;
            $normalized['wind_direction'] = $current['wind_direction_10m'] ?? null;
            $normalized['cloud_cover'] = $current['cloud_cover'] ?? null;
            $normalized['precipitation'] = $current['precipitation'] ?? null;
            $normalized['weather_code'] = $current['weather_code'] ?? null;
        }

        if (isset($sources['openweather'])) {
            $ow = $sources['openweather'];
            $normalized['temperature'] = $normalized['temperature'] ?? $ow['main']['temp'];
            $normalized['humidity'] = $normalized['humidity'] ?? $ow['main']['humidity'];
            $normalized['pressure'] = $normalized['pressure'] ?? $ow['main']['pressure'];
            $normalized['wind_speed'] = $normalized['wind_speed'] ?? $ow['wind']['speed'];
            $normalized['wind_direction'] = $normalized['wind_direction'] ?? $ow['wind']['deg'];
            $normalized['visibility'] = $normalized['visibility'] ?? ($ow['visibility'] ?? null) / 1000; // Convert to km
            $normalized['cloud_cover'] = $normalized['cloud_cover'] ?? $ow['clouds']['all'];
        }

        return $normalized;
    }

    /**
     * Normalize forecast data from multiple sources
     */
    protected function normalizeForecastData(array $sources, float $lat, float $lon, int $hours): array
    {
        $forecast = [];

        if (isset($sources['openmeteo']['hourly'])) {
            $hourly = $sources['openmeteo']['hourly'];
            $times = $hourly['time'] ?? [];
            
            for ($i = 0; $i < min(count($times), $hours); $i++) {
                $forecast[] = [
                    'timestamp' => $times[$i],
                    'temperature' => $hourly['temperature_2m'][$i] ?? null,
                    'humidity' => $hourly['relative_humidity_2m'][$i] ?? null,
                    'pressure' => $hourly['pressure_msl'][$i] ?? null,
                    'wind_speed' => $hourly['wind_speed_10m'][$i] ?? null,
                    'wind_direction' => $hourly['wind_direction_10m'][$i] ?? null,
                    'visibility' => $hourly['visibility'][$i] ?? null,
                    'cloud_cover' => $hourly['cloud_cover'][$i] ?? null,
                    'precipitation' => $hourly['precipitation'][$i] ?? null,
                    'weather_code' => $hourly['weather_code'][$i] ?? null,
                ];
            }
        }

        return [
            'latitude' => $lat,
            'longitude' => $lon,
            'forecast_hours' => $hours,
            'forecast' => $forecast,
            'sources' => array_keys($sources),
        ];
    }

    /**
     * Get forecast for a specific time and location
     */
    protected function getForecastAtTime(float $lat, float $lon, Carbon $targetTime): array
    {
        $hoursFromNow = $targetTime->diffInHours(now());
        $forecast = $this->getForecast($lat, $lon, min(240, $hoursFromNow + 6));
        
        // Find the closest forecast entry
        $closestForecast = null;
        $minDiff = PHP_INT_MAX;
        
        foreach ($forecast['forecast'] as $entry) {
            $entryTime = Carbon::parse($entry['timestamp']);
            $diff = abs($entryTime->diffInMinutes($targetTime));
            
            if ($diff < $minDiff) {
                $minDiff = $diff;
                $closestForecast = $entry;
            }
        }
        
        return $closestForecast ?? [];
    }

    /**
     * Generate weather summary for route
     */
    protected function generateWeatherSummary(array $weatherData): array
    {
        $temperatures = [];
        $windSpeeds = [];
        $precipitations = [];
        
        foreach ($weatherData as $point) {
            if (isset($point['weather']['temperature'])) {
                $temperatures[] = $point['weather']['temperature'];
            }
            if (isset($point['weather']['wind_speed'])) {
                $windSpeeds[] = $point['weather']['wind_speed'];
            }
            if (isset($point['weather']['precipitation'])) {
                $precipitations[] = $point['weather']['precipitation'];
            }
        }
        
        return [
            'temperature_range' => [
                'min' => $temperatures ? min($temperatures) : null,
                'max' => $temperatures ? max($temperatures) : null,
                'avg' => $temperatures ? array_sum($temperatures) / count($temperatures) : null,
            ],
            'wind_speed_range' => [
                'min' => $windSpeeds ? min($windSpeeds) : null,
                'max' => $windSpeeds ? max($windSpeeds) : null,
                'avg' => $windSpeeds ? array_sum($windSpeeds) / count($windSpeeds) : null,
            ],
            'total_precipitation' => $precipitations ? array_sum($precipitations) : null,
            'conditions_summary' => $this->generateConditionsSummary($weatherData),
        ];
    }

    /**
     * Generate human-readable conditions summary
     */
    protected function generateConditionsSummary(array $weatherData): string
    {
        // Analyze weather patterns and generate summary
        $windSpeeds = array_filter(array_column(array_column($weatherData, 'weather'), 'wind_speed'));
        $avgWindSpeed = $windSpeeds ? array_sum($windSpeeds) / count($windSpeeds) : 0;
        
        if ($avgWindSpeed > 15) {
            return "High winds expected along route (avg {$avgWindSpeed} m/s). Consider speed adjustments.";
        } elseif ($avgWindSpeed > 10) {
            return "Moderate winds expected (avg {$avgWindSpeed} m/s). Good sailing conditions.";
        } else {
            return "Light winds expected (avg {$avgWindSpeed} m/s). Calm conditions.";
        }
    }
}