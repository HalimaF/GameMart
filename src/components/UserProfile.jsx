import { Box, Typography, Avatar } from "@mui/material";

const UserProfile = ({ user }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Avatar sx={{ width: 56, height: 56, bgcolor: '#3b82f6' }}>
        {user?.username?.[0]?.toUpperCase()}
      </Avatar>
      <Box>
        <Typography sx={{ color: '#e5e7eb', fontWeight: 600 }}>{user?.username}</Typography>
        <Typography sx={{ color: '#9ca3af' }}>{user?.email}</Typography>
        <Typography sx={{ color: '#86efac' }}>Tier: {user?.tier}</Typography>
      </Box>
    </Box>
  );
};

export default UserProfile;
