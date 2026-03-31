import { Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AlertBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if alert has been dismissed within the last 24 hours
    const alertDismissed = localStorage.getItem('alertBannerDismissed');
    
    if (alertDismissed) {
      const dismissedTime = parseInt(alertDismissed, 10);
      const currentTime = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      // If less than 24 hours have passed, keep it hidden
      if (currentTime - dismissedTime < twentyFourHours) {
        setIsVisible(false);
      } else {
        // If 24 hours have passed, show it again and clear the old cookie
        localStorage.removeItem('alertBannerDismissed');
        setIsVisible(true);
      }
    } else {
      // No cookie found, show the alert
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Store the current timestamp when dismissed
    localStorage.setItem('alertBannerDismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-cyan-900 to-cyan-800 dark:from-cyan-900 dark:to-cyan-800 from-cyan-100 to-cyan-200 px-3 sm:px-6 py-2 sm:py-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        <div className="bg-cyan-700 dark:bg-cyan-700 bg-cyan-300 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
          <Info className="w-3 h-3 sm:w-4 sm:h-4 text-white dark:text-white text-cyan-900" />
        </div>
        <p className="text-xs sm:text-sm text-white dark:text-white text-cyan-900 flex-1 leading-relaxed">
          We kindly encourage you to review the national projects performance metrics and strategic initiatives to ensure optimal implementation across all sectors.
        </p>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleDismiss}
            className="text-cyan-300 dark:text-cyan-300 text-cyan-700 hover:text-white dark:hover:text-white hover:text-cyan-900 text-xs sm:text-sm font-medium px-3 py-1 sm:py-1.5 hover:bg-cyan-700 dark:hover:bg-cyan-700 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap flex-1 sm:flex-initial"
          >
            Action Now
          </button>
          <button
            onClick={handleDismiss}
            className="text-cyan-300 dark:text-cyan-300 text-cyan-700 hover:text-white dark:hover:text-white hover:text-cyan-900 p-1"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}