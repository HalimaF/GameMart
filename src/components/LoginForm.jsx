import { Box, TextField, Button } from "@mui/material";

const LoginForm = ({ onSubmit }) => {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Email" type="email" name="email" required />
      <TextField label="Password" type="password" name="password" required />
      <Button type="submit" variant="contained">Login</Button>
    </Box>
  );
};

export default LoginForm;
