import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { formatPKR } from '../utils/currency';

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredGames = [
    { id: 1, title: 'Cyberpunk 2077', price: 59.99, tag: 'RPG' },
    { id: 2, title: 'The Witcher 3', price: 39.99, tag: 'Adventure' },
    { id: 3, title: 'Red Dead Redemption 2', price: 49.99, tag: 'Action' },
    { id: 4, title: 'Elden Ring', price: 59.99, tag: 'Souls-like' },
    { id: 5, title: 'GTA V', price: 29.99, tag: 'Open World' },
    { id: 6, title: 'Minecraft', price: 26.99, tag: 'Sandbox' },
  ];

  return (
    <div className="home">
      {/* Animated Background */}
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.3}px)` }} />
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.2}px)` }} />
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }} />
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.5}px)`, opacity: 1 - scrollY / 500 }}>
          <h1 className="hero-title">
            <span className="gradient-text">GameMart</span>
          </h1>
          <p className="hero-subtitle">Your ultimate destination for premium games</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/store')}>
              Browse Store
            </button>
            <button className="btn-secondary" onClick={() => navigate('/minigames')}>
              Play Mini Games
            </button>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line" />
        </div>
      </section>

      {/* Featured Games */}
      <section className="featured">
        <h2 className="section-title">Featured Games</h2>
        <div className="games-grid">
          {featuredGames.map((game, i) => (
            <div
              key={game.id}
              className="game-card"
              style={{
                animationDelay: `${i * 0.1}s`,
                transform: `translateY(${Math.max(0, scrollY - 300) * -0.05}px)`,
              }}
            >
              <div className="game-card-inner">
                <div className="game-card-bg" />
                <span className="game-tag">{game.tag}</span>
                <h3 className="game-title">{game.title}</h3>
                <p className="game-price">{formatPKR(game.price)}</p>
                <button className="game-btn" onClick={() => navigate('/store')}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to level up?</h2>
          <p className="cta-text">Join thousands of gamers and start your adventure today</p>
          <button className="btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
