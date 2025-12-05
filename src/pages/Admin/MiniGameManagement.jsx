import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import minigamesData from "../../data/minigames.json";
import '../Home.css';
import PageHeading from "../../components/PageHeading";

const API_URL = 'http://localhost:5000/api';

const MiniGameManagement = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    src: '',
    category: 'Arcade',
    tags: '',
    thumbnail: '',
    allowSameOriginSandbox: true
  });
  const { user } = useUser();
  const navigate = useNavigate();
  const [minigames, setMinigames] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const loadGames = async () => {
      try {
        // Try to fetch from backend first
        const response = await fetch(`${API_URL}/minigames`);
        if (response.ok) {
          const data = await response.json();
          setMinigames(data);
          // Also update localStorage for offline access
          localStorage.setItem('gm:minigames', JSON.stringify(data));
        } else {
          // Fallback to localStorage
          const saved = localStorage.getItem('gm:minigames');
          setMinigames(saved ? JSON.parse(saved) : minigamesData);
        }
      } catch (error) {
        console.error('Error loading minigames:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem('gm:minigames');
        setMinigames(saved ? JSON.parse(saved) : minigamesData);
      }
    };
    
    loadGames();
    const interval = setInterval(loadGames, 3000);
    return () => clearInterval(interval);
  }, []);

  const saveMinigames = async (games) => {
    try {
      setLoading(true);
      // Save to backend
      const response = await fetch(`${API_URL}/minigames`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(games)
      });
      
      if (response.ok) {
        // Also save to localStorage
        localStorage.setItem('gm:minigames', JSON.stringify(games));
        setMinigames(games);
      } else {
        // If backend fails, still save to localStorage
        localStorage.setItem('gm:minigames', JSON.stringify(games));
        setMinigames(games);
      }
    } catch (error) {
      console.error('Error saving minigames:', error);
      // Fallback to localStorage only
      localStorage.setItem('gm:minigames', JSON.stringify(games));
      setMinigames(games);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (game) => {
    setEditingId(game.id);
    setFormData({
      title: game.title || '',
      src: game.src || '',
      category: game.category || 'Arcade',
      tags: Array.isArray(game.tags) ? game.tags.join(', ') : '',
      thumbnail: game.thumbnail || '',
      allowSameOriginSandbox: game.allowSameOriginSandbox !== false
    });
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this mini game?')) {
      const updated = minigames.filter(g => g.id !== id);
      saveMinigames(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const gameData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      id: editingId || `game-${Date.now()}`
    };

    if (editingId) {
      // Update existing game
      const updated = minigames.map(g => g.id === editingId ? gameData : g);
      saveMinigames(updated);
    } else {
      // Add new game
      saveMinigames([...minigames, gameData]);
    }

    setShowAddModal(false);
    setEditingId(null);
    setFormData({ title: '', src: '', category: 'Arcade', tags: '', thumbnail: '', allowSameOriginSandbox: true });
  };

  const categories = ['Arcade', 'Puzzle', 'Racing', 'Action', 'FPS', 'Third-Person', 'City-Building', 'Shoot \'em up', 'Real-Time strategies', 'Turn-Based strategies'];

  const getDifficultyByCategory = (category) => {
    const difficultyMap = {
      'Arcade': 'Easy',
      'Puzzle': 'Medium',
      'Racing': 'Medium',
      'Action': 'Hard',
      'FPS': 'Hard',
      'Third-Person': 'Hard',
      'City-Building': 'Medium',
      'Shoot \'em up': 'Hard',
      'Real-Time strategies': 'Hard',
      'Turn-Based strategies': 'Medium'
    };
    return difficultyMap[category] || 'Easy';
  };

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>

      <div className="featured">
        <div className="flex-between mb-32">
          <div className="flex-1">
            <PageHeading title="MiniGame Management" align="left" />
          </div>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add New MiniGame</button>
        </div>

        <div className="games-grid">
          {minigames.map((game, i) => {
            const difficulty = getDifficultyByCategory(game.category);
            return (
              <div key={game.id} className="game-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="game-card-inner">
                  <div className="game-card-bg"></div>
                  {game.thumbnail ? (
                    <img src={game.thumbnail} alt={game.title} className="game-image game-image-tall" />
                  ) : (
                    <div className="minigame-placeholder">
                      🎮
                    </div>
                  )}
                  <div className={`game-tag ${
                    difficulty === 'Easy' ? 'difficulty-easy' : 
                    difficulty === 'Medium' ? 'difficulty-medium' : 
                    'difficulty-hard'
                  }`}>
                    {game.category}
                  </div>
                  <div className="game-title game-title-sm">{game.title}</div>
                  <div className="tag-container">
                    {game.tags && game.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="tag-badge">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="button-group-spaced">
                    <button className="game-btn btn-flex-1" onClick={() => handleEdit(game)}>Edit</button>
                    <button 
                      className="game-btn btn-flex-1 btn-delete" 
                      onClick={() => handleDelete(game.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add/Edit MiniGame Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2 className="modal-title">
                {editingId ? 'Edit' : 'Add New'} <span className="gradient-text">MiniGame</span>
              </h2>
              
              <form onSubmit={handleSubmit}>
                {/* Game Title */}
                <div className="form-group">
                  <label className="form-label">
                    Game Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="form-input"
                    placeholder="e.g., Floppy Bird"
                  />
                </div>

                {/* Game URL/Embed Link */}
                <div className="form-group">
                  <label className="form-label">
                    Game URL (Embed Link) *
                  </label>
                  <input
                    type="url"
                    value={formData.src}
                    onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                    required
                    className="form-input"
                    placeholder="https://example.com/game"
                  />
                  <div className="form-hint">
                    Enter the direct URL to embed the game
                  </div>
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="form-label">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div className="form-group">
                  <label className="form-label">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="form-input"
                    placeholder="e.g., arcade, flappy, bird"
                  />
                </div>

                {/* Thumbnail URL */}
                <div className="form-group">
                  <label className="form-label">
                    Thumbnail URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.thumbnail && (
                    <div className="mt-12">
                      <img 
                        src={formData.thumbnail} 
                        alt="Preview" 
                        className="upload-preview"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>

                {/* Allow Same Origin Sandbox */}
                <div className="mb-24">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.allowSameOriginSandbox}
                      onChange={(e) => setFormData({ ...formData, allowSameOriginSandbox: e.target.checked })}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">
                      Allow Same Origin Sandbox
                    </span>
                  </label>
                  <div className="checkbox-hint">
                    Enable if the game requires same-origin access
                  </div>
                </div>

                {/* Buttons */}
                <div className="button-group">
                  <button type="submit" className="btn-primary btn-flex-1">
                    {editingId ? 'Update MiniGame' : 'Add MiniGame'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingId(null);
                      setFormData({ title: '', src: '', category: 'Arcade', tags: '', thumbnail: '', allowSameOriginSandbox: true });
                    }}
                    className="game-btn btn-flex-1"
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
