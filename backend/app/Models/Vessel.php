<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vessel extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'imo_number',
        'vessel_type',
        'length',
        'beam',
        'draft',
        'gross_tonnage',
        'deadweight',
        'max_speed',
        'service_speed',
        'fuel_capacity',
        'fuel_consumption_rate',
        'fuel_type',
        'specifications',
    ];

    protected $casts = [
        'specifications' => 'array',
        'length' => 'decimal:2',
        'beam' => 'decimal:2',
        'draft' => 'decimal:2',
        'gross_tonnage' => 'decimal:2',
        'deadweight' => 'decimal:2',
        'max_speed' => 'decimal:2',
        'service_speed' => 'decimal:2',
        'fuel_capacity' => 'decimal:2',
        'fuel_consumption_rate' => 'decimal:3',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function routes()
    {
        return $this->hasMany(Route::class);
    }

    public function plans()
    {
        return $this->hasMany(Plan::class);
    }
}