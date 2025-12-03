import { Avatar } from "@mui/material";

const ProfileAvatar = ({ user, size = 48 }) => {
  return (
    <Avatar sx={{ width: size, height: size, bgcolor: '#3b82f6' }}>
      {user?.username?.[0]?.toUpperCase()}
    </Avatar>
  );
};

export default ProfileAvatar;
