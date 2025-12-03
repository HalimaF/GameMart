import { useEffect, useState } from "react";
import PageHeading from "../components/PageHeading";
import { formatPKR } from "../utils/currency";

const Invoice = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const orders = JSON.parse(localStorage.getItem('gm:orders') || '[]');
      const last = orders[0] || null;
      setOrder(last);
    } catch { setOrder(null); }
  }, []);

  if (!order) {
    return (
      <div className="home">
        <div className="featured">
          <PageHeading title="Order" highlight="Invoice" center={false} />
          <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
            <div style={{ color: 'var(--text-dim)' }}>No recent order found.</div>
          </div>
        </div>
      </div>
    );
  }

  const { id, items = [], total = 0, address = {}, payment = 'COD', placedAt } = order;
  const addressText = typeof address === 'object' 
    ? [address.name, address.line1, address.city].filter(Boolean).join(', ') 
    : String(address || '');

  return (
    <div className="home">
      <div className="featured" style={{ maxWidth: 900 }}>
        <PageHeading title="Order" highlight="Invoice" center={false} />
        <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ color: 'var(--text)' }}>Invoice #{id}</div>
            <div style={{ color: 'var(--text-dim)' }}>{placedAt ? new Date(placedAt).toLocaleString() : ''}</div>
          </div>
          <div style={{ marginBottom: 16, color: 'var(--text-dim)' }}>
            <div><strong style={{ color: 'var(--text)' }}>Payment:</strong> {payment}</div>
            <div><strong style={{ color: 'var(--text)' }}>Ship to:</strong> {addressText}</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ textAlign: 'left', padding: 8, color: 'var(--text-dim)' }}>Item</th>
                <th style={{ textAlign: 'right', padding: 8, color: 'var(--text-dim)' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: 8, color: 'var(--text-dim)' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: 8, color: 'var(--text)' }}>{it.title}</td>
                  <td style={{ padding: 8, textAlign: 'right', color: 'var(--text)' }}>{it.quantity || 1}</td>
                  <td style={{ padding: 8, textAlign: 'right', color: 'var(--primary)', fontWeight: 700 }}>{formatPKR((it.price || 0) * (it.quantity || 1))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <div style={{ color: 'var(--text)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 32 }}>
                <span>Subtotal</span>
                <span>{formatPKR(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
