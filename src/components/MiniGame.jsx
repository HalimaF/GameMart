import { Box, Paper } from "@mui/material";

const MiniGame = ({ children }) => {
  return (
    <Paper sx={{ p: 2, background: '#0b1220', border: '1px solid #30363d' }}>
      <Box>{children}</Box>
    </Paper>
  );
};

export default MiniGame;
