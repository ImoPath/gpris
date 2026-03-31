'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Building2,
  Calendar,
  Heart,
  Home,
  Loader2,
  Sprout,
  Target,
  TrendingUp,
  Users,
  Wifi,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { MetricCardEnhanced } from '../components/MetricCardEnhanced';

type PillarCard = {
  id: string;
  category: 'blue' | 'red' | 'green' | 'yellow';
  title: string;
  description: string;
  detailHref: string;
  icon: string;
  color: string;
};

type MetricCardApiItem = {
  metric_name?: string | null;
  direction?: string | null;
  percent_value?: number | string | null;
  unit?: string | null;
  current_label?: string | null;
  current_value?: string | null;
  delta_value?: string | null;
};

type MetricCardApiResponse = {
  pillar?: string;
  count?: number;
  metrics?: MetricCardApiItem[];
};

type HudumaResponse = {
  success?: boolean;
  [key: string]: unknown;
};

type ServiceStat = {
  service: string;
  bookings: number;
};

const pillarCards: PillarCard[] = [
  {
    id: 'agriculture',
    category: 'yellow',
    title: 'Agriculture',
    description: 'Food security, farm productivity, and value-chain expansion.',
    detailHref: '/agriculture',
    icon: 'Sprout',
    color: '#3B82F6',
  },
  {
    id: 'msme-economy',
    category: 'green',
    title: 'MSME Economy',
    description: 'Empowering small businesses through financing and market access.',
    detailHref: '/msme-economy',
    icon: 'Building2',
    color: '#3B82F6',
  },
  {
    id: 'affordable-housing',
    category: 'blue',
    title: 'Affordable Housing',
    description: 'Affordable homes delivered for low and middle-income households.',
    detailHref: '/insights?pillar=Affordable%20Housing',
    icon: 'Home',
    color: '#3B82F6',
  },
  {
    id: 'universal-health-care',
    category: 'red',
    title: 'Universal Health Care',
    description: 'Expanding access to quality, affordable healthcare nationwide.',
    detailHref: '/metric/healthcare',
    icon: 'Heart',
    color: '#3B82F6',
  },
  {
    id: 'digital-superhighway-creative-economy',
    category: 'blue',
    title: 'Digital Superhighway and Creative Economy',
    description: 'Digital infrastructure and creative economy acceleration.',
    detailHref: '/insights?pillar=Digital%20Superhighway%20and%20Creative%20Economy',
    icon: 'Wifi',
    color: '#3B82F6',
  },
];

function resolveApiPath(path: string) {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/overview')) {
    return `/overview${path}`;
  }
  return path;
}

function normalizeNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/,/g, '').replace('%', '').trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function formatValue(value: string | null | undefined, unit: string | null | undefined) {
  if (!value) return 'Metric pending';
  const numeric = normalizeNumber(value);
  if (numeric === null) return `${value}${unit ? ` ${unit}` : ''}`;
  return `${Intl.NumberFormat('en-KE', { notation: 'compact', maximumFractionDigits: 1 }).format(numeric)}${unit ? ` ${unit}` : ''}`;
}

function pickNumberFromKeys(source: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    const value = normalizeNumber(source[key]);
    if (value !== null) return value;
  }
  return 0;
}

function extractTopServices(huduma: HudumaResponse | null): ServiceStat[] {
  if (!huduma) return [];

  const raw = (huduma.services ?? huduma.topServices ?? huduma.top_mda_services ?? huduma.mda_services) as unknown;
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const row = item as Record<string, unknown>;
        const service = String(row.service ?? row.mda_service ?? row.name ?? row.label ?? 'Unknown service');
        const bookings = pickNumberFromKeys(row, ['bookings', 'total_bookings', 'value', 'count']);
        return { service, bookings };
      })
      .filter((item): item is ServiceStat => Boolean(item))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  }

  if (typeof raw === 'object') {
    return Object.entries(raw as Record<string, unknown>)
      .map(([service, value]) => ({ service, bookings: normalizeNumber(value) ?? 0 }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);
  }

  return [];
}

