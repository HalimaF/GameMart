import { useState, useEffect } from "react";
import { Container, Typography, Paper, Box, Button, ToggleButton, ToggleButtonGroup, MenuItem, Select, FormControl, InputLabel, IconButton, Tooltip, Snackbar, Alert, Chip } from "@mui/material";
import { FiHeart, FiShare2, FiExternalLink } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import EmbeddedMiniGame from "../components/EmbeddedMiniGame";
import PageHeading from "../components/PageHeading";
import miniGames from "../data/minigames.json";
// Allowed hosts for embedding; others will be hidden from the selector
const ALLOW_HOSTS = [
  "v0games.vercel.app",
  "opentetris.vercel.app",
  "nebez.github.io", // floppybird
  "wayou.github.io", // t-rex runner
  "phoboslab.org", // js13k games
  "xproger.info", // openlara
  "bkcore.com", // hexgl
  "killedbyapixel.github.io"
];

const hostFromUrl = (url) => {
  try { return new URL(url, window.location.origin).hostname; } catch { return ""; }
};

const isAllowedHost = (url) => {
  try {
    const host = hostFromUrl(url);
    if (!host) return false;
    return ALLOW_HOSTS.some(h => host === h || host.endsWith(`.${h}`));
  } catch { return false; }
};

const MiniGame = () => {
  // Remove built-in/embedded toggle
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetX, setTargetX] = useState(50);
  const [targetY, setTargetY] = useState(50);
  const allowedGames = miniGames.filter(g => isAllowedHost(g.src));
  const [selectedGameId, setSelectedGameId] = useState(allowedGames?.[0]?.id || "");
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mg:favorites") || "[]"); } catch { return []; }
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Read id from URL: /minigame/:id
    const parts = (window.location.pathname || "").split("/").filter(Boolean);
    const id = parts[1] === 'minigame' ? parts[2] : (parts[0] === 'minigame' ? parts[1] : undefined);
      if (id) {
        const found = allowedGames.find(g => g.id === id);
      if (found) setSelectedGameId(found.id);
    }
  }, []);

  useEffect(() => {
    if (selectedGameId) {
      navigate(`/minigame/${selectedGameId}`, { replace: true });
    }
  }, [selectedGameId]);

  useEffect(() => {
    localStorage.setItem("mg:favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(true);
    }
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft]);

  const handleStart = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    moveTarget();
  };

  const moveTarget = () => {
    setTargetX(Math.random() * 80 + 5);
    setTargetY(Math.random() * 70 + 10);
  };

  const handleClick = () => {
    if (isPlaying) {
      setScore(score + 10);
      moveTarget();
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <PageHeading title="Play" subtitle="Choose and play mini games" align="left" />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {(() => {
            const g = miniGames.find((x) => x.id === selectedGameId);
            if (!g) return null;
            const isFav = favorites.includes(g.id);
            return (
              <>
                <Tooltip title={isFav ? "Remove from favorites" : "Add to favorites"}>
                  <IconButton onClick={() => toggleFavorite(g.id)} sx={{ color: isFav ? '#ff4d6d' : '#9ca3af' }}>
                    <FiHeart />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy link">
                  <IconButton onClick={copyLink} sx={{ color: '#9ca3af' }}>
                    <FiShare2 />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Open game in new tab">
                  <IconButton component="a" href={g.src} target="_blank" rel="noopener noreferrer" sx={{ color: '#9ca3af' }}>
                    <FiExternalLink />
                  </IconButton>
                </Tooltip>
              </>
            );
          })()}
          <Button variant="outlined" href="/minigames">Back to Gallery</Button>
        </Box>
      </Box>

      <FormControl size="small" sx={{ minWidth: 240, mb: 2 }}>
        <InputLabel id="mini-game-select-label">Game</InputLabel>
        <Select
          labelId="mini-game-select-label"
          label="Game"
          value={selectedGameId}
          onChange={(e) => setSelectedGameId(e.target.value)}
        >
          {allowedGames.map((g) => (
            <MenuItem key={g.id} value={g.id}>{g.title}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {(() => {
        const game = allowedGames.find((g) => g.id === selectedGameId);
        if (!game) {
          return (
            <Paper sx={{ p: 3, background: '#0b1220', border: '1px solid #30363d' }}>
              <Typography sx={{ color: '#fca5a5', mb: 1 }}>Game not found.</Typography>
              <Button variant="contained" href="/minigames">Back to Gallery</Button>
            </Paper>
          );
        }
        return (
          <>
            <Paper sx={{ p: 2, background: '#0b1220', border: '1px solid #30363d', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ color: '#e5e7eb', fontWeight: 600, flex: 1 }}>{game.title}</Typography>
                <Chip size="small" label={game.category || 'Other'} variant="outlined" sx={{ color: '#22d3ee', borderColor: '#22d3ee' }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#9ca3af' }}>{game.src}</Typography>
            </Paper>
            <EmbeddedMiniGame
              key={game.id}
              src={game.src}
              title={game.title}
              allowSameOriginSandbox={Boolean(game.allowSameOriginSandbox)}
            />
          </>
        );
      })()}
      <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setCopied(false)} sx={{ width: '100%' }}>
          Link copied to clipboard
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MiniGame;
