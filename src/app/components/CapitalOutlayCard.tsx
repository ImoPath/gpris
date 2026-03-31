import { DashboardCard } from './DashboardCard';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function CapitalOutlayCard() {
  const data = [
    { name: 'Improvements', value: 85 },
    { name: 'Machinery', value: 8 },
    { name: 'Other Capital', value: 7 },
  ];

  const COLORS = ['#3B82F6', '#93C5FD', '#DBEAFE'];

  return (
    <DashboardCard title="Capital outlay">
      <div className="h-64 mb-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
              <span style={{ color: COLORS[index] }}>■</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-8">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          $8,155,437.68
        </div>
        <div className="text-sm text-gray-600">
          in Expenses in Sep 2018
        </div>
      </div>
    </DashboardCard>
  );
}
