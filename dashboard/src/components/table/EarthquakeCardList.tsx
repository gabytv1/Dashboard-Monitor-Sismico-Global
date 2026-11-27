import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { EarthquakeEvent } from '../../types/earthquake';
import Button from '../common/Button';
import EarthquakeCard from './EarthquakeCard';

interface EarthquakeCardListProps {
  events: EarthquakeEvent[];
  totalCount: number;
  hasMore: boolean;
  onLoadMore: () => void;
  onSelect: (event: EarthquakeEvent) => void;
}

// Lista de tarjetas de sismos en móvil con el botón «Cargar más».
export default function EarthquakeCardList({ events, totalCount, hasMore, onLoadMore, onSelect }: EarthquakeCardListProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      {events.map((event) => (
        <EarthquakeCard key={event.id} event={event} onSelect={onSelect} />
      ))}
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 0.5 }}>
        Mostrando {events.length} de {totalCount}
      </Typography>
      {hasMore && (
        <Button fullWidth onClick={onLoadMore} icon={<ExpandMoreIcon />}>
          Cargar más
        </Button>
      )}
    </Box>
  );
}
