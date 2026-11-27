import { BarChart } from '@mui/x-charts/BarChart';
import type { RegionCount } from '../../types/earthquake';

interface RegionBarChartProps {
  data: RegionCount[];
  selectedRegion: string;
  maxItems?: number;
}

const BAR_COLOR = '#93c5fd';
const SELECTED_COLOR = '#2563eb';
const MUTED_COLOR = '#dbe3ee';

// Barras horizontales con las regiones con más sismos; resalta la región elegida.
export default function RegionBarChart({ data, selectedRegion, maxItems = 8 }: RegionBarChartProps) {
  const top = data.slice(0, maxItems);
  // Si la región elegida no está en el top, reemplaza a la última barra para poder resaltarla.
  const selected = data.find((r) => r.region === selectedRegion);
  if (selected && !top.includes(selected) && top.length > 0) top[top.length - 1] = selected;
  const regions = top.map((r) => r.region);
  const colors = regions.map((region) => {
    if (selectedRegion === 'all') return BAR_COLOR;
    return region === selectedRegion ? SELECTED_COLOR : MUTED_COLOR;
  });

  return (
    <BarChart
      layout="horizontal"
      yAxis={[
        {
          scaleType: 'band',
          data: regions,
          width: 120,
          colorMap: { type: 'ordinal', values: regions, colors },
        },
      ]}
      xAxis={[{ label: 'Número de sismos', tickMinStep: 1 }]}
      series={[{ data: top.map((r) => r.count), label: 'Sismos' }]}
      barLabel="value"
      borderRadius={4}
      grid={{ vertical: true }}
      hideLegend
    />
  );
}
