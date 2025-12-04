import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import gamesData from "../../data/games.json";
import '../Home.css';
import { formatPKR } from "../../utils/currency";
import { BarChart, LineChart } from '@mui/x-charts';

const SellerDashboard = () => {
  const [scrollY, setScrollY] = useState(0);
  const { user } = useUser();
  const navigate = useNavigate();
  const [myProducts, setMyProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Load dynamic data
  useEffect(() => {
    const loadData = () => {
      try {
        // Load seller products
        const savedProducts = localStorage.getItem('seller:products');
        setMyProducts(savedProducts ? JSON.parse(savedProducts) : gamesData.slice(0, 8));

        // Load orders
        const savedOrders = localStorage.getItem('gm:orders');
        setOrders(savedOrders ? JSON.parse(savedOrders) : []);

        // Load rentals
        const savedRentals = localStorage.getItem('gm:rentals');
        setRentals(savedRentals ? JSON.parse(savedRentals) : []);
      } catch (error) {
        console.error('Error loading data:', error);
        setMyProducts(gamesData.slice(0, 8));
        setOrders([]);
        setRentals([]);
      }
    };

    loadData();
    // Refresh data every 2 seconds to catch changes
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate dynamic stats
  const totalProducts = myProducts.length;
  const totalSales = orders.length + rentals.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0) + 
                       rentals.reduce((sum, rental) => sum + parseFloat(rental.price || 0), 0);
  
  // Calculate average rating (mock for now, can be enhanced)
  const averageRating = myProducts.length > 0 ? 
    (myProducts.reduce((sum, p) => sum + (p.rating || 4.5), 0) / myProducts.length).toFixed(1) : '4.8';

  const stats = [
    { label: 'Total Products', value: totalProducts, color: '#00ffe7', icon: '🎮' },
    { label: 'Total Sales', value: totalSales, color: '#ff00c8', icon: '💳' },
    { label: 'Revenue', value: totalRevenue, color: '#ffea00', icon: '💰', currency: true },
    { label: 'Rating', value: `${averageRating}★`, color: '#86efac', icon: '⭐' },
  ];

  // Get recent sales (last 3 orders)
  const recentSales = [...orders, ...rentals]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 3)
    .map(item => ({
      game: item.gameTitle || item.items?.[0]?.title || 'Unknown',
      buyer: item.buyer || item.customerName || 'Customer',
      amount: item.total || parseFloat(item.price || 0),
      date: item.date ? new Date(item.date).toLocaleString() : 'Recently'
    }));

  // Generate monthly sales data
  const monthlySales = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const salesCount = orders.filter(o => {
      const orderMonth = new Date(o.date || '2025-01-01').getMonth() + 1;
      return orderMonth === month;
    }).length;
    return salesCount > 0 ? salesCount : Math.floor(Math.random() * 10);
  });

  // Generate monthly revenue data
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthRevenue = orders.filter(o => {
      const orderMonth = new Date(o.date || '2025-01-01').getMonth() + 1;
      return orderMonth === month;
    }).reduce((sum, o) => sum + (o.total || 0), 0);
    return monthRevenue > 0 ? monthRevenue : Math.floor(Math.random() * 5000);
  });

  const displayProducts = myProducts.slice(0, 6);

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>

      <div className="featured">
        <h1 className="section-title">
          Seller <span className="gradient-text">Dashboard</span>
        </h1>
        
        {user && (
          <div className="welcome-message">
            Welcome back, <span className="gradient-text welcome-username">{user.username}</span>
          </div>
        )}

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
                <div className="game-price stat-value" style={{ color: stat.color }}>{stat.currency ? formatPKR(stat.value) : stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Sales */}
        <h2 className="section-title section-title-responsive">
          Recent Sales
        </h2>
        
        {/* Sales Charts */}
        <div className="grid-2col mb-24">
          <div className="chart-container">
            <h3 className="chart-title">Monthly Sales</h3>
            <BarChart
              xAxis={[{ data: Array.from({ length: 12 }, (_, i) => i + 1), label: 'Month', scaleType: 'band' }]}
              series={[{ data: monthlySales, label: 'Sales Count', color: '#00ffe7' }]}
              height={200}
            />
          </div>
          <div className="chart-container">
            <h3 className="chart-title">Monthly Revenue</h3>
            <LineChart
              xAxis={[{ data: Array.from({ length: 12 }, (_, i) => i + 1), label: 'Month' }]}
              series={[{ data: monthlyRevenue, label: 'Revenue (PKR)', color: '#ffea00' }]}
              height={200}
            />
          </div>
        </div>

        <div className="card card-compact mb-60">
          {recentSales.length > 0 ? recentSales.map((sale, i) => (
            <div key={i} className="card-list-item" style={{
              animation: `cardFadeIn 0.6s ease-out ${0.2 + i * 0.1}s both`
            }}>
              <div>
                <div className="sales-game-title">{sale.game}</div>
                <div className="sales-buyer">Buyer: {sale.buyer}</div>
              </div>
              <div className="text-right">
                <div className="sales-amount">{formatPKR(sale.amount)}</div>
                <div className="sales-date">{sale.date}</div>
              </div>
            </div>
          )) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div>No sales yet. Start selling to see your sales data!</div>
            </div>
          )}
          <button className="game-btn mt-16">
            View All Sales
          </button>
        </div>

        {/* My Products */}
        <h2 className="section-title section-title-responsive">
          My Products
        </h2>
        <div className="games-grid mb-40">
          {displayProducts.map((game, i) => (
            <div key={game.id} className="game-card" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
              <div className="game-card-inner">
                <div className="game-card-bg"></div>
                {game.image && (
                  <img src={game.image} alt={game.title} className="game-image game-image-short" />
                )}
                <div className="game-tag">{game.genre}</div>
                <div className="game-title game-title-sm">{game.title}</div>
                <div className="game-price">{formatPKR(game.price)}</div>
                <div className="stock-info mt-8">
                  Stock: <span className={game.stock > 10 ? 'stock-high' : 'stock-low'}>{game.stock || 0}</span>
                </div>
                <div className="flex-gap-8 mt-12" style={{ display: 'flex' }}>
                  <button className="game-btn btn-flex-1 btn-small" onClick={() => navigate('/seller/products')}>Edit</button>
                  <button className="game-btn btn-flex-1 btn-small">Stats</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {myProducts.length === 0 ? (
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
            <div style={{ color: 'var(--text-dim)', marginBottom: '24px' }}>
              You haven't added any products yet
            </div>
            <button className="btn-primary" onClick={() => navigate('/seller/products')}>
              Add Your First Product
            </button>
          </div>
        ) : (
          <button className="btn-primary" onClick={() => navigate('/seller/products')} style={{ margin: '0 auto', display: 'block' }}>
            Manage All Products
          </button>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
