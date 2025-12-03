import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = ({ size = 40 }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress size={size} />
    </Box>
  );
};

export default LoadingSpinner;
