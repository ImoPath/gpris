'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, MapPin, RadioTower, Wifi } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

type CountyStatus = 'on-target' | 'warning' | 'intervention';
type MapTab = 'hubs' | 'wifi';

type HubsCounty = {
  county: string;
  percent_complete: number;
  county_status: string;
  total_sites: number;
  sites_complete: number;
  sites_ongoing: number;
};

type HubsResponse = {
  total: number;
  complete: number;
  ongoing: number;
  counties: number;
  by_county: HubsCounty[];
};

type WifiCounty = {
  county: string;
  total: number;
  operational: number;
};

type WifiCategory = {
  category: string;
  count: number;
};

type WifiResponse = {
  total: number;
  operational: number;
  not_operational: number;
  counties: number;
  by_county: WifiCounty[];
  by_category: WifiCategory[];
};

type ProjectRow = {
  project_id: number;
  name: string;
  sector: string;
  ministry: string;
  implementing_agency: string;
  status: string | null;
  percentage_complete: number | null;
  latest_update: string | null;
  allocated_kes: number | null;
  disbursed_kes: number | null;
  budget_source: string | null;
  county: string | null;
  start_date: string | null;
  expected_completion: string | null;
};

const KENYA_GEO_URL = '/geojson/gadm41_KEN_1.json';
const STATUS_COLORS: Record<CountyStatus, string> = {
  'on-target': '#16a34a',
  warning: '#f59e0b',
  intervention: '#e11d48',
};

function resolveApiPath(path: string) {
  const basePath = '/overview';
  return path.startsWith(basePath) ? path : `${basePath}${path}`;
}

function formatNumber(value: number | undefined | null) {
  return new Intl.NumberFormat('en-KE').format(value ?? 0);
}

function formatCurrencyCompact(value: number | null | undefined) {
  const safe = value ?? 0;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(safe);
}

function formatPercent(value: number | undefined, total: number | undefined) {
  const safeValue = value ?? 0;
  const safeTotal = total ?? 0;
  if (!safeTotal) return '0.0%';
  return `${((safeValue / safeTotal) * 100).toFixed(1)}%`;
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString();
}

function buildMapData(rows: Array<{ county: string; value: number }>) {
  const valid = rows.filter((row) => Number.isFinite(row.value));
  const sorted = [...valid].sort((a, b) => b.value - a.value);
  const tercile = Math.max(1, Math.ceil(sorted.length / 3));

  const statusByCounty = new Map<string, CountyStatus>();
  sorted.forEach((row, index) => {
    const status: CountyStatus =
      index < tercile ? 'on-target' : index < tercile * 2 ? 'warning' : 'intervention';
    statusByCounty.set(row.county, status);
  });

  const topSlice = sorted.slice(0, tercile).map((r) => r.value);
  const middleSlice = sorted.slice(tercile, tercile * 2).map((r) => r.value);
  const bottomSlice = sorted.slice(tercile * 2).map((r) => r.value);

  const min = (list: number[]) => (list.length ? Math.min(...list) : 0);
  const max = (list: number[]) => (list.length ? Math.max(...list) : 0);

  return {
    statusByCounty,
    legend: {
      top: [min(topSlice), max(topSlice)] as [number, number],
      middle: [min(middleSlice), max(middleSlice)] as [number, number],
      bottom: [min(bottomSlice), max(bottomSlice)] as [number, number],
    },
  };
}

function legendLabel(range: [number, number], suffix = '') {
  const [min, max] = range;
  if (min === 0 && max === 0) return 'No data';
  if (min === max) return `${formatNumber(max)}${suffix}`;
  return `${formatNumber(min)}${suffix} - ${formatNumber(max)}${suffix}`;
}

function statusBadge(status: string | null) {
  const normalized = (status ?? '').toLowerCase();
  if (normalized.includes('complete') || normalized.includes('operational')) {
    return 'bg-green-500/20 text-green-300 border-green-500/30';
  }
  if (normalized.includes('ongoing') || normalized.includes('progress')) {
    return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  }
  if (normalized.includes('planning') || normalized.includes('pending')) {
    return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
  }
  return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
}

