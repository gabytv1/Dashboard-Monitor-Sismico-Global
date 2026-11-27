import MuiPagination from '@mui/material/Pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Paginación «‹ 1 2 3 … ›» de la tabla de escritorio.
export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <MuiPagination
      page={currentPage}
      count={totalPages}
      color="primary"
      shape="rounded"
      size="small"
      siblingCount={1}
      onChange={(_event: unknown, page: number) => onPageChange(page)}
    />
  );
}
