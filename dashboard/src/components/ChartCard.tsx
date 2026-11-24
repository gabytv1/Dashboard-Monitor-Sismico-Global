import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  height?: number;
  children?: ReactNode;
}

// Contenedor de un gráfico: título, subtítulo y área reservada. Si no recibe
// children muestra un marcador; el gráfico se incorporará en el siguiente sprint.
export default function ChartCard({ title, subtitle, height = 280, children }: ChartCardProps) {
  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 }, height: '100%' }}>
      <Typography variant="h2">{title}</Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" component="p">
          {subtitle}
        </Typography>
      )}
      <Box
        sx={{
          height: { xs: Math.round(height * 0.75), md: height },
          mt: 1.5,
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'divider',
          bgcolor: '#f8fafc',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {children ?? (
          <Typography variant="body2" color="text.secondary">
            Área del gráfico
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
