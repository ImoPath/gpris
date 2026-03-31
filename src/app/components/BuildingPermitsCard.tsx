import { DashboardCard } from './DashboardCard';
import { StatusBadge } from './StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';

export function BuildingPermitsCard() {
  const data = [
    { month: 'Nov 2016', value: 120 },
    { month: 'Dec 2016', value: 95 },
    { month: 'Jan 2017', value: 85 },
    { month: 'Feb 2017', value: 60 },
    { month: 'Mar 2017', value: 55 },
    { month: 'Apr 2017', value: 50 },
    { month: 'May 2017', value: 65 },
    { month: 'Jun 2017', value: 70 },
    { month: 'Jul 2017', value: 60 },
    { month: 'Aug 2017', value: 55 },
    { month: 'Sep 2017', value: 130 },
  ];

  return (
    <DashboardCard title="Building permits (Target 75)">
      <StatusBadge status="needs-focus" text="Target above 75" />
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6B7280', fontSize: 10 }}
              interval={4}
            />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
            <ReferenceLine y={75} stroke="#9CA3AF" strokeDasharray="3 3" />
            <Bar dataKey="value" fill="#93C5FD" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 mb-1">38</div>
        <div className="text-sm text-gray-600">
          in Type Description in Sep 2017
        </div>
      </div>
    </DashboardCard>
  );
}
