import type { EarthquakeEvent, FilterState, KpiData, SelectOption, TimeRange } from '../types/earthquake';

const RANGE_HOURS: Record<TimeRange, number> = { hour: 1, day: 24, week: 168, month: 720 };

const RANGE_TEXT: Record<TimeRange, string> = {
  hour: 'en la última hora',
  day: 'en las últimas 24 h',
  week: 'en los últimos 7 días',
  month: 'en los últimos 30 días',
};

const REGION_NAMES: Record<string, string> = {
  CA: 'California',
  MX: 'México',
  Mexico: 'México',
  Hawaii: 'Hawái',
  'New Mexico': 'Nuevo México',
  Japan: 'Japón',
  Russia: 'Rusia',
  Philippines: 'Filipinas',
  Peru: 'Perú',
};

// Región = texto después de la última coma de "place" (ej. "..., CA" -> "California").
export function getRegion(place: string | null): string {
  if (!place) return 'Desconocida';
  const comma = place.lastIndexOf(', ');
  const region = comma >= 0 ? place.slice(comma + 2) : place;
  return REGION_NAMES[region] ?? region;
}

// Aplica los tres filtros: rango de tiempo, magnitud mínima y región.
export function applyFilters(events: EarthquakeEvent[], filters: FilterState, now: number): EarthquakeEvent[] {
  const from = now - RANGE_HOURS[filters.range] * 3600 * 1000;
  return events.filter(
    (e) =>
      e.time >= from &&
      (filters.minMag === 0 || e.mag >= filters.minMag) &&
      (filters.region === 'all' || e.region === filters.region),
  );
}

export function buildKpis(events: EarthquakeEvent[], range: TimeRange): KpiData[] {
  const total = events.length;
  if (total === 0) {
    return [
      { id: 'total', label: 'Sismos registrados', value: '0', subtext: RANGE_TEXT[range] },
      { id: 'maxMag', label: 'Magnitud máxima', value: '-', subtext: 'Sin datos' },
      { id: 'avgMag', label: 'Magnitud promedio', value: '-', subtext: 'Sin datos' },
      { id: 'avgDepth', label: 'Profundidad promedio', value: '-', subtext: 'Sin datos' },
    ];
  }
  const strongest = events.reduce((max, e) => (e.mag > max.mag ? e : max));
  const avgMag = events.reduce((sum, e) => sum + e.mag, 0) / total;
  const avgDepth = events.reduce((sum, e) => sum + e.depth, 0) / total;
  return [
    { id: 'total', label: 'Sismos registrados', value: String(total), subtext: RANGE_TEXT[range] },
    { id: 'maxMag', label: 'Magnitud máxima', value: strongest.mag.toFixed(1), subtext: strongest.region },
    { id: 'avgMag', label: 'Magnitud promedio', value: avgMag.toFixed(1), subtext: `promedio de ${total} sismos` },
    { id: 'avgDepth', label: 'Profundidad promedio', value: `${avgDepth.toFixed(1)} km`, subtext: 'bajo la superficie' },
  ];
}

export function buildRegionOptions(events: EarthquakeEvent[]): SelectOption<string>[] {
  const regions = [...new Set(events.map((e) => e.region))].sort((a, b) => a.localeCompare(b, 'es'));
  return [{ value: 'all', label: 'Todas' }, ...regions.map((r) => ({ value: r, label: r }))];
}

const dateFormat = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'America/Guayaquil',
});

export const formatDateTime = (ms: number) => dateFormat.format(ms).replace('.', '');
