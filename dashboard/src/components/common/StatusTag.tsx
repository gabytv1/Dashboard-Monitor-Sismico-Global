import Chip from '@mui/material/Chip';

interface StatusTagProps {
  status: 'automatic' | 'reviewed';
}

// Etiqueta del estado de revisión del evento.
export default function StatusTag({ status }: StatusTagProps) {
  const reviewed = status === 'reviewed';
  return (
    <Chip
      size="small"
      label={status}
      sx={{
        borderRadius: 1.5,
        fontWeight: 500,
        bgcolor: reviewed ? '#e8f5ee' : '#f1f3f6',
        color: reviewed ? '#166534' : '#4b5563',
      }}
    />
  );
}
