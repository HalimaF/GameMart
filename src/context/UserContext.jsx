// Event-based global store using localStorage. Hooks used: useState, useEffect only.
import { useState, useEffect } from 'react';

export const UserProvider = ({ children }) => children;

const readUser = () => {
  try { const s = localStorage.getItem('gm:user'); return s ? JSON.parse(s) : null; } catch { return null; }
};
const writeUser = (u) => {
  try { localStorage.setItem('gm:user', JSON.stringify(u)); } catch {}
  window.dispatchEvent(new Event('userUpdated'));
};

const readCart = () => {
  try { const s = localStorage.getItem('gm:cart'); return s ? JSON.parse(s) : []; } catch { return []; }
};
const writeCart = (items) => {
  try {
    localStorage.setItem('gm:cart', JSON.stringify(items));
    const count = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
    localStorage.setItem('cartCount', String(count));
  } catch {}
  window.dispatchEvent(new Event('cartUpdated'));
};

export const useUser = () => {
  const [user, setUserState] = useState(readUser());
  const [cart, setCartState] = useState(readCart());
  const [cartCount, setCartCount] = useState(() => cart.reduce((s,i)=>s+(i.quantity||1),0));
  const [cartTotal, setCartTotal] = useState(() => cart.reduce((s,i)=>s+(i.price*(i.quantity||1)),0));

  useEffect(() => {
    const onUser = () => setUserState(readUser());
    const onCart = () => {
      const c = readCart();
      setCartState(c);
      setCartCount(c.reduce((s,i)=>s+(i.quantity||1),0));
      setCartTotal(c.reduce((s,i)=>s+(i.price*(i.quantity||1)),0));
    };
    window.addEventListener('userUpdated', onUser);
    window.addEventListener('cartUpdated', onCart);
    window.addEventListener('storage', onCart);
    return () => {
      window.removeEventListener('userUpdated', onUser);
      window.removeEventListener('cartUpdated', onCart);
      window.removeEventListener('storage', onCart);
    };
  }, []);

  const setUser = (u) => writeUser(u);
  const addToCart = (item, qty = 1) => {
    const current = readCart();
    const idx = current.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      const updated = [...current];
      const q = Math.min((updated[idx].quantity || 1) + qty, 99);
      updated[idx] = { ...updated[idx], quantity: q };
      writeCart(updated);
    } else {
      writeCart([...current, { id: item.id, title: item.title, price: item.price, image: item.image, quantity: Math.min(qty, 99) }]);
    }
  };
  const removeFromCart = (id) => writeCart(readCart().filter(i => i.id !== id));
  const updateQuantity = (id, qty) => {
    const q = Math.max(1, Math.min(qty, 99));
    const updated = readCart().map(i => (i.id === id ? { ...i, quantity: q } : i));
    writeCart(updated);
  };
  const clearCart = () => writeCart([]);

  return { user, setUser, cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal };
};

export default useUser;
