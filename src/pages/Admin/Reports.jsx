import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import '../Home.css';

const Reports = () => {
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
    { label: 'Total Revenue', value: '$45,678', change: '+12.5%', color: '#86efac', icon: '💰' },
    { label: 'Total Orders', value: '1,234', change: '+8.3%', color: '#00ffe7', icon: '📦' },
    { label: 'Active Users', value: '567', change: '+15.2%', color: '#ff00c8', icon: '👥' },
    { label: 'Conversion Rate', value: '3.42%', change: '+0.8%', color: '#ffea00', icon: '📈' },
  ];

  const topProducts = [
    { name: 'Elden Ring', sales: 234, revenue: '$14,040' },
    { name: 'Cyberpunk 2077', sales: 189, revenue: '$9,450' },
    { name: 'The Witcher 3', sales: 156, revenue: '$6,240' },
    { name: 'Red Dead Redemption 2', sales: 142, revenue: '$8,520' },
    { name: 'GTA V', sales: 128, revenue: '$3,840' },
  ];

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
                <div style={{ color: '#86efac', fontSize: '14px', marginTop: '8px' }}>{stat.change}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="section-title" style={{ fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: '32px' }}>
          Top Selling Products
        </h2>

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  color: 'var(--bg)'
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ color: 'var(--text)', fontWeight: '600', marginBottom: '4px' }}>{product.name}</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '14px' }}>{product.sales} sales</div>
                </div>
              </div>
              <div style={{ color: '#86efac', fontWeight: '700', fontSize: '18px' }}>{product.revenue}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
