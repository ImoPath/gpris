import { DashboardCard } from './DashboardCard';
import { StatusBadge } from './StatusBadge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';

export function ParksAttendanceCard() {
  const data = [
    { year: '2011', value: 2000 },
    { year: '2012', value: 2050 },
    { year: '2013', value: 2100 },
    { year: '2014', value: 2200 },
    { year: '2015', value: 2150 },
    { year: '2016', value: 1800 },
  ];

  return (
    <DashboardCard 
      title="Parks Attendance Target" 
      subtitle="Strategic Goal - Resident satisfaction and operational..."
    >
      <StatusBadge status="needs-focus" text="Target above 1,500" />
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              domain={[0, 2500]}
            />
            <ReferenceLine y={1500} stroke="#9CA3AF" strokeDasharray="3 3" />
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
        <div className="text-3xl font-bold text-gray-900 mb-1">1,319</div>
        <div className="text-sm text-gray-600">
          in Activity in 2016
        </div>
      </div>
    </DashboardCard>
  );
}
