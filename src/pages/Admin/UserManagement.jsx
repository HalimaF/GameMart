import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import usersData from "../../data/users.json";
import '../Home.css';

const UserManagement = () => {
  const [scrollY, setScrollY] = useState(0);
  const { user } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState(usersData);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showPendingSellers, setShowPendingSellers] = useState(false);

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

  const handleEdit = (userData) => {
    setEditingUser(userData.id);
    setEditForm(userData);
  };

  const handleSave = () => {
    setUsers(users.map(u => u.id === editingUser ? editForm : u));
    setEditingUser(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleApprove = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: 'approved' } : u
    ));
  };

  const handleReject = (userId) => {
    if (window.confirm('Are you sure you want to reject this seller application?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const pendingSellers = users.filter(u => u.role === 'seller' && u.status === 'pending');
  const activeUsers = users.filter(u => u.status !== 'pending');

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>

      <div className="featured">
        {pendingSellers.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="section-title">
                Pending <span className="gradient-text">Seller Approvals</span>
                <span style={{ 
                  marginLeft: '12px', 
                  fontSize: '14px', 
                  padding: '4px 12px', 
                  background: 'rgba(255, 234, 0, 0.2)', 
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 234, 0, 0.3)',
                  color: '#ffea00'
                }}>
                  {pendingSellers.length}
                </span>
              </h2>
              <button 
                className="game-btn" 
                onClick={() => setShowPendingSellers(!showPendingSellers)}
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                {showPendingSellers ? 'Hide' : 'Show'} Pending
              </button>
            </div>

            {showPendingSellers && (
              <div style={{
                background: 'rgba(255, 234, 0, 0.05)',
                border: '1px solid rgba(255, 234, 0, 0.2)',
                borderRadius: '20px',
                padding: '24px',
                backdropFilter: 'blur(20px)',
                overflowX: 'auto'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 234, 0, 0.2)' }}>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>ID</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Username</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Email</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Store Name</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Join Date</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingSellers.map((u, i) => (
                      <tr key={u.id} style={{ 
                        borderBottom: i < pendingSellers.length - 1 ? '1px solid rgba(255, 234, 0, 0.1)' : 'none',
                        animation: `cardFadeIn 0.6s ease-out ${i * 0.1}s both`
                      }}>
                        <td style={{ padding: '16px', color: 'var(--text)' }}>{u.id}</td>
                        <td style={{ padding: '16px', color: 'var(--text)', fontWeight: '600' }}>{u.username}</td>
                        <td style={{ padding: '16px', color: 'var(--text-dim)' }}>{u.email}</td>
                        <td style={{ padding: '16px', color: 'var(--text)' }}>{u.storeName || 'N/A'}</td>
                        <td style={{ padding: '16px', color: 'var(--text-dim)' }}>{u.joinDate}</td>
                        <td style={{ padding: '16px' }}>
                          <button 
                            className="game-btn" 
                            onClick={() => handleApprove(u.id)}
                            style={{ 
                              padding: '6px 12px', 
                              fontSize: '12px', 
                              marginRight: '8px',
                              background: 'rgba(34, 197, 94, 0.1)',
                              borderColor: 'rgba(34, 197, 94, 0.3)',
                              color: '#22c55e'
                            }}
                          >
                            Approve
                          </button>
                          <button 
                            className="game-btn" 
                            onClick={() => handleReject(u.id)}
                            style={{ 
                              padding: '6px 12px', 
                              fontSize: '12px', 
                              background: 'rgba(239, 68, 68, 0.1)', 
                              borderColor: 'rgba(239, 68, 68, 0.3)',
                              color: '#ef4444'
                            }}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <h1 className="section-title">
          User <span className="gradient-text">Management</span>
        </h1>

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
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>ID</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Username</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Role</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Tier</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Coins</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>XP</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.map((u, i) => (
                <tr key={u.id} style={{ 
                  borderBottom: i < activeUsers.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                  animation: `cardFadeIn 0.6s ease-out ${i * 0.1}s both`
                }}>
                  <td style={{ padding: '16px', color: 'var(--text)' }}>{u.id}</td>
                  <td style={{ padding: '16px' }}>
                    {editingUser === u.id ? (
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          color: 'var(--text)',
                          fontSize: '14px',
                          width: '100%'
                        }}
                      />
                    ) : (
                      <span style={{ color: 'var(--text)', fontWeight: '600' }}>{u.username}</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {editingUser === u.id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          color: 'var(--text)',
                          fontSize: '14px',
                          width: '100%'
                        }}
                      />
                    ) : (
                      <span style={{ color: 'var(--text-dim)' }}>{u.email}</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {editingUser === u.id ? (
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          color: 'var(--text)',
                          fontSize: '14px'
                        }}
                      >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="game-tag" style={{ 
                        background: u.role === 'admin' ? 'rgba(255, 0, 200, 0.2)' : u.role === 'seller' ? 'rgba(255, 234, 0, 0.2)' : 'rgba(0, 255, 231, 0.2)',
                        borderColor: u.role === 'admin' ? 'rgba(255, 0, 200, 0.5)' : u.role === 'seller' ? 'rgba(255, 234, 0, 0.5)' : 'rgba(0, 255, 231, 0.5)',
                        color: u.role === 'admin' ? '#ff00c8' : u.role === 'seller' ? '#ffea00' : '#00ffe7'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {editingUser === u.id ? (
                      <select
                        value={editForm.tier}
                        onChange={(e) => setEditForm({...editForm, tier: e.target.value})}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          color: 'var(--text)',
                          fontSize: '14px'
                        }}
                      >
                        <option value="Bronze">Bronze</option>
                        <option value="Silver">Silver</option>
                        <option value="Gold">Gold</option>
                        <option value="Platinum">Platinum</option>
                      </select>
                    ) : (
                      <span style={{ color: 'var(--text)' }}>{u.tier}</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {editingUser === u.id ? (
                      <input
                        type="number"
                        value={editForm.coins}
                        onChange={(e) => setEditForm({...editForm, coins: parseInt(e.target.value)})}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          color: 'var(--text)',
                          fontSize: '14px',
                          width: '80px'
                        }}
                      />
                    ) : (
                      <span style={{ color: '#ffea00', fontWeight: '600' }}>{u.coins}</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {editingUser === u.id ? (
                      <input
                        type="number"
                        value={editForm.xp}
                        onChange={(e) => setEditForm({...editForm, xp: parseInt(e.target.value)})}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          color: 'var(--text)',
                          fontSize: '14px',
                          width: '80px'
                        }}
                      />
                    ) : (
                      <span style={{ color: '#00ffe7', fontWeight: '600' }}>{u.xp}</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {editingUser === u.id ? (
                      <>
                        <button 
                          className="game-btn" 
                          onClick={handleSave}
                          style={{ 
                            padding: '6px 12px', 
                            fontSize: '12px', 
                            marginRight: '8px',
                            background: 'rgba(34, 197, 94, 0.1)',
                            borderColor: 'rgba(34, 197, 94, 0.3)',
                            color: '#22c55e'
                          }}
                        >
                          Save
                        </button>
                        <button 
                          className="game-btn" 
                          onClick={handleCancel}
                          style={{ 
                            padding: '6px 12px', 
                            fontSize: '12px',
                            background: 'rgba(156, 163, 175, 0.1)',
                            borderColor: 'rgba(156, 163, 175, 0.3)',
                            color: '#9ca3af'
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="game-btn" 
                          onClick={() => handleEdit(u)}
                          style={{ padding: '6px 12px', fontSize: '12px', marginRight: '8px' }}
                        >
                          Edit
                        </button>
                        <button 
                          className="game-btn" 
                          onClick={() => handleDelete(u.id)}
                          style={{ 
                            padding: '6px 12px', 
                            fontSize: '12px', 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            borderColor: 'rgba(239, 68, 68, 0.3)',
                            color: '#ef4444'
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
