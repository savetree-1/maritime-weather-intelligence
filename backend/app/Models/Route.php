<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vessel_id',
        'name',
        'origin_port',
        'destination_port',
        'geometry',
        'distance_nm',
        'sample_points',
        'estimated_duration_hours',
        'status',
    ];

    protected $casts = [
        'geometry' => 'array',
        'sample_points' => 'array',
        'distance_nm' => 'decimal:2',
        'estimated_duration_hours' => 'decimal:2',
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

    public function plans()
    {
        return $this->hasMany(Plan::class);
    }

    public function weatherSamples()
    {
        return $this->hasMany(WeatherSample::class);
    }
}