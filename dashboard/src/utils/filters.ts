import type { EarthquakeEvent, FilterState, SortState, TimeRange } from '../types/earthquake';

export const DEFAULT_FILTERS: FilterState = { range: 'day', minMag: 0, region: 'all' };
export const DEFAULT_SORT: SortState = { key: 'time', direction: 'desc' };

export const RANGE_HOURS: Record<TimeRange, number> = { hour: 1, day: 24, week: 168, month: 720 };

export const RANGE_TEXT: Record<TimeRange, string> = {
  hour: 'en la última hora',
  day: 'en las últimas 24 h',
  week: 'en los últimos 7 días',
  month: 'en los últimos 30 días',
};

export function filterByRange(events: EarthquakeEvent[], range: TimeRange, now: number): EarthquakeEvent[] {
  const from = now - RANGE_HOURS[range] * 3600 * 1000;
  return events.filter((e) => e.time >= from && e.time <= now);
}

// La magnitud mínima y la región se aplican en el navegador.
// «Todas» (minMag = 0) no filtra, porque el catálogo incluye magnitudes negativas.
export function applyClientFilters(events: EarthquakeEvent[], filters: FilterState): EarthquakeEvent[] {
  return events.filter(
    (e) =>
      (filters.minMag === 0 || e.mag >= filters.minMag) &&
      (filters.region === 'all' || e.region === filters.region),
  );
}

export function countActiveFilters(filters: FilterState): number {
  return (filters.minMag !== 0 ? 1 : 0) + (filters.region !== 'all' ? 1 : 0);
}

export function sortEvents(events: EarthquakeEvent[], sort: SortState): EarthquakeEvent[] {
  const factor = sort.direction === 'asc' ? 1 : -1;
  return [...events].sort((a, b) => {
    const va = a[sort.key] ?? -1;
    const vb = b[sort.key] ?? -1;
    if (typeof va === 'string' && typeof vb === 'string') return va.localeCompare(vb, 'es') * factor;
    return ((va as number) - (vb as number)) * factor;
  });
}
