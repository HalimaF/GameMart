import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import usersData from "../../data/users.json";
import gamesData from "../../data/games.json";
import '../Home.css';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import PageHeading from '../../components/PageHeading';
import { formatPKR } from '../../utils/currency';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [scrollY, setScrollY] = useState(0);
  const { user } = useUser();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState([]);

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

  // Load dynamic data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load users from backend first
        try {
          const response = await fetch(`${API_URL}/users`);
          if (response.ok) {
            const data = await response.json();
            setAllUsers(data);
            localStorage.setItem('gm:users', JSON.stringify(data));
          } else {
            throw new Error('Backend fetch failed');
          }
        } catch (error) {
          // Fallback to localStorage
          const savedUsers = localStorage.getItem('gm:users');
          setAllUsers(savedUsers ? JSON.parse(savedUsers) : usersData);
        }

        // Load ALL games from unified storage (backend or localStorage)
        try {
          const response = await fetch(`${API_URL}/products`);
          if (response.ok) {
            const products = await response.json();
            setAllGames(products);
          } else {
            throw new Error('Backend fetch failed');
          }
        } catch (error) {
          // Fallback to localStorage unified storage
          const unifiedProducts = localStorage.getItem('gamemart:products');
          if (unifiedProducts) {
            const products = JSON.parse(unifiedProducts);
            setAllGames(products);
          } else {
            // Last resort: use games.json
            setAllGames(gamesData);
          }
        }

        // Load orders
        const savedOrders = localStorage.getItem('gm:orders');
        setOrders(savedOrders ? JSON.parse(savedOrders) : []);

        // Load rentals
        const savedRentals = localStorage.getItem('gm:rentals');
        setRentals(savedRentals ? JSON.parse(savedRentals) : []);
      } catch (error) {
        console.error('Error loading data:', error);
        setAllUsers(usersData);
        setAllGames(gamesData);
        setOrders([]);
        setRentals([]);
      }
    };

    loadData();
    // Refresh data every 3 seconds to catch changes
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Calculate dynamic stats
  const totalUsers = allUsers.length;
  const totalGames = allGames.length;
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  
  // Additional metrics
  const buyersCount = allUsers.filter(u => u.role === 'buyer').length;
  const sellersCount = allUsers.filter(u => u.role === 'seller').length;
  const totalStock = allGames.reduce((sum, game) => sum + (game.stock || 0), 0);
  const rentableGames = allGames.filter(g => g.availableForRent).length;

  const stats = [
    { label: 'Total Users', value: totalUsers, color: '#00ffe7', icon: '👥', subtext: `${buyersCount} buyers, ${sellersCount} sellers` },
    { label: 'Total Games', value: totalGames, color: '#ff00c8', icon: '🎮', subtext: `${totalStock} units in stock` },
    { label: 'Active Orders', value: activeOrders, color: '#ffea00', icon: '📦', subtext: `${orders.length} total orders` },
    { label: 'Revenue', value: formatPKR(totalRevenue), color: '#86efac', icon: '💰', subtext: rentals.length > 0 ? `+${rentals.length} rentals` : 'From sales' },
  ];

  const recentUsers = allUsers.slice(-5).reverse().slice(0, 3);
  const recentGames = allGames.slice(0, 4);
  
  // Generate monthly user growth data
  const monthlyUsers = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return allUsers.filter(u => {
      const joinMonth = new Date(u.joinDate || '2025-01-01').getMonth() + 1;
      return joinMonth === month;
    }).length * 10 + Math.floor(Math.random() * 20);
  });

  // Generate monthly revenue data
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const baseRevenue = totalRevenue / 12;
    return Math.floor(baseRevenue * (0.8 + Math.random() * 0.4));
  });

  // Genre distribution from actual games
  const genreDistribution = Array.from(
    allGames.reduce((map, g) => map.set(g.genre, (map.get(g.genre) || 0) + 1), new Map()),
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
        <div className="games-grid mb-60">
          {stats.map((stat, i) => (
            <div key={stat.label} className="game-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="game-card-inner">
                <div className="game-card-bg"></div>
                <div className="stat-icon">{stat.icon}</div>
                <div className="game-tag stat-label" style={{ 
                  background: `${stat.color}20`, 
                  borderColor: `${stat.color}50`,
                  color: stat.color
                }}>
                  {stat.label}
                </div>
                <div className="game-price stat-value" style={{ color: stat.color }}>{stat.value}</div>
                {stat.subtext && (
                  <div className="stat-subtext">
                    {stat.subtext}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Users */}
        <PageHeading title="Recent" highlight="Users" />
        <div className="grid-2col mb-24">
          <div className="chart-container">
            <LineChart
              xAxis={[{ data: Array.from({ length: 12 }, (_, i) => i + 1), label: 'Month' }]}
              series={[{ data: monthlyUsers, label: 'New Users' }]}
              height={240}
            />
          </div>
          <div className="chart-container">
            <BarChart
              xAxis={[{ data: Array.from({ length: 12 }, (_, i) => i + 1), label: 'Month' }]}
              series={[{ data: monthlyRevenue, label: 'Revenue (PKR)' }]}
              height={240}
            />
          </div>
        </div>
        <div className="card card-compact mb-60">
          {recentUsers.map((u, i) => (
            <div key={u.id} className="card-list-item" style={{
              animation: `cardFadeIn 0.6s ease-out ${0.2 + i * 0.1}s both`
            }}>
              <div className="user-info">
                <div className="user-name">{u.username}</div>
                <div className="user-email">{u.email}</div>
              </div>
              <div className="text-right">
                <div className="game-tag user-role-tag" style={{ 
                  background: u.role === 'admin' ? 'rgba(255, 0, 200, 0.2)' : u.role === 'seller' ? 'rgba(255, 234, 0, 0.2)' : 'rgba(0, 255, 231, 0.2)',
                  borderColor: u.role === 'admin' ? 'rgba(255, 0, 200, 0.5)' : u.role === 'seller' ? 'rgba(255, 234, 0, 0.5)' : 'rgba(0, 255, 231, 0.5)',
                  color: u.role === 'admin' ? '#ff00c8' : u.role === 'seller' ? '#ffea00' : '#00ffe7'
                }}>
                  {u.role}
                </div>
                <div className="user-tier">{u.tier}</div>
              </div>
            </div>
          ))}
          <button className="game-btn mt-16" onClick={() => navigate('/admin/users')}>
            View All Users
          </button>
        </div>

        {/* Recent Games */}
        <PageHeading title="Game" highlight="Management" />
        <div className="chart-container mb-24">
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
                <div className="game-price">{formatPKR(game.price)}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '8px' }}>
                  Stock: {game.stock || 0}
                </div>
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