export function DigitalSuperhighwayCreativeEconomyPage() {
  const router = useRouter();

  const [hubs, setHubs] = useState<HubsResponse | null>(null);
  const [wifi, setWifi] = useState<WifiResponse | null>(null);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [mapTab, setMapTab] = useState<MapTab>('hubs');
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setProjectsLoading(true);
      try {
        const [projectsRes, wifiRes, hubsRes] = await Promise.all([
          fetch(`${resolveApiPath('/api/projects')}?focus=digital`, { cache: 'no-store' }),
          fetch(resolveApiPath('/api/wifi'), { cache: 'no-store' }),
          fetch(resolveApiPath('/api/digital-hubs'), { cache: 'no-store' }),
        ]);

        if (!cancelled && projectsRes.ok) {
          const projectsData = (await projectsRes.json()) as { data?: ProjectRow[] };
          setProjects(projectsData.data ?? []);
        }
        if (!cancelled && wifiRes.ok) {
          setWifi((await wifiRes.json()) as WifiResponse);
        }
        if (!cancelled && hubsRes.ok) {
          setHubs((await hubsRes.json()) as HubsResponse);
        }
      } catch {
        // Keep graceful fallbacks in place for partial failures.
      } finally {
        if (!cancelled) setProjectsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const hubsMapData = useMemo(
    () =>
      buildMapData(
        (hubs?.by_county ?? []).map((row) => ({
          county: row.county,
          value: row.percent_complete ?? 0,
        }))
      ),
    [hubs?.by_county]
  );

  const wifiMapData = useMemo(
    () =>
      buildMapData(
        (wifi?.by_county ?? []).map((row) => ({
          county: row.county,
          value: row.operational ?? 0,
        }))
      ),
    [wifi?.by_county]
  );

  const activeMapData = mapTab === 'hubs' ? hubsMapData : wifiMapData;
  const topWifiCategories = useMemo(() => (wifi?.by_category ?? []).slice(0, 4), [wifi?.by_category]);

  return (
    <div className="space-y-6 p-4 pb-[7%] sm:p-6 sm:px-[5%]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Digital Superhighway & Creative Economy</h1>
          <p className="mt-1 text-sm text-gray-400 sm:text-base">
            Tracking digital hubs, public Wi-Fi, and ICT project execution across counties.
          </p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Hubs Complete',
            value: hubs ? formatNumber(hubs.complete) : '—',
            icon: <CheckCircle2 className="h-4 w-4" />,
          },
          {
            label: 'Hubs In Progress',
            value: hubs ? formatNumber(hubs.ongoing) : '—',
            icon: <MapPin className="h-4 w-4" />,
          },
          {
            label: 'Wi-Fi Sites',
            value: wifi ? formatNumber(wifi.total) : '—',
            icon: <RadioTower className="h-4 w-4" />,
          },
          {
            label: 'Wi-Fi Operational',
            value: wifi ? formatNumber(wifi.operational) : '—',
            icon: <Wifi className="h-4 w-4" />,
          },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index + 0.1 }}
            className="rounded-xl border border-gray-700 bg-[#1f2333] p-4"
          >
            <div className="flex items-center gap-2 text-gray-400">
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-6"
        >
          <h2 className="text-lg font-semibold text-white">Digital Hubs Summary</h2>
          <p className="mt-2 text-sm text-gray-400">
            County delivery scores are mapped from hub completion rates and grouped into terciles.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-700 bg-gray-800/40 p-3">
              <p className="text-xs text-gray-400">Total Hub Sites</p>
              <p className="mt-1 text-lg font-semibold text-white">{hubs ? formatNumber(hubs.total) : '—'}</p>
            </div>
            <div className="rounded-lg border border-gray-700 bg-gray-800/40 p-3">
              <p className="text-xs text-gray-400">Counties</p>
              <p className="mt-1 text-lg font-semibold text-white">{hubs ? formatNumber(hubs.counties) : '—'}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-6"
        >
          <h2 className="text-lg font-semibold text-white">Public Wi-Fi Summary</h2>
          <p className="mt-2 text-sm text-gray-400">
            Operational coverage and location mix from the public Wi-Fi rollout feed.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-700 bg-gray-800/40 p-3">
              <p className="text-xs text-gray-400">Operational Rate</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {wifi ? formatPercent(wifi.operational, wifi.total) : '—'}
              </p>
            </div>
            <div className="rounded-lg border border-gray-700 bg-gray-800/40 p-3">
              <p className="text-xs text-gray-400">Counties</p>
              <p className="mt-1 text-lg font-semibold text-white">{wifi ? formatNumber(wifi.counties) : '—'}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {topWifiCategories.length ? (
              topWifiCategories.map((category) => (
                <span key={category.category} className="rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-200">
                  {category.category}: {formatNumber(category.count)}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">Category data unavailable</span>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:col-span-2 sm:p-6"
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">County Performance Map</h2>
              <p className="text-sm text-gray-400">
                {hoveredCounty
                  ? `${hoveredCounty}: ${hoveredValue !== null ? formatNumber(hoveredValue) : '—'}${
                      mapTab === 'hubs' ? '%' : ''
                    }`
                  : 'Hover counties for details'}
              </p>
            </div>
            <div className="inline-flex rounded-lg border border-gray-700 bg-gray-800/60 p-1">
              <button
                onClick={() => setMapTab('hubs')}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  mapTab === 'hubs' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Hubs
              </button>
              <button
                onClick={() => setMapTab('wifi')}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  mapTab === 'wifi' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Wi-Fi
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mapTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden rounded-lg border border-gray-700"
            >
              <ComposableMap projection="geoMercator" projectionConfig={{ center: [38, 0.6], scale: 3500 }}>
                <Geographies geography={KENYA_GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countyName = String(geo.properties.NAME_1 ?? '');
                      const status = activeMapData.statusByCounty.get(countyName);
                      const fill = status ? STATUS_COLORS[status] : '#334155';

                      const hubsRow = hubs?.by_county.find((row) => row.county === countyName);
                      const wifiRow = wifi?.by_county.find((row) => row.county === countyName);
                      const activeValue = mapTab === 'hubs' ? hubsRow?.percent_complete : wifiRow?.operational;

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => {
                            setHoveredCounty(countyName);
                            setHoveredValue(activeValue ?? null);
                          }}
                          onMouseLeave={() => {
                            setHoveredCounty(null);
                            setHoveredValue(null);
                          }}
                          style={{
                            default: { fill, stroke: '#0f172a', strokeWidth: 0.5, outline: 'none' },
                            hover: { fill: '#60a5fa', stroke: '#0f172a', strokeWidth: 0.7, outline: 'none' },
                            pressed: { fill: '#2563eb', stroke: '#0f172a', strokeWidth: 0.7, outline: 'none' },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800/30 p-3 text-sm">
            <p className="mb-2 text-gray-300">Legend ({mapTab})</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-gray-200">
                <span className="inline-block h-3 w-3 rounded-full bg-green-600" /> On target (
                {legendLabel(activeMapData.legend.top, mapTab === 'hubs' ? '%' : '')})
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <span className="inline-block h-3 w-3 rounded-full bg-amber-500" /> Warning (
                {legendLabel(activeMapData.legend.middle, mapTab === 'hubs' ? '%' : '')})
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <span className="inline-block h-3 w-3 rounded-full bg-rose-600" /> Intervention (
                {legendLabel(activeMapData.legend.bottom, mapTab === 'hubs' ? '%' : '')})
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-6"
        >
          <h2 className="text-lg font-semibold text-white">Map Tab Insight</h2>
          <div className="mt-3 rounded-lg border border-gray-700 bg-gray-800/30 p-3 text-sm text-gray-200">
            {mapTab === 'hubs' ? (
              <>
                <p className="font-medium text-white">Digital hubs</p>
                <p className="mt-2">Counties are grouped by hub completion percentage relative to peers.</p>
              </>
            ) : (
              <>
                <p className="font-medium text-white">Public Wi-Fi</p>
                <p className="mt-2">Counties are grouped by operational site counts relative to peers.</p>
              </>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">ICT Projects</h2>
          <span className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-300">
            Source: /api/projects?focus=digital
          </span>
        </div>

        {projectsLoading ? (
          <p className="text-sm text-gray-300">Loading projects...</p>
        ) : !projects.length ? (
          <p className="text-sm text-gray-400">No ICT projects available.</p>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 8).map((project, index) => {
              const progress = Math.max(0, Math.min(100, Number(project.percentage_complete ?? 0)));
              return (
                <motion.div
                  key={project.project_id}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="rounded-lg border border-gray-700 bg-gray-800/30 p-3"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-white">{project.name}</p>
                    <span className={`w-fit rounded-md border px-2 py-0.5 text-xs ${statusBadge(project.status)}`}>
                      {project.status ?? 'Unknown'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    {project.ministry || project.implementing_agency || 'Implementer not provided'} •{' '}
                    {project.county || 'County not provided'}
                  </p>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, delay: 0.05 * index }}
                      className="h-full rounded-full bg-blue-500"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-300">
                    <span>{progress.toFixed(0)}% complete</span>
                    <span>Budget {formatCurrencyCompact(project.allocated_kes)}</span>
                    <span>Disbursed {formatCurrencyCompact(project.disbursed_kes)}</span>
                    <span>Expected {formatDate(project.expected_completion)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      <p className="text-xs text-gray-500">
        Data sources: Digital hubs (`/api/digital-hubs`), public Wi-Fi (`/api/wifi`), and ICT projects (
        `/api/projects?focus=digital`).
      </p>
    </div>
  );
}
