import { TextField, IconButton, Box } from "@mui/material";

const ChatInput = ({ value, onChange, onSend }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Type a message..."
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === 'Enter' && onSend?.()}
      />
      <IconButton color="primary" onClick={onSend}>Send</IconButton>
    </Box>
  );
};

export default ChatInput;
