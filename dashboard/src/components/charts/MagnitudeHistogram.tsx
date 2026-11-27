import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import type { HistogramBin, MagnitudeLevel } from '../../types/earthquake';
import { MAGNITUDE_COLORS } from '../../utils/magnitude';

interface MagnitudeHistogramProps {
  bins: HistogramBin[];
  compact?: boolean;
}

const LEGEND: Array<{ level: MagnitudeLevel; text: string }> = [
  { level: 'low', text: '< 2' },
  { level: 'moderate', text: '2 – 3.9' },
  { level: 'high', text: '≥ 4' },
];

// Histograma de magnitudes con las barras coloreadas según el nivel.
export default function MagnitudeHistogram({ bins, compact = false }: MagnitudeHistogramProps) {
  const labels = bins.map((b) => b.label);
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <BarChart
          xAxis={[
            {
              scaleType: 'band',
              data: labels,
              label: compact ? undefined : 'Magnitud',
              colorMap: {
                type: 'ordinal',
                values: labels,
                colors: bins.map((b) => MAGNITUDE_COLORS[b.level]),
              },
            },
          ]}
          yAxis={[{ tickMinStep: 1 }]}
          series={[{ data: bins.map((b) => b.count), label: 'Sismos' }]}
          barLabel="value"
          borderRadius={4}
          grid={{ horizontal: true }}
          hideLegend
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 0.5 }}>
        {LEGEND.map((item) => (
          <Box key={item.level} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: MAGNITUDE_COLORS[item.level] }} />
            <Typography variant="caption" color="text.secondary">
              {item.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
