import { Box, Typography, Avatar } from "@mui/material";

const ChatMessage = ({ message, isOwn = false }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexDirection: isOwn ? 'row-reverse' : 'row' }}>
      <Avatar sx={{ width: 32, height: 32, bgcolor: isOwn ? '#3b82f6' : '#64748b' }}>
        {message.user?.[0]?.toUpperCase()}
      </Avatar>
      <Box sx={{ maxWidth: '70%' }}>
        <Typography variant="caption" sx={{ color: '#9ca3af' }}>{message.user}</Typography>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isOwn ? '#1e3a8a' : '#1f2937' }}>
          <Typography sx={{ color: '#e5e7eb' }}>{message.text}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatMessage;
