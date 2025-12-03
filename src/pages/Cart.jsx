import { useState, useEffect } from "react";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import { useUser } from "../context/UserContext";
import CartItem from "../components/CartItem";
import './Home.css';
import PageHeading from '../components/PageHeading';
import { formatPKR } from "../utils/currency";

const Cart = () => {
  const [scrollY, setScrollY] = useState(0);
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useUser();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>
      <Container sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <PageHeading title="Shopping" highlight="Cart" />

      {cart.length === 0 ? (
        <Paper sx={{ p: 3, background: '#111827', border: '1px solid #30363d' }}>
          <Typography sx={{ color: '#9ca3af' }}>Your cart is empty.</Typography>
        </Paper>
      ) : (
        <Paper sx={{ background: '#0b1220', border: '1px solid #30363d' }}>
          {cart.map(item => (
            <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
          ))}
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ color: '#e5e7eb' }}>Total</Typography>
            <Typography variant="h6" sx={{ color: '#86efac', fontWeight: 700 }}>{formatPKR(cartTotal)}</Typography>
          </Box>
          <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button color="warning" variant="outlined" onClick={clearCart}>Clear Cart</Button>
            <Button variant="contained" href="/checkout">Checkout</Button>
          </Box>
        </Paper>
      )}
    </Container>
    </div>
  );
};

export default Cart;
