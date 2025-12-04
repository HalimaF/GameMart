import { useState, useEffect } from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import usersData from "../data/users.json";
import './Home.css';
import PageHeading from '../components/PageHeading';

const API_URL = 'http://localhost:5000/api';

const Leaderboard = () => {
  const [scrollY, setScrollY] = useState(0);
  const [users, setUsers] = useState(usersData);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          const saved = localStorage.getItem('gm:users');
          setUsers(saved ? JSON.parse(saved) : usersData);
        }
      } catch (error) {
        console.error('Error loading users:', error);
        const saved = localStorage.getItem('gm:users');
        setUsers(saved ? JSON.parse(saved) : usersData);
      }
    };

    loadUsers();
    const interval = setInterval(loadUsers, 3000);
    return () => clearInterval(interval);
  }, []);

  const sorted = [...users].sort((a, b) => b.xp - a.xp).slice(0, 10);

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>
      <Container sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <PageHeading title="" highlight="Leaderboard" />
      <Paper sx={{ background: '#0b1220', border: '1px solid #30363d' }}>
        {sorted.map((u, idx) => (
          <Box key={u.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: idx === sorted.length - 1 ? 'none' : '1px solid #30363d' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: '50%', background: '#111827', display: 'grid', placeItems: 'center', color: '#93c5fd' }}>{idx + 1}</Box>
              <Typography sx={{ color: '#e5e7eb', fontWeight: 600 }}>{u.username}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ color: '#93c5fd' }}>{u.xp} XP</Typography>
              <Typography sx={{ color: '#fde68a' }}>{u.coins} coins</Typography>
            </Box>
          </Box>
        ))}
      </Paper>
    </Container>
    </div>
  );
};

export default Leaderboard;
