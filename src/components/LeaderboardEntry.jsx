import { Box, Typography, Avatar } from "@mui/material";

const LeaderboardEntry = ({ rank, user }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid #30363d' }}>
      <Typography sx={{ color: '#93c5fd', fontWeight: 700, minWidth: 32 }}>#{rank}</Typography>
      <Avatar sx={{ bgcolor: '#1e3a8a' }}>{user.username?.[0]?.toUpperCase()}</Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ color: '#e5e7eb' }}>{user.username}</Typography>
        <Typography sx={{ color: '#9ca3af' }}>{user.xp} XP</Typography>
      </Box>
    </Box>
  );
};

export default LeaderboardEntry;
