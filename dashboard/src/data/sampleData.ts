// Datos de ejemplo del Sprint 2: 298 sismos tomados de data/earthquakes.json
// (Sprint 1), uno de cada 33 registros, con los campos que usa la interfaz.
import type { EarthquakeEvent } from '../types/earthquake';
import { getRegion } from '../utils/dashboard';
import rawSample from './sampleEarthquakes.json';

interface RawEarthquake {
  id: string;
  time: string; // ISO 8601 UTC
  place: string | null;
  mag: number;
  magType: string | null;
  depth: number | null;
  status: string | null;
  latitude: number;
  longitude: number;
}

export const SAMPLE_EVENTS: EarthquakeEvent[] = (rawSample as RawEarthquake[]).map((raw) => ({
  id: raw.id,
  time: Date.parse(raw.time),
  place: raw.place ?? 'Ubicación no disponible',
  region: getRegion(raw.place),
  mag: raw.mag,
  magType: raw.magType ?? '',
  depth: raw.depth ?? 0,
  status: raw.status === 'reviewed' ? 'reviewed' : 'automatic',
  latitude: raw.latitude,
  longitude: raw.longitude,
}));

// El sismo más reciente de la muestra hace de "ahora" para calcular los rangos.
export const SAMPLE_NOW = SAMPLE_EVENTS.reduce((max, e) => Math.max(max, e.time), 0);
