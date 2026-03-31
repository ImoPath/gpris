'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Map, MapPin, Activity, TrendingUp, Info } from 'lucide-react';
import { allCountiesData } from '../data/mockData';

export function MapPage() {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'projects' | 'population' | 'budget'>('projects');

  const county = selectedCounty ? allCountiesData.find(c => c.name === selectedCounty) : null;

  // Get color based on value intensity
  const getColor = (value: number, max: number) => {
    const intensity = (value / max) * 100;
    if (intensity > 75) return '#10B981'; // Green
    if (intensity > 50) return '#3B82F6'; // Blue
    if (intensity > 25) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  const maxValues = {
    projects: Math.max(...allCountiesData.map(c => c.projects)),
    population: Math.max(...allCountiesData.map(c => c.population)),
    budget: Math.max(...allCountiesData.map(c => c.budget))
  };

  return (
    <div className="p-4 sm:p-6 px-4 sm:px-[5%] pb-[7%] space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Geographic Distribution Map</h1>
        <p className="text-gray-400 text-sm sm:text-base">Visual representation of projects across Kenya's 47 counties</p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1f2333] rounded-xl border border-gray-700 p-4 sm:p-6"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <span className="text-gray-400 font-semibold text-sm">View by:</span>
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => setSelectedMetric('projects')}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm whitespace-nowrap ${
                  selectedMetric === 'projects'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Active Projects
              </button>
              <button
                onClick={() => setSelectedMetric('population')}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm whitespace-nowrap ${
                  selectedMetric === 'population'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Population
              </button>
              <button
                onClick={() => setSelectedMetric('budget')}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm whitespace-nowrap ${
                  selectedMetric === 'budget'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Budget Allocation
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <span className="text-gray-400 text-xs sm:text-sm font-semibold">Intensity:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-[#EF4444]" />
                <span className="text-gray-400 text-xs sm:text-sm">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-[#F59E0B]" />
                <span className="text-gray-400 text-xs sm:text-sm">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-[#3B82F6]" />
                <span className="text-gray-400 text-xs sm:text-sm">High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-[#10B981]" />
                <span className="text-gray-400 text-xs sm:text-sm">Highest</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Map Visualization (Simplified Grid View) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[#1f2333] rounded-xl border border-gray-700 p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg sm:text-xl font-bold text-white">Kenya Counties Heatmap</h3>
          </div>

          {/* Grid representation of counties */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {allCountiesData.map((c, index) => {
              const value = c[selectedMetric];
              const color = getColor(value, maxValues[selectedMetric]);
              const isSelected = selectedCounty === c.name;

              return (
                <motion.button
                  key={c.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  onClick={() => setSelectedCounty(c.name)}
                  className={`aspect-square rounded-lg p-2 flex flex-col items-center justify-center transition-all ${
                    isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  title={c.name}
                >
                  <MapPin className="w-4 h-4 text-white mb-1" />
                  <span className="text-white text-xs font-semibold text-center leading-tight">
                    {c.name.split(' ')[0]}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">Interactive County Map</p>
              <p className="text-blue-400">
                Click on any county tile to view detailed statistics. Colors represent intensity of the selected metric across all counties.
              </p>
            </div>
          </div>
        </motion.div>

        {/* County Details Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1f2333] rounded-xl border border-gray-700 p-4 sm:p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">County Details</h3>

          {county ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-gray-700">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-1">{county.name}</h4>
                  <p className="text-gray-400 text-sm">County Overview</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Population</span>
                    <Activity className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {county.population.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {((county.population / allCountiesData.reduce((sum, c) => sum + c.population, 0)) * 100).toFixed(1)}% of national
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Active Projects</span>
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {county.projects}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Rank #{allCountiesData.sort((a, b) => b.projects - a.projects).findIndex(c => c.name === county.name) + 1} nationally
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Budget Allocation</span>
                    <Activity className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {(county.budget / 1000000000).toFixed(2)}B
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    KES {(county.budget / county.population).toLocaleString()} per capita
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-2">Efficiency Score</div>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                      style={{ width: `${Math.min((county.projects / county.budget) * 1000000000000, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Projects per billion KES: {(county.projects / (county.budget / 1000000000)).toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                  View Detailed Report
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <Map className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-gray-400 mb-2">No county selected</p>
              <p className="text-gray-500 text-sm">Click on a county tile to view details</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Regional Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#1f2333] rounded-xl border border-gray-700 p-4 sm:p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Regional Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { region: 'Nairobi Metro', counties: 3, color: '#10B981' },
            { region: 'Central', counties: 7, color: '#3B82F6' },
            { region: 'Coast', counties: 6, color: '#8B5CF6' },
            { region: 'Eastern', counties: 8, color: '#F59E0B' },
            { region: 'North Eastern', counties: 3, color: '#EF4444' },
            { region: 'Nyanza', counties: 6, color: '#EC4899' },
            { region: 'Rift Valley', counties: 14, color: '#14B8A6' },
            { region: 'Western', counties: 4, color: '#F97316' },
          ].slice(0, 5).map((region, index) => (
            <div key={region.region} className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: region.color }}
                />
                <span className="text-white font-semibold">{region.region}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{region.counties}</div>
              <div className="text-gray-400 text-sm">Counties</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}