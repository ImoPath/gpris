'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Header } from '../components/Header';
import { AlertBanner } from '../components/AlertBanner';
import { ThemeProvider } from '../components/ThemeProvider';
import { MilestoneNotifications } from '../components/MilestoneNotifications';
import { Toaster } from 'sonner';

export function RootLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    const mainContent = document.querySelector('.flex-1.overflow-y-auto');
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }
  }, [pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // '/' to focus search
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // 'd' to toggle dark mode
      if (e.key === 'd') {
        e.preventDefault();
        const themeToggle = document.querySelector('[data-theme-toggle]') as HTMLButtonElement;
        if (themeToggle) {
          themeToggle.click();
        }
      }

      // 'h' to go home
      if (e.key === 'h') {
        e.preventDefault();
        router.push('/');
      }

      // 'i' to go to insights
      if (e.key === 'i') {
        e.preventDefault();
        router.push('/insights');
      }

      // 'c' to go to counties
      if (e.key === 'c') {
        e.preventDefault();
        router.push('/counties');
      }

      // 'm' to go to map
      if (e.key === 'm') {
        e.preventDefault();
        router.push('/map');
      }

      // '?' to show keyboard shortcuts
      if (e.key === '?') {
        e.preventDefault();
        // Could open a modal with shortcuts - for now just log
        console.log('Keyboard shortcuts: h=Home, i=Insights, c=Counties, m=Map, d=Dark Mode, /=Search');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [router]);

  return (
    <ThemeProvider>
      <MilestoneNotifications />
      <div className="flex h-screen bg-[#161929] dark:bg-[#161929] bg-gray-50 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Alert Banner */}
            {/* <AlertBanner /> */}

            {/* Page Content */}
            {children}
          </div>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}