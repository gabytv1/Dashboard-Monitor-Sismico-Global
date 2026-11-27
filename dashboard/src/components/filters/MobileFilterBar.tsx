import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import type { FilterState, SelectOption, TimeRange } from '../../types/earthquake';
import { countActiveFilters } from '../../utils/filters';
import SegmentedControl from '../common/SegmentedControl';
import FilterButton from './FilterButton';
import FilterSheet from './FilterSheet';
import { RANGE_OPTIONS_SHORT } from './filterOptions';

interface MobileFilterBarProps {
  filters: FilterState;
  regionOptions: SelectOption<string>[];
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

// Filtros en móvil: el rango queda visible y el resto se abre en FilterSheet.
// El estado isSheetOpen (useState) controla si la hoja está abierta.
export default function MobileFilterBar({ filters, regionOptions, onChange, onReset }: MobileFilterBarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
        <Box sx={{ flexGrow: 1 }}>
          <SegmentedControl<TimeRange>
            label="Rango de tiempo"
            options={RANGE_OPTIONS_SHORT}
            value={filters.range}
            onChange={(range) => onChange({ range })}
            fullWidth
          />
        </Box>
        <FilterButton activeCount={countActiveFilters(filters)} onClick={() => setIsSheetOpen(true)} />
      </Box>
      <FilterSheet
        isOpen={isSheetOpen}
        filters={filters}
        regionOptions={regionOptions}
        onApply={(next) => onChange({ minMag: next.minMag, region: next.region })}
        onReset={onReset}
        onClose={() => setIsSheetOpen(false)}
      />
    </Paper>
  );
}
