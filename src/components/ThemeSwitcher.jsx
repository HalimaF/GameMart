import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ThemeSwitcher = ({ isDark = true, onToggle }) => {
  return (
    <IconButton onClick={onToggle} color="inherit">
      {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ThemeSwitcher;