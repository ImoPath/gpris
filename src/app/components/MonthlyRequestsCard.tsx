import { DashboardCard } from './DashboardCard';
import { StatusBadge } from './StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export function MonthlyRequestsCard() {
  const data = [
    { month: 'Mar 2015', value: 250 },
    { month: 'Apr 2015', value: 280 },
    { month: 'May 2015', value: 220 },
    { month: 'Jun 2015', value: 260 },
    { month: 'Jul 2015', value: 290 },
    { month: 'Aug 2015', value: 310 },
    { month: 'Sep 2015', value: 420 },
  ];

  return (
    <DashboardCard title="311 Monthly Requests Target" subtitle="311 Services Requests">
      <StatusBadge status="on-track" text="Target below 100,000" />
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6B7280', fontSize: 10 }}
            />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `${value}K`}
            />
            <Bar dataKey="value" fill="#93C5FD" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          219,483,417
        </div>
        <div className="text-sm text-gray-600">
          in Closed Status in Sep 2015
        </div>
      </div>
    </DashboardCard>
  );
}
