import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './hooks/AuthContext';
import { useCart } from './hooks/CartContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';

function AppContent() {
  const { user, loading, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const cartCount = cart.length;

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-950 font-bold text-blue-500">
      Loading Culinaria...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="bg-slate-900 text-white p-4 shadow-xl sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate('/')} 
            className="text-2xl font-black tracking-tighter text-blue-400 hover:opacity-80 transition"
          >
            CULINARIA
          </button>
          
          <div className="flex gap-8 items-center font-medium">
            <button onClick={() => navigate('/')} className="hover:text-blue-400 transition">Menu</button>
            
            {user ? (
              <>
                <button onClick={() => navigate('/orders')} className="hover:text-blue-400 transition">My Orders</button>
                <div className="flex items-center gap-4 border-l border-slate-700 pl-8">
                  <span className="text-sm text-slate-400 font-bold text-blue-300">Hi, {user.name}</span>
                  <button onClick={logout} className="bg-rose-600 px-5 py-2 rounded-xl hover:bg-rose-700 transition text-sm">Logout</button>
                </div>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-700 transition">Login</button>
            )}

            <button onClick={() => navigate('/cart')} className="relative p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900 font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="w-full"> 
        <Routes>
          <Route path="/" element={
            <div className="max-w-7xl mx-auto py-6 px-4">
              <MenuPage onUnauthorized={() => navigate('/login')} />
            </div>
          } />

          <Route path="/login" element={<LoginPage onRegister={() => navigate('/register')} />} />
          <Route path="/register" element={<RegisterPage onBack={() => navigate('/login')} />} />
          
          <Route path="/cart" element={user ? <div className="max-w-7xl mx-auto py-6 px-4"><CartPage onCheckout={() => navigate('/checkout')} /></div> : <Navigate to="/login" />} />
          
          <Route path="/checkout" element={user ? (
            <div className="max-w-7xl mx-auto py-6 px-4">
              <CheckoutPage onOrderPlaced={(id) => {
                if (id) {
                  localStorage.setItem('activeTrackingId', id);
                  localStorage.setItem('trackingStartTime', Date.now());
                  navigate(`/order-detail/${id}`);
                } else {
                  navigate('/orders');
                }
              }} />
            </div>
          ) : <Navigate to="/login" />} />
          
          <Route path="/orders" element={user ? <div className="max-w-7xl mx-auto py-6 px-4"><OrdersPage /></div> : <Navigate to="/login" />} />
          <Route path="/order-detail/:id" element={user ? <div className="max-w-7xl mx-auto py-6 px-4"><OrderDetailPage /></div> : <Navigate to="/login" />} />
          <Route path="/track-order/:id" element={user ? <div className="max-w-7xl mx-auto py-6 px-4"><OrderTrackingPage /></div> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default AppContent;