import { DashboardCard } from './DashboardCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export function ExpensesByTypeCard() {
  const data = [
    { year: '2015', cat1: 35, cat2: 25, cat3: 15, cat4: 10 },
    { year: '2016', cat1: 40, cat2: 28, cat3: 18, cat4: 12 },
    { year: '2017', cat1: 38, cat2: 30, cat3: 20, cat4: 15 },
    { year: '2018', cat1: 42, cat2: 32, cat3: 22, cat4: 14 },
    { year: '2019', cat1: 45, cat2: 35, cat3: 18, cat4: 16 },
  ];

  return (
    <DashboardCard title="Expenses by Expense Type">
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `$${value}M`}
            />
            <Bar dataKey="cat1" stackId="a" fill="#BFDBFE" />
            <Bar dataKey="cat2" stackId="a" fill="#93C5FD" />
            <Bar dataKey="cat3" stackId="a" fill="#60A5FA" />
            <Bar dataKey="cat4" stackId="a" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          $15,542,235.55
        </div>
        <div className="text-sm text-gray-600">
          in Expenses in 2019
        </div>
      </div>
    </DashboardCard>
  );
}
