import { useState, useEffect } from "react";
import { Container, Typography, Grid, Paper, Chip, Box } from "@mui/material";
import data from "../data/rewards.json";
import RewardItem from "../components/RewardItem";
import './Home.css';
import PageHeading from '../components/PageHeading';

const Rewards = () => {
  const [scrollY, setScrollY] = useState(0);
  const [rewardData, setRewardData] = useState(() => {
    const saved = localStorage.getItem('gm:rewards');
    return saved ? JSON.parse(saved) : data;
  });
  const { userStats, missions } = rewardData;

  useEffect(() => {
    localStorage.setItem('gm:rewards', JSON.stringify(rewardData));
  }, [rewardData]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClaim = (missionId) => {
    setRewardData(prev => {
      const mission = prev.missions.find(m => m.id === missionId);
      if (!mission || mission.claimed || mission.current < mission.target) return prev;

      return {
        userStats: {
          ...prev.userStats,
          coins: prev.userStats.coins + mission.rewardCoins,
          xp: prev.userStats.xp + mission.rewardXP
        },
        missions: prev.missions.map(m =>
          m.id === missionId ? { ...m, claimed: true } : m
        )
      };
    });
  };

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>
      <Container sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <PageHeading title="Rewards & Missions" fullGradient align="left" />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, background: '#0b1220', border: '1px solid #30363d' }}>
            <Typography variant="h6" sx={{ color: '#e5e7eb', mb: 1 }}>Your Stats</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box>
                <Typography sx={{ color: '#fde68a', fontWeight: 700 }}>{userStats.coins}</Typography>
                <Typography sx={{ color: '#9ca3af' }}>Coins</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: '#93c5fd', fontWeight: 700 }}>{userStats.xp}</Typography>
                <Typography sx={{ color: '#9ca3af' }}>XP</Typography>
              </Box>
              <Box>
                <Typography sx={{ color: '#86efac', fontWeight: 700 }}>{userStats.tier}</Typography>
                <Typography sx={{ color: '#9ca3af' }}>Tier</Typography>
              </Box>
            </Box>
            <Typography sx={{ color: '#9ca3af', mb: 1 }}>Badges</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {userStats.badges.map((b, i) => (
                <Chip key={i} label={b} color="secondary" variant="outlined" />
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {missions.map(m => (
              <Grid item xs={12} key={m.id}>
                <RewardItem mission={m} onClaim={handleClaim} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
    </div>
  );
};

export default Rewards;
