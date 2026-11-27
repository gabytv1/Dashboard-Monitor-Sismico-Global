import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { EarthquakeEvent, SortKey } from '../../types/earthquake';
import { EMPTY_VALUE, formatDateTime } from '../../utils/format';
import MagnitudeBadge from '../common/MagnitudeBadge';
import StatusTag from '../common/StatusTag';

interface EarthquakeRowProps {
  event: EarthquakeEvent;
  isSelected: boolean;
  hiddenColumns?: SortKey[];
  onSelect: (event: EarthquakeEvent) => void;
}

// Una fila de la tabla: da formato a los campos del sismo y resalta la fila elegida.
export default function EarthquakeRow({ event, isSelected, hiddenColumns = [], onSelect }: EarthquakeRowProps) {
  const show = (key: SortKey) => !hiddenColumns.includes(key);
  return (
    <TableRow
      hover
      selected={isSelected}
      onClick={() => onSelect(event)}
      onKeyDown={(e: { key: string }) => {
        if (e.key === 'Enter') onSelect(event);
      }}
      tabIndex={0}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(event.time)}</TableCell>
      <TableCell sx={{ fontWeight: 600 }}>{event.place}</TableCell>
      <TableCell align="center">
        <MagnitudeBadge value={event.mag} />
      </TableCell>
      <TableCell align="right">{event.depth.toFixed(1)}</TableCell>
      {show('magType') && <TableCell>{event.magType || EMPTY_VALUE}</TableCell>}
      {show('status') && (
        <TableCell>
          <StatusTag status={event.status} />
        </TableCell>
      )}
      {show('tsunami') && (
        <TableCell align="center">{event.tsunami === undefined ? EMPTY_VALUE : event.tsunami === 1 ? 'Sí' : 'No'}</TableCell>
      )}
    </TableRow>
  );
}
