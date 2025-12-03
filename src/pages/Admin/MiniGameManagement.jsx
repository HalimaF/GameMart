import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import '../Home.css';
import PageHeading from "../../components/PageHeading";

const MiniGameManagement = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'Easy',
    points: '',
    image: ''
  });
  const { user } = useUser();
  const navigate = useNavigate();

  // Sample minigames data
  const [minigames] = useState([
    { id: 1, name: 'Snake Game', difficulty: 'Easy', points: 100, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400' },
    { id: 2, name: 'Memory Match', difficulty: 'Medium', points: 200, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400' },
    { id: 3, name: 'Puzzle Quest', difficulty: 'Hard', points: 300, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400' },
  ]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New MiniGame:', formData);
    // Save to database/localStorage here
    setShowAddModal(false);
    setFormData({ name: '', description: '', difficulty: 'Easy', points: '', image: '' });
    setImagePreview(null);
  };

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>

      <div className="featured">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ flex: 1 }}>
            <PageHeading title="MiniGame Management" subtitle="Add and manage mini games" align="left" />
          </div>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add New MiniGame</button>
        </div>

        <div className="games-grid">
          {minigames.map((game, i) => (
            <div key={game.id} className="game-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="game-card-inner">
                <div className="game-card-bg"></div>
                {game.image && (
                  <img src={game.image} alt={game.name} style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    marginBottom: '16px'
                  }} />
                )}
                <div className="game-tag" style={{ 
                  background: game.difficulty === 'Easy' ? 'rgba(134, 239, 172, 0.2)' : 
                              game.difficulty === 'Medium' ? 'rgba(255, 234, 0, 0.2)' : 
                              'rgba(239, 68, 68, 0.2)',
                  borderColor: game.difficulty === 'Easy' ? 'rgba(134, 239, 172, 0.5)' : 
                               game.difficulty === 'Medium' ? 'rgba(255, 234, 0, 0.5)' : 
                               'rgba(239, 68, 68, 0.5)',
                  color: game.difficulty === 'Easy' ? '#86efac' : 
                         game.difficulty === 'Medium' ? '#ffea00' : '#ef4444'
                }}>
                  {game.difficulty}
                </div>
                <div className="game-title" style={{ fontSize: '20px', marginTop: '12px' }}>{game.name}</div>
                <div style={{ color: 'var(--primary)', fontSize: '18px', fontWeight: '700', marginTop: '8px' }}>
                  {game.points} points
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button className="game-btn" style={{ flex: 1 }}>Edit</button>
                  <button className="game-btn" style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add MiniGame Modal */}
        {showAddModal && (
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
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ color: 'var(--text)', marginBottom: '24px', fontSize: '28px' }}>
                Add New <span className="gradient-text">MiniGame</span>
              </h2>
              
              <form onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: 'var(--text)', marginBottom: '8px', fontWeight: '600' }}>
                    Game Image *
                  </label>
                  <div style={{
                    border: '2px dashed rgba(255, 0, 200, 0.3)',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    background: 'rgba(255, 0, 200, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 0, 200, 0.3)'}
                  >
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                      id="minigame-image"
                      required
                    />
                    <label htmlFor="minigame-image" style={{ cursor: 'pointer' }}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                      ) : (
                        <>
                          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎮</div>
                          <div style={{ color: 'var(--accent)', fontWeight: '600', marginBottom: '4px' }}>
                            Click to upload image
                          </div>
                          <div style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
                            PNG, JPG, GIF up to 10MB
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'var(--text)', marginBottom: '8px', fontWeight: '600' }}>
                    Game Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    placeholder="Enter game name"
                  />
                </div>

                {/* Description */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'var(--text)', marginBottom: '8px', fontWeight: '600' }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                    placeholder="Brief description of the game"
                  />
                </div>

                {/* Difficulty & Points */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: 'var(--text)', marginBottom: '8px', fontWeight: '600' }}>
                      Difficulty *
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
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
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: 'var(--text)', marginBottom: '8px', fontWeight: '600' }}>
                      Points Reward *
                    </label>
                    <input
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: e.target.value })}
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
                      placeholder="100"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                    Add MiniGame
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({ name: '', description: '', difficulty: 'Easy', points: '', image: '' });
                      setImagePreview(null);
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

export default MiniGameManagement;
