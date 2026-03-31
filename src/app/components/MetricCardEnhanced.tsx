'use client';

import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { motion } from 'motion/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface MetricCardEnhancedProps {
  id: string;
  category: string;
  title: string;
  value: string;
  unit: string;
  progress: number;
  trend: 'up' | 'down';
  trendValue: string;
  deltaNote?: string;
  icon: string;
  color: string;
  description: string;
  delay?: number;
}

export function MetricCardEnhanced({
  id,
  category,
  title,
  value,
  unit,
  progress,
  trend,
  trendValue,
  deltaNote,
  icon,
  color,
  description,
  delay = 0
}: MetricCardEnhancedProps) {
  const router = useRouter();
  const IconComponent = (Icons as any)[icon] || Icons.Activity;

  const handleClick = () => {
    router.push(`/metric/${id}`);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={handleClick}
            className={`bg-[#1f2333] dark:bg-[#1f2333] bg-white rounded-xl border border-gray-700 dark:border-gray-700 border-gray-200 overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:shadow-${category}-500/10`}
            style={{ borderTopColor: color, borderTopWidth: '4px' }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-white dark:text-white text-gray-900 text-lg font-semibold mb-1">
                    {title}
                  </h3>
                  <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">
                    {unit}
                  </p>
                </div>
                <div 
                  className="p-3 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <IconComponent 
                    className="w-6 h-6" 
                    style={{ color }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold mb-2 text-black dark:text-white">
                  <AnimatedCounter value={value} />
                </div>
                {deltaNote ? (
                  <p className="mb-2 text-xs text-blue-400">{deltaNote}</p>
                ) : null}
                <div className="flex items-center gap-2">
                  {trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {trendValue}
                  </span>
                  <span className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">
                    vs last month
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400 dark:text-gray-400 text-gray-600">Progress</span>
                  <span className="text-white dark:text-white text-gray-900 font-semibold">
                    {progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 dark:bg-gray-700 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: delay + 0.3 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </div>

              {/* View Details Link */}
              <div className="flex items-center justify-end text-sm group">
                <span className="text-gray-400 group-hover:text-white transition-colors">
                  View Details
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs bg-gray-900 text-white p-3 rounded-lg border border-gray-700"
        >
          <p className="text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
