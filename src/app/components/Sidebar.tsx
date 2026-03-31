import { Home, FileText, Mail, FolderOpen, Ticket, MessageSquare, Building2, FileCheck, CreditCard, FileStack, MoreHorizontal, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  badge?: number;
  hasSubmenu?: boolean;
}

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  const navItems: NavItem[] = [
    { icon: Home, label: 'Dashboard', badge: 1 },
    { icon: FileText, label: 'Email' },
    { icon: Mail, label: 'Email' },
    { icon: FolderOpen, label: 'File Manager' },
    { icon: Ticket, label: 'Tickets' },
    { icon: MessageSquare, label: 'Contact Board' },
    { icon: Building2, label: 'Companies' },
    { icon: FileCheck, label: 'Invoice', hasSubmenu: true },
    { icon: CreditCard, label: 'Pages', hasSubmenu: true },
    { icon: FileStack, label: 'Audit Pages', hasSubmenu: true },
    { icon: MoreHorizontal, label: 'Error Pages', hasSubmenu: true },
  ];

  return (
    <div className="w-64 bg-[#1a1d2e] h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">H</span>
        </div>
        <span className="text-white font-semibold text-lg">Highdmin</span>
      </div>

      {/* User Profile */}
      <div className="px-4 pb-4 mb-4 border-b border-gray-700">
        <div className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="text-white text-sm font-medium">William Ruto</div>
            <div className="text-gray-400 text-xs">President of Kenya</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto">
        <div className="text-gray-500 text-xs uppercase font-semibold mb-3">Navigation</div>
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  index === 0
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {item.hasSubmenu && <ChevronDown className="w-4 h-4" />}
              </a>
            </li>
          ))}
        </ul>

        <div className="text-gray-500 text-xs uppercase font-semibold mt-6 mb-3">More</div>
        <ul className="space-y-1">
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
              <span className="flex-1 text-sm">Layouts</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}