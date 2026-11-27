import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import type { DataStatus } from '../../types/earthquake';

interface LiveStatusBadgeProps {
  status: DataStatus;
  lastUpdated: number | null;
  compact?: boolean;
}

const COLORS: Record<DataStatus, { bg: string; dot: string; text: string; border: string }> = {
  success: { bg: '#ecfdf3', dot: '#16a34a', text: '#166534', border: '#bbf7d0' },
  loading: { bg: '#eff6ff', dot: '#2563eb', text: '#1e40af', border: '#bfdbfe' },
  error: { bg: '#fef2f2', dot: '#dc2626', text: '#991b1b', border: '#fecaca' },
};

// Badge «En vivo · actualizado hace N s». Usa su propio estado (useState) con
// un temporizador de 1 s para volver a calcular los segundos transcurridos.
export default function LiveStatusBadge({ status, lastUpdated, compact = false }: LiveStatusBadgeProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  let text = 'En vivo';
  if (status === 'loading') text = 'Actualizando…';
  else if (status === 'error') text = 'Sin conexión';
  else if (!compact && lastUpdated !== null) {
    const seconds = Math.max(0, Math.floor((now - lastUpdated) / 1000));
    text = `En vivo · actualizado hace ${seconds} s`;
  }

  const c = COLORS[status];
  return (
    <Box
      component="span"
      aria-live="polite"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.6,
        borderRadius: 999,
        bgcolor: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c.dot }} />
      {text}
    </Box>
  );
}
