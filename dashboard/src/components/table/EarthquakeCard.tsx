import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import type { EarthquakeEvent } from '../../types/earthquake';
import { formatDateTime } from '../../utils/format';
import MagnitudeBadge from '../common/MagnitudeBadge';

interface EarthquakeCardProps {
  event: EarthquakeEvent;
  onSelect: (event: EarthquakeEvent) => void;
}

// Tarjeta que resume un sismo en móvil (reemplaza a la fila de la tabla).
export default function EarthquakeCard({ event, onSelect }: EarthquakeCardProps) {
  return (
    <ButtonBase
      onClick={() => onSelect(event)}
      sx={{
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <MagnitudeBadge value={event.mag} size="md" />
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
          {event.place}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDateTime(event.time)} · {event.depth.toFixed(1)} km
        </Typography>
      </Box>
    </ButtonBase>
  );
}
