// Tipos compartidos del dashboard (sección 3 de la Planificación).

export type TimeRange = 'hour' | 'day' | 'week' | 'month';
export type MinMagnitude = 0 | 2 | 4; // Todas | 2+ | 4+
export type MagnitudeLevel = 'low' | 'moderate' | 'high'; // <2 | 2 a 3.9 | >=4
export type DataStatus = 'loading' | 'success' | 'error';
export type ViewState = 'loading' | 'error' | 'empty' | 'ready';

export interface EarthquakeEvent {
  id: string;
  time: number; // ms desde 1970, UTC (se convierte del ISO del JSON)
  place: string;
  region: string; // derivada del final de place
  mag: number;
  magType: string;
  depth: number; // km
  type: string;
  status: 'automatic' | 'reviewed';
  net: string;
  tsunami?: 0 | 1; // solo en el GeoJSON; no está en el CSV/JSON
  sig?: number; // solo en el GeoJSON; no está en el CSV/JSON
  nst: number | null;
  latitude: number;
  longitude: number;
  url: string; // página del evento en USGS; se arma con el id
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

export type SortKey = 'time' | 'place' | 'mag' | 'depth' | 'magType' | 'status' | 'tsunami';

export interface SortState {
  key: SortKey;
  direction: 'asc' | 'desc';
}

export interface TimePoint {
  label: string;
  count: number;
}

export interface HistogramBin {
  label: string;
  count: number;
  level: MagnitudeLevel;
}

export interface RegionCount {
  region: string;
  count: number;
}

export interface KpiData {
  id: 'total' | 'maxMag' | 'avgMag' | 'avgDepth';
  label: string;
  value: string;
  subtext: string;
  badge?: { text: string; level: MagnitudeLevel };
}
