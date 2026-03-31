import { DashboardCard } from './DashboardCard';
import { StatusBadge } from './StatusBadge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';

export function PotholeRepairCard() {
  const data = [
    { year: '2015', value: 2000 },
    { year: '2016', value: 2800 },
    { year: '2017', value: 3200 },
    { year: '2018', value: 2600 },
  ];

  return (
    <DashboardCard 
      title="# of Pothole Repair Requests Closed within SLA" 
      subtitle="Our goal is to repair all requests in 30 days"
    >
      <StatusBadge status="on-target" text="Target below 1,850" />
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <ReferenceLine y={2000} stroke="#9CA3AF" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 mb-1">60</div>
        <div className="text-sm text-gray-600">
          in Closed Status in 2018
        </div>
      </div>
    </DashboardCard>
  );
}
