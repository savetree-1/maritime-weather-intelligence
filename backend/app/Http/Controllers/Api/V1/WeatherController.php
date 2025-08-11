<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\WeatherService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WeatherController extends Controller
{
    protected $weatherService;

    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    /**
     * Get real-time weather data for a specific location
     */
    public function realtime(Request $request): JsonResponse
    {
        $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lon' => 'required|numeric|between:-180,180',
        ]);

        try {
            $data = $this->weatherService->getRealTimeWeather(
                $request->lat,
                $request->lon
            );

            return response()->json([
                'success' => true,
                'data' => $data,
                'timestamp' => now()->toISOString(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch weather data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get weather forecast for a specific location
     */
    public function forecast(Request $request): JsonResponse
    {
        $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lon' => 'required|numeric|between:-180,180',
            'hours' => 'integer|min:1|max:240',
        ]);

        $hours = $request->get('hours', 240);

        try {
            $data = $this->weatherService->getForecast(
                $request->lat,
                $request->lon,
                $hours
            );

            return response()->json([
                'success' => true,
                'data' => $data,
                'forecast_hours' => $hours,
                'timestamp' => now()->toISOString(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch forecast data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get weather data for a route
     */
    public function routeWeather(Request $request): JsonResponse
    {
        $request->validate([
            'route_id' => 'required|integer|exists:routes,id',
            'departure_time' => 'required|date',
        ]);

        try {
            $data = $this->weatherService->getRouteWeather(
                $request->route_id,
                $request->departure_time
            );

            return response()->json([
                'success' => true,
                'data' => $data,
                'route_id' => $request->route_id,
                'timestamp' => now()->toISOString(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch route weather data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}