<?php

namespace App\Services;

use App\Models\Vessel;
use App\Models\Route;
use Carbon\Carbon;

class SpeedOptimizationService
{
    protected $weatherService;

    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    /**
     * Optimize speed for a given route and vessel
     */
    public function optimizeSpeed(array $params): array
    {
        $vessel = $params['vessel'];
        $route = $params['route'];
        $departureTime = Carbon::parse($params['departure_time']);
        $optimizationType = $params['optimization_type'];
        $fuelPrice = $params['fuel_price'];
        $timePenalty = $params['time_penalty'];

        // Get weather data for the route
        $routeWeather = $this->weatherService->getRouteWeather($route->id, $departureTime->toISOString());

        // Generate speed candidates
        $speedCandidates = $this->generateSpeedCandidates($vessel);

        // Evaluate each candidate
        $evaluations = [];
        foreach ($speedCandidates as $speed) {
            $evaluation = $this->evaluateSpeedCandidate($speed, $vessel, $route, $routeWeather, $fuelPrice, $timePenalty);
            $evaluation['candidate_speed'] = $speed;
            $evaluations[] = $evaluation;
        }

        // Select optimal speed based on optimization type
        $optimalPlan = $this->selectOptimalPlan($evaluations, $optimizationType);

        // Generate detailed recommendations
        $recommendations = $this->generateSpeedRecommendations($route, $routeWeather, $vessel, $optimalPlan);

        return [
            'optimization_type' => $optimizationType,
            'optimal_speed' => $optimalPlan['candidate_speed'],
            'estimated_arrival' => $this->calculateArrivalTime($departureTime, $route, $optimalPlan['effective_speed']),
            'fuel_consumption' => $optimalPlan['fuel_consumption'],
            'total_cost' => $optimalPlan['total_cost'],
            'safety_score' => $optimalPlan['safety_score'],
            'speed_recommendations' => $recommendations,
            'weather_summary' => $routeWeather['summary'],
            'explanation' => $this->generateExplanation($optimalPlan, $optimizationType, $routeWeather),
            'candidates_evaluated' => count($evaluations),
            'all_evaluations' => $evaluations,
        ];
    }

    /**
     * Generate speed candidates based on vessel specifications
     */
    protected function generateSpeedCandidates(Vessel $vessel): array
    {
        $serviceSpeed = $vessel->service_speed;
        
        return [
            round($serviceSpeed * 0.6, 1), // Economic speed
            round($serviceSpeed * 0.8, 1), // Efficient speed
            round($serviceSpeed * 1.0, 1), // Service speed
            round(min($serviceSpeed * 1.1, $vessel->max_speed), 1), // Fast speed (capped at max)
        ];
    }

    /**
     * Evaluate a speed candidate considering weather effects
     */
    protected function evaluateSpeedCandidate(float $speed, Vessel $vessel, Route $route, array $routeWeather, float $fuelPrice, float $timePenalty): array
    {
        $totalDistance = $route->distance_nm;
        $weatherData = $routeWeather['weather_data'];
        
        $totalFuelConsumption = 0;
        $totalTime = 0;
        $safetyPenalties = 0;
        $effectiveSpeedSum = 0;
        $segmentCount = count($weatherData);

        foreach ($weatherData as $index => $segment) {
            $weather = $segment['weather'];
            $segmentDistance = $totalDistance / $segmentCount; // Assume equal segments
            
            // Calculate weather effects on speed
            $weatherEffect = $this->calculateWeatherEffect($weather, $speed);
            $effectiveSpeed = $speed * $weatherEffect['speed_factor'];
            $effectiveSpeedSum += $effectiveSpeed;
            
            // Calculate time for this segment
            $segmentTime = $segmentDistance / $effectiveSpeed; // hours
            $totalTime += $segmentTime;
            
            // Calculate fuel consumption for this segment
            $segmentFuelConsumption = $this->calculateFuelConsumption($vessel, $effectiveSpeed, $segmentTime, $weather);
            $totalFuelConsumption += $segmentFuelConsumption;
            
            // Calculate safety penalties
            $safetyPenalties += $this->calculateSafetyPenalty($weather, $effectiveSpeed, $vessel);
        }

        $averageEffectiveSpeed = $effectiveSpeedSum / $segmentCount;
        $fuelCost = $totalFuelConsumption * $fuelPrice;
        $delayCost = max(0, $totalTime - ($route->estimated_duration_hours ?? 24)) * $timePenalty;
        $totalCost = $fuelCost + $delayCost + $safetyPenalties;
        
        // Safety score (0-100, higher is safer)
        $safetyScore = max(0, 100 - ($safetyPenalties / 10));

        return [
            'effective_speed' => $averageEffectiveSpeed,
            'total_time' => $totalTime,
            'fuel_consumption' => $totalFuelConsumption,
            'fuel_cost' => $fuelCost,
            'delay_cost' => $delayCost,
            'safety_penalties' => $safetyPenalties,
            'total_cost' => $totalCost,
            'safety_score' => $safetyScore,
        ];
    }

