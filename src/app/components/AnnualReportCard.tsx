import { DashboardCard } from './DashboardCard';

export function AnnualReportCard() {
  const reportData = [
    { category: 'Transfers Out', amount: '$1,568,508.00' },
    { category: 'Other Charges', amount: '$939,578.84' },
    { category: 'Services & Charges', amount: '$2,610,575.56' },
    { category: 'Capital Outlay', amount: '$1,736,362.32' },
    { category: 'Other', amount: '$872,687.21' },
    { category: 'Personnel Services', amount: '$7,814,523.62' },
  ];

  return (
    <DashboardCard title="Annual Report">
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-sm font-semibold text-gray-700">Category</th>
              <th className="text-right py-3 text-sm font-semibold text-gray-700">2019</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 text-sm text-gray-600">{row.category}</td>
                <td className="py-3 text-sm text-gray-900 text-right font-medium">{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
