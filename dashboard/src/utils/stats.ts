import type {
  EarthquakeEvent,
  HistogramBin,
  KpiData,
  RegionCount,
  SelectOption,
  TimePoint,
  TimeRange,
} from '../types/earthquake';
import { RANGE_TEXT } from './filters';
import { EMPTY_VALUE, formatAgo, formatDay, formatHour, formatMag } from './format';
import { getMagnitudeLevel, MAGNITUDE_TEXT } from './magnitude';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const ECUADOR_OFFSET = -5 * HOUR; // UTC-5, sin horario de verano

export function buildKpis(events: EarthquakeEvent[], range: TimeRange, now: number): KpiData[] {
  const total = events.length;
  const strongest = events.reduce<EarthquakeEvent | null>(
    (max, e) => (max === null || e.mag > max.mag ? e : max),
    null,
  );
  const avgMag = total > 0 ? events.reduce((sum, e) => sum + e.mag, 0) / total : null;
  const depths = events.map((e) => e.depth);
  const avgDepth = total > 0 ? depths.reduce((sum, d) => sum + d, 0) / total : null;

  return [
    { id: 'total', label: 'Sismos registrados', value: String(total), subtext: RANGE_TEXT[range] },
    {
      id: 'maxMag',
      label: 'Magnitud máxima',
      value: strongest ? formatMag(strongest.mag) : EMPTY_VALUE,
      subtext: strongest ? `${strongest.region} · ${formatAgo(strongest.time, now)}` : 'Sin datos',
      badge: strongest
        ? { text: MAGNITUDE_TEXT[getMagnitudeLevel(strongest.mag)], level: getMagnitudeLevel(strongest.mag) }
        : undefined,
    },
    {
      id: 'avgMag',
      label: 'Magnitud promedio',
      value: avgMag !== null ? formatMag(avgMag) : EMPTY_VALUE,
      subtext: `promedio de ${total} sismos`,
    },
    {
      id: 'avgDepth',
      label: 'Profundidad promedio',
      value: avgDepth !== null ? `${avgDepth.toFixed(1)} km` : EMPTY_VALUE,
      subtext:
        total > 0
          ? `mín ${Math.min(...depths).toFixed(1)} – máx ${Math.max(...depths).toFixed(1)} km`
          : 'Sin datos',
    },
  ];
}

// Tamaño y cantidad de intervalos de la serie según el rango elegido.
const SERIES_CONFIG: Record<TimeRange, { size: number; buckets: number }> = {
  hour: { size: 5 * MINUTE, buckets: 13 },
  day: { size: HOUR, buckets: 25 },
  week: { size: DAY, buckets: 8 },
  month: { size: DAY, buckets: 31 },
};

export function getGranularity(range: TimeRange): 'hour' | 'day' {
  return range === 'hour' || range === 'day' ? 'hour' : 'day';
}

export function buildTimeSeries(events: EarthquakeEvent[], range: TimeRange, now: number): TimePoint[] {
  const { size, buckets } = SERIES_CONFIG[range];
  // Inicio del intervalo que contiene "now", alineado a la hora local de Ecuador.
  const lastStart = Math.floor((now + ECUADOR_OFFSET) / size) * size - ECUADOR_OFFSET;
  const firstStart = lastStart - (buckets - 1) * size;
  const counts = new Array<number>(buckets).fill(0);

  for (const e of events) {
    const index = Math.floor((e.time - firstStart) / size);
    if (index >= 0 && index < buckets) counts[index] += 1;
  }

  const granularity = getGranularity(range);
  return counts.map((count, i) => {
    const start = firstStart + i * size;
    return { label: granularity === 'hour' ? formatHour(start) : formatDay(start), count };
  });
}

const HISTOGRAM_BINS: Array<{ label: string; min: number; max: number }> = [
  { label: '<1', min: -Infinity, max: 1 },
  { label: '1–1.9', min: 1, max: 2 },
  { label: '2–2.9', min: 2, max: 3 },
  { label: '3–3.9', min: 3, max: 4 },
  { label: '4–4.9', min: 4, max: 5 },
  { label: '5+', min: 5, max: Infinity },
];

export function buildHistogram(events: EarthquakeEvent[]): HistogramBin[] {
  return HISTOGRAM_BINS.map((bin) => ({
    label: bin.label,
    count: events.filter((e) => e.mag >= bin.min && e.mag < bin.max).length,
    level: getMagnitudeLevel(Number.isFinite(bin.min) ? bin.min : 0),
  }));
}

export function buildRegionCounts(events: EarthquakeEvent[]): RegionCount[] {
  const counts = new Map<string, number>();
  for (const e of events) counts.set(e.region, (counts.get(e.region) ?? 0) + 1);
  return [...counts.entries()]
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count || a.region.localeCompare(b.region, 'es'));
}

export function buildRegionOptions(events: EarthquakeEvent[]): SelectOption<string>[] {
  const regions = buildRegionCounts(events).map((r) => r.region);
  regions.sort((a, b) => a.localeCompare(b, 'es'));
  return [{ value: 'all', label: 'Todas' }, ...regions.map((r) => ({ value: r, label: r }))];
}
