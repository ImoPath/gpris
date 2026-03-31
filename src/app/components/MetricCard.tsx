import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: React.ReactNode;
  iconBg: string;
}

export function MetricCard({ title, value, trend, trendLabel, icon, iconBg }: MetricCardProps) {
  const isPositive = trend >= 0;

  return (
    <div className="bg-[#1f2333] rounded-xl p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <h3 className="text-white text-2xl font-bold">{value}</h3>
        </div>
        <div className={`${iconBg} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-medium">{Math.abs(trend)}%</span>
        </div>
        <span className="text-gray-400 text-sm">{trendLabel}</span>
      </div>
    </div>
  );
}
