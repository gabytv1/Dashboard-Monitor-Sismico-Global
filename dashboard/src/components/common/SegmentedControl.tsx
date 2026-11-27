import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import type { SelectOption } from '../../types/earthquake';

interface SegmentedControlProps<T extends string | number> {
  label: string;
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
}

// Control de selección única (rango de tiempo y magnitud mínima). Es genérico
// respecto al tipo del valor: TimeRange (texto) o MinMagnitude (número).
export default function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  fullWidth = false,
}: SegmentedControlProps<T>) {
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <ToggleButtonGroup
        exclusive
        size="small"
        color="primary"
        value={value}
        fullWidth={fullWidth}
        aria-label={label}
        onChange={(_event: unknown, next: T | null) => {
          // MUI envía null al pulsar la opción ya elegida; se ignora para que siempre haya una.
          if (next !== null) onChange(next);
        }}
        sx={{
          '& .MuiToggleButton-root': { px: 1.5, py: 0.6, fontWeight: 600, border: '1px solid #e5e7eb' },
          '& .MuiToggleButton-root.Mui-selected': {
            bgcolor: 'primary.main',
            color: '#fff',
            '&:hover': { bgcolor: 'primary.dark' },
          },
        }}
      >
        {options.map((option) => (
          <ToggleButton key={String(option.value)} value={option.value}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