export function DashboardPage() {
  const [metricByPillar, setMetricByPillar] = useState<Record<string, MetricCardApiItem | null>>({});
  const [hudumaData, setHudumaData] = useState<HudumaResponse | null>(null);
  const [hudumaLoading, setHudumaLoading] = useState(true);
  const [hudumaError, setHudumaError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPillarCards() {
      const results = await Promise.all(
        pillarCards.map(async (area) => {
          try {
            const endpoint = `${resolveApiPath('/api/metric-cards')}?pillar=${encodeURIComponent(area.title)}`;
            const res = await fetch(endpoint, { cache: 'no-store' });
            const data = (await res.json()) as MetricCardApiResponse;
            const firstMetric = data.metrics?.[0] ?? null;
            return [area.title, firstMetric] as const;
          } catch {
            return [area.title, null] as const;
          }
        }),
      );

      if (!cancelled) {
        setMetricByPillar(Object.fromEntries(results));
      }
    }

    loadPillarCards();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadHuduma() {
      setHudumaLoading(true);
      setHudumaError(null);
      try {
        const res = await fetch(resolveApiPath('/api/huduma'), { cache: 'no-store' });
        const data = (await res.json()) as HudumaResponse;
        if (!cancelled) {
          if (data.success === false) {
            setHudumaError(String(data.error ?? 'Huduma data unavailable'));
          }
          setHudumaData(data);
        }
      } catch {
        if (!cancelled) {
          setHudumaError('Huduma stats are temporarily unavailable.');
          setHudumaData(null);
        }
      } finally {
        if (!cancelled) {
          setHudumaLoading(false);
        }
      }
    }

    loadHuduma();
    return () => {
      cancelled = true;
    };
  }, []);

  const hudumaTotals = useMemo(() => {
    const source = (hudumaData ?? {}) as Record<string, unknown>;
    const bookings = pickNumberFromKeys(source, ['bookings', 'total_bookings', 'totalBookings', 'total']);
    const served = pickNumberFromKeys(source, ['served', 'total_served', 'served_count', 'servedCount']);
    const cancelled = pickNumberFromKeys(source, ['cancelled', 'canceled', 'total_cancelled', 'cancelled_count']);
    const centers = pickNumberFromKeys(source, ['centers', 'huduma_centers', 'coverage_centers']);
    const counties = pickNumberFromKeys(source, ['counties', 'coverage_counties']);
    const servedRate = bookings > 0 ? Math.min(100, Math.max(0, (served / bookings) * 100)) : 0;
    return { bookings, served, cancelled, centers, counties, servedRate };
  }, [hudumaData]);

  const topServices = useMemo(() => extractTopServices(hudumaData), [hudumaData]);
  const metrics = useMemo(
    () =>
      pillarCards.map((pillar) => {
        const metric = metricByPillar[pillar.title] ?? null;
        const resolvedUnit = pillar.id === 'universal-health-care' ? 'Citizens' : metric?.unit ?? null;
        const progress = Math.max(0, Math.min(100, normalizeNumber(metric?.percent_value) ?? 0));
        const direction = (metric?.direction ?? '').toLowerCase();
        const trend: 'up' | 'down' = direction.includes('up') || direction.includes('positive') ? 'up' : 'down';
        return {
          id: pillar.id,
          category: pillar.category,
          title: pillar.title,
          value: formatValue(metric?.current_value ?? null, resolvedUnit),
          unit: metric?.metric_name ?? 'Metric pending',
          progress,
          trend,
          trendValue: metric?.delta_value ?? 'N/A',
          deltaNote: metric?.current_label ?? undefined,
          icon: pillar.icon,
          color: pillar.color,
          description: pillar.description,
          detailHref: pillar.detailHref,
        };
      }),
    [metricByPillar],
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/assets/47349e5c56fe81cbb46dd533f2586a9f6cc564e5.png"
            alt="Kenya Railway"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />

        <div className="relative h-full flex items-center px-4 sm:px-6 lg:px-[5%] py-[25px] lg:py-16">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4"
            >
              <img
                src="/assets/5b3ad8699cb5b280b3f5817e2ec5026f64df5890.png"
                alt="Kenya Coat of Arms"
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
              />
              <div className="h-10 sm:h-12 md:h-16 w-px bg-white/30" />
              <div>
                <div className="text-cyan-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-1">
                  Republic of Kenya
                </div>
                <div className="text-white text-xs sm:text-sm md:text-base font-medium">
                  Presidential Dashboard
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-none"
            >
              Kenya Government Progress 2026
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-6 md:mb-8 max-w-2xl leading-relaxed"
            >
              Strategic pillars dashboard for FY 2025/26 Q3 with live KPI and Huduma service data.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-6 mb-4 sm:mb-6 md:mb-8"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 md:p-4 border border-white/20">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-cyan-400" />
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-300">Key Focus Areas</div>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">5</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 md:p-4 border border-white/20">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-400" />
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-300">Counties</div>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">47</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 md:p-4 border border-white/20">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400" />
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-300">Last Update</div>
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold text-white">Today</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 md:p-4 border border-white/20">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-cyan-300" />
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-300">Data Feed</div>
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold text-white">Live</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4"
            >
              <button
                onClick={() => {
                  const element = document.getElementById('dashboard-content');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-white rounded-lg font-semibold transition-all transform hover:scale-105 text-sm sm:text-base"
                style={{ backgroundColor: '#df990c' }}
              >
                View Dashboard
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div id="dashboard-content" className="p-4 sm:p-6 px-4 sm:px-[5%] pb-[7%] space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src="/assets/5b3ad8699cb5b280b3f5817e2ec5026f64df5890.png"
              alt="Kenya Coat of Arms"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
            <div>
              <h1 className="text-white dark:text-white text-gray-900 text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
                Kenya National Projects
              </h1>
              <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-xs sm:text-sm">
                Comprehensive Performance Overview
              </p>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-300 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            Live data
          </div>
        </div>

        <div className="bg-[#1f2333] dark:bg-[#1f2333] bg-white rounded-xl border border-gray-700 dark:border-gray-700 border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-gray-300 dark:text-gray-300 text-gray-700 leading-relaxed text-sm sm:text-base">
                Track real-time progress for the five strategic focus areas and Huduma Center service operations.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {metrics.map((metric, index) => (
            <div key={metric.id} className="relative">
              <MetricCardEnhanced
                {...metric}
                delay={index * 0.08}
              />
              <Link href={metric.detailHref} className="absolute inset-0 z-10" aria-label={`View ${metric.title}`} />
            </div>
          ))}

          <Dialog>
            <DialogTrigger asChild>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="bg-[#1f2333] dark:bg-[#1f2333] bg-white rounded-xl border border-gray-700 dark:border-gray-700 border-gray-200 overflow-hidden cursor-pointer transition-all hover:shadow-xl"
                style={{ borderTopColor: '#f59e0b', borderTopWidth: '4px' }}
              >
                <div className="p-6 text-left">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-white dark:text-white text-gray-900 text-lg font-semibold mb-1">
                        Huduma Center Stats
                      </h3>
                      <p className="text-gray-400 dark:text-gray-400 text-gray-600 text-sm">
                        Operational snapshot
                      </p>
                    </div>
                    <div className="p-3 rounded-lg flex-shrink-0 bg-cyan-500/20">
                      <Building2 className="w-6 h-6 text-cyan-300" />
                    </div>
                  </div>

                  {hudumaLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading HUDUMA stats...
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold mb-2 text-black dark:text-white">
                        {Intl.NumberFormat('en-KE').format(hudumaTotals.bookings)}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-500">
                          {hudumaTotals.servedRate.toFixed(1)}% served
                        </span>
                        <span className="text-gray-400 dark:text-gray-400 text-gray-600">
                          of total bookings
                        </span>
                      </div>
                    </>
                  )}
                  {hudumaError ? <p className="mt-3 text-xs text-rose-300">{hudumaError}</p> : null}
                </div>
              </motion.button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto border-white/20 bg-[#0b1127] text-white">
              <DialogHeader>
                <DialogTitle className="text-xl">Huduma Center Operational Dashboard</DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                    <p className="text-xs text-gray-300">Total bookings</p>
                    <p className="mt-1 text-2xl font-bold">{Intl.NumberFormat('en-KE').format(hudumaTotals.bookings)}</p>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                    <p className="text-xs text-gray-300">Total served</p>
                    <p className="mt-1 text-2xl font-bold">{Intl.NumberFormat('en-KE').format(hudumaTotals.served)}</p>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                    <p className="text-xs text-gray-300">Total cancelled</p>
                    <p className="mt-1 text-2xl font-bold">{Intl.NumberFormat('en-KE').format(hudumaTotals.cancelled)}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-300">Served rate</span>
                    <span className="font-semibold">{hudumaTotals.servedRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10">
                    <div className="h-3 rounded-full bg-cyan-300 transition-all" style={{ width: `${hudumaTotals.servedRate}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                    <h3 className="mb-3 text-sm font-semibold text-gray-200">Top MDA services by bookings</h3>
                    {topServices.length > 0 ? (
                      <ul className="space-y-2">
                        {topServices.map((item) => (
                          <li key={item.service} className="flex items-center justify-between border-b border-white/10 pb-2 text-sm">
                            <span className="text-gray-200">{item.service}</span>
                            <span className="font-medium text-cyan-100">{Intl.NumberFormat('en-KE').format(item.bookings)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">No service ranking data available.</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                    <h3 className="mb-3 text-sm font-semibold text-gray-200">Coverage snapshot</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Huduma centers</span>
                        <span>{hudumaTotals.centers > 0 ? hudumaTotals.centers : 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Counties covered</span>
                        <span>{hudumaTotals.counties > 0 ? hudumaTotals.counties : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {hudumaError ? (
                  <div className="rounded-lg border border-rose-300/30 bg-rose-400/10 p-3 text-sm text-rose-100">
                    {hudumaError}
                  </div>
                ) : null}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <footer className="mt-7 text-center text-xs text-gray-300">
          Kenya Government Dashboard | Integrated strategic pillar and Huduma service performance view
        </footer>
      </div>
    </div>
  );
}