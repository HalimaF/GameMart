import { Box, Typography } from "@mui/material";

const MiniGameScore = ({ score, highScore }) => {
  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      <Box>
        <Typography variant="caption" sx={{ color: '#9ca3af' }}>Score</Typography>
        <Typography variant="h6" sx={{ color: '#93c5fd' }}>{score}</Typography>
      </Box>
      {highScore !== undefined && (
        <Box>
          <Typography variant="caption" sx={{ color: '#9ca3af' }}>High Score</Typography>
          <Typography variant="h6" sx={{ color: '#fde68a' }}>{highScore}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default MiniGameScore;
