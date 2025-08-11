<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vessel_id',
        'route_id',
        'name',
        'departure_time',
        'arrival_time',
        'optimization_type',
        'speed_recommendations',
        'fuel_consumption_estimate',
        'total_cost',
        'safety_score',
        'weather_conditions',
        'explanation',
        'status',
    ];

    protected $casts = [
        'departure_time' => 'datetime',
        'arrival_time' => 'datetime',
        'speed_recommendations' => 'array',
        'fuel_consumption_estimate' => 'decimal:2',
        'total_cost' => 'decimal:2',
        'safety_score' => 'decimal:2',
        'weather_conditions' => 'array',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vessel()
    {
        return $this->belongsTo(Vessel::class);
    }

    public function route()
    {
        return $this->belongsTo(Route::class);
    }
}