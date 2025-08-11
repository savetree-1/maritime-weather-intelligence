<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\SpeedOptimizationService;
use App\Models\Plan;
use App\Models\Route;
use App\Models\Vessel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SpeedController extends Controller
{
    protected $optimizationService;

    public function __construct(SpeedOptimizationService $optimizationService)
    {
        $this->optimizationService = $optimizationService;
    }

    /**
     * Create a new speed optimization plan
     */
    public function plan(Request $request): JsonResponse
    {
        $request->validate([
            'vessel_id' => 'required|integer|exists:vessels,id',
            'route_id' => 'required|integer|exists:routes,id',
            'departure_time' => 'required|date',
            'optimization_type' => 'required|in:fuel,time,safety,balanced',
            'fuel_price' => 'required|numeric|min:0',
            'time_penalty' => 'required|numeric|min:0',
            'name' => 'string|max:255',
        ]);

        try {
            $vessel = Vessel::findOrFail($request->vessel_id);
            $route = Route::findOrFail($request->route_id);

            // Check if user owns the vessel and route
            if ($vessel->user_id !== auth()->id() || $route->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to vessel or route',
                ], 403);
            }

            $optimization = $this->optimizationService->optimizeSpeed([
                'vessel' => $vessel,
                'route' => $route,
                'departure_time' => $request->departure_time,
                'optimization_type' => $request->optimization_type,
                'fuel_price' => $request->fuel_price,
                'time_penalty' => $request->time_penalty,
            ]);

            // Create the plan record
            $plan = Plan::create([
                'user_id' => auth()->id(),
                'vessel_id' => $request->vessel_id,
                'route_id' => $request->route_id,
                'name' => $request->name ?? "Plan " . now()->format('Y-m-d H:i'),
                'departure_time' => $request->departure_time,
                'arrival_time' => $optimization['estimated_arrival'],
                'optimization_type' => $request->optimization_type,
                'speed_recommendations' => $optimization['speed_recommendations'],
                'fuel_consumption_estimate' => $optimization['fuel_consumption'],
                'total_cost' => $optimization['total_cost'],
                'safety_score' => $optimization['safety_score'],
                'weather_conditions' => $optimization['weather_summary'],
                'explanation' => $optimization['explanation'],
                'status' => 'draft',
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'plan_id' => $plan->id,
                    'optimization' => $optimization,
                ],
                'message' => 'Speed optimization completed successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create optimization plan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get plan details
     */
    public function getPlan(Request $request, $planId): JsonResponse
    {
        try {
            $plan = Plan::with(['vessel', 'route'])
                ->where('user_id', auth()->id())
                ->findOrFail($planId);

            return response()->json([
                'success' => true,
                'data' => $plan,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Plan not found',
            ], 404);
        }
    }

    /**
     * Update plan status
     */
    public function updatePlanStatus(Request $request, $planId): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:draft,active,completed,cancelled',
        ]);

        try {
            $plan = Plan::where('user_id', auth()->id())->findOrFail($planId);
            $plan->update(['status' => $request->status]);

            return response()->json([
                'success' => true,
                'data' => $plan,
                'message' => 'Plan status updated successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update plan status',
            ], 500);
        }
    }
}