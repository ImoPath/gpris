'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Briefcase, Search, SlidersHorizontal, StickyNote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Trend = 'up' | 'down' | 'neutral';

type MetricCardRow = {
  section_id: number;
  section_code: string;
  section_title: string;
  category: string;
  metric_id: number;
  metric_name: string;
  unit: string | null;
  direction: string | null;
  percent_value: number | null;
  baseline_label: string | null;
  baseline_value: string | null;
  current_label: string | null;
  current_value: string | null;
  delta_label: string | null;
  delta_value: string | null;
  delta_note: string | null;
};

type MetricCardsResponse = {
  pillar?: string;
  count?: number;
  metrics?: MetricCardRow[];
  detail?: string;
  error?: string;
};

type ProjectRow = {
  project_id: number;
  name: string | null;
  status: string | null;
  percentage_complete: number | null;
  latest_update: string | null;
  allocated_kes: number | null;
  disbursed_kes: number | null;
  county: string | null;
};

type ProjectsResponse = {
  data?: ProjectRow[];
  detail?: string;
  error?: string;
};

type SectionGroup = {
  key: string;
  title: string;
  metrics: MetricCardRow[];
};

function resolveApiPath(path: string) {
  const basePath = '/overview';
  return path.startsWith(basePath) ? path : `${basePath}${path}`;
}

function normalizeTrend(direction: string | null | undefined): Trend {
  const value = (direction ?? '').toLowerCase();
  if (value.includes('up') || value.includes('positive')) return 'up';
  if (value.includes('down') || value.includes('negative')) return 'down';
  return 'neutral';
}

function formatNumberLike(value: string | null | undefined) {
  if (!value) return '—';
  const parsed = Number(String(value).replace(/,/g, '').replace('%', '').trim());
  if (!Number.isFinite(parsed)) return value;
  return new Intl.NumberFormat('en-KE', { maximumFractionDigits: 1 }).format(parsed);
}

function formatMetricValue(value: string | null | undefined, unit: string | null | undefined) {
  if (!value) return '—';
  return `${formatNumberLike(value)}${unit ? ` ${unit}` : ''}`;
}

function formatCompactNumber(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-KE', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function valueTone(trend: Trend) {
  if (trend === 'up') return 'text-emerald-300';
  if (trend === 'down') return 'text-rose-300';
  return 'text-gray-200';
}

function statusTone(status: string | null | undefined) {
  const value = (status ?? '').toLowerCase();
  if (value.includes('complete') || value.includes('done')) return 'bg-emerald-500/20 text-emerald-200';
  if (value.includes('delay') || value.includes('risk')) return 'bg-rose-500/20 text-rose-200';
  if (value.includes('progress') || value.includes('ongoing')) return 'bg-amber-500/20 text-amber-200';
  return 'bg-slate-500/20 text-slate-200';
}

