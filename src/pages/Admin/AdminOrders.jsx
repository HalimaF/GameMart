import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { formatPKR } from "../../utils/currency";
import '../Home.css';

const AdminOrders = () => {
  const [scrollY, setScrollY] = useState(0);
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

  const orders = [
    { id: 1001, customer: 'GamerPro123', items: 3, total: 15997, status: 'Completed', date: '2025-12-01' },
    { id: 1002, customer: 'ProPlayer99', items: 1, total: 5999, status: 'Processing', date: '2025-12-01' },
    { id: 1003, customer: 'GameMaster456', items: 2, total: 11998, status: 'Shipped', date: '2025-11-30' },
    { id: 1004, customer: 'NinjaGamer', items: 4, total: 21996, status: 'Completed', date: '2025-11-30' },
    { id: 1005, customer: 'PixelHunter', items: 1, total: 4999, status: 'Processing', date: '2025-11-29' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return { bg: 'rgba(134, 239, 172, 0.2)', border: 'rgba(134, 239, 172, 0.5)', color: '#86efac' };
      case 'Processing': return { bg: 'rgba(255, 234, 0, 0.2)', border: 'rgba(255, 234, 0, 0.5)', color: '#ffea00' };
      case 'Shipped': return { bg: 'rgba(0, 255, 231, 0.2)', border: 'rgba(0, 255, 231, 0.5)', color: '#00ffe7' };
      default: return { bg: 'rgba(156, 163, 175, 0.2)', border: 'rgba(156, 163, 175, 0.5)', color: '#9ca3af' };
    }
  };

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>

      <div className="featured">
        <h1 className="section-title">
          Order <span className="gradient-text">Management</span>
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
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Order ID</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Items</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Total</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Date</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order.id} style={{ 
                  borderBottom: i < orders.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                  animation: `cardFadeIn 0.6s ease-out ${i * 0.1}s both`
                }}>
                  <td style={{ padding: '16px', color: 'var(--text)', fontWeight: '600' }}>#{order.id}</td>
                  <td style={{ padding: '16px', color: 'var(--text)' }}>{order.customer}</td>
                  <td style={{ padding: '16px', color: 'var(--text-dim)' }}>{order.items}</td>
                  <td style={{ padding: '16px', color: '#86efac', fontWeight: '700', fontSize: '16px' }}>{formatPKR(order.total)}</td>
                  <td style={{ padding: '16px' }}>
                    <span className="game-tag" style={{ 
                      background: getStatusColor(order.status).bg,
                      borderColor: getStatusColor(order.status).border,
                      color: getStatusColor(order.status).color
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-dim)' }}>{order.date}</td>
                  <td style={{ padding: '16px' }}>
                    <button className="game-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      View Details
                    </button>
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

export default AdminOrders;
