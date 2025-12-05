import { useState, useEffect } from "react";
import { formatPKR } from "../utils/currency";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import games from "../data/games.json";
import './Home.css';
import PageHeading from '../components/PageHeading';

const Rental = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [rentalDuration, setRentalDuration] = useState('3');
  const [rentalDate, setRentalDate] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Allow viewing rentals without login; set default start date
    const today = new Date().toISOString().split('T')[0];
    setRentalDate(today);
  }, []);

  const handleRentNow = (game) => {
    setSelectedGame(game);
    setShowRentalModal(true);
  };

  const calculateRentalPrice = (basePrice, days) => {
    // Rental price is 20% of base price per day, with discounts for longer periods
    const dailyRate = basePrice * 0.2;
    let total = dailyRate * parseInt(days);
    
    // Apply discounts
    if (days >= 7) total *= 0.85; // 15% discount for week+
    if (days >= 14) total *= 0.8; // Additional 20% for 2 weeks+
    
    return total.toFixed(2);
  };

  const handleSubmitRental = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to confirm your rental.');
      navigate('/login');
      return;
    }
    const rental = {
      gameId: selectedGame.id,
      gameTitle: selectedGame.title,
      duration: rentalDuration,
      startDate: rentalDate,
      price: calculateRentalPrice(selectedGame.price, rentalDuration),
      status: 'Active'
    };
    
    // Save to localStorage
    const existingRentals = JSON.parse(localStorage.getItem('gm:rentals') || '[]');
    existingRentals.push(rental);
    localStorage.setItem('gm:rentals', JSON.stringify(existingRentals));
    
    setShowRentalModal(false);
    alert(`Successfully rented ${selectedGame.title} for ${rentalDuration} days!`);
  };

  const rentalGames = games.filter(g => g.stock > 0);

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>

      <div className="featured">
        <PageHeading 
          title="Game" 
          highlight="Rental" 
          subtitle="Rent games starting from 20% of the price per day 📅" 
        />

        {/* Rental Info Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {[
            { title: 'Daily Rate', desc: '20% of game price', icon: '💰', color: '#00ffe7' },
            { title: 'Weekly Discount', desc: '15% off 7+ days', icon: '📅', color: '#ff00c8' },
            { title: 'Bi-weekly Deal', desc: '20% off 14+ days', icon: '🎁', color: '#ffea00' },
            { title: 'Easy Returns', desc: 'Hassle-free process', icon: '✨', color: '#86efac' }
          ].map((info, i) => (
            <div key={i} className="game-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="game-card-inner">
                <div className="game-card-bg"></div>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{info.icon}</div>
                <div style={{ color: info.color, fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}>
                  {info.title}
                </div>
                <div style={{ color: 'var(--text-dim)', fontSize: '14px' }}>{info.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Available Games */}
        <h2 className="section-title" style={{ fontSize: 'clamp(28px, 5vw, 40px)', marginBottom: '32px' }}>
          Available for Rent
        </h2>
        <div className="games-grid">
          {rentalGames.map((game, i) => (
            <div key={game.id} className="game-card" style={{ animationDelay: `${0.4 + i * 0.05}s` }}>
              <div className="game-card-inner">
                <div className="game-card-bg"></div>
                {game.image && (
                  <img src={game.image} alt={game.title} style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    marginBottom: '12px'
                  }} />
                )}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <div className="game-tag" style={{ 
                    background: 'rgba(0, 255, 231, 0.2)', 
                    borderColor: 'rgba(0, 255, 231, 0.5)', 
                    color: '#00ffe7' 
                  }}>
                    {game.console}
                  </div>
                  <div className="game-tag" style={{ 
                    background: 'rgba(255, 0, 200, 0.2)', 
                    borderColor: 'rgba(255, 0, 200, 0.5)', 
                    color: '#ff00c8' 
                  }}>
                    {game.genre}
                  </div>
                </div>
                <div className="game-title" style={{ fontSize: '18px' }}>{game.title}</div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ color: 'var(--text-dim)', fontSize: '14px' }}>From</div>
                  <div className="game-price">{formatPKR(calculateRentalPrice(game.price, 1))}/day</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '4px' }}>
                    Full price: {formatPKR(game.price)}
                  </div>
                </div>
                <button 
                  className="game-btn" 
                  style={{ marginTop: '16px', width: '100%' }}
                  onClick={() => handleRentNow(game)}
                >
                  Rent Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Rental Modal */}
        {showRentalModal && selectedGame && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              background: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%'
            }}>
              <h2 style={{ color: 'var(--text)', marginBottom: '24px', fontSize: '28px' }}>
                Rent <span className="gradient-text">{selectedGame.title}</span>
              </h2>
              
              <form onSubmit={handleSubmitRental}>
                {/* Game Image */}
                <img src={selectedGame.image} alt={selectedGame.title} style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }} />

                {/* Rental Duration */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'var(--text)', marginBottom: '8px', fontWeight: '600' }}>
                    Rental Duration (days) *
                  </label>
                  <select
                    value={rentalDuration}
                    onChange={(e) => setRentalDuration(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '16px'
                    }}
                  >
                    <option value="1">1 day</option>
                    <option value="3">3 days</option>
                    <option value="5">5 days</option>
                    <option value="7">7 days (15% off)</option>
                    <option value="14">14 days (20% off)</option>
                    <option value="30">30 days (20% off)</option>
                  </select>
                </div>

                {/* Start Date */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'var(--text)', marginBottom: '8px', fontWeight: '600' }}>
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={rentalDate}
                    onChange={(e) => setRentalDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '16px'
                    }}
                  />
                </div>

                {/* Price Summary */}
                <div style={{
                  background: 'rgba(0, 255, 231, 0.1)',
                  border: '1px solid rgba(0, 255, 231, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Daily Rate:</span>
                    <span style={{ color: 'var(--text)' }}>{formatPKR(Math.round(selectedGame.price * 0.2))}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Duration:</span>
                    <span style={{ color: 'var(--text)' }}>{rentalDuration} days</span>
                  </div>
                  {parseInt(rentalDuration) >= 7 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#86efac' }}>Discount:</span>
                      <span style={{ color: '#86efac' }}>
                        {parseInt(rentalDuration) >= 14 ? '20%' : '15%'} off
                      </span>
                    </div>
                  )}
                  <div style={{ 
                    borderTop: '1px solid rgba(0, 255, 231, 0.3)', 
                    paddingTop: '12px',
                    marginTop: '12px',
                    display: 'flex', 
                    justifyContent: 'space-between' 
                  }}>
                    <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '18px' }}>Total:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '18px' }}>
                      {formatPKR(calculateRentalPrice(selectedGame.price, rentalDuration))}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                    Confirm Rental
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowRentalModal(false);
                      setSelectedGame(null);
                    }}
                    className="game-btn"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rental;
