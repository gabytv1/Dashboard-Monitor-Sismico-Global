import { createTheme } from '@mui/material/styles';

// Puntos de quiebre de la fase de diseño: móvil < 768, tableta 768–1023, escritorio >= 1024.
export const theme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 480, md: 768, lg: 1024, xl: 1440 },
  },
  palette: {
    primary: { main: '#2563eb', light: '#eaf1fe' },
    error: { main: '#dc2626' },
    warning: { main: '#f59e0b' },
    success: { main: '#16a34a' },
    background: { default: '#f5f7fb', paper: '#ffffff' },
    text: { primary: '#111827', secondary: '#6b7280' },
    divider: '#e5e7eb',
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif',
    h1: { fontSize: '1.5rem', fontWeight: 700 },
    h2: { fontSize: '1.05rem', fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(17, 24, 39, 0.06)' },
      },
    },
    MuiAppBar: {
      styleOverrides: { root: { border: 'none', borderBottom: '1px solid #e5e7eb' } },
    },
    MuiDrawer: {
      styleOverrides: { paper: { border: 'none' } },
    },
  },
});