export function MsmeEconomyPage() {
  const [metricCards, setMetricCards] = useState<MetricCardRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedTrend, setSelectedTrend] = useState<'all' | Trend>('all');
  const [projectStatus, setProjectStatus] = useState('all');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const [metricsResponse, projectsResponse] = await Promise.all([
          fetch(`${resolveApiPath('/api/metric-cards')}?pillar=MSME%20Economy`, { cache: 'no-store' }),
          fetch(`${resolveApiPath('/api/projects')}?focus=msme`, { cache: 'no-store' }),
        ]);

        const metricsData = (await metricsResponse.json()) as MetricCardsResponse;
        const projectsData = (await projectsResponse.json()) as ProjectsResponse;

        if (!metricsResponse.ok) {
          throw new Error(metricsData.detail ?? metricsData.error ?? `Metrics request failed (${metricsResponse.status})`);
        }
        if (!projectsResponse.ok) {
          throw new Error(projectsData.detail ?? projectsData.error ?? `Projects request failed (${projectsResponse.status})`);
        }

        if (!cancelled) {
          setMetricCards(Array.isArray(metricsData.metrics) ? metricsData.metrics : []);
          setProjects(Array.isArray(projectsData.data) ? projectsData.data : []);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : 'Failed to load MSME dashboard data');
          setMetricCards([]);
          setProjects([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const sectionOptions = useMemo(() => {
    const deduped = new Map<string, string>();
    metricCards.forEach((row) => {
      const key = row.section_code || `section-${row.section_id}`;
      if (!deduped.has(key)) deduped.set(key, row.section_title || row.section_code || 'Uncategorized');
    });
    return [{ key: 'all', label: 'All sections' }, ...Array.from(deduped, ([key, label]) => ({ key, label }))];
  }, [metricCards]);

  const filteredMetrics = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return metricCards.filter((row) => {
      const sectionKey = row.section_code || `section-${row.section_id}`;
      if (selectedSection !== 'all' && sectionKey !== selectedSection) return false;

      const trend = normalizeTrend(row.direction);
      if (selectedTrend !== 'all' && trend !== selectedTrend) return false;

      if (!trimmed) return true;
      const haystack = [row.metric_name, row.category, row.section_title, row.section_code, row.current_label, row.delta_note]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [metricCards, query, selectedSection, selectedTrend]);

  const topCards = useMemo(() => filteredMetrics.slice(0, 4), [filteredMetrics]);

  const sectionGroups = useMemo<SectionGroup[]>(() => {
    const grouped = new Map<string, SectionGroup>();
    filteredMetrics.forEach((row) => {
      const key = row.section_code || `section-${row.section_id}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          key,
          title: row.section_title || row.section_code || 'Uncategorized',
          metrics: [],
        });
      }
      grouped.get(key)?.metrics.push(row);
    });
    return Array.from(grouped.values());
  }, [filteredMetrics]);

  const notes = useMemo(
    () => filteredMetrics.filter((row) => Boolean(row.delta_note && row.delta_note.trim().length > 0)),
    [filteredMetrics]
  );

  const projectStatusOptions = useMemo(() => {
    const unique = new Set<string>();
    projects.forEach((project) => {
      const status = (project.status ?? '').trim();
      if (status) unique.add(status);
    });
    return ['all', ...Array.from(unique)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (projectStatus === 'all') return projects;
    return projects.filter((project) => (project.status ?? '').toLowerCase() === projectStatus.toLowerCase());
  }, [projects, projectStatus]);

  return (
    <div className="space-y-6 p-4 pb-[7%] sm:p-6 sm:px-[5%]">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-4 rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">MSME Economy Metrics</h1>
            <p className="mt-1 text-sm text-gray-400 sm:text-base">
              Performance view for MSME Economy, sourced from <span className="font-medium">beta.vw_metric_cards</span>.
            </p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
            {loading
              ? 'Loading data...'
              : `${filteredMetrics.length} of ${metricCards.length} metrics shown | ${filteredProjects.length} projects`}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <label className="md:col-span-1">
            <span className="mb-1 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
              <Search className="h-3.5 w-3.5" />
              Search
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search metric, section, or note..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none ring-emerald-400/40 transition focus:ring"
            />
          </label>

          <label>
            <span className="mb-1 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Section
            </span>
            <select
              value={selectedSection}
              onChange={(event) => setSelectedSection(event.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none ring-emerald-400/40 transition focus:ring"
            >
              {sectionOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Trend
            </span>
            <select
              value={selectedTrend}
              onChange={(event) => setSelectedTrend(event.target.value as 'all' | Trend)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none ring-emerald-400/40 transition focus:ring"
            >
              <option value="all">All trends</option>
              <option value="up">Up</option>
              <option value="down">Down</option>
              <option value="neutral">Neutral</option>
            </select>
          </label>

          <label>
            <span className="mb-1 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
              <Briefcase className="h-3.5 w-3.5" />
              Project status
            </span>
            <select
              value={projectStatus}
              onChange={(event) => setProjectStatus(event.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none ring-emerald-400/40 transition focus:ring"
            >
              {projectStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All statuses' : status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </motion.div>

      {error && (
        <div className="rounded-lg border border-rose-600/50 bg-rose-500/10 p-4 text-sm text-rose-200">
          Failed to load MSME dashboard: {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {topCards.map((row, idx) => {
          const trend = normalizeTrend(row.direction);
          return (
            <motion.div
              key={row.metric_id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.25 }}
              className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 shadow-lg shadow-black/10"
            >
              <p className="text-sm text-gray-300">{row.metric_name}</p>
              <p className="mt-2 text-2xl font-bold text-white">{formatMetricValue(row.current_value, row.unit)}</p>
              <p className={`mt-2 text-sm ${valueTone(trend)}`}>
                {row.delta_label || 'Change'}: {row.delta_value || '—'}
              </p>
            </motion.div>
          );
        })}
      </div>

      {!loading && !filteredMetrics.length && (
        <div className="rounded-lg border border-gray-700 bg-[#1f2333] p-8 text-center text-sm text-gray-300">
          No metrics match your current filters.
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {sectionGroups.map((group, groupIndex) => (
          <motion.section
            key={group.key}
            layout
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, delay: groupIndex * 0.03 }}
            className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-6"
          >
            <h2 className="text-lg font-semibold text-white">{group.title}</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
              {group.metrics.map((row) => {
                const trend = normalizeTrend(row.direction);
                const progress = Math.max(0, Math.min(100, Number(row.percent_value ?? 0)));
                return (
                  <motion.div
                    key={row.metric_id}
                    layout
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg border border-gray-700 bg-gray-800/40 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">{row.metric_name}</p>
                        <p className="mt-1 text-xs text-gray-400">{row.category || 'General'}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          trend === 'up'
                            ? 'bg-emerald-500/20 text-emerald-200'
                            : trend === 'down'
                              ? 'bg-rose-500/20 text-rose-200'
                              : 'bg-slate-500/20 text-slate-200'
                        }`}
                      >
                        {trend}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs sm:text-sm">
                      <div>
                        <p className="text-gray-400">{row.baseline_label || 'Baseline'}</p>
                        <p className="font-semibold text-gray-100">{formatMetricValue(row.baseline_value, row.unit)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">{row.current_label || 'Current'}</p>
                        <p className="font-semibold text-white">{formatMetricValue(row.current_value, row.unit)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">{row.delta_label || 'Change'}</p>
                        <p className={`font-semibold ${valueTone(trend)}`}>{row.delta_value || '—'}</p>
                      </div>
                    </div>

                    {Number.isFinite(progress) && progress > 0 ? (
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                          <span>Progress</span>
                          <span>{progress.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-700">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-2 rounded-full bg-emerald-400"
                          />
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        ))}
      </AnimatePresence>

      <section className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-6">
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
          <StickyNote className="h-5 w-5 text-amber-300" />
          Metric Notes
        </h2>
        <div className="mt-4 space-y-3">
          {notes.length ? (
            notes.map((row) => (
              <div key={`note-${row.metric_id}`} className="rounded-lg border border-gray-700 bg-gray-800/40 p-3">
                <p className="text-sm font-medium text-white">{row.metric_name}</p>
                <p className="mt-1 text-sm text-gray-300">{row.delta_note}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No notes available for the current filter selection.</p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-6">
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
          <Briefcase className="h-5 w-5 text-cyan-300" />
          MSME Projects
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filteredProjects.length ? (
            filteredProjects.map((project, index) => {
              const progress = Math.max(0, Math.min(100, Number(project.percentage_complete ?? 0)));
              return (
                <motion.article
                  key={project.project_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: Math.min(index * 0.02, 0.2) }}
                  className="rounded-lg border border-gray-700 bg-gray-800/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-white">{project.name || 'Unnamed project'}</p>
                    <span className={`rounded-full px-2 py-1 text-xs ${statusTone(project.status)}`}>
                      {project.status || 'Unknown'}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-gray-300 sm:text-sm">
                    <p>
                      <span className="text-gray-400">County:</span> {project.county || '—'}
                    </p>
                    <p>
                      <span className="text-gray-400">Allocated:</span> {formatCompactNumber(project.allocated_kes)}
                    </p>
                    <p>
                      <span className="text-gray-400">Disbursed:</span> {formatCompactNumber(project.disbursed_kes)}
                    </p>
                    <p>
                      <span className="text-gray-400">Completion:</span> {progress.toFixed(1)}%
                    </p>
                  </div>

                  {progress > 0 ? (
                    <div className="mt-3">
                      <div className="h-2 rounded-full bg-gray-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-2 rounded-full bg-cyan-400"
                        />
                      </div>
                    </div>
                  ) : null}

                  <p className="mt-3 text-sm text-gray-300">{project.latest_update || 'No updates yet.'}</p>
                </motion.article>
              );
            })
          ) : (
            <p className="text-sm text-gray-400">No projects found for the current selection.</p>
          )}
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400">Source: `beta.vw_metric_cards`</footer>
    </div>
  );
}
