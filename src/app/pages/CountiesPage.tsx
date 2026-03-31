'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, TrendingUp, Building2, Users, DollarSign } from 'lucide-react';
import { allCountiesData } from '../data/mockData';

export function CountiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'population' | 'projects' | 'budget'>('population');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredCounties = allCountiesData
    .filter(county => county.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortOrder === 'asc'
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });

  const totalPopulation = allCountiesData.reduce((sum, c) => sum + c.population, 0);
  const totalProjects = allCountiesData.reduce((sum, c) => sum + c.projects, 0);
  const totalBudget = allCountiesData.reduce((sum, c) => sum + c.budget, 0);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="p-4 sm:p-6 px-4 sm:px-[5%] pb-[7%] space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">County Performance Dashboard</h1>
        <p className="text-gray-400 text-sm sm:text-base">Track progress across all 47 counties</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6"
        >
          <MapPin className="w-8 h-8 text-white mb-3" />
          <div className="text-3xl font-bold text-white mb-1">47</div>
          <div className="text-blue-100 text-sm">Total Counties</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6"
        >
          <Users className="w-8 h-8 text-white mb-3" />
          <div className="text-3xl font-bold text-white mb-1">
            {(totalPopulation / 1000000).toFixed(1)}M
          </div>
          <div className="text-green-100 text-sm">Total Population</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6"
        >
          <Building2 className="w-8 h-8 text-white mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{totalProjects}</div>
          <div className="text-purple-100 text-sm">Active Projects</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-6"
        >
          <DollarSign className="w-8 h-8 text-white mb-3" />
          <div className="text-3xl font-bold text-white mb-1">
            {(totalBudget / 1000000000).toFixed(0)}B
          </div>
          <div className="text-orange-100 text-sm">Total Budget (KES)</div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#1f2333] rounded-xl border border-gray-700 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search counties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as typeof sortBy)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="name">County Name</option>
              <option value="population">Population</option>
              <option value="projects">Projects</option>
              <option value="budget">Budget</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Counties Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-[#1f2333] rounded-xl border border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold">Rank</th>
                <th 
                  className="text-left py-4 px-6 text-gray-400 font-semibold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    County
                    {sortBy === 'name' && (
                      <TrendingUp className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="text-right py-4 px-6 text-gray-400 font-semibold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('population')}
                >
                  <div className="flex items-center justify-end gap-2">
                    Population
                    {sortBy === 'population' && (
                      <TrendingUp className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="text-right py-4 px-6 text-gray-400 font-semibold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('projects')}
                >
                  <div className="flex items-center justify-end gap-2">
                    Active Projects
                    {sortBy === 'projects' && (
                      <TrendingUp className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="text-right py-4 px-6 text-gray-400 font-semibold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('budget')}
                >
                  <div className="flex items-center justify-end gap-2">
                    Budget (KES)
                    {sortBy === 'budget' && (
                      <TrendingUp className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="text-right py-4 px-6 text-gray-400 font-semibold">Performance</th>
              </tr>
            </thead>
            <tbody>
              {filteredCounties.map((county, index) => {
                const performance = Math.round((county.projects / 156) * 100); // Relative to Nairobi (max)
                return (
                  <motion.tr
                    key={county.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(index * 0.02, 0.5) }}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 text-white font-semibold">
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <span className="text-white font-semibold">{county.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right text-white">
                      {county.population.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full font-semibold">
                        {county.projects}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-white font-medium">
                      {(county.budget / 1000000000).toFixed(1)}B
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                            style={{ width: `${performance}%` }}
                          />
                        </div>
                        <span className="text-white font-semibold w-12 text-right">
                          {performance}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Footer Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-[#1f2333] rounded-xl border border-gray-700 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-gray-400 text-sm mb-2">Average Projects per County</div>
            <div className="text-3xl font-bold text-white">
              {Math.round(totalProjects / allCountiesData.length)}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-2">Average Population per County</div>
            <div className="text-3xl font-bold text-white">
              {(totalPopulation / allCountiesData.length / 1000).toFixed(0)}K
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-2">Average Budget per County</div>
            <div className="text-3xl font-bold text-white">
              {(totalBudget / allCountiesData.length / 1000000000).toFixed(1)}B KES
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}