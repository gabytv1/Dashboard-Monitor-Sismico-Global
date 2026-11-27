import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import type { DataStatus } from '../../types/earthquake';
import LiveStatusBadge from './LiveStatusBadge';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  status: DataStatus;
  lastUpdated: number | null;
  compact?: boolean;
}

// Encabezado con logo, título, fuente de datos y estado de actualización.
export default function DashboardHeader({ title, subtitle, status, lastUpdated, compact = false }: DashboardHeaderProps) {
  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ gap: 2, minHeight: { xs: 64, md: 72 } }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: 'primary.light',
            color: 'primary.main',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <MonitorHeartOutlinedIcon />
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h1" component="h1" noWrap sx={{ fontSize: compact ? '1.15rem' : '1.5rem' }}>
            {title}
          </Typography>
          {!compact && (
            <Typography variant="caption" color="text.secondary" noWrap component="p">
              {subtitle}
            </Typography>
          )}
        </Box>
        <LiveStatusBadge status={status} lastUpdated={lastUpdated} compact={compact} />
      </Toolbar>
    </AppBar>
  );
}
