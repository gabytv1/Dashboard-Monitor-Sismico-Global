import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type { FilterState, MinMagnitude, SelectOption, TimeRange } from '../../types/earthquake';
import Button from '../common/Button';
import SegmentedControl from '../common/SegmentedControl';
import SelectDropdown from '../common/SelectDropdown';
import { MAGNITUDE_OPTIONS, RANGE_OPTIONS } from './filterOptions';

interface FilterBarProps {
  filters: FilterState;
  regionOptions: SelectOption<string>[];
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

// Barra de filtros de escritorio y tableta. No guarda estado: muestra los
// valores que recibe por props y avisa los cambios al padre con onChange.
export default function FilterBar({ filters, regionOptions, onChange, onReset }: FilterBarProps) {
  return (
    <Paper
      sx={{
        position: 'sticky',
        top: 80,
        zIndex: 2,
        p: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: 3,
      }}
    >
      <SegmentedControl<TimeRange>
        label="Rango de tiempo"
        options={RANGE_OPTIONS}
        value={filters.range}
        onChange={(range) => onChange({ range })}
      />
      <SegmentedControl<MinMagnitude>
        label="Magnitud mínima"
        options={MAGNITUDE_OPTIONS}
        value={filters.minMag}
        onChange={(minMag) => onChange({ minMag })}
      />
      <SelectDropdown
        label="Región"
        options={regionOptions}
        value={filters.region}
        onChange={(region) => onChange({ region })}
      />
      <Box sx={{ flexGrow: 1 }} />
      <Button onClick={onReset} icon={<RestartAltIcon />}>
        Restablecer
      </Button>
    </Paper>
  );
}
