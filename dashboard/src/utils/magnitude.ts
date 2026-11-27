import type { MagnitudeLevel } from '../types/earthquake';

// Escala de color de la fase de diseño: azul baja, ámbar moderada, roja alta.
export const MAGNITUDE_COLORS: Record<MagnitudeLevel, string> = {
  low: '#5b9cf6',
  moderate: '#f59e0b',
  high: '#dc2626',
};

export const MAGNITUDE_TEXT: Record<MagnitudeLevel, string> = {
  low: 'Baja',
  moderate: 'Moderada',
  high: 'Alta',
};

export function getMagnitudeLevel(mag: number): MagnitudeLevel {
  if (mag >= 4) return 'high';
  if (mag >= 2) return 'moderate';
  return 'low';
}
