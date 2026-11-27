import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import ChartCard from '../components/ChartCard';
import DashboardHeader from '../components/DashboardHeader';
import EarthquakeTable from '../components/EarthquakeTable';
import FilterBar from '../components/FilterBar';
import KpiGrid from '../components/KpiGrid';
import { useEarthquakes } from '../hooks/useEarthquakes';
import type { FilterState } from '../types/earthquake';
import { applyFilters, buildKpis, buildRegionOptions } from '../utils/dashboard';

const DEFAULT_FILTERS: FilterState = { range: 'month', minMag: 0, region: 'all' };
const TABLE_ROWS = 8;

// Componente contenedor: obtiene los sismos desde Firebase, guarda el estado de
// los filtros, calcula los datos que se muestran y los entrega a los hijos por props.
export default function DashboardPage() {
  const { events, loading, error } = useEarthquakes();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Los datos son una copia del catálogo del 17 oct al 16 nov de 2026: el sismo
  // más reciente hace de "ahora" para calcular los rangos de tiempo.
  const now = events.length > 0 ? events[0].time : Date.now();
  const filteredEvents = applyFilters(events, filters, now);
  const kpis = buildKpis(filteredEvents, filters.range);
  const regionOptions = buildRegionOptions(events);

  let statusText = `Firebase: ${events.length} registros`;
  let statusColor: 'default' | 'success' | 'error' = 'success';
  if (loading) {
    statusText = 'Cargando…';
    statusColor = 'default';
  } else if (error) {
    statusText = 'Error de conexión';
    statusColor = 'error';
  }

  const handleFilterChange = (patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <DashboardHeader
        title="Monitor Sísmico Global"
        subtitle="Fuente: USGS Earthquake Hazards Program"
        statusText={statusText}
        statusColor={statusColor}
      />
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 3 } }}>
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 10 }}>
            <CircularProgress />
            <Typography color="text.secondary">Cargando sismos desde Firebase…</Typography>
          </Box>
        )}
        {!loading && error && (
          <Alert severity="error">No se pudieron obtener los datos de Firebase: {error}</Alert>
        )}
        {!loading && !error && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
            <FilterBar
              filters={filters}
              regionOptions={regionOptions}
              onChange={handleFilterChange}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />
            <KpiGrid kpis={kpis} />
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <ChartCard title="Sismos por hora" subtitle="Número de sismos por hora, hora local (Ecuador)" />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <ChartCard title="Distribución por magnitud" subtitle="Número de sismos por intervalo" />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <ChartCard title="Regiones con más sismos" subtitle="Top 8" />
              </Grid>
              <Grid size={{ xs: 12, lg: 8 }}>
                <EarthquakeTable
                  title="Últimos sismos"
                  events={filteredEvents.slice(0, TABLE_ROWS)}
                  totalCount={filteredEvents.length}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
