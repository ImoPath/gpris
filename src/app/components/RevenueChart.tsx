import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, MoreVertical } from 'lucide-react';

export function RevenueChart() {
  const data = [
    { month: 'Jan', totalIncome: 90, totalExpenses: 60 },
    { month: 'Feb', totalIncome: 75, totalExpenses: 50 },
    { month: 'Mar', totalIncome: 85, totalExpenses: 65 },
    { month: 'Apr', totalIncome: 70, totalExpenses: 55 },
    { month: 'May', totalIncome: 95, totalExpenses: 70 },
    { month: 'Jun', totalIncome: 80, totalExpenses: 60 },
    { month: 'Jul', totalIncome: 88, totalExpenses: 68 },
    { month: 'Aug', totalIncome: 95, totalExpenses: 75 },
    { month: 'Sep', totalIncome: 85, totalExpenses: 65 },
    { month: 'Oct', totalIncome: 100, totalExpenses: 80 },
    { month: 'Nov', totalIncome: 92, totalExpenses: 72 },
    { month: 'Dec', totalIncome: 98, totalExpenses: 78 },
  ];

  const stats = [
    { label: 'Revenue', value: '$29.5k', icon: <TrendingUp className="w-4 h-4" />, color: 'text-cyan-400' },
    { label: 'Expenses', value: '$16.07k', icon: <TrendingUp className="w-4 h-4" />, color: 'text-red-400' },
    { label: 'Investment', value: '$3.6k', icon: <TrendingUp className="w-4 h-4" />, color: 'text-gray-400' },
  ];

  return (
    <div className="bg-[#1f2333] rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-semibold">Total Revenue</h3>
        <button className="text-gray-400 hover:text-white">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="flex items-center justify-between mb-6">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="flex items-center gap-2 mb-1">
              <div className={stat.color}>{stat.icon}</div>
              <span className="text-gray-400 text-xs">{stat.label}</span>
            </div>
            <p className="text-white text-lg font-semibold">{stat.value}</p>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/200px-Mastercard_2019_logo.svg.png" alt="Mastercard" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png" alt="PayPal" className="h-6" />
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="totalIncome"
              stroke="#06b6d4"
              fill="url(#colorIncome)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="totalExpenses"
              stroke="#10b981"
              fill="url(#colorExpenses)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
          <span className="text-gray-400 text-sm">Total Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-400 text-sm">Total Expenses</span>
        </div>
      </div>
    </div>
  );
}
