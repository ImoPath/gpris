'use client';

import { motion } from 'motion/react';
import { TrendingUp, AlertCircle, CheckCircle, Clock, Lightbulb, BarChart3, Users, DollarSign } from 'lucide-react';
import { newsData, metricsData } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export function InsightsPage() {
  // AI-generated insights (mock)
  const insights = [
    {
      type: 'success',
      icon: CheckCircle,
      color: '#10B981',
      title: 'Universal Healthcare Exceeding Targets',
      description: 'SHA registrations are growing 12.5% month-over-month, 3.2% ahead of planned trajectory. At this rate, the 47M target will be reached 4 months ahead of schedule.',
      impact: 'high',
      recommendation: 'Consider allocating surplus resources to quality improvement initiatives.'
    },
    {
      type: 'warning',
      icon: AlertCircle,
      color: '#F59E0B',
      title: 'Affordable Housing Pace Needs Acceleration',
      description: 'Current completion rate of 228,331 units represents only 46% of target. Quarterly growth needs to increase from 5.5% to 8.7% to meet 2027 deadline.',
      impact: 'medium',
      recommendation: 'Review construction bottlenecks and consider public-private partnerships to accelerate delivery.'
    },
    {
      type: 'success',
      icon: TrendingUp,
      color: '#10B981',
      title: 'Digital Jobs Platform Achieving Viral Growth',
      description: 'Youth registration increased 25.4% last month, the highest growth rate across all metrics. Platform engagement metrics show 73% active usage.',
      impact: 'high',
      recommendation: 'Scale up partnerships with international employers to meet demand.'
    },
    {
      type: 'info',
      icon: Lightbulb,
      color: '#3B82F6',
      title: 'Revenue Collection Correlation with Economic Zones',
      description: 'Counties with Special Economic Zones show 34% higher revenue collection. Expanding SEZ framework could boost national revenue by estimated 580B KES annually.',
      impact: 'high',
      recommendation: 'Fast-track SEZ approval process in underperforming counties.'
    },
    {
      type: 'pending',
      icon: Clock,
      color: '#6B7280',
      title: 'Tree Planting Initiative Requires Seasonal Strategy',
      description: 'Planting rate varies significantly by season. Rainy season months show 3x higher success rates. Current trajectory suggests target will be missed by 18 months.',
      impact: 'medium',
      recommendation: 'Concentrate resources and campaigns during optimal planting periods (March-May, October-November).'
    }
  ];

  // Performance comparison data
  const comparisonData = [
    { category: 'Healthcare', current: 64, target: 100 },
    { category: 'Employment', current: 60, target: 100 },
    { category: 'Infrastructure', current: 68, target: 100 },
    { category: 'Agriculture', current: 85, target: 100 },
    { category: 'Revenue', current: 73, target: 100 },
    { category: 'Digital', current: 92, target: 100 },
  ];

  // Budget allocation
  const budgetData = [
    { name: 'Infrastructure', value: 35, color: '#3B82F6' },
    { name: 'Healthcare', value: 22, color: '#10B981' },
    { name: 'Education', value: 18, color: '#F59E0B' },
    { name: 'Agriculture', value: 12, color: '#8B5CF6' },
    { name: 'Digital Economy', value: 8, color: '#EC4899' },
    { name: 'Other', value: 5, color: '#6B7280' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'info': return Lightbulb;
      default: return Clock;
    }
  };

  return (
    <div className="p-4 sm:p-6 px-4 sm:px-[5%] pb-[7%] space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">AI-Powered Insights & Analysis</h1>
        <p className="text-gray-400 text-sm sm:text-base">Data-driven recommendations and trend analysis for Kenya's national projects</p>
      </motion.div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1f2333] rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${insight.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: insight.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{insight.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                      insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {insight.impact.toUpperCase()} IMPACT
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{insight.description}</p>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-yellow-500 font-semibold text-sm">Recommendation: </span>
                        <span className="text-gray-300 text-sm">{insight.recommendation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1f2333] rounded-xl border border-gray-700 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance vs Target
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={comparisonData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="category" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <PolarRadiusAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <Radar name="Current" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Budget Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#1f2333] rounded-xl border border-gray-700 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Budget Allocation by Sector
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent News & Updates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-[#1f2333] rounded-xl border border-gray-700 p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Recent Updates & Milestones</h3>
        <div className="space-y-4">
          {newsData.slice(0, 5).map((news, index) => (
            <div
              key={news.id}
              className="border-l-4 pl-4 py-2 hover:bg-gray-800/30 transition-colors rounded-r"
              style={{ borderColor: news.impact === 'high' ? '#10B981' : news.impact === 'medium' ? '#F59E0B' : '#6B7280' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">{news.title}</h4>
                  <p className="text-gray-400 text-sm mb-2">{news.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{news.date}</span>
                    <span className="px-2 py-1 bg-gray-700 rounded">{news.category}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ml-4 ${
                  news.impact === 'high' ? 'bg-green-500/20 text-green-400' :
                  news.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {news.impact.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6"
        >
          <TrendingUp className="w-8 h-8 text-white mb-3" />
          <div className="text-3xl font-bold text-white mb-1">8/13</div>
          <div className="text-blue-100 text-sm">Projects On Track</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6"
        >
          <CheckCircle className="w-8 h-8 text-white mb-3" />
          <div className="text-3xl font-bold text-white mb-1">68.5%</div>
          <div className="text-green-100 text-sm">Avg. Progress Rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6"
        >
          <Users className="w-8 h-8 text-white mb-3" />
          <div className="text-3xl font-bold text-white mb-1">47</div>
          <div className="text-purple-100 text-sm">Counties Engaged</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-6"
        >
          <DollarSign className="w-8 h-8 text-white mb-3" />
          <div className="text-3xl font-bold text-white mb-1">4.6T</div>
          <div className="text-orange-100 text-sm">Total Budget (KES)</div>
        </motion.div>
      </div>
    </div>
  );
}