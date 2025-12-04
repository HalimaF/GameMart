import { useState, useEffect } from "react";
import { Container, Typography, Paper, Box, Button, ToggleButton, ToggleButtonGroup, MenuItem, Select, FormControl, InputLabel, IconButton, Tooltip, Snackbar, Alert, Chip } from "@mui/material";
import { FiHeart, FiShare2, FiExternalLink } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import EmbeddedMiniGame from "../components/EmbeddedMiniGame";
import PageHeading from "../components/PageHeading";
import miniGames from "../data/minigames.json";
import { useUser } from "../context/UserContext";
import usersData from "../data/users.json";

const API_URL = 'http://localhost:5000/api';

// Allowed hosts for embedding; others will be hidden from the selector
const ALLOW_HOSTS = [
  "v0games.vercel.app",
  "opentetris.vercel.app",
  "nebez.github.io", // floppybird
  "wayou.github.io", // t-rex runner
  "phoboslab.org", // js13k games
  "xproger.info", // openlara
  "hexgl.bkcore.com",
  "bkcore.com", // hexgl
  "killedbyapixel.github.io",
  "codeincomplete.com", // snake
  "graememcc.co.uk", // micropolis
  "fragglet.github.io", // sopwith
  "mindustrygame.github.io", // mindustry
  "linuxconsulting.ro" // openpanzer
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
  const { user, setUser } = useUser();
  // Remove built-in/embedded toggle
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetX, setTargetX] = useState(50);
  const [targetY, setTargetY] = useState(50);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXpAlert, setShowXpAlert] = useState(false);
  const [playTimer, setPlayTimer] = useState(0);
  
  // Load minigames from localStorage (admin changes) or fallback to JSON file
  const [miniGamesData, setMiniGamesData] = useState(() => {
    try {
      const saved = localStorage.getItem('gm:minigames');
      return saved ? JSON.parse(saved) : miniGames;
    } catch {
      return miniGames;
    }
  });
  
  const [allowedGames, setAllowedGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState("");
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mg:favorites") || "[]"); } catch { return []; }
  });
  const [copied, setCopied] = useState(false);
  
  // Update allowed games when miniGamesData changes
  useEffect(() => {
    const filtered = miniGamesData.filter(g => isAllowedHost(g.src));
    setAllowedGames(filtered);
  }, [miniGamesData]);
  
  // Refresh minigames from backend every 3 seconds to catch admin changes
  useEffect(() => {
    const loadGames = async () => {
      try {
        const response = await fetch(`${API_URL}/minigames`);
        if (response.ok) {
          const data = await response.json();
          setMiniGamesData(data);
          localStorage.setItem('gm:minigames', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error loading minigames from backend:', error);
        // Fallback to localStorage
        try {
          const saved = localStorage.getItem('gm:minigames');
          if (saved) {
            setMiniGamesData(JSON.parse(saved));
          }
        } catch (err) {
          console.error('Error loading from localStorage:', err);
        }
      }
    };
    
    loadGames(); // Load immediately
    const interval = setInterval(loadGames, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Read id from URL: /minigame/:id
    const parts = (window.location.pathname || "").split("/").filter(Boolean);
    const id = parts[1] === 'minigame' ? parts[2] : (parts[0] === 'minigame' ? parts[1] : undefined);
    
    if (id && allowedGames.length > 0) {
      const found = allowedGames.find(g => g.id === id);
      if (found) {
        setSelectedGameId(found.id);
      } else if (allowedGames[0]) {
        setSelectedGameId(allowedGames[0].id);
      }
    } else if (allowedGames.length > 0 && !selectedGameId) {
      setSelectedGameId(allowedGames[0].id);
    }
  }, [allowedGames]);

  useEffect(() => {
    if (selectedGameId && allowedGames.length > 0) {
      const currentPath = window.location.pathname;
      const expectedPath = `/minigame/${selectedGameId}`;
      if (currentPath !== expectedPath) {
        navigate(expectedPath, { replace: true });
      }
    }
  }, [selectedGameId, navigate]);

  // Track when game is loaded and award XP for playing
  useEffect(() => {
    if (selectedGameId && user) {
      setGameStartTime(Date.now());
      setPlayTimer(0);
    }
  }, [selectedGameId, user]);

  // Update play timer every second
  useEffect(() => {
    if (gameStartTime && user) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        setPlayTimer(elapsed);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [gameStartTime, user]);

  // Award XP every 30 seconds of continuous play
  useEffect(() => {
    if (playTimer > 0 && playTimer % 30 === 0 && user) {
      const awardXP = async () => {
        const earnedXP = 10;
        
        try {
          // Get current users
          const response = await fetch(`${API_URL}/users`);
          let allUsers = [];
          
          if (response.ok) {
            allUsers = await response.json();
          } else {
            const saved = localStorage.getItem('gm:users');
            allUsers = saved ? JSON.parse(saved) : usersData;
          }
          
          // Update user XP and coins
          const updatedUsers = allUsers.map(u => {
            if (u.id === user.id) {
              return {
                ...u,
                xp: (u.xp || 0) + earnedXP,
                coins: (u.coins || 0) + Math.floor(earnedXP / 2)
              };
            }
            return u;
          });
          
          // Save to backend
          await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUsers)
          });
          
          // Update local storage and context
          localStorage.setItem('gm:users', JSON.stringify(updatedUsers));
          const updatedUser = updatedUsers.find(u => u.id === user.id);
          if (updatedUser) {
            setUser(updatedUser);
            localStorage.setItem('gm:user', JSON.stringify(updatedUser));
            setXpEarned(earnedXP);
            setShowXpAlert(true);
          }
        } catch (error) {
          console.error('Error updating XP:', error);
        }
      };
      
      awardXP();
    }
  }, [playTimer, user]);

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
          {user && playTimer > 0 && (
            <Paper sx={{ px: 2, py: 1, background: '#0b1220', border: '1px solid #30363d', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: '#93c5fd', fontWeight: 600, fontSize: '14px' }}>⏱️ {Math.floor(playTimer / 60)}:{(playTimer % 60).toString().padStart(2, '0')}</Typography>
              <Typography sx={{ color: '#9ca3af', fontSize: '12px' }}>Next reward in {30 - (playTimer % 30)}s</Typography>
            </Paper>
          )}
          {(() => {
            const g = miniGamesData.find((x) => x.id === selectedGameId);
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
      <Snackbar open={showXpAlert} autoHideDuration={4000} onClose={() => setShowXpAlert(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setShowXpAlert(false)} sx={{ width: '100%', background: '#22c55e' }}>
          🎮 You earned {xpEarned} XP and {Math.floor(xpEarned / 2)} coins for playing!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MiniGame;
