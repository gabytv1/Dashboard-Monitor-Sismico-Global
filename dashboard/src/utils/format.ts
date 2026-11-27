// Funciones de formato. Las horas se muestran en la zona horaria de Ecuador.
const TIME_ZONE = 'America/Guayaquil';

const dateTimeFormat = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: TIME_ZONE,
});

const hourFormat = new Intl.DateTimeFormat('es-EC', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: TIME_ZONE,
});

const dayFormat = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  timeZone: TIME_ZONE,
});

const fullFormat = new Intl.DateTimeFormat('es-EC', {
  dateStyle: 'medium',
  timeStyle: 'medium',
  hour12: false,
  timeZone: TIME_ZONE,
});

const utcFormat = new Intl.DateTimeFormat('es-EC', {
  dateStyle: 'medium',
  timeStyle: 'medium',
  hour12: false,
  timeZone: 'UTC',
});

const cleanMonth = (text: string) => text.replace('.', '');

export const formatDateTime = (ms: number) => cleanMonth(dateTimeFormat.format(ms));
export const formatHour = (ms: number) => hourFormat.format(ms);
export const formatDay = (ms: number) => cleanMonth(dayFormat.format(ms));
export const formatLocalFull = (ms: number) => fullFormat.format(ms);
export const formatUtcFull = (ms: number) => `${utcFormat.format(ms)} UTC`;

export const formatMag = (mag: number) => mag.toFixed(1);
export const formatDepth = (km: number) => `${km.toFixed(1)} km`;

export function formatAgo(fromMs: number, toMs: number): string {
  const minutes = Math.max(0, Math.round((toMs - fromMs) / 60000));
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `hace ${hours} h`;
  return `hace ${Math.round(hours / 24)} d`;
}

export const EMPTY_VALUE = '—';
