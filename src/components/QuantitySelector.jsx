import { IconButton, TextField, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const QuantitySelector = ({ value, onChange, min = 1, max = 99 }) => {
  const dec = () => onChange(Math.max(min, (value || 1) - 1));
  const inc = () => onChange(Math.min(max, (value || 1) + 1));
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton size="small" onClick={dec}>
        <RemoveIcon fontSize="small" />
      </IconButton>
      <TextField
        size="small"
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        inputProps={{ min, max }}
        sx={{ width: 72 }}
      />
      <IconButton size="small" onClick={inc}>
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default QuantitySelector;
