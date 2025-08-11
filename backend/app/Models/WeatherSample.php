<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeatherSample extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_id',
        'latitude',
        'longitude',
        'timestamp',
        'temperature',
        'humidity',
        'pressure',
        'wind_speed',
        'wind_direction',
        'wave_height',
        'wave_period',
        'wave_direction',
        'visibility',
        'precipitation',
        'cloud_cover',
        'source_api',
        'raw_data',
    ];

    protected $casts = [
        'timestamp' => 'datetime',
        'latitude' => 'decimal:6',
        'longitude' => 'decimal:6',
        'temperature' => 'decimal:2',
        'humidity' => 'decimal:2',
        'pressure' => 'decimal:2',
        'wind_speed' => 'decimal:2',
        'wind_direction' => 'decimal:2',
        'wave_height' => 'decimal:2',
        'wave_period' => 'decimal:2',
        'wave_direction' => 'decimal:2',
        'visibility' => 'decimal:2',
        'precipitation' => 'decimal:2',
        'cloud_cover' => 'decimal:2',
        'raw_data' => 'array',
    ];

    // Relationships
    public function route()
    {
        return $this->belongsTo(Route::class);
    }
}