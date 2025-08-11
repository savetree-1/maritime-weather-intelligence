import React, { useState } from 'react';
import { Navigation2, Fuel, Clock, Shield, Settings } from 'lucide-react';
import WeatherMap from '../components/WeatherMap';

const RouteOptimization = () => {
  const [optimizationData, setOptimizationData] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [formData, setFormData] = useState({
    vesselType: 'container',
    serviceSpeed: 14,
    fuelConsumption: 45,
    optimizationType: 'balanced',
    fuelPrice: 650,
    timePenalty: 1000,
  });

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    setTimeout(() => {
      setOptimizationData({
        optimalSpeed: 12.3,
        fuelSavings: 8.5,
        timeDifference: 2.4,
        safetyScore: 92,
        totalCost: 15420,
        recommendations: [
          {
            segment: 'Dover Strait',
            recommendedSpeed: 11.2,
            reason: 'Heavy traffic area, reduced speed for safety',
            conditions: 'Light winds, good visibility',
          },
          {
            segment: 'English Channel',
            recommendedSpeed: 13.1,
            reason: 'Favorable conditions allow higher speed',
            conditions: 'Moderate following winds',
          },
          {
            segment: 'Bay of Biscay',
            recommendedSpeed: 10.8,
            reason: 'Strong headwinds require speed reduction',
            conditions: 'High winds, moderate waves',
          },
        ],
      });
      setIsOptimizing(false);
    }, 3000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const OptimizationCard = ({ icon: Icon, title, value, subtitle, color = 'text-teal-400' }) => (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">{title}</h3>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-white/60 text-sm">{subtitle}</div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Route Optimization</h1>
        <div className="text-white/60">Speed Advisory & Route Planning</div>
      </div>

      {/* Configuration Panel */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Settings className="h-5 w-5 mr-2 text-teal-400" />
          Vessel & Route Configuration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Vessel Type */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Vessel Type
            </label>
            <select
              value={formData.vesselType}
              onChange={(e) => handleInputChange('vesselType', e.target.value)}
              className="input-field w-full"
            >
              <option value="container">Container Ship</option>
              <option value="bulk">Bulk Carrier</option>
              <option value="tanker">Tanker</option>
              <option value="roro">RoRo Ferry</option>
            </select>
          </div>

          {/* Service Speed */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Service Speed (knots)
            </label>
            <input
              type="number"
              value={formData.serviceSpeed}
              onChange={(e) => handleInputChange('serviceSpeed', parseFloat(e.target.value))}
              className="input-field w-full"
              min="8"
              max="25"
              step="0.1"
            />
          </div>

          {/* Fuel Consumption */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Fuel Consumption (tons/day)
            </label>
            <input
              type="number"
              value={formData.fuelConsumption}
              onChange={(e) => handleInputChange('fuelConsumption', parseFloat(e.target.value))}
              className="input-field w-full"
              min="10"
              max="200"
              step="1"
            />
          </div>

          {/* Optimization Type */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Optimization Target
            </label>
            <select
              value={formData.optimizationType}
              onChange={(e) => handleInputChange('optimizationType', e.target.value)}
              className="input-field w-full"
            >
              <option value="fuel">Minimize Fuel Cost</option>
              <option value="time">Minimize Voyage Time</option>
              <option value="safety">Maximize Safety</option>
              <option value="balanced">Balanced Optimization</option>
            </select>
          </div>

          {/* Fuel Price */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Fuel Price (USD/ton)
            </label>
            <input
              type="number"
              value={formData.fuelPrice}
              onChange={(e) => handleInputChange('fuelPrice', parseFloat(e.target.value))}
              className="input-field w-full"
              min="400"
              max="1000"
              step="10"
            />
          </div>

          {/* Time Penalty */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Delay Penalty (USD/hour)
            </label>
            <input
              type="number"
              value={formData.timePenalty}
              onChange={(e) => handleInputChange('timePenalty', parseFloat(e.target.value))}
              className="input-field w-full"
              min="100"
              max="5000"
              step="100"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="btn-primary flex items-center px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOptimizing ? (
              <>
                <div className="spinner h-4 w-4 mr-2"></div>
                Optimizing...
              </>
            ) : (
              <>
                <Navigation2 className="h-4 w-4 mr-2" />
                Optimize Route
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {optimizationData && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <OptimizationCard
              icon={Navigation2}
              title="Optimal Speed"
              value={`${optimizationData.optimalSpeed} kts`}
              subtitle="Recommended cruise speed"
              color="text-teal-400"
            />
            <OptimizationCard
              icon={Fuel}
              title="Fuel Savings"
              value={`${optimizationData.fuelSavings}%`}
              subtitle="Compared to standard speed"
              color="text-green-400"
            />
            <OptimizationCard
              icon={Clock}
              title="Time Difference"
              value={`+${optimizationData.timeDifference}h`}
              subtitle="Additional voyage time"
              color="text-yellow-400"
            />
            <OptimizationCard
              icon={Shield}
              title="Safety Score"
              value={`${optimizationData.safetyScore}%`}
              subtitle="Weather & traffic safety"
              color="text-blue-400"
            />
          </div>

          {/* Speed Recommendations */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Navigation2 className="h-5 w-5 mr-2 text-teal-400" />
              Segment-by-Segment Recommendations
            </h2>
            
            <div className="space-y-4">
              {optimizationData.recommendations.map((rec, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{rec.segment}</h3>
                    <span className="text-teal-400 font-bold">{rec.recommendedSpeed} kts</span>
                  </div>
                  <p className="text-white/80 text-sm mb-2">{rec.reason}</p>
                  <p className="text-white/60 text-xs">Conditions: {rec.conditions}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Route Map */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Navigation2 className="h-5 w-5 mr-2 text-teal-400" />
              Optimized Route Visualization
            </h2>
            <div className="map-container">
              <WeatherMap
                center={[50.5, -1.5]}
                zoom={6}
                showWeatherOverlay={true}
              />
            </div>
            <div className="mt-4 text-white/60 text-sm">
              Route shows optimal speed zones colored by recommendations: 
              <span className="text-green-400 ml-2">Normal Speed</span>
              <span className="text-yellow-400 ml-2">Reduced Speed</span>
              <span className="text-red-400 ml-2">Caution Zone</span>
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Cost Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">$12,340</div>
                <div className="text-white/60 text-sm">Fuel Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">$2,400</div>
                <div className="text-white/60 text-sm">Time Penalty</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">$680</div>
                <div className="text-white/60 text-sm">Safety Margin</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20 text-center">
              <div className="text-3xl font-bold text-teal-400">${optimizationData.totalCost.toLocaleString()}</div>
              <div className="text-white/60">Total Voyage Cost</div>
            </div>
          </div>
        </>
      )}

      {/* Placeholder for no optimization */}
      {!optimizationData && !isOptimizing && (
        <div className="glass-card p-12 text-center">
          <Navigation2 className="h-16 w-16 mx-auto mb-4 text-teal-400/30" />
          <h3 className="text-xl font-semibold text-white mb-2">Ready to Optimize</h3>
          <p className="text-white/60">
            Configure your vessel parameters above and click "Optimize Route" to get speed recommendations
          </p>
        </div>
      )}
    </div>
  );
};

export default RouteOptimization;