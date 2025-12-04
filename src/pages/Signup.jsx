import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import usersData from "../data/users.json";
import './Home.css';

const API_URL = 'http://localhost:5000/api';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [scrollY, setScrollY] = useState(0);
  
  // Seller-specific fields
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cnic, setCnic] = useState("");
  
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onSignup = async () => {
    if (!email || !password || !name) {
      setError('Please fill all required fields');
      return;
    }
    
    // Validate admin email
    if (role === 'admin' && !email.endsWith('@gamemart.com')) {
      setError('Admin accounts require a @gamemart.com email address');
      return;
    }
    
    // Validate seller required fields
    if (role === 'seller') {
      if (!businessName || !businessAddress || !phoneNumber || !cnic) {
        setError('Sellers must provide business name, address, phone number, and CNIC');
        return;
      }
      
      // Validate CNIC format (13 digits)
      if (!/^\d{13}$/.test(cnic)) {
        setError('CNIC must be 13 digits');
        return;
      }
      
      // Validate phone number format
      if (!/^\d{11}$/.test(phoneNumber)) {
        setError('Phone number must be 11 digits');
        return;
      }
    }
    
    // Set status to 'pending' for sellers, 'approved' for others
    const status = role === 'seller' ? 'pending' : 'approved';
    
    const newUser = { 
      id: Date.now(), 
      username: name || email, 
      email,
      password,
      role, 
      tier: 'Bronze', 
      coins: 0, 
      xp: 0, 
      badges: [], 
      joinDate: new Date().toISOString(),
      status: status,
      ...(role === 'seller' && {
        businessName,
        businessAddress,
        phoneNumber,
        cnic
      })
    };
    
    try {
      // Get existing users
      const savedUsers = localStorage.getItem('gm:users');
      const allUsers = savedUsers ? JSON.parse(savedUsers) : usersData;
      
      // Add new user to array
      const updatedUsers = [...allUsers, newUser];
      
      // Save to localStorage
      localStorage.setItem('gm:users', JSON.stringify(updatedUsers));
      localStorage.setItem('gm:user', JSON.stringify(newUser));
      
      // Try to save to backend
      try {
        await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUsers)
        });
      } catch (error) {
        console.error('Backend save failed:', error);
      }
      
      setUser(newUser);
      setError("");
      
      if (role === 'seller' && status === 'pending') {
        alert('Your seller account is pending approval. You will be notified once approved.');
        navigate('/');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError('Signup failed. Please try again.');
      console.error('Signup error:', error);
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
        <div className="hero-content">
          <h1 className="hero-title" style={{ opacity: Math.max(0, 1 - scrollY / 500) }}>
            Create your <span className="gradient-text">GameMart</span> account
          </h1>
          <p className="hero-subtitle" style={{ opacity: Math.max(0, 1 - scrollY / 500) }}>Sign up to get started</p>

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

            {role === 'seller' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '8px', fontSize: '14px' }}>Business Name *</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text)',
                      fontSize: '15px'
                    }}
                    placeholder="Enter business name"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '8px', fontSize: '14px' }}>Business Address *</label>
                  <input
                    type="text"
                    value={businessAddress}
                    onChange={e => setBusinessAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text)',
                      fontSize: '15px'
                    }}
                    placeholder="Enter business address"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '8px', fontSize: '14px' }}>Phone Number *</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text)',
                      fontSize: '15px'
                    }}
                    placeholder="03xxxxxxxxx (11 digits)"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '8px', fontSize: '14px' }}>CNIC *</label>
                  <input
                    type="text"
                    value={cnic}
                    onChange={e => setCnic(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text)',
                      fontSize: '15px'
                    }}
                    placeholder="1234567890123 (13 digits)"
                  />
                </div>
              </>
            )}

            {role === 'admin' && (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#93c5fd',
                marginBottom: '20px',
                fontSize: '13px'
              }}>
                Admin accounts require a @gamemart.com email address
              </div>
            )}

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
