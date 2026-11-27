import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import type { MagnitudeLevel } from '../../types/earthquake';
import { MAGNITUDE_COLORS } from '../../utils/magnitude';

interface KpiCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: ReactNode;
  badge?: { text: string; level: MagnitudeLevel };
  isLoading?: boolean;
}

// Tarjeta de un indicador. Solo presenta lo que recibe por props.
export default function KpiCard({ label, value, subtext, icon, badge, isLoading = false }: KpiCardProps) {
  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 }, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', mb: 1 }}>
        {icon}
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
      </Box>
      {isLoading ? (
        <>
          <Skeleton variant="text" width="50%" sx={{ fontSize: '2rem' }} />
          <Skeleton variant="text" width="80%" />
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography component="p" sx={{ fontSize: { xs: 24, md: 32 }, fontWeight: 700, lineHeight: 1.2 }}>
              {value}
            </Typography>
            {badge && (
              <Box
                component="span"
                sx={{
                  bgcolor: MAGNITUDE_COLORS[badge.level],
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 12,
                  px: 1,
                  py: 0.3,
                  borderRadius: 999,
                }}
              >
                {badge.text}
              </Box>
            )}
          </Box>
          <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.5 }}>
            {subtext}
          </Typography>
        </>
      )}
    </Paper>
  );
}
