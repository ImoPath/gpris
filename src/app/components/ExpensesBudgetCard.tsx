import { DashboardCard } from './DashboardCard';

export function ExpensesBudgetCard() {
  const remaining = 14673200.07;
  const spent = 40455143.79;
  const budgeted = 55128343.86;
  const percentage = 26.62;

  // Calculate the angle for the semi-circle (180 degrees = full semi-circle)
  const angle = (percentage / 100) * 180;

  return (
    <DashboardCard title="YTD Expenses vs Budget" subtitle="Updated 3 weeks ago">
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-32 mb-4">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 20 80 A 80 80 0 0 1 180 80"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 20 80 A 80 80 0 0 1 180 80"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={`${angle * 1.4} 1000`}
            />
          </svg>
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-blue-600 text-sm font-semibold">
              ${remaining.toLocaleString()} ({percentage}%)
            </div>
            <div className="text-blue-600 text-xs">Remaining</div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            ${spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-600">
            In Expenses of ${budgeted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Budgeted Through Sep 2018
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
