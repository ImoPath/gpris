import { MoreHorizontal, Plus } from 'lucide-react';

export function TransactionsTable() {
  const transactions = [
    { id: '#1234', date: 'Jan 15, 2024', customer: 'John Doe', amount: '$1,234.00', status: 'Completed' },
    { id: '#1235', date: 'Jan 16, 2024', customer: 'Jane Smith', amount: '$856.00', status: 'Pending' },
    { id: '#1236', date: 'Jan 17, 2024', customer: 'Mike Johnson', amount: '$2,100.00', status: 'Completed' },
    { id: '#1237', date: 'Jan 18, 2024', customer: 'Sarah Williams', amount: '$450.00', status: 'Failed' },
  ];

  return (
    <div className="bg-[#1f2333] rounded-xl border border-gray-700">
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <h3 className="text-white text-lg font-semibold">Transactions</h3>
        <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          <span className="text-sm">Add New</span>
          <Plus className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left px-6 py-3 text-gray-400 text-sm font-medium">Transaction ID</th>
              <th className="text-left px-6 py-3 text-gray-400 text-sm font-medium">Date</th>
              <th className="text-left px-6 py-3 text-gray-400 text-sm font-medium">Customer</th>
              <th className="text-left px-6 py-3 text-gray-400 text-sm font-medium">Amount</th>
              <th className="text-left px-6 py-3 text-gray-400 text-sm font-medium">Status</th>
              <th className="text-left px-6 py-3 text-gray-400 text-sm font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-white text-sm">{transaction.id}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{transaction.date}</td>
                <td className="px-6 py-4 text-white text-sm">{transaction.customer}</td>
                <td className="px-6 py-4 text-white text-sm font-medium">{transaction.amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'Completed'
                        ? 'bg-green-500/20 text-green-400'
                        : transaction.status === 'Pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-white">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
