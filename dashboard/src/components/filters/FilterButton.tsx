import TuneIcon from '@mui/icons-material/Tune';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

interface FilterButtonProps {
  activeCount: number;
  onClick: () => void;
}

// Botón que abre la hoja de filtros en móvil; el contador indica los filtros activos.
export default function FilterButton({ activeCount, onClick }: FilterButtonProps) {
  return (
    <IconButton
      onClick={onClick}
      aria-label={`Abrir filtros (${activeCount} activos)`}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, width: 48, height: 48 }}
    >
      <Badge badgeContent={activeCount} color="primary" showZero>
        <TuneIcon />
      </Badge>
    </IconButton>
  );
}
