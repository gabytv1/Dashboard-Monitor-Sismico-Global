import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import type { ViewState } from '../../types/earthquake';
import StateMessage from '../common/StateMessage';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  state: ViewState;
  onRetry?: () => void;
  height?: number;
  children: ReactNode;
}

// Contenedor de cada gráfico (y de la tabla o lista de sismos): título,
// subtítulo y área de contenido. Según "state" muestra un esqueleto, un
// mensaje de error o vacío, o el contenido. Sin "height" el alto es automático.
export default function ChartCard({ title, subtitle, state, onRetry, height, children }: ChartCardProps) {
  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 }, height: '100%' }}>
      <Typography variant="h2" component="h2">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" component="p">
          {subtitle}
        </Typography>
      )}
      <Box sx={{ height: height ?? 'auto', minHeight: height ? undefined : 240, mt: 1.5 }}>
        {state === 'loading' && <Skeleton variant="rounded" height={height ?? 240} />}
        {state === 'error' && <StateMessage variant="error" actionLabel="Reintentar" onAction={onRetry} />}
        {state === 'empty' && <StateMessage variant="empty" />}
        {state === 'ready' && children}
      </Box>
    </Paper>
  );
}
