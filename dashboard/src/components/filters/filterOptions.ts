import type { MinMagnitude, SelectOption, TimeRange } from '../../types/earthquake';

export const RANGE_OPTIONS: SelectOption<TimeRange>[] = [
  { value: 'hour', label: '1 h' },
  { value: 'day', label: '24 h' },
  { value: 'week', label: '7 días' },
  { value: 'month', label: '30 días' },
];

export const RANGE_OPTIONS_SHORT: SelectOption<TimeRange>[] = [
  { value: 'hour', label: '1 h' },
  { value: 'day', label: '24 h' },
  { value: 'week', label: '7 d' },
  { value: 'month', label: '30 d' },
];

export const MAGNITUDE_OPTIONS: SelectOption<MinMagnitude>[] = [
  { value: 0, label: 'Todas' },
  { value: 2, label: '2+' },
  { value: 4, label: '4+' },
];
