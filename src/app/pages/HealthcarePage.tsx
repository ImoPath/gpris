'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, CalendarClock, ShieldCheck, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

type CountyCount = { county: string; count: number };

type SummaryResponse = {
  registrations: {
    total: number;
    by_gender: { male: number; female: number };
    by_age: { below_18: number; above_18: number };
    by_employment: {
      employed: number;
      self_employed: number;
      unemployed: number;
      sponsored: number;
    };
    by_county: CountyCount[];
  };
  facilities: {
    total: number;
    active: number;
    inactive: number;
    licensed: number;
    unlicensed: number;
    by_level: Array<{ level: string; count: number }>;
    by_county: CountyCount[];
  };
  last_synced: Array<{
    dataset_name: string;
    last_synced_modified_at: string | null;
    last_full_sync_at: string | null;
  }>;
};

type CountyResponse = {
  county: string;
  registrations: SummaryResponse['registrations'];
  facilities: SummaryResponse['facilities'];
};

type CountyStatus = 'on-target' | 'warning' | 'intervention';
type MapTab = 'registrations' | 'facilities';

const GEO_URL = '/geojson/gadm41_KEN_1.json';
const STATUS_COLORS: Record<CountyStatus, string> = {
  'on-target': '#16a34a',
  warning: '#f59e0b',
  intervention: '#e11d48',
};

function formatNumber(value: number | undefined) {
  return new Intl.NumberFormat('en-KE').format(value ?? 0);
}

