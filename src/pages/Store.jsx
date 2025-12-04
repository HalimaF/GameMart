import { useState, useEffect } from "react";
import { formatPKR } from "../utils/currency";
import gamesData from "../data/games.json";
// import GameCard from "../components/GameCard";
import { useUser } from "../context/UserContext";

const API_URL = 'http://localhost:5000/api';
// SellerProducts card layout for Store
const StoreGameCard = ({ game, onAddToCart, onRent }) => (
  <div className="game-card-inner">
    <div className="game-card-bg"></div>
    {game.image && (
      <img src={game.image} alt={game.title} style={{
        width: '100%',
        height: '160px',
        objectFit: 'cover',
        borderRadius: '12px',
        marginBottom: '12px'
      }} />
    )}
    <div className="game-tag">{game.genre}</div>
    <div className="game-title" style={{ fontSize: '18px', marginTop: '8px' }}>{game.title}</div>
    <div className="game-price" style={{ marginTop: '8px' }}>{formatPKR(game.price)}</div>
    <div style={{ color: 'var(--text-dim)', fontSize: '14px', marginTop: '4px' }}>
      Console: <span style={{ color: '#00ffe7', fontWeight: '600' }}>{game.console}</span>
    </div>
    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
      <a href={`/game/${game.id}`} className="game-btn" style={{ flex: 1, padding: '10px', fontSize: '13px', textAlign: 'center' }}>Details</a>
      <button className="game-btn" style={{ flex: 1, padding: '10px', fontSize: '13px', background: 'rgba(134,239,172,0.1)', borderColor: 'rgba(134,239,172,0.3)' }} onClick={() => onAddToCart(game)}>
        Add to Cart
      </button>
    </div>
    <button className="game-btn" style={{ width: '100%', padding: '10px', fontSize: '13px', marginTop: '8px', background: 'rgba(0,255,231,0.1)', borderColor: 'rgba(0,255,231,0.3)' }} onClick={() => onRent(game)}>
      Rent
    </button>
  </div>
);
import './Home.css';
import PageHeading from '../components/PageHeading';

const Store = () => {
  const [scrollY, setScrollY] = useState(0);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load games from backend API and localStorage
  useEffect(() => {
    const loadGames = async () => {
      try {
        // Try to fetch from backend first
        const response = await fetch(`${API_URL}/products`);
        if (response.ok) {
          const data = await response.json();
          setGames(data);
          localStorage.setItem('admin:products', JSON.stringify(data));
        } else {
          // Fallback to localStorage
          const adminProducts = localStorage.getItem('admin:products');
          const sellerProducts = localStorage.getItem('seller:products');
          
          let allGames = [];
          
          if (adminProducts) {
            allGames = [...allGames, ...JSON.parse(adminProducts)];
          }
          if (sellerProducts) {
            allGames = [...allGames, ...JSON.parse(sellerProducts)];
          }
          
          if (allGames.length === 0) {
            allGames = gamesData;
          }
          
          setGames(allGames);
        }
      } catch (error) {
        console.error('Error loading games:', error);
        // Fallback to localStorage
        const adminProducts = localStorage.getItem('admin:products');
        const sellerProducts = localStorage.getItem('seller:products');
        
        let allGames = [];
        
        if (adminProducts) {
          allGames = [...allGames, ...JSON.parse(adminProducts)];
        }
        if (sellerProducts) {
          allGames = [...allGames, ...JSON.parse(sellerProducts)];
        }
        
        if (allGames.length === 0) {
          allGames = gamesData;
        }
        
        setGames(allGames);
      }
    };
    
    loadGames();
    const interval = setInterval(loadGames, 3000);
    return () => clearInterval(interval);
  }, []);

  const { user } = useUser();
  
  const handleAddToCart = (game) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      const cart = JSON.parse(localStorage.getItem('gm:cart') || '[]');
      const existing = cart.find(item => item.id === game.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({ ...game, quantity: 1 });
      }
      localStorage.setItem('gm:cart', JSON.stringify(cart));
      alert('Added to cart!');
    } catch {}
  };

  const handleRent = (game) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    // Save rental info to localStorage and redirect to rental page
    localStorage.setItem('gm:rental', JSON.stringify({ ...game, rentedBy: user.username, rentedAt: Date.now() }));
    window.location.href = '/rental';
  };

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>

      <div className="featured">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '32px' }}>
          <PageHeading title="" highlight="Store" center={false} />
          <div style={{ color: 'var(--text-dim)' }}>{games.length} games</div>
        </div>
        <div className="games-grid">
          {games.map((game, i) => (
            <div key={game.id} className="game-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <StoreGameCard game={game} onAddToCart={handleAddToCart} onRent={handleRent} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;
