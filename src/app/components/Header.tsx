'use client';

import { Search, Flag, Bell, Grid3x3, Moon, Sun, LayoutDashboard, Lightbulb, MapPin, Map, Menu, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
// import profileImage from '../../../assets/42aed68bc14957518d247509548a516388d66b6c.png';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/insights', label: 'Insights', icon: Lightbulb },
    { path: '/counties', label: 'Counties', icon: MapPin },
    { path: '/map', label: 'Map', icon: Map },
  ];

  return (
    <div className="bg-[#1f2333] dark:bg-[#1f2333] bg-white border-b border-gray-700 dark:border-gray-700 border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left side - Navigation */}
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-400" />
            ) : (
              <Menu className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    if (item.path === '/' && pathname === '/') {
                      // If already on dashboard page, scroll to dashboard content
                      const element = document.getElementById('dashboard-content');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      router.push(item.path);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile - show current page name */}
          <div className="lg:hidden">
            <span className="text-white font-semibold text-sm">
              {navItems.find(item => item.path === pathname)?.label || 'Dashboard'}
            </span>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search - hidden on mobile */}
          {/* <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="search"
              placeholder="Search... (Press /)"
              className="bg-gray-800 dark:bg-gray-800 bg-gray-100 text-white dark:text-white text-gray-900 text-sm pl-10 pr-4 py-2 rounded-lg border border-gray-700 dark:border-gray-700 border-gray-300 focus:outline-none focus:border-cyan-500 w-48 lg:w-80"
            />
          </div> */}

          {/* Search icon for mobile */}
          {/* <button className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-gray-400" />
          </button> */}

          {/* Other actions - some hidden on mobile */}
          {/* <button className="hidden sm:block p-2 hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <Flag className="w-5 h-5 text-gray-400" />
          </button> */}

          {/* Notifications */}
          {/* <button className="p-2 hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button> */}

          {/* <button className="hidden sm:block p-2 hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <Grid3x3 className="w-5 h-5 text-gray-400" />
          </button> */}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            data-theme-toggle
            className="p-2 hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2 cursor-pointer">
            {/* <img
              src="/assets/42aed68bc14957518d247509548a516388d66b6c.png"
              alt="Profile"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
            /> */}
            {/* <span className="hidden sm:inline text-white dark:text-white text-gray-900 text-sm">W. Ruto</span> */}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-700 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  if (item.path === '/' && pathname === '/') {
                    // If already on dashboard page, scroll to dashboard content
                    const element = document.getElementById('dashboard-content');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    router.push(item.path);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}