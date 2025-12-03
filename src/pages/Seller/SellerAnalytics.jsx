import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import '../Home.css';
import { BarChart, LineChart } from '@mui/x-charts';
import PageHeading from '../../components/PageHeading';
import { formatPKR } from "../../utils/currency";

const SellerAnalytics = () => {
  const [scrollY, setScrollY] = useState(0);
  const { user } = useUser();
  const navigate = useNavigate();

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

  const stats = [
    { label: 'Total Sales', value: '156', change: '+12', color: '#00ffe7', icon: '📊' },
    { label: 'Revenue', value: 12450, change: '+1234', color: '#86efac', icon: '💰', currency: true },
    { label: 'Products', value: '12', change: '+2', color: '#ff00c8', icon: '🎮' },
    { label: 'Avg Rating', value: '4.8★', change: '+0.2', color: '#ffea00', icon: '⭐' },
  ];

  const topProducts = [
    { name: 'Elden Ring', sales: 45, revenue: 2695, rating: '4.9★' },
    { name: 'Cyberpunk 2077', sales: 38, revenue: 1900, rating: '4.7★' },
    { name: 'The Witcher 3', sales: 32, revenue: 1280, rating: '4.8★' },
    { name: 'Red Dead Redemption 2', sales: 25, revenue: 1500, rating: '4.9★' },
  ];

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>

      <div className="featured">
        <PageHeading title="Sales" highlight="Analytics" align="left" />

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
                <div className="game-price" style={{ color: stat.color, marginTop: '12px' }}>{stat.currency ? formatPKR(stat.value) : stat.value}</div>
                <div style={{ color: '#86efac', fontSize: '14px', marginTop: '8px' }}>{stat.currency ? `+${formatPKR(Number(stat.change))}` : stat.change}</div>
              </div>
            </div>
          ))}
        </div>

        <PageHeading title="Top Performing" highlight="Products" align="left" />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '16px' }}>
            <LineChart
              xAxis={[{ data: Array.from({ length: 12 }, (_, i) => i + 1), label: 'Month' }]}
              series={[{ data: [12,18,22,25,28,30,35,33,31,29,27,24], label: 'Orders' }]}
              height={240}
            />
          </div>
          <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '16px' }}>
            <BarChart
              xAxis={[{ data: topProducts.map(t => t.name), label: 'Product' }]}
              series={[{ data: topProducts.map(t => t.revenue), label: 'Revenue (PKR)' }]}
              height={240}
            />
          </div>
        </div>

        <div style={{
          background: 'rgba(17, 24, 39, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '24px',
          backdropFilter: 'blur(20px)'
        }}>
          {topProducts.map((product, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              borderBottom: i < topProducts.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
              animation: `cardFadeIn 0.6s ease-out ${0.4 + i * 0.1}s both`
            }}>
              <div>
                <div style={{ color: 'var(--text)', fontWeight: '600', marginBottom: '4px' }}>{product.name}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '14px' }}>{product.sales} sales</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#86efac', fontWeight: '700', marginBottom: '4px' }}>{formatPKR(product.revenue)}</div>
                <div style={{ color: '#ffea00', fontSize: '14px' }}>{product.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;
