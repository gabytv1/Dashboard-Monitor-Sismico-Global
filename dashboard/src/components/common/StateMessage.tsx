import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from './Button';

interface StateMessageProps {
  variant: 'loading' | 'empty' | 'error';
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const DEFAULT_MESSAGES = {
  loading: 'Cargando sismos…',
  empty: 'No hay sismos con los filtros elegidos.',
  error: 'No se pudieron obtener los datos.',
};

// Informa el estado de la descarga (carga, vacío o error) y ofrece una acción.
export default function StateMessage({ variant, message, actionLabel, onAction }: StateMessageProps) {
  return (
    <Box
      role={variant === 'error' ? 'alert' : 'status'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        py: 4,
        textAlign: 'center',
        height: '100%',
      }}
    >
      {variant === 'loading' && <CircularProgress size={28} />}
      {variant === 'empty' && <SearchOffIcon color="disabled" fontSize="large" />}
      {variant === 'error' && <ErrorOutlineIcon color="error" fontSize="large" />}
      <Typography variant="body2" color="text.secondary">
        {message ?? DEFAULT_MESSAGES[variant]}
      </Typography>
      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </Box>
  );
}
