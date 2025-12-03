import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import { useUser } from "../context/UserContext";
import './Home.css';
import PageHeading from '../components/PageHeading';

const Profile = () => {
  const [scrollY, setScrollY] = useState(0);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!user) {
    return (
      <div className="home">
        <div className="home-bg">
          <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
          <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
          <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
        </div>
        <Container sx={{ py: 6, position: 'relative', zIndex: 1 }}>
          <Paper sx={{ p: 3, background: 'rgba(17, 24, 39, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)' }}>
            <Typography sx={{ color: '#e5e7eb' }}>You are not logged in.</Typography>
            <Box sx={{ mt: 2 }}>
              <button className="btn-primary" onClick={() => navigate('/login')}>Login</button>
            </Box>
          </Paper>
        </Container>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>
      <Container sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <PageHeading title="" highlight="Profile" />
        <Paper sx={{ p: 3, background: 'rgba(17, 24, 39, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', borderRadius: '20px' }}>
          <Typography sx={{ color: '#9ca3af' }}>Username</Typography>
          <Typography sx={{ color: '#e5e7eb', mb: 2, fontWeight: 600 }}>{user.username}</Typography>
          <Typography sx={{ color: '#9ca3af' }}>Email</Typography>
          <Typography sx={{ color: '#e5e7eb', mb: 2 }}>{user.email}</Typography>
          <Typography sx={{ color: '#9ca3af' }}>Role</Typography>
          <Typography sx={{ color: '#e5e7eb', mb: 2 }}>
            <span className="game-tag" style={{ 
              background: user.role === 'admin' ? 'rgba(255, 0, 200, 0.2)' : user.role === 'seller' ? 'rgba(255, 234, 0, 0.2)' : 'rgba(0, 255, 231, 0.2)',
              borderColor: user.role === 'admin' ? 'rgba(255, 0, 200, 0.5)' : user.role === 'seller' ? 'rgba(255, 234, 0, 0.5)' : 'rgba(0, 255, 231, 0.5)',
              color: user.role === 'admin' ? '#ff00c8' : user.role === 'seller' ? '#ffea00' : '#00ffe7'
            }}>
              {user.role || 'buyer'}
            </span>
          </Typography>
          <Typography sx={{ color: '#9ca3af' }}>Tier</Typography>
          <Typography sx={{ color: '#e5e7eb' }}>{user.tier}</Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <button className="btn-secondary" onClick={() => setUser(null)}>Logout</button>
            {user.role === 'admin' && (
              <button className="btn-primary" onClick={() => navigate('/admin/dashboard')}>Admin Dashboard</button>
            )}
            {user.role === 'seller' && (
              <button className="btn-primary" onClick={() => navigate('/seller/dashboard')}>Seller Dashboard</button>
            )}
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Profile;
