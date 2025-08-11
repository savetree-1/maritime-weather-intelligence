<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\WeatherController;
use App\Http\Controllers\Api\V1\SpeedController;
use App\Http\Controllers\Api\V1\AlertController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    
    // Public weather endpoints
    Route::get('/weather/realtime', [WeatherController::class, 'realtime']);
    Route::get('/weather/forecast', [WeatherController::class, 'forecast']);
    
    // Public alerts endpoint
    Route::get('/alerts', [AlertController::class, 'index']);
    Route::get('/alerts/{alert}', [AlertController::class, 'show']);
    
    // Protected routes (require authentication)
    Route::middleware('auth:api')->group(function () {
        
        // Weather routes for authenticated users
        Route::get('/weather/route', [WeatherController::class, 'routeWeather']);
        
        // Speed optimization routes
        Route::post('/speed/plan', [SpeedController::class, 'plan']);
        Route::get('/speed/plans/{plan}', [SpeedController::class, 'getPlan']);
        Route::patch('/speed/plans/{plan}/status', [SpeedController::class, 'updatePlanStatus']);
        
        // Alert management routes
        Route::post('/alerts', [AlertController::class, 'store']);
        Route::post('/alerts/{alert}/acknowledge', [AlertController::class, 'acknowledge']);
        
        // Document processing routes (to be implemented)
        Route::post('/docs/upload', function () {
            return response()->json(['message' => 'Document upload endpoint - to be implemented']);
        });
        Route::get('/docs/status/{jobId}', function ($jobId) {
            return response()->json(['message' => "Document status for job {$jobId} - to be implemented"]);
        });
        
    });
    
});