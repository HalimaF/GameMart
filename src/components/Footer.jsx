import { Link } from "react-router-dom";
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-logo">GameMart</div>
          <p className="footer-text">
            Your ultimate destination for gaming excellence
          </p>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h4>Shop</h4>
            <Link to="/store">Browse Games</Link>
            <Link to="/cart">Shopping Cart</Link>
            <Link to="/rewards">Rewards</Link>
          </div>
          
          <div className="footer-column">
            <h4>Community</h4>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/minigames">Mini Games</Link>
            <Link to="/profile">Profile</Link>
          </div>
          
          <div className="footer-column">
            <h4>Support</h4>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} GameMart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
