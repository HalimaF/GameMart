import { Chip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const RewardBadge = ({ label, color = 'primary' }) => {
  return (
    <Chip
      icon={<EmojiEventsIcon />}
      label={label}
      color={color}
      variant="outlined"
      size="small"
    />
  );
};

export default RewardBadge;
