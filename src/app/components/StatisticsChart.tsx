import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, MoreVertical } from 'lucide-react';

export function StatisticsChart() {
  const data = [
    { month: 'Jan', openCampaign: 80, marketingCost: 65 },
    { month: 'Feb', openCampaign: 120, marketingCost: 45 },
    { month: 'Mar', openCampaign: 95, marketingCost: 75 },
    { month: 'Apr', openCampaign: 140, marketingCost: 85 },
    { month: 'May', openCampaign: 100, marketingCost: 55 },
    { month: 'Jun', openCampaign: 125, marketingCost: 95 },
    { month: 'Jul', openCampaign: 90, marketingCost: 70 },
    { month: 'Aug', openCampaign: 160, marketingCost: 50 },
    { month: 'Sep', openCampaign: 110, marketingCost: 85 },
    { month: 'Oct', openCampaign: 135, marketingCost: 65 },
    { month: 'Nov', openCampaign: 95, marketingCost: 90 },
    { month: 'Dec', openCampaign: 120, marketingCost: 75 },
  ];

  const stats = [
    { label: 'Total Income', value: '$35.2k', icon: <TrendingUp className="w-4 h-4" />, color: 'text-cyan-400' },
    { label: 'Total Expenditure', value: '$18.9k', icon: <TrendingUp className="w-4 h-4" />, color: 'text-red-400' },
    { label: 'Capital Invested', value: '$5.2k', icon: <TrendingUp className="w-4 h-4" />, color: 'text-gray-400' },
    { label: 'Net Savings', value: '$8.1k', icon: <TrendingUp className="w-4 h-4" />, color: 'text-gray-400' },
  ];

  return (
    <div className="bg-[#1f2333] rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-semibold">Statistics</h3>
        <button className="text-gray-400 hover:text-white">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="flex items-center gap-2 mb-1">
              <div className={stat.color}>{stat.icon}</div>
              <span className="text-gray-400 text-xs">{stat.label}</span>
            </div>
            <p className="text-white text-lg font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#2a2d3a' }}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#2a2d3a' }}
              tickFormatter={(value) => `${value}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1d2e',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="openCampaign" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="marketingCost" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
          <span className="text-gray-400 text-sm">Open Campaign</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-gray-400 text-sm">Marketing Cost</span>
        </div>
      </div>
    </div>
  );
}
