import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Store from './pages/Store';
import Cart from './pages/Cart';
import Rewards from './pages/Rewards';
import Leaderboard from './pages/Leaderboard';
import GroupChat from './pages/GroupChat';
import MiniGame from './pages/MiniGame';
import MiniGames from './pages/MiniGames';
import Game from './pages/Game';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import ProductManagement from './pages/Admin/ProductManagement';
import MiniGameManagement from './pages/Admin/MiniGameManagement';
import AdminOrders from './pages/Admin/AdminOrders';
import Reports from './pages/Admin/Reports';
import SellerDashboard from './pages/Seller/SellerDashboard';
import SellerProducts from './pages/Seller/SellerProducts';
import SellerOrders from './pages/Seller/SellerOrders';
import SellerAnalytics from './pages/Seller/SellerAnalytics';
import Rental from './pages/Rental';
import Checkout from './pages/Checkout';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Home />} />
              <Route path="/store" element={<Store />} />
              <Route path="/game/:id" element={<Game />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/chat" element={<GroupChat />} />
              <Route path="/minigames" element={<MiniGames />} />
              <Route path="/minigame" element={<MiniGame />} />
              <Route path="/minigame/:id" element={<MiniGame />} />
              <Route path="/rental" element={<Rental />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/products" element={<ProductManagement />} />
              <Route path="/admin/minigames" element={<MiniGameManagement />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/products" element={<SellerProducts />} />
              <Route path="/seller/orders" element={<SellerOrders />} />
              <Route path="/seller/analytics" element={<SellerAnalytics />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
