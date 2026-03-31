'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, Download, Target, Calendar } from 'lucide-react';
import * as Icons from 'lucide-react';
import { metricsData, generateHistoricalData, generateCountyData } from '../data/mockData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { motion } from 'motion/react';

export function MetricDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const metric = metricsData.find(m => m.id === id);

  if (!metric) {
    return (
      <div className="p-6 px-[5%]">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Metric not found</h2>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const historicalData = generateHistoricalData(id);
  const countyData = generateCountyData(id);
  const IconComponent = (Icons as any)[metric.icon] || Icons.Activity;

  return (
    <div className="p-4 sm:p-6 px-4 sm:px-[5%] pb-[7%] space-y-4 sm:space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <button
          onClick={() => router.push('/')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          Dashboard
        </button>
        <span className="text-gray-600">/</span>
        <span className="text-white truncate">{metric.title}</span>
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1f2333] rounded-xl border border-gray-700 p-4 sm:p-6 lg:p-8"
        style={{ borderTopColor: metric.color, borderTopWidth: '4px' }}
      >
        <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div 
              className="p-3 sm:p-4 rounded-xl"
              style={{ backgroundColor: `${metric.color}20` }}
            >
              <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: metric.color }} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{metric.title}</h1>
              <p className="text-gray-400 text-base sm:text-lg">{metric.unit}</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Current Value</div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              <AnimatedCounter value={metric.value} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              {metric.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {metric.trendValue}
              </span>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Progress</div>
            <div className="text-2xl sm:text-3xl font-bold text-white">{metric.progress}%</div>
            <div className="w-full h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.progress}%` }}
                transition={{ duration: 1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: metric.color }}
              />
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Target
            </div>
            <div className="text-lg sm:text-xl font-bold text-white">{metric.target}</div>
            <div className="text-gray-400 text-sm mt-1">{metric.timeline}</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Last Updated
            </div>
            <div className="text-base sm:text-lg font-semibold text-white">
              {new Date().toLocaleDateString()}
            </div>
            <div className="text-gray-400 text-sm mt-1">Real-time data</div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 p-4 bg-gray-800/30 rounded-lg">
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{metric.description}</p>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Historical Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1f2333] rounded-xl border border-gray-700 p-4 sm:p-6"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">12-Month Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metric.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={metric.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                tickFormatter={(value) => {
                  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                  return value;
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
                formatter={(value: any) => {
                  if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)}B`;
                  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                  return value.toLocaleString();
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={metric.color}
                strokeWidth={2}
                fill={`url(#gradient-${id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Counties */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1f2333] rounded-xl border border-gray-700 p-4 sm:p-6"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Top 10 Counties</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={countyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="county" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value;
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
                formatter={(value: any) => value.toLocaleString()}
              />
              <Bar dataKey="value" fill={metric.color} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* County Breakdown Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#1f2333] rounded-xl border border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">County Performance Breakdown</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">
            <Download className="w-4 h-4" />
            Export Table
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Rank</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">County</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">Value</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">Performance</th>
              </tr>
            </thead>
            <tbody>
              {countyData.map((county) => (
                <tr key={county.county} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-white font-semibold text-sm">
                      {county.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white font-medium">{county.county}</td>
                  <td className="py-3 px-4 text-right text-white">{county.value.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ 
                            width: `${county.percentage}%`,
                            backgroundColor: metric.color
                          }}
                        />
                      </div>
                      <span className="text-white font-semibold w-12 text-right">
                        {county.percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Forecast Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#1f2333] rounded-xl border border-gray-700 p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Projected Growth to 2027</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Current Annual Growth Rate</div>
            <div className="text-2xl font-bold text-green-500">+{Math.abs(parseFloat(metric.trendValue))}%</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Projected 2027 Value</div>
            <div className="text-2xl font-bold text-white">
              {metric.target}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2">Time to Target</div>
            <div className="text-2xl font-bold text-white">
              {metric.timeline === '2027' ? '1 year' : metric.timeline === '2026' ? '3 months' : '4 years'}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}