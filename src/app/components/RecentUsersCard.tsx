import { Download } from 'lucide-react';

export function RecentUsersCard() {
  const users = [
    { name: 'Alice Cooper', email: 'alice@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { name: 'Bob Wilson', email: 'bob@example.com', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
    { name: 'Carol Davis', email: 'carol@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
    { name: 'David Miller', email: 'david@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  ];

  return (
    <div className="bg-[#1f2333] rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-semibold">Recent New Users</h3>
      </div>
      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={index} className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{user.name}</p>
              <p className="text-gray-400 text-xs">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
        <span className="text-sm">Import</span>
        <Download className="w-4 h-4 text-cyan-400" />
      </button>
    </div>
  );
}
