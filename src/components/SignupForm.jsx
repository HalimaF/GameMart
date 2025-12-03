import { Box, TextField, Button } from "@mui/material";

const SignupForm = ({ onSubmit }) => {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Username" name="username" required />
      <TextField label="Email" type="email" name="email" required />
      <TextField label="Password" type="password" name="password" required />
      <Button type="submit" variant="contained">Sign Up</Button>
    </Box>
  );
};

export default SignupForm;
