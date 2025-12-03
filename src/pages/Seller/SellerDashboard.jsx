import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import games from "../../data/games.json";
import '../Home.css';
import { formatPKR } from "../../utils/currency";

const SellerDashboard = () => {
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
    { label: 'Total Products', value: 12, color: '#00ffe7', icon: '🎮' },
    { label: 'Total Sales', value: 156, color: '#ff00c8', icon: '💳' },
    { label: 'Revenue', value: 12450, color: '#ffea00', icon: '💰', currency: true },
    { label: 'Rating', value: '4.8★', color: '#86efac', icon: '⭐' },
  ];

  const myProducts = games.slice(0, 6);

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
          <div style={{
            textAlign: 'center',
            marginBottom: '40px',
            color: 'var(--text-dim)'
          }}>
            Welcome back, <span className="gradient-text" style={{ fontWeight: '700' }}>{user.username}</span>
          </div>
        )}

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
                <div className="game-price" style={{ color: stat.color, marginTop: '12px' }}>{stat.currency ? formatPKR(stat.value) : stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Sales */}
        <h2 className="section-title" style={{ fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: '32px' }}>
          Recent Sales
        </h2>
        <div style={{
          background: 'rgba(17, 24, 39, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '24px',
          backdropFilter: 'blur(20px)',
          marginBottom: '60px'
        }}>
          {[
            { game: 'Elden Ring', buyer: 'GamerPro123', amount: 5999, date: '2 hours ago' },
            { game: 'Cyberpunk 2077', buyer: 'ProPlayer99', amount: 4999, date: '5 hours ago' },
            { game: 'The Witcher 3', buyer: 'GameMaster456', amount: 3999, date: '1 day ago' },
          ].map((sale, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              borderBottom: i < 2 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
              animation: `cardFadeIn 0.6s ease-out ${0.2 + i * 0.1}s both`
            }}>
              <div>
                <div style={{ color: 'var(--text)', fontWeight: '600', marginBottom: '4px' }}>{sale.game}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Buyer: {sale.buyer}</div>
              </div>
                <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#ffea00', fontWeight: '700', marginBottom: '4px' }}>{formatPKR(sale.amount)}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '12px' }}>{sale.date}</div>
              </div>
            </div>
          ))}
          <button className="game-btn" style={{ marginTop: '16px' }}>
            View All Sales
          </button>
        </div>

        {/* My Products */}
        <h2 className="section-title" style={{ fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: '32px' }}>
          My Products
        </h2>
        <div className="games-grid" style={{ marginBottom: '40px' }}>
          {myProducts.map((game, i) => (
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
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button className="game-btn" style={{ flex: 1, padding: '8px', fontSize: '13px' }}>Edit</button>
                  <button className="game-btn" style={{ flex: 1, padding: '8px', fontSize: '13px' }}>Stats</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="btn-primary" style={{ margin: '0 auto', display: 'block' }}>
          Add New Product
        </button>
      </div>
    </div>
  );
};

export default SellerDashboard;