    /**
     * Calculate weather effects on vessel speed
     */
    protected function calculateWeatherEffect(array $weather, float $speed): array
    {
        $windSpeed = $weather['wind_speed'] ?? 0;
        $waveHeight = $weather['wave_height'] ?? 0;
        $visibility = $weather['visibility'] ?? 10;
        
        // Wind resistance factor
        $windFactor = 1.0;
        if ($windSpeed > 20) {
            $windFactor = 0.8; // Severe wind
        } elseif ($windSpeed > 15) {
            $windFactor = 0.9; // Strong wind
        } elseif ($windSpeed > 10) {
            $windFactor = 0.95; // Moderate wind
        }
        
        // Wave resistance factor
        $waveFactor = 1.0;
        if ($waveHeight > 4) {
            $waveFactor = 0.7; // High waves
        } elseif ($waveHeight > 2) {
            $waveFactor = 0.85; // Moderate waves
        } elseif ($waveHeight > 1) {
            $waveFactor = 0.95; // Light waves
        }
        
        // Visibility factor (affects safe speed)
        $visibilityFactor = 1.0;
        if ($visibility < 1) {
            $visibilityFactor = 0.5; // Very poor visibility
        } elseif ($visibility < 3) {
            $visibilityFactor = 0.7; // Poor visibility
        } elseif ($visibility < 5) {
            $visibilityFactor = 0.9; // Reduced visibility
        }
        
        $overallSpeedFactor = $windFactor * $waveFactor * $visibilityFactor;
        
        return [
            'speed_factor' => $overallSpeedFactor,
            'wind_factor' => $windFactor,
            'wave_factor' => $waveFactor,
            'visibility_factor' => $visibilityFactor,
        ];
    }

    /**
     * Calculate fuel consumption for a vessel segment
     */
    protected function calculateFuelConsumption(Vessel $vessel, float $effectiveSpeed, float $time, array $weather): float
    {
        $baseFuelRate = $vessel->fuel_consumption_rate; // tons/hour at service speed
        $serviceSpeed = $vessel->service_speed;
        
        // Fuel consumption follows cubic relationship with speed
        $speedRatio = $effectiveSpeed / $serviceSpeed;
        $speedFuelFactor = pow($speedRatio, 3);
        
        // Weather resistance increases fuel consumption
        $windSpeed = $weather['wind_speed'] ?? 0;
        $waveHeight = $weather['wave_height'] ?? 0;
        
        $weatherResistanceFactor = 1.0;
        $weatherResistanceFactor += ($windSpeed / 100); // 1% increase per m/s wind
        $weatherResistanceFactor += ($waveHeight / 10);  // 10% increase per meter wave height
        
        return $baseFuelRate * $speedFuelFactor * $weatherResistanceFactor * $time;
    }

    /**
     * Calculate safety penalty based on conditions
     */
    protected function calculateSafetyPenalty(array $weather, float $effectiveSpeed, Vessel $vessel): float
    {
        $penalty = 0;
        
        $windSpeed = $weather['wind_speed'] ?? 0;
        $waveHeight = $weather['wave_height'] ?? 0;
        $visibility = $weather['visibility'] ?? 10;
        
        // High wind penalty
        if ($windSpeed > 25) {
            $penalty += 100; // Very dangerous
        } elseif ($windSpeed > 20) {
            $penalty += 50; // Dangerous
        } elseif ($windSpeed > 15) {
            $penalty += 20; // Moderate risk
        }
        
        // High wave penalty
        if ($waveHeight > 6) {
            $penalty += 80; // Very dangerous
        } elseif ($waveHeight > 4) {
            $penalty += 40; // Dangerous
        } elseif ($waveHeight > 2) {
            $penalty += 15; // Moderate risk
        }
        
        // Low visibility penalty
        if ($visibility < 1) {
            $penalty += 60; // Very dangerous
        } elseif ($visibility < 3) {
            $penalty += 30; // Dangerous
        } elseif ($visibility < 5) {
            $penalty += 10; // Moderate risk
        }
        
        // Speed vs conditions penalty
        $maxSafeSpeed = $vessel->service_speed * 0.8; // Conservative speed in bad conditions
        if ($effectiveSpeed > $maxSafeSpeed && ($windSpeed > 15 || $waveHeight > 2)) {
            $penalty += 25; // Too fast for conditions
        }
        
        return $penalty;
    }

