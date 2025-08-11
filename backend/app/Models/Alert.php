<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'severity',
        'title',
        'message',
        'latitude',
        'longitude',
        'radius_km',
        'start_time',
        'end_time',
        'source_api',
        'metadata',
        'is_active',
        'acknowledged_at',
    ];

    protected $casts = [
        'latitude' => 'decimal:6',
        'longitude' => 'decimal:6',
        'radius_km' => 'decimal:2',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'metadata' => 'array',
        'is_active' => 'boolean',
        'acknowledged_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                    ->where('start_time', '<=', now())
                    ->where(function ($q) {
                        $q->whereNull('end_time')
                          ->orWhere('end_time', '>=', now());
                    });
    }

    public function scopeBySeverity($query, $severity)
    {
        return $query->where('severity', $severity);
    }
}