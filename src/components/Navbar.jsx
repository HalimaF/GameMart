import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ThemeSwitcher from './ThemeSwitcher';
import './Navbar.css';

const Navbar = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const { user } = useUser();

  useEffect(() => {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const count = localStorage.getItem('cartCount');
    if (count) {
      setCartItemCount(parseInt(count));
    }

    const handleCartUpdate = () => {
      const updated = localStorage.getItem('cartCount');
      if (updated) {
        setCartItemCount(parseInt(updated));
      } else {
        setCartItemCount(0);
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.body.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          GameMart
        </Link>
        <ul className="navbar-menu">
          {!user || user.role === 'buyer' ? (
            <>
              <li>
                <Link to="/" className="navbar-link">Home</Link>
              </li>
              <li>
                <Link to="/store" className="navbar-link">Store</Link>
              </li>
              <li>
                <Link to="/rental" className="navbar-link">Rental</Link>
              </li>
              <li>
                <Link to="/chat" className="navbar-link">Group Chat</Link>
              </li>
              <li>
                <Link to="/rewards" className="navbar-link">Rewards</Link>
              </li>
              <li>
                <Link to="/leaderboard" className="navbar-link">Leaderboard</Link>
              </li>
              <li>
                <Link to="/minigames" className="navbar-link">Mini Games</Link>
              </li>
            </>
          ) : user.role === 'admin' ? (
            <>
              <li>
                <Link to="/admin/dashboard" className="navbar-link">Dashboard</Link>
              </li>
              <li>
                <Link to="/admin/users" className="navbar-link">Users</Link>
              </li>
              <li>
                <Link to="/admin/products" className="navbar-link">Products</Link>
              </li>
              <li>
                <Link to="/admin/minigames" className="navbar-link">Mini Games</Link>
              </li>
              <li>
                <Link to="/admin/orders" className="navbar-link">Orders</Link>
              </li>
              <li>
                <Link to="/admin/reports" className="navbar-link">Reports</Link>
              </li>
              <li>
                <Link to="/chat" className="navbar-link">Group Chat</Link>
              </li>
            </>
          ) : user.role === 'seller' ? (
            <>
              <li>
                <Link to="/seller/dashboard" className="navbar-link">Dashboard</Link>
              </li>
              <li>
                <Link to="/seller/products" className="navbar-link">My Products</Link>
              </li>
              <li>
                <Link to="/seller/orders" className="navbar-link">Orders</Link>
              </li>
              <li>
                <Link to="/seller/analytics" className="navbar-link">Analytics</Link>
              </li>
              <li>
                <Link to="/chat" className="navbar-link">Group Chat</Link>
              </li>
            </>
          ) : null}
        </ul>

        <div className="navbar-right">
          <ThemeSwitcher isDark={isDark} onToggle={handleThemeToggle} />
          {(!user || user.role === 'buyer') && (
            <Link to="/cart" className="cart-link">
              Cart
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
          )}
          <Link to="/profile" className="navbar-link">
            {user ? user.username : 'Profile'}
          </Link>
          {!user ? (
            <Link to="/login" className="navbar-link">Login</Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
