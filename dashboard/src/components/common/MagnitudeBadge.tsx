import Box from '@mui/material/Box';
import { formatMag } from '../../utils/format';
import { getMagnitudeLevel, MAGNITUDE_COLORS, MAGNITUDE_TEXT } from '../../utils/magnitude';

interface MagnitudeBadgeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showLevelText?: boolean;
}

const SIZES = {
  sm: { fontSize: 12, px: 1, py: 0.25 },
  md: { fontSize: 14, px: 1.25, py: 0.4 },
  lg: { fontSize: 18, px: 1.5, py: 0.5 },
};

// Muestra la magnitud con el color de su nivel (misma escala en todo el dashboard).
export default function MagnitudeBadge({ value, size = 'sm', showLevelText = false }: MagnitudeBadgeProps) {
  const level = getMagnitudeLevel(value);
  const s = SIZES[size];
  return (
    <Box
      component="span"
      aria-label={`Magnitud ${formatMag(value)}, ${MAGNITUDE_TEXT[level]}`}
      sx={{
        display: 'inline-block',
        minWidth: 36,
        textAlign: 'center',
        borderRadius: 999,
        bgcolor: MAGNITUDE_COLORS[level],
        color: '#fff',
        fontWeight: 700,
        fontSize: s.fontSize,
        px: s.px,
        py: s.py,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      {formatMag(value)}
      {showLevelText ? ` · ${MAGNITUDE_TEXT[level]}` : ''}
    </Box>
  );
}
