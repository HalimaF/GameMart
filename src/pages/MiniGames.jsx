import { useState, useEffect } from "react";
import { Container, Typography, Box, Paper, TextField, Grid, Button, Chip, Stack, IconButton } from "@mui/material";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import miniGames from "../data/minigames.json";
// Only show games from hosts that typically allow embedding
const ALLOW_HOSTS = [
  "v0games.vercel.app",
  "opentetris.vercel.app",
  "nebez.github.io",
  "wayou.github.io",
  "phoboslab.org",
  "xproger.info",
  "bkcore.com",
  "killedbyapixel.github.io"
];

const hostFromUrl = (url) => {
  try { return new URL(url, window.location.origin).hostname; } catch { return ""; }
};

const isAllowedHost = (url) => {
  const host = hostFromUrl(url);
  return host && ALLOW_HOSTS.some(h => host === h || host.endsWith(`.${h}`));
};
import './Home.css';
import PageHeading from "../components/PageHeading";

const MiniGames = () => {
  const [scrollY, setScrollY] = useState(0);
  const [query, setQuery] = useState("");
  const allowedGames = miniGames.filter(g => isAllowedHost(g.src));
  const [list, setList] = useState(allowedGames);
  const [category, setCategory] = useState("All");
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mg:favorites") || "[]"); } catch { return []; }
  });
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mg:recent") || "[]"); } catch { return []; }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    let filtered = allowedGames;
    if (category !== "All") {
      filtered = filtered.filter(g => (g.category || "").toLowerCase() === category.toLowerCase());
    }
    if (q) {
      filtered = filtered.filter(g => {
        const hay = `${g.title || ""} ${g.id || ""} ${(g.tags || []).join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }
    setList(filtered);
  }, [query, category]);

  useEffect(() => { localStorage.setItem("mg:favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("mg:recent", JSON.stringify(recent)); }, [recent]);

  const onOpen = (id) => {
    setRecent((prev) => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, 10);
      return next;
    });
    navigate(`/minigame/${id}`);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const categories = ["All", ...Array.from(new Set(allowedGames.map(g => g.category || "Other")))];

  const categoryStyle = (c) => {
    const key = (c || 'Other').toLowerCase();
    const map = {
      arcade: { color: '#22d3ee', borderColor: '#22d3ee', bg: 'rgba(34,211,238,0.12)' },
      puzzle: { color: '#fbbf24', borderColor: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
      strategy: { color: '#a78bfa', borderColor: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
      sports: { color: '#34d399', borderColor: '#34d399', bg: 'rgba(52,211,153,0.12)' },
      other: { color: '#9ca3af', borderColor: '#9ca3af', bg: 'rgba(156,163,175,0.12)' },
    };
    return map[key] || map.other;
  };

  const initials = (title) => (title || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');

  const colorFromId = (id) => {
    let h = 0;
    const s = (id || 'game');
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    const hue = h % 360;
    return `hsl(${hue} 85% 55%)`;
  };

  const renderThumb = (g, height = 160) => {
    if (g.thumbnail) {
      return (
        <Box sx={{ height, backgroundImage: `url(${g.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#1f2937' }} />
      );
    }
    const c1 = colorFromId(g.id);
    const c2 = colorFromId(g.id + 'x');
    return (
      <Box sx={{
        height,
        position: 'relative',
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Typography sx={{ color: '#0b1220', fontWeight: 800, fontSize: 40, textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}>
          {initials(g.title)}
        </Typography>
      </Box>
    );
  };

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>
      <Container sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <PageHeading title="Mini Games" subtitle="Browse and play casual games" align="left" />
      <Paper sx={{ p: 2, background: '#0b1220', border: '1px solid #30363d', mb: 2 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            size="small"
            label="Search games"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="outlined"
          />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {categories.map((c) => (
              <Chip
                key={c}
                label={c}
                onClick={() => setCategory(c)}
                color={category === c ? 'primary' : 'default'}
                variant={category === c ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Stack>
      </Paper>

      {favorites.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ color: '#e5e7eb', fontWeight: 600, mb: 1 }}>Favorites</Typography>
          <Grid container spacing={2}>
            {favorites.map(fid => {
              const g = allowedGames.find(x => x.id === fid);
              if (!g) return null;
              return (
                <Grid item xs={12} sm={6} md={4} key={`fav-${g.id}`}>
                  <Paper sx={{ p: 0, background: '#0b1220', border: '1px solid #30363d', overflow: 'hidden' }}>
                    {renderThumb(g, 120)}
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: '#e5e7eb', fontWeight: 600 }}>{g.title}</Typography>
                        <Chip size="small" label={g.category || 'Other'} sx={{ ml: 0, mt: 0.5, color: categoryStyle(g.category).color, borderColor: categoryStyle(g.category).borderColor, backgroundColor: categoryStyle(g.category).bg }} variant="outlined" />
                      </Box>
                      <IconButton onClick={() => toggleFavorite(g.id)} sx={{ color: favorites.includes(g.id) ? '#ff4d6d' : '#9ca3af' }}>
                        <FiHeart />
                      </IconButton>
                      <Button variant="contained" size="small" onClick={() => onOpen(g.id)} sx={{ ml: 1 }}>Play</Button>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {recent.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ color: '#e5e7eb', fontWeight: 600, mb: 1 }}>Recently Played</Typography>
          <Grid container spacing={2}>
            {recent.map(rid => {
              const g = allowedGames.find(x => x.id === rid);
              if (!g) return null;
              return (
                <Grid item xs={12} sm={6} md={4} key={`rec-${g.id}`}>
                  <Paper sx={{ p: 0, background: '#0b1220', border: '1px solid #30363d', overflow: 'hidden' }}>
                    {renderThumb(g, 100)}
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: '#e5e7eb', fontWeight: 600 }}>{g.title}</Typography>
                        <Chip size="small" label={g.category || 'Other'} sx={{ ml: 0, mt: 0.5, color: categoryStyle(g.category).color, borderColor: categoryStyle(g.category).borderColor, backgroundColor: categoryStyle(g.category).bg }} variant="outlined" />
                      </Box>
                      <Button variant="contained" size="small" onClick={() => onOpen(g.id)}>Play</Button>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
      <Grid container spacing={2}>
        {list.map((g) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={g.id}>
            <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0b1220', border: '1px solid #30363d', overflow: 'hidden' }}>
              {renderThumb(g, 180)}
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', mt: 'auto' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography noWrap sx={{ color: '#e5e7eb', fontWeight: 600, mb: 0.5 }}>{g.title}</Typography>
                  <Chip size="small" label={g.category || 'Other'} sx={{ color: categoryStyle(g.category).color, borderColor: categoryStyle(g.category).borderColor, backgroundColor: categoryStyle(g.category).bg }} variant="outlined" />
                </Box>
                <IconButton onClick={() => toggleFavorite(g.id)} sx={{ color: favorites.includes(g.id) ? '#ff4d6d' : '#9ca3af' }}>
                  <FiHeart />
                </IconButton>
                <Button variant="contained" size="small" onClick={() => onOpen(g.id)} sx={{ ml: 1 }}>Play</Button>
              </Box>
            </Paper>
          </Grid>
        ))}
        {list.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, background: '#0b1220', border: '1px solid #30363d' }}>
              <Typography sx={{ color: '#9ca3af' }}>No games match your search.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
    </div>
  );
};

export default MiniGames;
