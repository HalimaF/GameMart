import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import users from "../data/users.json";
import { useUser } from "../context/UserContext";
import './Home.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onLogin = () => {
    const match = users.find(u => u.email === email && u.password === password);
    if (!match) {
      setError('Invalid credentials');
      return;
    }
    
    // Store full user data including role
    const userData = { 
      id: match.id, 
      username: match.username, 
      email: match.email, 
      role: match.role || 'buyer',
      tier: match.tier,
      coins: match.coins,
      xp: match.xp,
      badges: match.badges,
      joinDate: match.joinDate
    };
    
    setUser(userData);
    setError("");
    
    // Redirect based on role
    if (match.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (match.role === 'seller') {
      navigate('/seller/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>
      
      <div className="hero">
        <div className="hero-content" style={{ opacity: Math.max(0, 1 - scrollY / 500) }}>
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">GameMart</span>
          </h1>
          <p className="hero-subtitle">Login to access your dashboard</p>
          
          <div style={{
            background: 'rgba(17, 24, 39, 0.8)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '8px', fontSize: '14px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text)',
                  fontSize: '15px'
                }}
                placeholder="Enter your email"
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '8px', fontSize: '14px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text)',
                  fontSize: '15px'
                }}
                placeholder="Enter your password"
              />
            </div>
            
            {error && (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            
            <button onClick={onLogin} className="btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
              Login
            </button>
            
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '14px', marginTop: '20px' }}>
              Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: 'var(--primary)', cursor: 'pointer' }}>Sign up</span>
            </div>
            
            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '8px' }}>Demo Accounts:</div>
              <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: '1.6' }}>
                Admin: admin@gamemart.com / admin123<br/>
                Seller: seller@gamemart.com / seller123<br/>
                Buyer: gamer@example.com / password123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
