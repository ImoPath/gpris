export function TransactionsUsesCard() {
  return (
    <div className="bg-[#1f2333] rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">Transactions Uses</h3>
        <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors text-sm">
          Refresh all
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-400 text-sm">Total Transactions</span>
          <span className="text-white font-medium">1,234</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-400 text-sm">Completed</span>
          <span className="text-green-400 font-medium">1,100</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-400 text-sm">Pending</span>
          <span className="text-yellow-400 font-medium">89</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-400 text-sm">Failed</span>
          <span className="text-red-400 font-medium">45</span>
        </div>
      </div>
    </div>
  );
}
