import { Box, Typography, Chip } from "@mui/material";
import { formatPKR } from "../utils/currency";

const GameDetails = ({ game }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ color: '#e5e7eb', mb: 1 }}>{game.title}</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Chip label={game.console} size="small" />
        <Chip label={game.genre} size="small" color="secondary" />
      </Box>
      <Typography sx={{ color: '#9ca3af', mb: 2 }}>{game.description || 'No description available.'}</Typography>
      <Typography variant="h6" sx={{ color: 'var(--primary)', fontWeight: 700 }}>
        {formatPKR(game.price)}
      </Typography>
    </Box>
  );
};

export default GameDetails;
