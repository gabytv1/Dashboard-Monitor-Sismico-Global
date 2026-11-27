import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import type { SelectOption } from '../../types/earthquake';

interface SelectDropdownProps {
  label: string;
  options: SelectOption<string>[];
  value: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
}

// Menú desplegable de selección única (región).
export default function SelectDropdown({ label, options, value, onChange, fullWidth = false }: SelectDropdownProps) {
  const labelId = `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Typography id={labelId} variant="caption" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Select
        size="small"
        value={value}
        labelId={labelId}
        fullWidth={fullWidth}
        onChange={(event: SelectChangeEvent<string>) => onChange(event.target.value)}
        MenuProps={{ slotProps: { paper: { sx: { maxHeight: 320 } } } }}
        sx={{ minWidth: 180, fontWeight: 600, bgcolor: 'background.paper' }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
