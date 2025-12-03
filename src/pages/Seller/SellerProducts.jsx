import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatPKR } from "../../utils/currency";
import { useUser } from "../../context/UserContext";
import games from "../../data/games.json";
import '../Home.css';
import PageHeading from '../../components/PageHeading';

const SellerProducts = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    console: 'PS5',
    genre: 'Action',
    price: '',
    stock: '',
    image: ''
  });
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

  const [myProducts, setMyProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('seller:products');
      return saved ? JSON.parse(saved) : games.slice(0, 8);
    } catch { return games.slice(0, 8); }
  });

  useEffect(() => {
    try { localStorage.setItem('seller:products', JSON.stringify(myProducts)); } catch {}
  }, [myProducts]);

  const onEdit = (game) => {
    setEditingId(game.id);
    setFormData({
      title: game.title || '',
      console: game.console || 'PS5',
      genre: game.genre || 'Action',
      price: game.price || '',
      stock: game.stock || '',
      image: game.image || ''
    });
    setImagePreview(game.image || null);
    setShowAddModal(true);
  };

  const onDelete = (id) => {
    setMyProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setMyProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...formData, id: editingId } : p));
    } else {
      const newProd = { ...formData, id: Date.now() };
      setMyProducts(prev => [newProd, ...prev]);
    }
    setShowAddModal(false);
    setEditingId(null);
    setFormData({ title: '', console: 'PS5', genre: 'Action', price: '', stock: '', image: '' });
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
          <PageHeading title="My" highlight="Products" center={false} />
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add New Product</button>
        </div>

        <div className="games-grid">
          {myProducts.map((game, i) => (
            <div key={game.id} className="game-card" style={{ animationDelay: `${i * 0.1}s` }}>
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
                  Stock: <span style={{ color: game.stock > 10 ? '#86efac' : '#fca5a5', fontWeight: '600' }}>{game.stock}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button className="game-btn" onClick={() => onEdit(game)} style={{ flex: 1, padding: '10px', fontSize: '13px' }}>Edit</button>
                  <button className="game-btn" onClick={() => onDelete(game.id)} style={{ flex: 1, padding: '10px', fontSize: '13px', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Add Product Modal */}
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
                {editingId ? 'Edit' : 'Add New'} <span className="gradient-text">Product</span>
              </h2>
              
              <form onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: 'var(--text)', marginBottom: '8px', fontWeight: '600' }}>
                    Product Image *
                  </label>
                  <div style={{
                    border: '2px dashed rgba(0, 255, 231, 0.3)',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    background: 'rgba(0, 255, 231, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 255, 231, 0.3)'}
                  >
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                      id="product-image"
                      required
                    />
                    <label htmlFor="product-image" style={{ cursor: 'pointer' }}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                      ) : (
                        <>
                          <div style={{ fontSize: '48px', marginBottom: '8px' }}>📸</div>
                          <div style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '4px' }}>
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

                {/* Title */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'var(--text)', marginBottom: '8px', fontWeight: '600' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    placeholder="Enter product title"
                  />
                </div>

                {/* Console & Genre */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: 'var(--text)', marginBottom: '8px', fontWeight: '600' }}>
                      Console *
                    </label>
                    <select
                      value={formData.console}
                      onChange={(e) => setFormData({ ...formData, console: e.target.value })}
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
                      <option value="PS5">PS5</option>
                      <option value="PS4">PS4</option>
                      <option value="Xbox Series X">Xbox Series X</option>
                      <option value="Xbox One">Xbox One</option>
                      <option value="PC">PC</option>
                      <option value="Nintendo Switch">Nintendo Switch</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: 'var(--text)', marginBottom: '8px', fontWeight: '600' }}>
                      Genre *
                    </label>
                    <select
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
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
                      <option value="Action">Action</option>
                      <option value="Adventure">Adventure</option>
                      <option value="RPG">RPG</option>
                      <option value="Sports">Sports</option>
                      <option value="Racing">Racing</option>
                      <option value="Fighting">Fighting</option>
                      <option value="Shooter">Shooter</option>
                      <option value="Horror">Horror</option>
                    </select>
                  </div>
                </div>

                {/* Price & Stock */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: 'var(--text)', marginBottom: '8px', fontWeight: '600' }}>
                      Price (PKR) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                      placeholder="59.99"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: 'var(--text)', marginBottom: '8px', fontWeight: '600' }}>
                      Stock *
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
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
                      placeholder="50"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                    Add Product
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingId(null);
                      setFormData({ title: '', console: 'PS5', genre: 'Action', price: '', stock: '', image: '' });
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
export default SellerProducts;
