import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { EarthquakeEvent } from '../types/earthquake';
import { formatDateTime } from '../utils/dashboard';

interface EarthquakeTableProps {
  title: string;
  events: EarthquakeEvent[];
  totalCount: number;
}

// Columnas que se ocultan en pantallas pequeñas para que la tabla quepa sin cortarse:
// "Tipo mag." y "Estado" en móvil y tableta pequeña; "Prof. (km)" solo en móvil.
const DESKTOP_ONLY = { display: { xs: 'none', md: 'table-cell' } };
const HIDE_ON_MOBILE = { display: { xs: 'none', sm: 'table-cell' } };

// Contenedor de la tabla de últimos sismos.
export default function EarthquakeTable({ title, events, totalCount }: EarthquakeTableProps) {
  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 } }}>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 1.5 }}>
        Mostrando {events.length} de {totalCount}
      </Typography>
      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table size="small" sx={{ '& th, & td': { px: { xs: 1, md: 2 }, fontSize: { xs: 13, md: 14 } } }}>
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: '#f8fafc' } }}>
              <TableCell>Fecha y hora</TableCell>
              <TableCell>Lugar</TableCell>
              <TableCell align="right">Mag.</TableCell>
              <TableCell align="right" sx={HIDE_ON_MOBILE}>
                Prof. (km)
              </TableCell>
              <TableCell sx={DESKTOP_ONLY}>Tipo mag.</TableCell>
              <TableCell sx={DESKTOP_ONLY}>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((e) => (
              <TableRow key={e.id}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(e.time)}</TableCell>
                <TableCell>{e.place}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {e.mag.toFixed(1)}
                </TableCell>
                <TableCell align="right" sx={HIDE_ON_MOBILE}>
                  {e.depth.toFixed(1)}
                </TableCell>
                <TableCell sx={DESKTOP_ONLY}>{e.magType}</TableCell>
                <TableCell sx={DESKTOP_ONLY}>{e.status}</TableCell>
              </TableRow>
            ))}
            {events.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No hay sismos con los filtros elegidos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
