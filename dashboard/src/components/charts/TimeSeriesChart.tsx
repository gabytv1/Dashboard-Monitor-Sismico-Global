import { LineChart } from '@mui/x-charts/LineChart';
import type { TimePoint } from '../../types/earthquake';

interface TimeSeriesChartProps {
  data: TimePoint[];
  granularity: 'hour' | 'day';
  compact?: boolean;
}

// Serie temporal (línea con área) de la cantidad de sismos por intervalo.
export default function TimeSeriesChart({ data, granularity, compact = false }: TimeSeriesChartProps) {
  const maxLabels = compact ? 4 : 8;
  const step = Math.max(1, Math.ceil(data.length / maxLabels));

  return (
    <LineChart
      xAxis={[
        {
          scaleType: 'point',
          data: data.map((p) => p.label),
          label: granularity === 'hour' ? 'Hora local' : 'Fecha',
          tickInterval: (_value: string, index: number) => index % step === 0,
        },
      ]}
      yAxis={[{ min: 0, tickMinStep: 1 }]}
      series={[
        {
          data: data.map((p) => p.count),
          label: 'Sismos',
          area: true,
          showMark: false,
          curve: 'monotoneX',
          color: '#2563eb',
          valueFormatter: (value: number | null) => `${value ?? 0} sismos`,
        },
      ]}
      grid={{ horizontal: true }}
      hideLegend
      sx={{ '& .MuiAreaElement-root': { fillOpacity: 0.15 } }}
    />
  );
}
