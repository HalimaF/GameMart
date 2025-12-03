import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import './Home.css';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onSignup = () => {
    if (!email || !password) {
      setError('Please fill all required fields');
      return;
    }
    const newUser = { id: Date.now(), username: name || email, email, role, tier: 'Bronze', coins: 0, xp: 0, badges: [], joinDate: new Date().toISOString() };
    try { localStorage.setItem('gm:newuser', JSON.stringify(newUser)); } catch {}
    setUser(newUser);
    setError("");
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'seller') {
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
            Create your <span className="gradient-text">GameMart</span> account
          </h1>
          <p className="hero-subtitle">Sign up to get started</p>

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
              <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '8px', fontSize: '14px' }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text)',
                  fontSize: '15px'
                }}
                placeholder="Enter your name"
              />
            </div>

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
                placeholder="Create a password"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '8px', fontSize: '14px' }}>Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text)',
                  fontSize: '15px'
                }}
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
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

            <button onClick={onSignup} className="btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
              Sign Up
            </button>

            <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '14px', marginTop: '20px' }}>
              Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'var(--primary)', cursor: 'pointer' }}>Login</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
