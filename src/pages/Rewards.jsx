import { useState, useEffect } from "react";
import { Container, Typography, Grid, Paper, Chip, Box } from "@mui/material";
import data from "../data/rewards.json";
import RewardItem from "../components/RewardItem";
import './Home.css';
import PageHeading from '../components/PageHeading';
import { useUser } from '../context/UserContext';
import usersData from "../data/users.json";

const API_URL = 'http://localhost:5000/api';

const Rewards = () => {
  const { user } = useUser();
  const [scrollY, setScrollY] = useState(0);
  const [rewardData, setRewardData] = useState(() => {
    const saved = localStorage.getItem('gm:rewards');
    return saved ? JSON.parse(saved) : data;
  });
  const [currentUser, setCurrentUser] = useState(user);
  
  // Load user data from backend
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`${API_URL}/users`);
        if (response.ok) {
          const allUsers = await response.json();
          const userData = allUsers.find(u => u.id === user.id);
          if (userData) {
            setCurrentUser(userData);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
    const interval = setInterval(loadUserData, 3000);
    return () => clearInterval(interval);
  }, [user]);
  
  // Calculate dynamic mission progress based on actual user data
  const calculateMissionProgress = () => {
    if (!currentUser) return rewardData.missions;
    
    // Get user's purchase history
    const orders = JSON.parse(localStorage.getItem('gm:orders') || '[]');
    const userOrders = orders.filter(o => o.userId === currentUser.id);
    
    // Get unique games purchased
    const uniqueGames = new Set();
    let totalSpent = 0;
    userOrders.forEach(order => {
      order.items?.forEach(item => uniqueGames.add(item.id));
      totalSpent += order.total || 0;
    });
    
    // Get mini games played (from recent games)
    const recentGames = JSON.parse(localStorage.getItem('mg:recent') || '[]');
    const uniqueMinigames = new Set(recentGames);
    
    // Get chat messages count (simulate - could track in real app)
    const chatMessages = JSON.parse(localStorage.getItem('gm:chatMessages') || '[]');
    const userMessages = chatMessages.filter(m => m.userId === currentUser.id);
    
    return rewardData.missions.map(mission => {
      let current = mission.current;
      
      switch (mission.id) {
        case 1: // First Purchase
          current = userOrders.length > 0 ? 1 : 0;
          break;
        case 2: // Game Collector
          current = uniqueGames.size;
          break;
        case 3: // Big Spender
          current = Math.floor(totalSpent / 100); // Assuming PKR amounts
          break;
        case 4: // Review Writer
          // Keep static or track reviews if implemented
          break;
        case 5: // Arcade Master
          current = uniqueMinigames.size;
          break;
        case 6: // Social Gamer
          current = userMessages.length;
          break;
      }
      
      return { ...mission, current };
    });
  };
  
  const userStats = currentUser ? {
    coins: currentUser.coins || 0,
    xp: currentUser.xp || 0,
    tier: currentUser.tier || 'Bronze',
    badges: currentUser.badges || []
  } : rewardData.userStats;
  
  const dynamicMissions = calculateMissionProgress();

  useEffect(() => {
    localStorage.setItem('gm:rewards', JSON.stringify(rewardData));
  }, [rewardData]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClaim = async (missionId) => {
    const mission = dynamicMissions.find(m => m.id === missionId);
    if (!mission || mission.claimed || mission.current < mission.target || !user) return;

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
      
      // Update user coins and XP
      const updatedUsers = allUsers.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            coins: (u.coins || 0) + mission.rewardCoins,
            xp: (u.xp || 0) + mission.rewardXP
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
      
      // Update local storage
      localStorage.setItem('gm:users', JSON.stringify(updatedUsers));
      const updatedUser = updatedUsers.find(u => u.id === user.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        localStorage.setItem('gm:user', JSON.stringify(updatedUser));
      }
      
      // Mark mission as claimed
      setRewardData(prev => ({
        ...prev,
        missions: prev.missions.map(m =>
          m.id === missionId ? { ...m, claimed: true } : m
        )
      }));
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
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
            {dynamicMissions.map(m => (
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
