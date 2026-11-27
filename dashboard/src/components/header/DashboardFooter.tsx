import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface DashboardFooterProps {
  text: string;
}

// Pie de página con la fuente de los datos.
export default function DashboardFooter({ text }: DashboardFooterProps) {
  return (
    <Box component="footer" sx={{ py: 3 }}>
      <Typography variant="caption" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
}
