import { Box, Typography, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatPKR } from "../utils/currency";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: '1px solid #30363d' }}>
      <img src={item.image} alt={item.title} width={72} height={72} style={{ borderRadius: 8, objectFit: 'cover' }} />
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ color: '#e5e7eb', fontWeight: 600 }}>{item.title}</Typography>
            <Typography sx={{ color: '#9ca3af' }}>{formatPKR(item.price)}</Typography>
      </Box>
      <TextField
        type="number"
        value={item.quantity}
        onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value))}
        inputProps={{ min: 1, max: 99 }}
        size="small"
        sx={{ width: 88 }}
      />
      <Typography sx={{ color: '#86efac', width: 96, textAlign: 'right' }}>
            {formatPKR((item.price * item.quantity))}
      </Typography>
      <IconButton color="error" onClick={() => onRemove(item.id)}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default CartItem;
