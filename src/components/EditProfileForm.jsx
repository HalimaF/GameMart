import { Box, TextField, Button } from "@mui/material";

const EditProfileForm = ({ user, onSave, onCancel }) => {
  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField label="Username" defaultValue={user?.username} fullWidth />
      <TextField label="Email" defaultValue={user?.email} fullWidth />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={onSave}>Save</Button>
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default EditProfileForm;
