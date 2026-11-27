import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import type { EarthquakeEvent, SortKey, SortState } from '../../types/earthquake';
import Pagination from '../common/Pagination';
import EarthquakeRow from './EarthquakeRow';

interface EarthquakeTableProps {
  events: EarthquakeEvent[];
  sort: SortState;
  onSortChange: (key: SortKey) => void;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  selectedId: string | null;
  onRowSelect: (event: EarthquakeEvent) => void;
  hiddenColumns?: SortKey[];
}

const COLUMNS: Array<{ key: SortKey; label: string; align?: 'left' | 'center' | 'right' }> = [
  { key: 'time', label: 'Fecha y hora' },
  { key: 'place', label: 'Lugar' },
  { key: 'mag', label: 'Mag.', align: 'center' },
  { key: 'depth', label: 'Prof. (km)', align: 'right' },
  { key: 'magType', label: 'Tipo mag.' },
  { key: 'status', label: 'Estado' },
  { key: 'tsunami', label: 'Tsunami', align: 'center' },
];

// Tabla de sismos (escritorio y tableta) con cabeceras ordenables y paginación.
// El orden, la página y la fila elegida vienen del padre y se notifican con callbacks.
export default function EarthquakeTable({
  events,
  sort,
  onSortChange,
  page,
  totalPages,
  totalCount,
  onPageChange,
  selectedId,
  onRowSelect,
  hiddenColumns = [],
}: EarthquakeTableProps) {
  const columns = COLUMNS.filter((c) => !hiddenColumns.includes(c.key));
  return (
    <Box>
      <TableContainer sx={{ maxHeight: 440, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table stickyHeader size="small" aria-label={`Últimos sismos, ${totalCount} en total`}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  sortDirection={sort.key === column.key ? sort.direction : false}
                  sx={{ fontWeight: 700, bgcolor: '#f8fafc', whiteSpace: 'nowrap' }}
                >
                  <TableSortLabel
                    active={sort.key === column.key}
                    direction={sort.key === column.key ? sort.direction : 'asc'}
                    onClick={() => onSortChange(column.key)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <EarthquakeRow
                key={event.id}
                event={event}
                isSelected={event.id === selectedId}
                hiddenColumns={hiddenColumns}
                onSelect={onRowSelect}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>
    </Box>
  );
}
