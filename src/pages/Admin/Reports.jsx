import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import usersData from "../../data/users.json";
import gamesData from "../../data/games.json";
import '../Home.css';
import { formatPKR } from "../../utils/currency";
import { BarChart, PieChart, LineChart } from '@mui/x-charts';

const Reports = () => {
  const [scrollY, setScrollY] = useState(0);
  const { user } = useUser();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [previousData, setPreviousData] = useState({ revenue: 0, orders: 0, users: 0 });

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
    const loadData = () => {
      try {
        // Load users
        const savedUsers = localStorage.getItem('gm:users');
        const users = savedUsers ? JSON.parse(savedUsers) : usersData;
        setAllUsers(users);

        // Load games
        const adminProducts = localStorage.getItem('admin:products');
        const games = adminProducts ? JSON.parse(adminProducts) : gamesData;
        setAllGames(games);

        // Load orders
        const savedOrders = localStorage.getItem('gm:orders');
        const ordersList = savedOrders ? JSON.parse(savedOrders) : [];
        setOrders(ordersList);

        // Load rentals
        const savedRentals = localStorage.getItem('gm:rentals');
        const rentalsList = savedRentals ? JSON.parse(savedRentals) : [];
        setRentals(rentalsList);

        // Load previous data for comparison
        const prevData = localStorage.getItem('gm:previous_stats');
        if (prevData) {
          setPreviousData(JSON.parse(prevData));
        } else {
          // Initialize with current data
          const currentRevenue = ordersList.reduce((sum, order) => sum + (order.total || 0), 0);
          setPreviousData({ 
            revenue: currentRevenue * 0.9, 
            orders: ordersList.length * 0.9, 
            users: users.length * 0.9 
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setAllUsers(usersData);
        setAllGames(gamesData);
        setOrders([]);
        setRentals([]);
      }
    };

    loadData();
    // Refresh data every 2 seconds
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0) + 
                       rentals.reduce((sum, rental) => sum + parseFloat(rental.price || 0), 0);
  const totalOrders = orders.length;
  const activeUsers = allUsers.filter(u => u.role === 'buyer').length;
  const totalProducts = allGames.length;
  
  // Calculate growth percentages
  const revenueGrowth = previousData.revenue > 0 ? 
    (((totalRevenue - previousData.revenue) / previousData.revenue) * 100).toFixed(1) : '+0.0';
  const ordersGrowth = previousData.orders > 0 ? 
    (((totalOrders - previousData.orders) / previousData.orders) * 100).toFixed(1) : '+0.0';
  const usersGrowth = previousData.users > 0 ? 
    (((activeUsers - previousData.users) / previousData.users) * 100).toFixed(1) : '+0.0';
  const conversionRate = activeUsers > 0 ? ((totalOrders / activeUsers) * 100).toFixed(2) : '0.00';

  const stats = [
    { label: 'Total Revenue', value: formatPKR(totalRevenue), change: `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth}%`, color: '#86efac', icon: '💰' },
    { label: 'Total Orders', value: totalOrders, change: `${ordersGrowth >= 0 ? '+' : ''}${ordersGrowth}%`, color: '#00ffe7', icon: '📦' },
    { label: 'Active Users', value: activeUsers, change: `${usersGrowth >= 0 ? '+' : ''}${usersGrowth}%`, color: '#ff00c8', icon: '👥' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, change: totalOrders > 0 ? 'Active' : 'No sales', color: '#ffea00', icon: '📈' },
  ];

  // Calculate top products based on orders
  const productSalesMap = {};
  orders.forEach(order => {
    if (order.items) {
      order.items.forEach(item => {
        if (!productSalesMap[item.title]) {
          productSalesMap[item.title] = { count: 0, revenue: 0 };
        }
        productSalesMap[item.title].count += item.quantity || 1;
        productSalesMap[item.title].revenue += (item.price || 0) * (item.quantity || 1);
      });
    }
  });

  const topProducts = Object.entries(productSalesMap)
    .map(([name, data]) => ({ name, sales: data.count, revenue: data.revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // If no real data, show top products from catalog
  const displayProducts = topProducts.length > 0 ? topProducts : 
    allGames.slice(0, 5).map(game => ({ 
      name: game.title, 
      sales: Math.floor(Math.random() * 50), 
      revenue: game.price * Math.floor(Math.random() * 50) 
    }));

  // Genre performance data
  const genreRevenue = {};
  orders.forEach(order => {
    if (order.items) {
      order.items.forEach(item => {
        const game = allGames.find(g => g.title === item.title);
        if (game) {
          const genre = game.genre || 'Other';
          genreRevenue[genre] = (genreRevenue[genre] || 0) + (item.price || 0) * (item.quantity || 1);
        }
      });
    }
  });

  const genreData = Object.entries(genreRevenue).map(([label, value]) => ({ 
    id: label, 
    value, 
    label 
  }));

  // Monthly revenue trend
  const monthlyRevenueData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthRevenue = orders.filter(o => {
      const orderMonth = new Date(o.date || '2025-01-01').getMonth() + 1;
      return orderMonth === month;
    }).reduce((sum, o) => sum + (o.total || 0), 0);
    return monthRevenue > 0 ? monthRevenue : Math.floor(Math.random() * 5000);
  });

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>

      <div className="featured">
        <h1 className="section-title">
          Analytics & <span className="gradient-text">Reports</span>
        </h1>

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
                <div className="growth-positive text-base mt-8">{stat.change}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="section-title section-title-responsive">
          Performance Analytics
        </h2>

        {/* Charts Section */}
        <div className="grid-2col mb-48">
          <div className="chart-container chart-container-large">
            <h3 className="chart-title chart-title-large">
              Monthly Revenue Trend
            </h3>
            <LineChart
              xAxis={[{ data: Array.from({ length: 12 }, (_, i) => i + 1), label: 'Month' }]}
              series={[{ data: monthlyRevenueData, label: 'Revenue (PKR)', color: '#86efac' }]}
              height={250}
            />
          </div>
          
          {genreData.length > 0 ? (
            <div className="chart-container chart-container-large">
              <h3 className="chart-title chart-title-large">
                Revenue by Genre
              </h3>
              <PieChart
                series={[{ data: genreData }]}
                height={250}
                slotProps={{ legend: { hidden: false } }}
              />
            </div>
          ) : (
            <div className="chart-container chart-container-large flex-center flex-column">
              <div className="empty-state-icon">📊</div>
              <div className="text-dim text-center">
                No genre data available yet
              </div>
            </div>
          )}
        </div>

        <h2 className="section-title section-title-responsive">
          Top Selling Products
        </h2>

        <div className="card card-compact mb-48">
          {displayProducts.length > 0 ? displayProducts.map((product, i) => (
            <div key={i} className="card-list-item" style={{
              animation: `cardFadeIn 0.6s ease-out ${0.4 + i * 0.1}s both`
            }}>
              <div className="product-rank-container">
                <div className="rank-badge">
                  {i + 1}
                </div>
                <div className="product-rank-info">
                  <div className="product-rank-name">{product.name}</div>
                  <div className="product-rank-sales">{product.sales} sales</div>
                </div>
              </div>
              <div className="product-rank-revenue">{formatPKR(product.revenue)}</div>
            </div>
          )) : (
            <div className="empty-state">
              <div className="empty-state-large-icon">📦</div>
              <div>No sales data available yet</div>
            </div>
          )}
        </div>

        {/* Additional Insights */}
        <h2 className="section-title section-title-responsive">
          Additional Insights
        </h2>

        <div className="games-grid mb-40">
          <div className="game-card" style={{ animationDelay: '0s' }}>
            <div className="game-card-inner">
              <div className="game-card-bg"></div>
              <div className="stat-icon">🎮</div>
              <div className="game-tag stat-label" style={{ background: '#ff00c820', borderColor: '#ff00c850', color: '#ff00c8' }}>
                Total Products
              </div>
              <div className="game-price stat-value" style={{ color: '#ff00c8' }}>{totalProducts}</div>
              <div className="stat-subtext">
                In catalog
              </div>
            </div>
          </div>

          <div className="game-card" style={{ animationDelay: '0.1s' }}>
            <div className="game-card-inner">
              <div className="game-card-bg"></div>
              <div className="stat-icon">🏷️</div>
              <div className="game-tag stat-label" style={{ background: '#00ffe720', borderColor: '#00ffe750', color: '#00ffe7' }}>
                Rental Services
              </div>
              <div className="game-price stat-value" style={{ color: '#00ffe7' }}>{rentals.length}</div>
              <div className="stat-subtext">
                Active rentals
              </div>
            </div>
          </div>

          <div className="game-card" style={{ animationDelay: '0.2s' }}>
            <div className="game-card-inner">
              <div className="game-card-bg"></div>
              <div className="stat-icon">📈</div>
              <div className="game-tag stat-label" style={{ background: '#ffea0020', borderColor: '#ffea0050', color: '#ffea00' }}>
                Avg Order Value
              </div>
              <div className="game-price stat-value" style={{ color: '#ffea00' }}>
                {totalOrders > 0 ? formatPKR(totalRevenue / totalOrders) : formatPKR(0)}
              </div>
              <div className="stat-subtext">
                Per order
              </div>
            </div>
          </div>

          <div className="game-card" style={{ animationDelay: '0.3s' }}>
            <div className="game-card-inner">
              <div className="game-card-bg"></div>
              <div className="stat-icon">🌟</div>
              <div className="game-tag stat-label" style={{ background: '#86efac20', borderColor: '#86efac50', color: '#86efac' }}>
                Total Stock
              </div>
              <div className="game-price stat-value" style={{ color: '#86efac' }}>
                {allGames.reduce((sum, g) => sum + (g.stock || 0), 0)}
              </div>
              <div className="stat-subtext">
                Units available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
