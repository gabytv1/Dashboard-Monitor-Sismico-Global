import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import DashboardPage from './pages/DashboardPage';
import { theme } from './theme/theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardPage />
    </ThemeProvider>
  );
}
