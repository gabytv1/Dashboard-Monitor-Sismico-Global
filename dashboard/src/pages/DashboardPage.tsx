import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo, useState } from 'react';
import ChartCard from '../components/charts/ChartCard';
import MagnitudeHistogram from '../components/charts/MagnitudeHistogram';
import RegionBarChart from '../components/charts/RegionBarChart';
import TimeSeriesChart from '../components/charts/TimeSeriesChart';
import EarthquakeDetailPanel from '../components/detail/EarthquakeDetailPanel';
import FilterBar from '../components/filters/FilterBar';
import MobileFilterBar from '../components/filters/MobileFilterBar';
import DashboardFooter from '../components/header/DashboardFooter';
import DashboardHeader from '../components/header/DashboardHeader';
import KpiGrid from '../components/kpi/KpiGrid';
import EarthquakeCardList from '../components/table/EarthquakeCardList';
import EarthquakeTable from '../components/table/EarthquakeTable';
import { useEarthquakes } from '../hooks/useEarthquakes';
import type {
  EarthquakeEvent,
  FilterState,
  SortKey,
  SortState,
  TimeRange,
  ViewState,
} from '../types/earthquake';
import { applyClientFilters, DEFAULT_FILTERS, DEFAULT_SORT, filterByRange, sortEvents } from '../utils/filters';
import {
  buildHistogram,
  buildKpis,
  buildRegionCounts,
  buildRegionOptions,
  buildTimeSeries,
  getGranularity,
} from '../utils/stats';

const PAGE_SIZE = 8; // filas por página en la tabla de escritorio
const CARDS_STEP = 10; // tarjetas que agrega «Cargar más» en móvil

const SERIES_SUBTITLE: Record<TimeRange, string> = {
  hour: 'Sismos cada 5 minutos · Última hora · hora local (Ecuador)',
  day: 'Número de sismos por hora · Últimas 24 horas · hora local (Ecuador)',
  week: 'Número de sismos por día · Últimos 7 días',
  month: 'Número de sismos por día · Últimos 30 días',
};

