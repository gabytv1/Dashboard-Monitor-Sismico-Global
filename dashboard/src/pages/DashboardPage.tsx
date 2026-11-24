import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import ChartCard from '../components/ChartCard';
import DashboardHeader from '../components/DashboardHeader';
import EarthquakeTable from '../components/EarthquakeTable';
import FilterBar from '../components/FilterBar';
import KpiGrid from '../components/KpiGrid';
import { SAMPLE_EVENTS, SAMPLE_NOW } from '../data/sampleData';
import type { FilterState } from '../types/earthquake';
import { applyFilters, buildKpis, buildRegionOptions } from '../utils/dashboard';

const DEFAULT_FILTERS: FilterState = { range: 'month', minMag: 0, region: 'all' };
const TABLE_ROWS = 8;

// Componente contenedor: guarda el estado de los filtros, calcula los datos
// que se muestran y los entrega a los componentes hijos por props.
export default function DashboardPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filteredEvents = applyFilters(SAMPLE_EVENTS, filters, SAMPLE_NOW);
  const kpis = buildKpis(filteredEvents, filters.range);
  const regionOptions = buildRegionOptions(SAMPLE_EVENTS);

  const handleFilterChange = (patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <DashboardHeader
        title="Monitor Sísmico Global"
        subtitle="Fuente: USGS Earthquake Hazards Program"
        statusText="Datos de ejemplo"
      />
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 3 } }}>
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
      </Container>
    </Box>
  );
}
