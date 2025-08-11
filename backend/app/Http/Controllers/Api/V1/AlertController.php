<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AlertController extends Controller
{
    /**
     * Get alerts for a specific area
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'bbox' => 'string', // lat1,lon1,lat2,lon2 format
            'severity' => 'string|in:low,medium,high,critical',
            'type' => 'string|in:weather,safety,operational,system',
            'active_only' => 'boolean',
        ]);

        try {
            $query = Alert::query();

            // Apply bounding box filter if provided
            if ($request->has('bbox')) {
                $bbox = explode(',', $request->bbox);
                if (count($bbox) === 4) {
                    $lat1 = (float) $bbox[0];
                    $lon1 = (float) $bbox[1];
                    $lat2 = (float) $bbox[2];
                    $lon2 = (float) $bbox[3];

                    $query->whereBetween('latitude', [min($lat1, $lat2), max($lat1, $lat2)])
                          ->whereBetween('longitude', [min($lon1, $lon2), max($lon1, $lon2)]);
                }
            }

            // Apply filters
            if ($request->has('severity')) {
                $query->bySeverity($request->severity);
            }

            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            if ($request->boolean('active_only', true)) {
                $query->active();
            }

            // Add user filter if authenticated
            if (auth()->check()) {
                $query->where(function ($q) {
                    $q->whereNull('user_id')
                      ->orWhere('user_id', auth()->id());
                });
            } else {
                $query->whereNull('user_id');
            }

            $alerts = $query->orderBy('severity', 'desc')
                           ->orderBy('start_time', 'desc')
                           ->get();

            return response()->json([
                'success' => true,
                'data' => $alerts,
                'count' => $alerts->count(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch alerts',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a specific alert
     */
    public function show($alertId): JsonResponse
    {
        try {
            $alert = Alert::findOrFail($alertId);

            // Check if user can access this alert
            if ($alert->user_id && (!auth()->check() || $alert->user_id !== auth()->id())) {
                return response()->json([
                    'success' => false,
                    'message' => 'Alert not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $alert,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Alert not found',
            ], 404);
        }
    }

    /**
     * Acknowledge an alert
     */
    public function acknowledge($alertId): JsonResponse
    {
        try {
            $alert = Alert::where('user_id', auth()->id())
                          ->orWhereNull('user_id')
                          ->findOrFail($alertId);

            $alert->update(['acknowledged_at' => now()]);

            return response()->json([
                'success' => true,
                'data' => $alert,
                'message' => 'Alert acknowledged successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to acknowledge alert',
            ], 500);
        }
    }

    /**
     * Create a custom alert (admin only)
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'required|in:weather,safety,operational,system',
            'severity' => 'required|in:low,medium,high,critical',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'radius_km' => 'nullable|numeric|min:0',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after:start_time',
            'metadata' => 'nullable|array',
        ]);

        try {
            $alert = Alert::create([
                'user_id' => auth()->id(),
                'type' => $request->type,
                'severity' => $request->severity,
                'title' => $request->title,
                'message' => $request->message,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'radius_km' => $request->radius_km,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'metadata' => $request->metadata,
                'source_api' => 'manual',
                'is_active' => true,
            ]);

            return response()->json([
                'success' => true,
                'data' => $alert,
                'message' => 'Alert created successfully',
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create alert',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}