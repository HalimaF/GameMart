import { Pagination as MUIPagination, Box } from "@mui/material";

const Pagination = ({ count, page, onChange }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
      <MUIPagination count={count} page={page} onChange={onChange} color="primary" />
    </Box>
  );
};

export default Pagination;
