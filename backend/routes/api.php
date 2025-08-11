<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\WeatherController;
use App\Http\Controllers\Api\V1\SpeedController;
use App\Http\Controllers\Api\V1\AlertController;
use App\Http\Controllers\Api\V1\DocumentController;

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
        
        // Document processing routes
        Route::post('/docs/upload', [DocumentController::class, 'upload']);
        Route::get('/docs/status/{jobId}', [DocumentController::class, 'status']);
        Route::get('/docs', [DocumentController::class, 'index']);
        Route::get('/docs/{document}', [DocumentController::class, 'show']);
        Route::delete('/docs/{document}', [DocumentController::class, 'destroy']);
        Route::get('/docs/{document}/download', [DocumentController::class, 'download']);
        
    });
    
});