function formatPercent(numerator: number, denominator: number) {
  if (!denominator) return '0.0%';
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function buildMapData(rows: CountyCount[]) {
  const sorted = [...rows].sort((a, b) => b.count - a.count);
  const tercile = Math.max(1, Math.ceil(sorted.length / 3));

  const statusByCounty = new Map<string, CountyStatus>();
  sorted.forEach((row, index) => {
    const status: CountyStatus =
      index < tercile ? 'on-target' : index < tercile * 2 ? 'warning' : 'intervention';
    statusByCounty.set(row.county, status);
  });

  const values = sorted.map((r) => r.count);
  const max = values[0] ?? 0;
  const middle = values[Math.min(tercile, values.length - 1)] ?? 0;
  const low = values[Math.min(tercile * 2, values.length - 1)] ?? 0;

  return {
    statusByCounty,
    legend: { max, middle, low },
  };
}

function latestSyncDisplay(lastSynced: SummaryResponse['last_synced']) {
  const timestamps = lastSynced
    .flatMap((item) => [item.last_synced_modified_at, item.last_full_sync_at])
    .filter(Boolean)
    .map((value) => new Date(value as string).getTime())
    .filter((t) => !Number.isNaN(t));

  if (!timestamps.length) return 'Not available';
  return new Date(Math.max(...timestamps)).toLocaleDateString();
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/40 p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export function HealthcarePage() {
  const router = useRouter();

  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [mapTab, setMapTab] = useState<MapTab>('registrations');
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);

  const [countyData, setCountyData] = useState<CountyResponse | null>(null);
  const [countyLoading, setCountyLoading] = useState(false);
  const [countyError, setCountyError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setSummaryLoading(true);
      setSummaryError(null);
      try {
        const response = await fetch('/api/healthcare/summary', { cache: 'no-store' });
        if (!response.ok) throw new Error(`Summary request failed (${response.status})`);
        const data = (await response.json()) as SummaryResponse;
        if (!cancelled) setSummary(data);
      } catch (error) {
        if (!cancelled) {
          setSummaryError(error instanceof Error ? error.message : 'Failed to load summary');
        }
      } finally {
        if (!cancelled) setSummaryLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedCounty) return;
    let cancelled = false;
    const run = async () => {
      setCountyLoading(true);
      setCountyError(null);
      try {
        const params = new URLSearchParams({ name: selectedCounty });
        const response = await fetch(`/api/healthcare/county?${params.toString()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`County request failed (${response.status})`);
        const data = (await response.json()) as CountyResponse;
        if (!cancelled) setCountyData(data);
      } catch (error) {
        if (!cancelled) {
          setCountyError(error instanceof Error ? error.message : 'Failed to load county');
          setCountyData(null);
        }
      } finally {
        if (!cancelled) setCountyLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedCounty]);

  const registrationMapData = useMemo(
    () => buildMapData(summary?.registrations.by_county ?? []),
    [summary?.registrations.by_county]
  );
  const facilityMapData = useMemo(
    () => buildMapData(summary?.facilities.by_county ?? []),
    [summary?.facilities.by_county]
  );

  const activeMapData = mapTab === 'registrations' ? registrationMapData : facilityMapData;
  const countyOptions = summary?.registrations.by_county.map((row) => row.county) ?? [];

  return (
    <div className="space-y-6 p-4 pb-[7%] sm:p-6 sm:px-[5%]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Healthcare Service Access</h1>
          <p className="mt-1 text-sm text-gray-400 sm:text-base">
            Universal Health Care dashboard for registration, facilities, and county performance.
          </p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>

      {summaryError && (
        <div className="rounded-lg border border-rose-600/50 bg-rose-500/10 p-4 text-sm text-rose-200">
          Failed to load healthcare summary: {summaryError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-700 bg-[#1f2333] p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="h-4 w-4" />
            <span className="text-sm">SHA Members Registered</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">
            {summaryLoading ? '...' : formatNumber(summary?.registrations.total)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-700 bg-[#1f2333] p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Building2 className="h-4 w-4" />
            <span className="text-sm">Active SHA Facilities</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">
            {summaryLoading ? '...' : formatNumber(summary?.facilities.active)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-700 bg-[#1f2333] p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-sm">Licensed Facilities (%)</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">
            {summaryLoading || !summary
              ? '...'
              : formatPercent(summary.facilities.licensed, summary.facilities.total)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-700 bg-[#1f2333] p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <CalendarClock className="h-4 w-4" />
            <span className="text-sm">Last Data Sync</span>
          </div>
          <p className="mt-2 text-xl font-bold text-white">
            {summaryLoading || !summary ? '...' : latestSyncDisplay(summary.last_synced)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white">Registration Demographics</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <InfoStat label="Male" value={formatNumber(summary?.registrations.by_gender.male)} />
            <InfoStat label="Female" value={formatNumber(summary?.registrations.by_gender.female)} />
            <InfoStat label="Below 18" value={formatNumber(summary?.registrations.by_age.below_18)} />
            <InfoStat label="Above 18" value={formatNumber(summary?.registrations.by_age.above_18)} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <InfoStat label="Employed" value={formatNumber(summary?.registrations.by_employment.employed)} />
            <InfoStat
              label="Self Employed"
              value={formatNumber(summary?.registrations.by_employment.self_employed)}
            />
            <InfoStat label="Unemployed" value={formatNumber(summary?.registrations.by_employment.unemployed)} />
            <InfoStat label="Sponsored" value={formatNumber(summary?.registrations.by_employment.sponsored)} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white">Facility Status</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <InfoStat label="Total" value={formatNumber(summary?.facilities.total)} />
            <InfoStat label="Active" value={formatNumber(summary?.facilities.active)} />
            <InfoStat label="Inactive" value={formatNumber(summary?.facilities.inactive)} />
            <InfoStat label="Licensed" value={formatNumber(summary?.facilities.licensed)} />
          </div>
          <div className="mt-4 space-y-2 rounded-lg border border-gray-700 bg-gray-800/30 p-3">
            <p className="text-sm text-gray-300">Facility KEPH levels</p>
            <div className="flex flex-wrap gap-2 text-sm">
              {(summary?.facilities.by_level ?? []).map((level) => (
                <span key={level.level} className="rounded-md bg-gray-700 px-2 py-1 text-gray-200">
                  {level.level}: {formatNumber(level.count)}
                </span>
              ))}
              {!summary?.facilities.by_level?.length && <span className="text-gray-500">No level data</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:col-span-2 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">County Performance Map</h2>
              <p className="text-sm text-gray-400">
                {hoveredCounty ? `Hovering: ${hoveredCounty}` : 'Click a county to view drill-down details'}
              </p>
            </div>
            <div className="inline-flex rounded-lg border border-gray-700 bg-gray-800/60 p-1">
              <button
                onClick={() => setMapTab('registrations')}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  mapTab === 'registrations' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Registrations
              </button>
              <button
                onClick={() => setMapTab('facilities')}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  mapTab === 'facilities' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Facilities
              </button>
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-lg border border-gray-700">
            <ComposableMap projection="geoMercator" projectionConfig={{ center: [38, 0.6], scale: 3500 }}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countyName = String(geo.properties.NAME_1 ?? '');
                    const status = activeMapData.statusByCounty.get(countyName);
                    const fill = status ? STATUS_COLORS[status] : '#334155';
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => setHoveredCounty(countyName)}
                        onMouseLeave={() => setHoveredCounty(null)}
                        onClick={() => setSelectedCounty(countyName)}
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

          <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800/30 p-3 text-sm">
            <p className="mb-2 text-gray-300">Legend ({mapTab})</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-gray-200">
                <span className="inline-block h-3 w-3 rounded-full bg-green-600" /> On target (up to{' '}
                {formatNumber(activeMapData.legend.max)})
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <span className="inline-block h-3 w-3 rounded-full bg-amber-500" /> Warning (up to{' '}
                {formatNumber(activeMapData.legend.middle)})
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <span className="inline-block h-3 w-3 rounded-full bg-rose-600" /> Intervention (up to{' '}
                {formatNumber(activeMapData.legend.low)})
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-[#1f2333] p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white">County Drill-down</h2>
          <label className="mt-3 block text-sm text-gray-300">
            Search county
            <input
              list="county-list"
              value={selectedCounty}
              onChange={(event) => setSelectedCounty(event.target.value)}
              placeholder="Start typing county name..."
              className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none ring-blue-500/40 focus:ring"
            />
          </label>
          <datalist id="county-list">
            {countyOptions.map((county) => (
              <option key={county} value={county} />
            ))}
          </datalist>

          <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800/30 p-3">
            {!selectedCounty && <p className="text-sm text-gray-400">Select a county from the map or search box.</p>}
            {selectedCounty && countyLoading && <p className="text-sm text-gray-300">Loading county metrics...</p>}
            {selectedCounty && countyError && (
              <p className="text-sm text-rose-300">Could not load county details: {countyError}</p>
            )}
            {countyData && !countyLoading && !countyError && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">County</p>
                  <p className="text-xl font-semibold text-white">{countyData.county}</p>
                </div>

                {mapTab === 'registrations' ? (
                  <div className="space-y-2 text-sm text-gray-200">
                    <p className="font-medium text-white">Registrations</p>
                    <p>Total: {formatNumber(countyData.registrations.total)}</p>
                    <p>
                      Gender: Male {formatNumber(countyData.registrations.by_gender.male)} / Female{' '}
                      {formatNumber(countyData.registrations.by_gender.female)}
                    </p>
                    <p>
                      Age: Below 18 {formatNumber(countyData.registrations.by_age.below_18)} / Above 18{' '}
                      {formatNumber(countyData.registrations.by_age.above_18)}
                    </p>
                    <p>
                      Employment: Employed {formatNumber(countyData.registrations.by_employment.employed)}, Self-employed{' '}
                      {formatNumber(countyData.registrations.by_employment.self_employed)}, Unemployed{' '}
                      {formatNumber(countyData.registrations.by_employment.unemployed)}, Sponsored{' '}
                      {formatNumber(countyData.registrations.by_employment.sponsored)}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm text-gray-200">
                    <p className="font-medium text-white">Facilities</p>
                    <p>Total: {formatNumber(countyData.facilities.total)}</p>
                    <p>
                      Active {formatNumber(countyData.facilities.active)} / Inactive{' '}
                      {formatNumber(countyData.facilities.inactive)}
                    </p>
                    <p>
                      Licensed {formatNumber(countyData.facilities.licensed)} / Unlicensed{' '}
                      {formatNumber(countyData.facilities.unlicensed)}
                    </p>
                    <div className="pt-1">
                      <p className="mb-1 text-gray-300">KEPH Levels</p>
                      <div className="flex flex-wrap gap-2">
                        {countyData.facilities.by_level.map((level) => (
                          <span key={level.level} className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-100">
                            {level.level}: {formatNumber(level.count)}
                          </span>
                        ))}
                        {!countyData.facilities.by_level.length && (
                          <span className="text-xs text-gray-500">No level breakdown available</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
