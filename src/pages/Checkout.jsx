import { useEffect, useState } from "react";
import './Home.css';
import { formatPKR } from '../utils/currency';
import PageHeading from '../components/PageHeading';

const Checkout = () => {
  const [scrollY, setScrollY] = useState(0);
  const [address, setAddress] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    zip: ''
  });
  const [payment, setPayment] = useState({
    method: 'card',
    card: { number: '', name: '', exp: '', cvv: '' }
  });
  const [note, setNote] = useState('');
  const cart = (() => {
    try { return JSON.parse(localStorage.getItem('gm:cart') || '[]'); } catch { return []; }
  })();
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  const shipping = subtotal > 2000 ? 0 : 500; // Free shipping over PKR 2k, else PKR 500
  const tax = Math.round(subtotal * 0.08); // approx 8%
  const total = subtotal + shipping + tax;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const placeOrder = () => {
    const order = {
      id: Date.now(),
      items: cart,
      address,
      payment: { method: payment.method },
      note,
      totals: { subtotal, shipping, tax, total },
      placedAt: Date.now()
    };
    try {
      const prev = JSON.parse(localStorage.getItem('gm:orders') || '[]');
      localStorage.setItem('gm:orders', JSON.stringify([order, ...prev]));
      localStorage.removeItem('gm:cart');
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Order placed successfully! Thank you for your purchase.');
      window.location.href = '/store';
    } catch {}
  };

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>

      <div className="featured">
        <PageHeading title="Checkout" subtitle="Review your order and confirm" align="left" />
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
          <div>
            <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
              <h3 style={{ color: 'var(--text)', marginBottom: '16px' }}>Shipping Address</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input placeholder="Full name" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} style={inputStyle} />
                <input placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} style={inputStyle} />
                <input placeholder="Address line 1" value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} style={inputStyle} />
                <input placeholder="Address line 2" value={address.line2} onChange={e => setAddress({ ...address, line2: e.target.value })} style={inputStyle} />
                <input placeholder="ZIP / Postal" value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })} style={{ ...inputStyle, gridColumn: 'span 2' }} />
              </div>
            </div>

            <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
              <h3 style={{ color: 'var(--text)', marginBottom: '16px' }}>Payment</h3>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                {['card','cod'].map(m => (
                  <button key={m} onClick={() => setPayment({ ...payment, method: m })} className="game-btn" style={{ borderColor: payment.method === m ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}>
                    {m === 'card' ? 'Card' : 'Cash on Delivery'}
                  </button>
                ))}
              </div>
              {payment.method === 'card' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input placeholder="Card number" value={payment.card.number} onChange={e => setPayment({ ...payment, card: { ...payment.card, number: e.target.value } })} style={{ ...inputStyle, gridColumn: 'span 2' }} />
                  <input placeholder="Name on card" value={payment.card.name} onChange={e => setPayment({ ...payment, card: { ...payment.card, name: e.target.value } })} style={{ ...inputStyle, gridColumn: 'span 2' }} />
                  <input placeholder="MM/YY" value={payment.card.exp} onChange={e => setPayment({ ...payment, card: { ...payment.card, exp: e.target.value } })} style={inputStyle} />
                  <input placeholder="CVV" value={payment.card.cvv} onChange={e => setPayment({ ...payment, card: { ...payment.card, cvv: e.target.value } })} style={inputStyle} />
                </div>
              )}
            </div>

            <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ color: 'var(--text)', marginBottom: '16px' }}>Order Notes</h3>
              <textarea placeholder="Any instructions for delivery" value={note} onChange={e => setNote(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>

          <div>
            <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ color: 'var(--text)', marginBottom: '16px' }}>Summary</h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {cart.length === 0 && <div style={{ color: 'var(--text-dim)' }}>Your cart is empty.</div>}
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text)' }}>
                    <div style={{ maxWidth: '60%' }}>{item.title} × {item.qty || 1}</div>
                    <div>{formatPKR(((item.price || 0) * (item.qty || 1)))}</div>
                  </div>
                ))}
                <hr style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                <div style={row}><span>Subtotal</span><span>{formatPKR(subtotal)}</span></div>
                <div style={row}><span>Shipping</span><span>{formatPKR(shipping)}</span></div>
                <div style={row}><span>Tax</span><span>{formatPKR(tax)}</span></div>
                <div style={{ ...row, fontWeight: 700 }}><span>Total</span><span>{formatPKR(total)}</span></div>
              </div>
              <button className="btn-primary" disabled={cart.length === 0} onClick={placeOrder} style={{ width: '100%', marginTop: '16px' }}>Place Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.05)',
  color: 'var(--text)',
  fontSize: '15px'
};

const row = { display: 'flex', justifyContent: 'space-between', color: 'var(--text)' };

export default Checkout;
