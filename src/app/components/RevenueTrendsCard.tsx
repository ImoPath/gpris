import { DashboardCard } from './DashboardCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export function RevenueTrendsCard() {
  const data = [
    { year: '2015', value1: 32, value2: 45 },
    { year: '2016', value1: 28, value2: 48 },
    { year: '2017', value1: 35, value2: 42 },
    { year: '2018', value1: 30, value2: 38 },
    { year: '2019', value1: 33, value2: 40 },
  ];

  return (
    <DashboardCard title="Revenue trends">
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `$${value}M`}
            />
            <Bar dataKey="value1" fill="#BFDBFE" />
            <Bar dataKey="value2" fill="#93C5FD" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          $18,346,340.92
        </div>
        <div className="text-sm text-gray-600">
          in Revenues in 2019
        </div>
      </div>
    </DashboardCard>
  );
}
