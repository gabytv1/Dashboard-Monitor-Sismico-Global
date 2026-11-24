// Tipos compartidos del dashboard (sección 3 de la Planificación).

export type TimeRange = 'hour' | 'day' | 'week' | 'month';
export type MinMagnitude = 0 | 2 | 4; // Todas | 2+ | 4+

export interface EarthquakeEvent {
  id: string;
  time: number; // ms desde 1970, UTC
  place: string;
  region: string; // derivada del final de place
  mag: number;
  magType: string;
  depth: number; // km
  status: 'automatic' | 'reviewed';
  latitude: number;
  longitude: number;
}

export interface FilterState {
  range: TimeRange;
  minMag: MinMagnitude;
  region: string; // 'all' o nombre de la región
}

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}

export interface KpiData {
  id: 'total' | 'maxMag' | 'avgMag' | 'avgDepth';
  label: string;
  value: string;
  subtext: string;
}
