'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { Trophy, TrendingUp, Target } from 'lucide-react';

export function MilestoneNotifications() {
  useEffect(() => {
    // Show notifications for recent milestones
    const timeout1 = setTimeout(() => {
      toast.success('Milestone Achieved!', {
        description: 'Universal Healthcare registrations exceeded 29.75M mark',
        icon: <Trophy className="w-5 h-5 text-yellow-500" />,
        duration: 5000,
      });
    }, 2000);

    const timeout2 = setTimeout(() => {
      toast.info('New Target Set', {
        description: 'Digital Jobs platform target increased to 1.5M youth',
        icon: <Target className="w-5 h-5 text-blue-500" />,
        duration: 5000,
      });
    }, 5000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  return null;
}
