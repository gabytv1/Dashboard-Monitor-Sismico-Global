import MuiButton from '@mui/material/Button';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
}

// Botón base reutilizable: «Restablecer», «Aplicar», «Cargar más», «Ver en USGS», «Reintentar».
export default function Button({
  children,
  onClick,
  variant = 'secondary',
  icon,
  fullWidth = false,
  disabled = false,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <MuiButton
      onClick={onClick}
      variant={isPrimary ? 'contained' : 'outlined'}
      color={isPrimary ? 'primary' : 'inherit'}
      startIcon={icon}
      fullWidth={fullWidth}
      disabled={disabled}
      disableElevation
      sx={isPrimary ? undefined : { borderColor: 'divider', bgcolor: 'background.paper' }}
    >
      {children}
    </MuiButton>
  );
}
