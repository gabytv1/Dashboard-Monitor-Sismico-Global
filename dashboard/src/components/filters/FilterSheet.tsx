import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import type { FilterState, MinMagnitude, SelectOption } from '../../types/earthquake';
import Button from '../common/Button';
import SegmentedControl from '../common/SegmentedControl';
import SelectDropdown from '../common/SelectDropdown';
import { MAGNITUDE_OPTIONS } from './filterOptions';

interface FilterSheetProps {
  isOpen: boolean;
  filters: FilterState;
  regionOptions: SelectOption<string>[];
  onApply: (next: FilterState) => void;
  onReset: () => void;
  onClose: () => void;
}

// Hoja inferior de filtros (móvil). Edita una copia temporal (draft) con
// useState; los cambios solo llegan al dashboard al pulsar «Aplicar».
export default function FilterSheet({ isOpen, filters, regionOptions, onApply, onReset, onClose }: FilterSheetProps) {
  const [draft, setDraft] = useState<FilterState>(filters);

  // Cada vez que se abre, la copia parte de los filtros vigentes.
  useEffect(() => {
    if (isOpen) setDraft(filters);
  }, [isOpen, filters]);

  return (
    <Drawer
      anchor="bottom"
      open={isOpen}
      onClose={onClose}
      slotProps={{ paper: { sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, p: 2.5, pb: 3 } } }}
    >
      <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider', mx: 'auto', mb: 2 }} />
      <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
        Filtros
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <SegmentedControl<MinMagnitude>
          label="Magnitud mínima"
          options={MAGNITUDE_OPTIONS}
          value={draft.minMag}
          onChange={(minMag) => setDraft({ ...draft, minMag })}
          fullWidth
        />
        <SelectDropdown
          label="Región"
          options={regionOptions}
          value={draft.region}
          onChange={(region) => setDraft({ ...draft, region })}
          fullWidth
        />
        <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
          <Button
            fullWidth
            onClick={() => {
              onReset();
              onClose();
            }}
          >
            Restablecer
          </Button>
          <Button
            fullWidth
            variant="primary"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Aplicar
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
