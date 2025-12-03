import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import '../Home.css';
import { formatPKR } from "../../utils/currency";

const SellerOrders = () => {
  const [scrollY, setScrollY] = useState(0);
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

  const orders = [
    { id: 1001, product: 'Elden Ring', buyer: 'GamerPro123', quantity: 1, total: 59.99, status: 'Completed', date: '2025-12-01' },
    { id: 1002, product: 'Cyberpunk 2077', buyer: 'ProPlayer99', quantity: 1, total: 49.99, status: 'Processing', date: '2025-12-01' },
    { id: 1003, product: 'The Witcher 3', buyer: 'GameMaster456', quantity: 2, total: 79.98, status: 'Shipped', date: '2025-11-30' },
    { id: 1004, product: 'Red Dead Redemption 2', buyer: 'NinjaGamer', quantity: 1, total: 59.99, status: 'Completed', date: '2025-11-30' },
    { id: 1005, product: 'GTA V', buyer: 'PixelHunter', quantity: 1, total: 29.99, status: 'Processing', date: '2025-11-29' },
  ];
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
          My <span className="gradient-text">Orders</span>
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
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Product</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Buyer</th>
                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-dim)', fontWeight: '600' }}>Qty</th>
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
                  <td style={{ padding: '16px', color: 'var(--text)' }}>{order.product}</td>
                  <td style={{ padding: '16px', color: 'var(--text-dim)' }}>{order.buyer}</td>
                  <td style={{ padding: '16px', color: 'var(--text-dim)' }}>{order.quantity}</td>
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
                    <button className="game-btn" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => { setSelectedOrder(order); setShowModal(true); }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ background: 'rgba(17,24,39,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '520px' }}>
            <h2 style={{ color: 'var(--text)', marginBottom: '12px' }}>Order <span className="gradient-text">#{selectedOrder.id}</span></h2>
            <div style={{ color: 'var(--text-dim)', marginBottom: '8px' }}>Product: <span style={{ color: 'var(--text)' }}>{selectedOrder.product}</span></div>
            <div style={{ color: 'var(--text-dim)', marginBottom: '8px' }}>Buyer: <span style={{ color: 'var(--text)' }}>{selectedOrder.buyer}</span></div>
            <div style={{ color: 'var(--text-dim)', marginBottom: '8px' }}>Quantity: <span style={{ color: 'var(--text)' }}>{selectedOrder.quantity}</span></div>
            <div style={{ color: 'var(--text-dim)', marginBottom: '8px' }}>Total: <span style={{ color: '#86efac', fontWeight: 700 }}>{formatPKR(selectedOrder.total)}</span></div>
            <div style={{ color: 'var(--text-dim)', marginBottom: '8px' }}>Status: <span className="game-tag" style={{ background: getStatusColor(selectedOrder.status).bg, borderColor: getStatusColor(selectedOrder.status).border, color: getStatusColor(selectedOrder.status).color }}>{selectedOrder.status}</span></div>
            <div style={{ color: 'var(--text-dim)', marginBottom: '16px' }}>Date: <span style={{ color: 'var(--text)' }}>{selectedOrder.date}</span></div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="game-btn" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
