import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatPKR } from "../../utils/currency";
import { useUser } from "../../context/UserContext";
import games from "../../data/games.json";
import '../Home.css';
import PageHeading from '../../components/PageHeading';

const API_URL = 'http://localhost:5000/api';

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

  const [myProducts, setMyProducts] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load seller's products from backend on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (response.ok) {
          const allProducts = await response.json();
          // Filter to show only this seller's products
          const sellerProducts = allProducts.filter(p => 
            p.sellerName === user?.username && p.sellerRole === 'seller'
          );
          setMyProducts(sellerProducts);
          localStorage.setItem('seller:products', JSON.stringify(sellerProducts));
        } else {
          const saved = localStorage.getItem('seller:products');
          if (saved) {
            setMyProducts(JSON.parse(saved));
          }
        }
      } catch (error) {
        console.error('Error loading products:', error);
        const saved = localStorage.getItem('seller:products');
        if (saved) {
          setMyProducts(JSON.parse(saved));
        }
      }
      setHasLoaded(true);
    };
    loadProducts();
  }, [user]);

  // Save to backend whenever products change
  useEffect(() => {
    if (!hasLoaded || myProducts.length === 0) {
      return;
    }
    
    const saveProductsToBackend = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        let allProducts = [];
        
        if (response.ok) {
          allProducts = await response.json();
        } else {
          allProducts = games.map(g => ({ ...g, sellerName: 'Admin', sellerRole: 'admin' }));
        }
        
        const otherProducts = allProducts.filter(p => 
          !(p.sellerName === user?.username && p.sellerRole === 'seller')
        );
        
        const updatedProducts = [...otherProducts, ...myProducts];
        
        const saveResponse = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProducts)
        });
        
        if (saveResponse.ok) {
          localStorage.setItem('seller:products', JSON.stringify(myProducts));
          localStorage.setItem('gamemart:products', JSON.stringify(updatedProducts));
        } else {
          console.error('❌ Backend save failed:', saveResponse.status);
          if (saveResponse.status === 413) {
            alert('Image too large! Please use a smaller image.');
          }
        }
      } catch (error) {
        console.error('❌ Error saving to backend:', error);
        // Save to localStorage as fallback
        localStorage.setItem('seller:products', JSON.stringify(myProducts));
      }
    };
    
    const timeoutId = setTimeout(saveProductsToBackend, 500);
    return () => clearTimeout(timeoutId);
  }, [myProducts, hasLoaded, user]);

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
      setMyProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      sellerName: user?.username || 'Unknown Seller',
      sellerRole: 'seller'
    };
    
    if (editingId) {
      setMyProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...productData, id: editingId } : p));
    } else {
      const newProd = { ...productData, id: Date.now() };
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
        <div className="flex-between mb-32">
          <PageHeading title="My" highlight="Products" center={false} />
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add New Product</button>
        </div>

        <div className="games-grid">
          {myProducts.map((game, i) => (
            <div key={game.id} className="game-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="game-card-inner">
                <div className="game-card-bg"></div>
                {game.image && (
                  <img src={game.image} alt={game.title} className="game-image" />
                )}
                <div className="game-tag">{game.genre}</div>
                <div className="game-title game-title-sm">{game.title}</div>
                <div className="game-price game-price-container">{formatPKR(game.price)}</div>
                <div className="stock-info">
                  Stock: <span className={game.stock > 10 ? 'stock-high' : 'stock-low'}>{game.stock}</span>
                </div>
                <div className="button-group-spaced">
                  <button className="game-btn btn-flex-1 btn-medium" onClick={() => onEdit(game)}>Edit</button>
                  <button className="game-btn btn-flex-1 btn-medium btn-delete" onClick={() => onDelete(game.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Add Product Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2 className="modal-title">
                {editingId ? 'Edit' : 'Add New'} <span className="gradient-text">Product</span>
              </h2>
              
              <form onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div className="mb-24">
                  <label className="form-label">
                    Product Image *
                  </label>
                  <div className="upload-box"
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 255, 231, 0.3)'}  
                  >
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="input-hidden"
                      id="product-image"
                      required={!editingId}
                    />
                    <label htmlFor="product-image" className="cursor-pointer">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="upload-preview" />
                      ) : (
                        <>
                          <div className="upload-icon">📸</div>
                          <div className="upload-text">
                            Click to upload image
                          </div>
                          <div className="upload-hint">
                            PNG, JPG, GIF up to 10MB
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div className="form-group">
                  <label className="form-label">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="form-input"
                    placeholder="Enter product title"
                  />
                </div>

                {/* Console & Genre */}
                <div className="form-group-double">
                  <div className="form-group-flex-1">
                    <label className="form-label">
                      Console *
                    </label>
                    <select
                      value={formData.console}
                      onChange={(e) => setFormData({ ...formData, console: e.target.value })}
                      className="form-select"
                    >
                      <option value="PS5">PS5</option>
                      <option value="PS4">PS4</option>
                      <option value="Xbox Series X">Xbox Series X</option>
                      <option value="Xbox One">Xbox One</option>
                      <option value="PC">PC</option>
                      <option value="Nintendo Switch">Nintendo Switch</option>
                    </select>
                  </div>
                  <div className="form-group-flex-1">
                    <label className="form-label">
                      Genre *
                    </label>
                    <select
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      className="form-select"
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
                <div className="form-group-double mb-24">
                  <div className="form-group-flex-1">
                    <label className="form-label">
                      Price (PKR) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="form-input"
                      placeholder="59.99"
                    />
                  </div>
                  <div className="form-group-flex-1">
                    <label className="form-label">
                      Stock *
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                      className="form-input"
                      placeholder="50"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="button-group">
                  <button type="submit" className="btn-primary btn-flex-1">
                    {editingId ? 'Update Product' : 'Add Product'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingId(null);
                      setFormData({ title: '', console: 'PS5', genre: 'Action', price: '', stock: '', image: '' });
                      setImagePreview(null);
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
export default SellerProducts;