// Componente contenedor: obtiene los sismos desde Firebase, guarda el estado de
// la interfaz, calcula los datos derivados y los entrega por props. Los hijos
// avisan las acciones con callbacks.
export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // < 768 px
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 768 a 1023 px

  // Estado de la interfaz (useState)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(CARDS_STEP);
  const [selectedEvent, setSelectedEvent] = useState<EarthquakeEvent | null>(null);

  // Sismos recuperados desde Firebase (useEffect + useState dentro del hook)
  const { events: allEvents, status, lastUpdated, now, retry } = useEarthquakes();
  const events = useMemo(() => filterByRange(allEvents, filters.range, now), [allEvents, filters.range, now]);

  // Datos derivados (se recalculan solo cuando cambian sus dependencias)
  const regionOptions = useMemo(() => buildRegionOptions(events), [events]);
  const filteredEvents = useMemo(() => applyClientFilters(events, filters), [events, filters]);
  const sortedEvents = useMemo(() => sortEvents(filteredEvents, sort), [filteredEvents, sort]);
  const kpis = useMemo(() => buildKpis(filteredEvents, filters.range, now), [filteredEvents, filters.range, now]);
  const series = useMemo(() => buildTimeSeries(filteredEvents, filters.range, now), [filteredEvents, filters.range, now]);
  const histogram = useMemo(() => buildHistogram(filteredEvents), [filteredEvents]);
  // El gráfico de regiones ignora el filtro de región para poder resaltar la elegida.
  const regionCounts = useMemo(
    () => buildRegionCounts(applyClientFilters(events, { ...filters, region: 'all' })),
    [events, filters],
  );

  let viewState: ViewState = 'ready';
  if (status === 'loading') viewState = 'loading';
  else if (status === 'error') viewState = 'error';
  else if (filteredEvents.length === 0) viewState = 'empty';
  const regionState: ViewState =
    viewState === 'loading' || viewState === 'error' ? viewState : regionCounts.length === 0 ? 'empty' : 'ready';

  const totalPages = Math.max(1, Math.ceil(sortedEvents.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageEvents = sortedEvents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const cardEvents = sortedEvents.slice(0, visibleCount);

  // Acciones que llegan desde los componentes hijos
  const handleFilterChange = (patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
    setVisibleCount(CARDS_STEP);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSort(DEFAULT_SORT);
    setPage(1);
    setVisibleCount(CARDS_STEP);
  };

  const handleSortChange = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: key === 'place' || key === 'magType' || key === 'status' ? 'asc' : 'desc' },
    );
    setPage(1);
  };

  const chartHeight = isMobile ? 240 : 320;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <DashboardHeader
        title={isMobile ? 'Monitor Sísmico' : 'Monitor Sísmico Global'}
        subtitle="Fuente: USGS Earthquake Hazards Program"
        status={status}
        lastUpdated={lastUpdated}
        compact={isMobile}
      />

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
          {isMobile ? (
            <MobileFilterBar
              filters={filters}
              regionOptions={regionOptions}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
          ) : (
            <FilterBar
              filters={filters}
              regionOptions={regionOptions}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
          )}

          <KpiGrid kpis={kpis} isLoading={status === 'loading'} />

          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <ChartCard
                title={getGranularity(filters.range) === 'hour' ? 'Sismos por hora' : 'Sismos por día'}
                subtitle={SERIES_SUBTITLE[filters.range]}
                state={viewState}
                onRetry={retry}
                height={chartHeight}
              >
                <TimeSeriesChart data={series} granularity={getGranularity(filters.range)} compact={isMobile} />
              </ChartCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <ChartCard
                title="Distribución por magnitud"
                subtitle="Número de sismos por intervalo"
                state={viewState}
                onRetry={retry}
                height={chartHeight}
              >
                <MagnitudeHistogram bins={histogram} compact={isMobile} />
              </ChartCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <ChartCard
                title="Regiones con más sismos"
                subtitle={isMobile ? 'Top 5' : 'Top 8'}
                state={regionState}
                onRetry={retry}
                height={isMobile ? 260 : 360}
              >
                <RegionBarChart data={regionCounts} selectedRegion={filters.region} maxItems={isMobile ? 5 : 8} />
              </ChartCard>
            </Grid>
            <Grid size={{ xs: 12, lg: 8 }}>
              <ChartCard
                title="Últimos sismos"
                subtitle={`Mostrando ${isMobile ? cardEvents.length : pageEvents.length} de ${sortedEvents.length}`}
                state={viewState}
                onRetry={retry}
              >
                {isMobile ? (
                  <EarthquakeCardList
                    events={cardEvents}
                    totalCount={sortedEvents.length}
                    hasMore={visibleCount < sortedEvents.length}
                    onLoadMore={() => setVisibleCount((count) => count + CARDS_STEP)}
                    onSelect={setSelectedEvent}
                  />
                ) : (
                  <EarthquakeTable
                    events={pageEvents}
                    sort={sort}
                    onSortChange={handleSortChange}
                    page={currentPage}
                    totalPages={totalPages}
                    totalCount={sortedEvents.length}
                    onPageChange={setPage}
                    selectedId={selectedEvent?.id ?? null}
                    onRowSelect={setSelectedEvent}
                    hiddenColumns={isTablet ? ['magType', 'status'] : []}
                  />
                )}
              </ChartCard>
            </Grid>
          </Grid>
        </Box>

        <DashboardFooter text="Datos: USGS Earthquake Hazards Program, catálogo del 17 oct al 16 nov de 2026 · Almacenados en Firebase Realtime Database" />
      </Container>

      <EarthquakeDetailPanel event={selectedEvent} fullScreen={isMobile} onClose={() => setSelectedEvent(null)} />
    </Box>
  );
}
