import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  statusText: string;
  statusColor?: 'default' | 'success' | 'error';
}

// Encabezado con logo, título, fuente de datos y estado.
export default function DashboardHeader({ title, subtitle, statusText, statusColor = 'success' }: DashboardHeaderProps) {
  return (
    <AppBar position="static" color="inherit" elevation={0}>
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
          <Typography variant="h1" sx={{ fontSize: { xs: '1.05rem', md: '1.5rem' }, lineHeight: 1.2 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap component="p" sx={{ display: { xs: 'none', md: 'block' } }}>
            {subtitle}
          </Typography>
        </Box>
        <Chip label={statusText} color={statusColor} variant="outlined" size="small" />
      </Toolbar>
    </AppBar>
  );
}
