import { DashboardCard } from './DashboardCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export function WaterSalesCard() {
  const data = [
    { year: '2015', value: 3.2 },
    { year: '2016', value: 3.5 },
    { year: '2017', value: 3.4 },
    { year: '2018', value: 3.6 },
    { year: '2019', value: 5.2 },
  ];

  return (
    <DashboardCard title="Water Sales over time">
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `$${value}M`}
            />
            <Bar dataKey="value" fill="#93C5FD" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          $3,453,403.10
        </div>
        <div className="text-sm text-gray-600">
          in Revenues in 2019
        </div>
      </div>
    </DashboardCard>
  );
}