    /**
     * Select optimal plan based on optimization type
     */
    protected function selectOptimalPlan(array $evaluations, string $optimizationType): array
    {
        switch ($optimizationType) {
            case 'fuel':
                return collect($evaluations)->sortBy('fuel_consumption')->first();
            
            case 'time':
                return collect($evaluations)->sortBy('total_time')->first();
            
            case 'safety':
                return collect($evaluations)->sortByDesc('safety_score')->first();
            
            case 'balanced':
            default:
                return collect($evaluations)->sortBy('total_cost')->first();
        }
    }

    /**
     * Generate detailed speed recommendations per route segment
     */
    protected function generateSpeedRecommendations(Route $route, array $routeWeather, Vessel $vessel, array $optimalPlan): array
    {
        $recommendations = [];
        $weatherData = $routeWeather['weather_data'];
        $baseSpeed = $optimalPlan['candidate_speed'];
        
        foreach ($weatherData as $index => $segment) {
            $weather = $segment['weather'];
            $weatherEffect = $this->calculateWeatherEffect($weather, $baseSpeed);
            $recommendedSpeed = $baseSpeed * $weatherEffect['speed_factor'];
            
            $recommendations[] = [
                'segment_index' => $index,
                'latitude' => $segment['latitude'],
                'longitude' => $segment['longitude'],
                'estimated_time' => $segment['estimated_time'],
                'base_speed' => $baseSpeed,
                'recommended_speed' => round($recommendedSpeed, 1),
                'weather_effect' => $weatherEffect,
                'weather_conditions' => $weather,
                'reasoning' => $this->generateSegmentReasoning($weather, $weatherEffect, $baseSpeed, $recommendedSpeed),
            ];
        }
        
        return $recommendations;
    }

    /**
     * Generate explanation for speed recommendation
     */
    protected function generateSegmentReasoning(array $weather, array $weatherEffect, float $baseSpeed, float $recommendedSpeed): string
    {
        $reasons = [];
        
        $windSpeed = $weather['wind_speed'] ?? 0;
        $waveHeight = $weather['wave_height'] ?? 0;
        $visibility = $weather['visibility'] ?? 10;
        
        if ($windSpeed > 15) {
            $reasons[] = "Strong winds ({$windSpeed} m/s) require reduced speed";
        }
        
        if ($waveHeight > 2) {
            $reasons[] = "High waves ({$waveHeight} m) impact vessel stability";
        }
        
        if ($visibility < 5) {
            $reasons[] = "Reduced visibility ({$visibility} km) requires caution";
        }
        
        if (empty($reasons)) {
            $reasons[] = "Good weather conditions allow optimal speed";
        }
        
        $speedChange = $recommendedSpeed - $baseSpeed;
        if (abs($speedChange) > 0.5) {
            $direction = $speedChange > 0 ? 'increased' : 'reduced';
            $reasons[] = "Speed {$direction} by " . round(abs($speedChange), 1) . " knots due to conditions";
        }
        
        return implode('. ', $reasons) . '.';
    }

    /**
     * Calculate estimated arrival time
     */
    protected function calculateArrivalTime(Carbon $departureTime, Route $route, float $effectiveSpeed): Carbon
    {
        $totalTime = $route->distance_nm / $effectiveSpeed;
        return $departureTime->copy()->addHours($totalTime);
    }

    /**
     * Generate overall explanation for the optimization
     */
    protected function generateExplanation(array $optimalPlan, string $optimizationType, array $routeWeather): string
    {
        $explanation = [];
        
        // Optimization type explanation
        switch ($optimizationType) {
            case 'fuel':
                $explanation[] = "Optimization focused on minimizing fuel consumption";
                break;
            case 'time':
                $explanation[] = "Optimization focused on minimizing voyage time";
                break;
            case 'safety':
                $explanation[] = "Optimization focused on maximizing safety";
                break;
            case 'balanced':
                $explanation[] = "Optimization balanced fuel cost, time, and safety considerations";
                break;
        }
        
        // Weather considerations
        $weatherSummary = $routeWeather['summary'];
        $avgWindSpeed = $weatherSummary['wind_speed_range']['avg'] ?? 0;
        
        if ($avgWindSpeed > 15) {
            $explanation[] = "Strong winds along route require careful speed management";
        } elseif ($avgWindSpeed > 10) {
            $explanation[] = "Moderate winds present along route";
        } else {
            $explanation[] = "Generally calm conditions expected";
        }
        
        // Results summary
        $explanation[] = sprintf(
            "Recommended speed achieves %.1f%% safety score with %.2f tons fuel consumption",
            $optimalPlan['safety_score'],
            $optimalPlan['fuel_consumption']
        );
        
        return implode('. ', $explanation) . '.';
    }
}