import { Box, Typography } from "@mui/material";

const LeaderboardRank = ({ rank, color = '#93c5fd' }) => {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: '50%', bgcolor: '#111827', border: `2px solid ${color}` }}>
      <Typography sx={{ color, fontWeight: 700 }}>#{rank}</Typography>
    </Box>
  );
};

export default LeaderboardRank;
