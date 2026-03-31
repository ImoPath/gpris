'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Building2, BriefcaseBusiness, Home, MapPinned, Wallet } from 'lucide-react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

type CountyStatus = 'on-target' | 'warning';

type OverviewMetric = {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
};

type MetricItem = {
  label: string;
  value: string;
};

type CountySnapshot = {
  county: string;
  units: string;
  completion: string;
  jobs: string;
  status: CountyStatus;
};

type HousingProject = {
  project_id: number;
  name: string;
  status: string | null;
  percentage_complete: number | null;
  latest_update: string | null;
  allocated_kes: number | null;
  disbursed_kes: number | null;
  county: string | null;
  expected_completion: string | null;
};

const KENYA_GEO_URL = '/geojson/gadm41_KEN_1.json';

const overviewMetrics: OverviewMetric[] = [
  { label: 'Boma Yangu Registrations', value: 792834, icon: Home },
  { label: 'Completed Units', value: 31120, icon: Building2 },
  { label: 'Active Construction Sites', value: 184, icon: MapPinned },
  { label: 'Jobs Created', value: 55760, icon: BriefcaseBusiness },
];

const bomaYanguMetrics: MetricItem[] = [
  { label: 'Verified Applicants', value: '548,210' },
  { label: 'Allocated Applicants', value: '74,930' },
  { label: 'Average Processing Time', value: '14 days' },
];

const projectMetrics: MetricItem[] = [
  { label: 'Bedsitters', value: '9,200 units' },
  { label: '1 Bedroom', value: '15,680 units' },
  { label: '2 Bedroom', value: '6,240 units' },
];

const jobsCreated: MetricItem[] = [
  { label: 'Direct Jobs', value: '34,880' },
  { label: 'Indirect Jobs', value: '20,340' },
  { label: 'Youth Jobs', value: '12,900' },
];

const countySample: CountySnapshot[] = [
  { county: 'Nairobi', units: '8,100', completion: '68%', jobs: '10,300', status: 'on-target' },
  { county: 'Mombasa', units: '2,240', completion: '59%', jobs: '3,220', status: 'on-target' },
  { county: 'Kisumu', units: '1,690', completion: '46%', jobs: '2,100', status: 'warning' },
  { county: 'Nakuru', units: '2,890', completion: '51%', jobs: '3,940', status: 'on-target' },
  { county: 'Uasin Gishu', units: '1,160', completion: '43%', jobs: '1,540', status: 'warning' },
  { county: 'Machakos', units: '1,820', completion: '48%', jobs: '2,460', status: 'warning' },
];

