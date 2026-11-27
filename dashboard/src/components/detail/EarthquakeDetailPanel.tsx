import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import type { EarthquakeEvent } from '../../types/earthquake';
import { EMPTY_VALUE, formatDepth, formatLocalFull, formatUtcFull } from '../../utils/format';
import Button from '../common/Button';
import DetailRow from '../common/DetailRow';
import MagnitudeBadge from '../common/MagnitudeBadge';
import StatusTag from '../common/StatusTag';

interface EarthquakeDetailPanelProps {
  event: EarthquakeEvent | null;
  fullScreen: boolean;
  onClose: () => void;
}

function DetailContent({ event }: { event: EarthquakeEvent }) {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <MagnitudeBadge value={event.mag} size="lg" showLevelText />
      </Box>
      <Typography variant="h2" component="p" sx={{ mb: 0.5 }}>
        {event.place}
      </Typography>
      <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 2 }}>
        Región: {event.region}
      </Typography>
      <DetailRow label="Hora local (Ecuador)" value={formatLocalFull(event.time)} />
      <DetailRow label="Hora UTC" value={formatUtcFull(event.time)} />
      <DetailRow label="Profundidad" value={formatDepth(event.depth)} />
      <DetailRow label="Tipo de magnitud" value={event.magType || EMPTY_VALUE} />
      <DetailRow label="Tipo de evento" value={event.type} />
      <DetailRow label="Estado" value={<StatusTag status={event.status} />} />
      <DetailRow label="Red sísmica" value={event.net.toUpperCase() || EMPTY_VALUE} />
      <DetailRow label="Significancia (sig)" value={event.sig ?? EMPTY_VALUE} />
      <DetailRow label="Estaciones (nst)" value={event.nst ?? EMPTY_VALUE} />
      <DetailRow label="Tsunami" value={event.tsunami === undefined ? EMPTY_VALUE : event.tsunami === 1 ? 'Sí' : 'No'} />
      <DetailRow label="Coordenadas" value={`${event.latitude.toFixed(3)}, ${event.longitude.toFixed(3)}`} />
      <Box sx={{ mt: 3 }}>
        <Button
          fullWidth
          variant="primary"
          icon={<OpenInNewIcon />}
          onClick={() => window.open(event.url, '_blank', 'noopener,noreferrer')}
        >
          Ver en USGS
        </Button>
      </Box>
    </>
  );
}

// Detalle del sismo elegido: panel lateral de 400 px en escritorio y pantalla
// completa en móvil. Si event es null, el panel está cerrado.
export default function EarthquakeDetailPanel({ event, fullScreen, onClose }: EarthquakeDetailPanelProps) {
  const isOpen = event !== null;

  if (fullScreen) {
    return (
      <Dialog fullScreen open={isOpen} onClose={onClose}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <IconButton onClick={onClose} aria-label="Volver">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h2" component="h2">
            Detalle del sismo
          </Typography>
        </Box>
        <Box sx={{ p: 2.5 }}>{event && <DetailContent event={event} />}</Box>
      </Dialog>
    );
  }

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 400, maxWidth: '100vw', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h2" component="h2">
            Detalle del sismo
          </Typography>
          <IconButton onClick={onClose} aria-label="Cerrar">
            <CloseIcon />
          </IconButton>
        </Box>
        {event && <DetailContent event={event} />}
      </Box>
    </Drawer>
  );
}
