import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { formatPKR } from "../../utils/currency";
import games from "../../data/games.json";
import '../Home.css';
import PageHeading from '../../components/PageHeading';

const API_URL = 'http://localhost:5000/api';

const ProductManagement = () => {
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
  const [products, setProducts] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Load all products from backend ONLY on mount (no auto-refresh)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (response.ok) {
          const allProducts = await response.json();
          
          // Check if products need seller info initialization
          const needsInit = allProducts.length > 0 && !allProducts[0].sellerName;
          
          if (needsInit) {
            const initializedProducts = allProducts.map(g => ({ 
              ...g, 
              sellerName: g.sellerName || 'Admin', 
              sellerRole: g.sellerRole || 'admin' 
            }));
            setProducts(initializedProducts);
            localStorage.setItem('gamemart:products', JSON.stringify(initializedProducts));
            // Save back to backend with seller info
            await fetch(`${API_URL}/products`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(initializedProducts)
            });
          } else {
            setProducts(allProducts);
            localStorage.setItem('gamemart:products', JSON.stringify(allProducts));
          }
        } else {
          const saved = localStorage.getItem('gamemart:products');
          if (saved) {
            setProducts(JSON.parse(saved));
          } else {
            // Initialize with games.json marked as admin products
            const initialGames = games.map(g => ({ ...g, sellerName: 'Admin', sellerRole: 'admin' }));
            setProducts(initialGames);
            // Save to backend
            await fetch(`${API_URL}/products`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(initialGames)
            });
          }
        }
      } catch (error) {
        console.error('❌ Error loading products:', error);
        const saved = localStorage.getItem('gamemart:products');
        setProducts(saved ? JSON.parse(saved) : games.map(g => ({ ...g, sellerName: 'Admin', sellerRole: 'admin' })));
      }
      setHasLoaded(true);
    };
    loadProducts();
    
    // NO AUTO-REFRESH - only load on mount to prevent overwriting
  }, []);
  
  // Save to backend whenever products change (but only after initial load)
  useEffect(() => {
    if (!hasLoaded || products.length === 0) {
      return;
    }
    
    const saveProducts = async () => {
      try {
        localStorage.setItem('gamemart:products', JSON.stringify(products));
        const response = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(products)
        });
        if (response.ok) {
          await response.json();
        } else {
          if (response.status === 413) {
            alert('Image too large! Please use a smaller image or URL.');
          }
        }
      } catch (error) {
        console.error('❌ Error saving products:', error);
      }
    };
    
    // Debounce saves to prevent excessive API calls
    const timeoutId = setTimeout(saveProducts, 500);
    return () => clearTimeout(timeoutId);
  }, [products, hasLoaded]);
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
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.price || !formData.stock) {
      alert('Please fill in all required fields (Title, Price, Stock)');
      return;
    }
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      sellerName: user?.username || 'Admin',
      sellerRole: 'admin',
      image: formData.image || 'https://via.placeholder.com/400x300?text=No+Image'
    };
    
    if (editingId) {
      setProducts(prev => {
        const updated = prev.map(p => p.id === editingId ? { ...p, ...productData, id: editingId } : p);
        return updated;
      });
    } else {
      const newProd = { ...productData, id: Date.now() };
      setProducts(prev => {
        const updated = [newProd, ...prev];
        return updated;
      });
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
          <PageHeading title="Product" highlight="Management" center={false} />
          <button className="btn-primary" onClick={() => { 
            setEditingId(null); 
            setFormData({ title: '', console: 'PS5', genre: 'Action', price: '', stock: '', image: '' });
            setImagePreview(null);
            setShowAddModal(true);
          }}>Add New Game</button>
        </div>

        <div style={{
          background: 'rgba(17, 24, 39, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '24px',
          backdropFilter: 'blur(20px)',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Image</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Title</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Console</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Genre</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Price</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Stock</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Seller</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((g, i) => (
                <tr key={g.id} style={{ 
                  borderBottom: i < products.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                  animation: `cardFadeIn 0.6s ease-out ${i * 0.05}s both`
                }}>
                  <td style={{ padding: '16px' }}>
                    {g.image && (
                      <img src={g.image} alt={g.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    )}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text)', fontWeight: '600' }}>{g.title}</td>
                  <td style={{ padding: '16px' }}>
                    <span className="game-tag" style={{ background: 'rgba(0, 255, 231, 0.2)', borderColor: 'rgba(0, 255, 231, 0.5)', color: '#00ffe7' }}>
                      {g.console}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-dim)' }}>{g.genre}</td>
                  <td style={{ padding: '16px', color: 'var(--primary)', fontWeight: '700', fontSize: '18px' }}>{formatPKR(g.price)}</td>
                  <td style={{ padding: '16px', color: g.stock > 10 ? '#86efac' : '#fca5a5', fontWeight: '600' }}>{g.stock}</td>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <span style={{ 
                        color: g.sellerRole === 'admin' ? '#00ffe7' : '#86efac',
                        fontWeight: '600',
                        fontSize: '13px'
                      }}>
                        {g.sellerName || 'Admin'}
                      </span>
                      <div style={{ 
                        fontSize: '11px', 
                        color: 'var(--text-dim)', 
                        marginTop: '2px',
                        textTransform: 'capitalize'
                      }}>
                        {g.sellerRole || 'admin'}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button className="game-btn" onClick={() => onEdit(g)} style={{ padding: '6px 12px', fontSize: '12px', marginRight: '8px' }}>
                      Edit
                    </button>
                    <button className="game-btn" onClick={() => onDelete(g.id)} style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ flex: 1 }}
                  >
                    {editingId ? 'Save Changes' : 'Add Product'}
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

export default ProductManagement;