function formatKES(value: number | null | undefined) {
  if (typeof value !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(value);
}

function statusStyles(status: string | null) {
  const normalized = (status ?? '').toLowerCase();
  if (normalized.includes('complete')) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  if (normalized.includes('delay') || normalized.includes('risk'))
    return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
  return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
}

export default function HousingPage() {
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([38, 0.6]);

  const [projects, setProjects] = useState<HousingProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoadingProjects(true);
      try {
        const response = await fetch('/api/projects?focus=housing', { cache: 'no-store' });
        const data = (await response.json()) as { data?: HousingProject[] };
        if (!cancelled) setProjects(Array.isArray(data.data) ? data.data : []);
      } catch {
        if (!cancelled) setProjects([]);
      } finally {
        if (!cancelled) setLoadingProjects(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const countyLookup = useMemo(() => {
    return new Map(countySample.map((county) => [county.county, county]));
  }, []);

  const selectedCountyData = selectedCounty ? countyLookup.get(selectedCounty) : null;

  const countyColor = (countyName: string) => {
    const status = countyLookup.get(countyName)?.status;
    if (status === 'on-target') return '#16a34a';
    if (status === 'warning') return '#f59e0b';
    return '#334155';
  };

  return (
    <div className="space-y-6 p-4 pb-[7%] sm:p-6 sm:px-[5%]">
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-6"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Affordable Housing Dashboard</h1>
        <p className="mt-1 max-w-3xl text-sm text-gray-400 sm:text-base">
          County-level view of housing delivery, jobs created, and project execution across the Affordable Housing
          pillar.
        </p>
      </motion.header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.25 }}
              whileHover={{ y: -3 }}
              className="rounded-xl border border-gray-700 bg-[#1f2333] p-4"
            >
              <div className="flex items-center gap-2 text-gray-400">
                <Icon className="h-4 w-4" />
                <span className="text-sm">{metric.label}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {new Intl.NumberFormat('en-KE').format(metric.value)}
              </p>
            </motion.div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 xl:col-span-2 sm:p-6"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">County Construction Progress</h2>
              <p className="text-sm text-gray-400">
                {hoveredCounty ? `Hovering: ${hoveredCounty}` : 'Hover or click a county for details'}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/60 p-1">
              <button
                onClick={() => setZoom((prev) => Math.min(4, +(prev + 0.3).toFixed(1)))}
                className="rounded-md px-2 py-1 text-sm text-gray-200 transition-colors hover:bg-gray-700"
              >
                +
              </button>
              <button
                onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.3).toFixed(1)))}
                className="rounded-md px-2 py-1 text-sm text-gray-200 transition-colors hover:bg-gray-700"
              >
                -
              </button>
              <button
                onClick={() => {
                  setZoom(1);
                  setCenter([38, 0.6]);
                }}
                className="rounded-md px-2 py-1 text-xs text-gray-200 transition-colors hover:bg-gray-700"
              >
                Reset
              </button>
            </div>
          </div>

          <motion.div
            key={zoom}
            initial={{ opacity: 0.8, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-lg border border-gray-700"
          >
            <ComposableMap projection="geoMercator" projectionConfig={{ center: [38, 0.6], scale: 3500 }}>
              <ZoomableGroup
                center={center}
                zoom={zoom}
                onMoveEnd={(position) => {
                  setCenter(position.coordinates as [number, number]);
                  setZoom(position.zoom);
                }}
              >
                <Geographies geography={KENYA_GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countyName = String(geo.properties.NAME_1 ?? '');
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => setHoveredCounty(countyName)}
                          onMouseLeave={() => setHoveredCounty(null)}
                          onClick={() => setSelectedCounty(countyName)}
                          style={{
                            default: {
                              fill: countyColor(countyName),
                              stroke: '#0f172a',
                              strokeWidth: 0.5,
                              outline: 'none',
                            },
                            hover: { fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 0.8, outline: 'none' },
                            pressed: { fill: '#0ea5e9', stroke: '#0f172a', strokeWidth: 0.8, outline: 'none' },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </motion.div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.25 }}
          className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-6"
        >
          <h2 className="text-lg font-semibold text-white">County Drill-down</h2>
          <p className="mt-1 text-sm text-gray-400">Click any county on the map to inspect sample housing metrics.</p>

          <AnimatePresence mode="wait">
            {!selectedCounty && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 rounded-lg border border-gray-700 bg-gray-800/30 p-4 text-sm text-gray-400"
              >
                No county selected.
              </motion.div>
            )}

            {selectedCounty && (
              <motion.div
                key={selectedCounty}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-4 space-y-2 rounded-lg border border-gray-700 bg-gray-800/30 p-4 text-sm"
              >
                <p className="text-base font-semibold text-white">{selectedCounty}</p>
                {selectedCountyData ? (
                  <>
                    <p className="text-gray-200">Units: {selectedCountyData.units}</p>
                    <p className="text-gray-200">Completion: {selectedCountyData.completion}</p>
                    <p className="text-gray-200">Jobs: {selectedCountyData.jobs}</p>
                    <p className="text-gray-300">Status: {selectedCountyData.status}</p>
                  </>
                ) : (
                  <p className="text-gray-400">No sample data for this county.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800/30 p-3 text-xs text-gray-300">
            <p className="mb-2 font-medium">Legend</p>
            <p className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-600" /> On target
            </p>
            <p className="mt-1 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Warning
            </p>
          </div>
        </motion.aside>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { title: 'Boma Yangu', values: bomaYanguMetrics },
          { title: 'Project Units Mix', values: projectMetrics },
          { title: 'Jobs Breakdown', values: jobsCreated },
        ].map((block, index) => (
          <motion.div
            key={block.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * index, duration: 0.25 }}
            className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-5"
          >
            <h3 className="text-base font-semibold text-white">{block.title}</h3>
            <div className="mt-3 space-y-2">
              {block.values.map((item) => (
                <div key={item.label} className="rounded-md border border-gray-700 bg-gray-800/35 p-3">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-6"
      >
        <h2 className="text-lg font-semibold text-white">Housing Projects (Live Feed)</h2>
        <p className="mt-1 text-sm text-gray-400">Source: /api/projects?focus=housing</p>

        <div className="mt-4 space-y-3">
          {loadingProjects && <p className="text-sm text-gray-300">Loading projects...</p>}

          {!loadingProjects && !projects.length && (
            <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-4 text-sm text-gray-400">
              No projects found.
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {projects.map((project) => {
              const progress = Math.max(0, Math.min(100, Number(project.percentage_complete ?? 0)));
              return (
                <motion.article
                  key={project.project_id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-lg border border-gray-700 bg-gray-800/35 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-white">{project.name}</p>
                      <p className="mt-1 text-xs text-gray-400">{project.county || 'County not specified'}</p>
                    </div>
                    <span className={`rounded-full border px-2 py-1 text-xs ${statusStyles(project.status)}`}>
                      {project.status || 'In progress'}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-2 rounded-full bg-sky-400"
                      />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-300 sm:grid-cols-2">
                    <p className="inline-flex items-center gap-1">
                      <Wallet className="h-3.5 w-3.5 text-gray-400" />
                      Allocated: {formatKES(project.allocated_kes)}
                    </p>
                    <p className="inline-flex items-center gap-1">
                      <Wallet className="h-3.5 w-3.5 text-gray-400" />
                      Disbursed: {formatKES(project.disbursed_kes)}
                    </p>
                    <p>Latest update: {project.latest_update ?? 'No update available'}</p>
                    <p>Expected completion: {project.expected_completion ?? 'Not provided'}</p>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.section>

      <footer className="text-center text-xs text-gray-400">Affordable Housing Pillar Dashboard</footer>
    </div>
  );
}
