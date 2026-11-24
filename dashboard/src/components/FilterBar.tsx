import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import type { FilterState, MinMagnitude, SelectOption, TimeRange } from '../types/earthquake';

interface FilterBarProps {
  filters: FilterState;
  regionOptions: SelectOption<string>[];
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

const RANGE_OPTIONS: SelectOption<TimeRange>[] = [
  { value: 'hour', label: '1 h' },
  { value: 'day', label: '24 h' },
  { value: 'week', label: '7 d' },
  { value: 'month', label: '30 d' },
];

const MAGNITUDE_OPTIONS: SelectOption<MinMagnitude>[] = [
  { value: 0, label: 'Todas' },
  { value: 2, label: '2+' },
  { value: 4, label: '4+' },
];

// Barra de filtros. No guarda estado: muestra los valores que recibe por props
// y avisa cada cambio al componente padre con onChange.
export default function FilterBar({ filters, regionOptions, onChange, onReset }: FilterBarProps) {
  return (
    <Paper sx={{ p: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: { xs: 2, md: 3 } }}>
      <Box>
        <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
          Rango de tiempo
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          color="primary"
          value={filters.range}
          onChange={(_e: unknown, range: TimeRange | null) => range && onChange({ range })}
        >
          {RANGE_OPTIONS.map((o) => (
            <ToggleButton key={o.value} value={o.value}>
              {o.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
          Magnitud mínima
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          color="primary"
          value={filters.minMag}
          onChange={(_e: unknown, minMag: MinMagnitude | null) => minMag !== null && onChange({ minMag })}
        >
          {MAGNITUDE_OPTIONS.map((o) => (
            <ToggleButton key={o.value} value={o.value}>
              {o.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ minWidth: { xs: '100%', sm: 200 } }}>
        <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
          Región
        </Typography>
        <Select
          size="small"
          fullWidth
          value={filters.region}
          onChange={(e: SelectChangeEvent<string>) => onChange({ region: e.target.value })}
        >
          {regionOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ flexGrow: 1 }} />
      <Button variant="outlined" color="inherit" onClick={onReset}>
        Restablecer
      </Button>
    </Paper>
  );
}
