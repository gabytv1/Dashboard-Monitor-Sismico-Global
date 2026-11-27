import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SensorsIcon from '@mui/icons-material/Sensors';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SpeedIcon from '@mui/icons-material/Speed';
import Grid from '@mui/material/Grid';
import type { ReactNode } from 'react';
import type { KpiData } from '../../types/earthquake';
import KpiCard from './KpiCard';

interface KpiGridProps {
  kpis: KpiData[];
  isLoading?: boolean;
}

const ICONS: Record<KpiData['id'], ReactNode> = {
  total: <SensorsIcon fontSize="small" />,
  maxMag: <SpeedIcon fontSize="small" />,
  avgMag: <ShowChartIcon fontSize="small" />,
  avgDepth: <ArrowDownwardIcon fontSize="small" />,
};

// Distribuye las tarjetas KPI: 4 en fila en escritorio y 2x2 en tableta y móvil.
export default function KpiGrid({ kpis, isLoading = false }: KpiGridProps) {
  return (
    <Grid container spacing={2}>
      {kpis.map((kpi) => (
        <Grid key={kpi.id} size={{ xs: 6, lg: 3 }}>
          <KpiCard
            label={kpi.label}
            value={kpi.value}
            subtext={kpi.subtext}
            icon={ICONS[kpi.id]}
            badge={kpi.badge}
            isLoading={isLoading}
          />
        </Grid>
      ))}
    </Grid>
  );
}
