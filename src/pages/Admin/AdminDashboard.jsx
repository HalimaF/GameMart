import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import users from "../../data/users.json";
import games from "../../data/games.json";
import '../Home.css';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import PageHeading from '../../components/PageHeading';

const AdminDashboard = () => {
  const [scrollY, setScrollY] = useState(0);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  const stats = [
    { label: 'Total Users', value: users.length, color: '#00ffe7', icon: '👥' },
    { label: 'Total Games', value: games.length, color: '#ff00c8', icon: '🎮' },
    { label: 'Active Orders', value: 47, color: '#ffea00', icon: '📦' },
    { label: 'Revenue', value: '$45,678', color: '#86efac', icon: '💰' },
  ];

  const recentUsers = users.slice(0, 3);
  const recentGames = games.slice(0, 4);
  const monthlyUsers = [120, 180, 240, 300, 280, 350, 400, 420, 450, 470, 500, 540];
  const monthlyRevenue = [15000, 18000, 21000, 25000, 23000, 27000, 30000, 32000, 34000, 36000, 39000, 42000];
  const genreDistribution = Array.from(
    games.reduce((map, g) => map.set(g.genre, (map.get(g.genre) || 0) + 1), new Map()),
  ).map(([label, value]) => ({ id: label, value, label }));

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>

      <div className="featured">
        <PageHeading title="Admin" highlight="Dashboard" />

        {/* Stats Grid */}
        <div className="games-grid" style={{ marginBottom: '60px' }}>
          {stats.map((stat, i) => (
            <div key={stat.label} className="game-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="game-card-inner">
                <div className="game-card-bg"></div>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{stat.icon}</div>
                <div className="game-tag" style={{ 
                  background: `${stat.color}20`, 
                  borderColor: `${stat.color}50`,
                  color: stat.color
                }}>
                  {stat.label}
                </div>
                <div className="game-price" style={{ color: stat.color, marginTop: '12px' }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Users */}
        <PageHeading title="Recent" highlight="Users" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '16px' }}>
            <LineChart
              xAxis={[{ data: Array.from({ length: 12 }, (_, i) => i + 1), label: 'Month' }]}
              series={[{ data: monthlyUsers, label: 'New Users' }]}
              height={240}
            />
          </div>
          <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '16px' }}>
            <BarChart
              xAxis={[{ data: Array.from({ length: 12 }, (_, i) => i + 1), label: 'Month' }]}
              series={[{ data: monthlyRevenue, label: 'Revenue (PKR)' }]}
              height={240}
            />
          </div>
        </div>
        <div style={{
          background: 'rgba(17, 24, 39, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '24px',
          backdropFilter: 'blur(20px)',
          marginBottom: '60px'
        }}>
          {recentUsers.map((u, i) => (
            <div key={u.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              borderBottom: i < recentUsers.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
              animation: `cardFadeIn 0.6s ease-out ${0.2 + i * 0.1}s both`
            }}>
              <div>
                <div style={{ color: 'var(--text)', fontWeight: '600', marginBottom: '4px' }}>{u.username}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '14px' }}>{u.email}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="game-tag" style={{ 
                  background: u.role === 'admin' ? 'rgba(255, 0, 200, 0.2)' : u.role === 'seller' ? 'rgba(255, 234, 0, 0.2)' : 'rgba(0, 255, 231, 0.2)',
                  borderColor: u.role === 'admin' ? 'rgba(255, 0, 200, 0.5)' : u.role === 'seller' ? 'rgba(255, 234, 0, 0.5)' : 'rgba(0, 255, 231, 0.5)',
                  color: u.role === 'admin' ? '#ff00c8' : u.role === 'seller' ? '#ffea00' : '#00ffe7'
                }}>
                  {u.role}
                </div>
                <div style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '4px' }}>{u.tier}</div>
              </div>
            </div>
          ))}
          <button className="game-btn" style={{ marginTop: '16px' }} onClick={() => navigate('/admin/users')}>
            View All Users
          </button>
        </div>

        {/* Recent Games */}
        <PageHeading title="Game" highlight="Management" />
        <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '16px', marginBottom: '24px' }}>
          <PieChart
            series={[{ data: genreDistribution }]}
            height={260}
            slotProps={{ legend: { hidden: false } }}
          />
        </div>
        <div className="games-grid" style={{ marginBottom: '40px' }}>
          {recentGames.map((game, i) => (
            <div key={game.id} className="game-card" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
              <div className="game-card-inner">
                <div className="game-card-bg"></div>
                {game.image && (
                  <img src={game.image} alt={game.title} style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    marginBottom: '12px'
                  }} />
                )}
                <div className="game-tag">{game.genre}</div>
                <div className="game-title" style={{ fontSize: '18px' }}>{game.title}</div>
                <div className="game-price">${game.price}</div>
                <button className="game-btn">Edit Game</button>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={() => navigate('/admin/products')} style={{ margin: '0 auto', display: 'block' }}>
          Manage All Products
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
