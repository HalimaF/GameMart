import { Card, CardMedia, CardContent, Typography, CardActions, Button, Chip, Box } from "@mui/material";
import { formatPKR } from "../utils/currency";
import { useUser } from "../context/UserContext";

const GameCard = ({ game }) => {
  const { addToCart } = useUser();

  return (
    <Card sx={{ 
      background: 'rgba(17, 24, 39, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '20px',
      backdropFilter: 'blur(20px)',
      transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      '&:hover': {
        transform: 'translateY(-8px)',
        borderColor: 'var(--primary)',
        boxShadow: '0 20px 60px rgba(0, 255, 231, 0.2)'
      }
    }}>
      <CardMedia 
        component="img" 
        height="200" 
        image={game.image} 
        alt={game.title}
        sx={{
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'scale(1.05)' }
        }}
      />
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ 
          color: 'var(--text)', 
          fontWeight: 600,
          minHeight: '60px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {game.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip 
            size="small" 
            label={game.console} 
            sx={{ 
              color: '#00ffe7', 
              borderColor: 'rgba(0, 255, 231, 0.3)',
              background: 'rgba(0, 255, 231, 0.1)'
            }} 
            variant="outlined" 
          />
          <Chip 
            size="small" 
            label={game.genre} 
            sx={{ 
              color: '#ff00c8', 
              borderColor: 'rgba(255, 0, 200, 0.3)',
              background: 'rgba(255, 0, 200, 0.1)'
            }} 
            variant="outlined" 
          />
          {game.discount ? (
            <Chip 
              size="small" 
              label={`-${game.discount}%`} 
              sx={{ 
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}
            />
          ) : null}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 2 }}>
          <Typography variant="h6" sx={{ color: 'var(--primary)', fontWeight: 700 }}>
            {formatPKR(game.price)}
          </Typography>
          {game.originalPrice && (
            <Typography variant="body2" sx={{ color: '#9ca3af', textDecoration: 'line-through' }}>
              {formatPKR(game.originalPrice)}
            </Typography>
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button 
          variant="contained" 
          size="small" 
          onClick={() => addToCart(game)}
          sx={{
            background: 'rgba(0, 255, 231, 0.1)',
            color: '#00ffe7',
            borderColor: 'rgba(0, 255, 231, 0.3)',
            border: '1px solid',
            '&:hover': {
              background: 'rgba(0, 255, 231, 0.2)',
              borderColor: 'var(--primary)'
            }
          }}
        >
          Add to Cart
        </Button>
        <Button 
          size="small" 
          href={`/game/${game.id}`} 
          sx={{ 
            color: 'var(--text-dim)',
            '&:hover': { color: 'var(--primary)' }
          }}
        >
          Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default GameCard;
