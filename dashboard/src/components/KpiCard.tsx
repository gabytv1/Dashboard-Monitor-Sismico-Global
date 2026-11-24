import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: ReactNode;
}

// Tarjeta de un indicador. Solo presenta lo que recibe por props.
export default function KpiCard({ label, value, subtext, icon }: KpiCardProps) {
  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 }, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', mb: 1 }}>
        {icon}
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
      </Box>
      <Typography component="p" sx={{ fontSize: { xs: 24, md: 32 }, fontWeight: 700, lineHeight: 1.2 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.5 }}>
        {subtext}
      </Typography>
    </Paper>
  );
}
