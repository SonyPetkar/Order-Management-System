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
    <div className="flex h-screen items-center justify-center bg-[#050505] relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="relative flex flex-col items-center">
        <div className="w-12 h-12 border-2 border-t-teal-500 border-r-transparent border-b-teal-500 border-l-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black tracking-[0.6em] text-teal-500 uppercase animate-pulse">Initializing Culinaria</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 relative overflow-hidden selection:bg-teal-500/30">
      {/* Global Background Glows - Matching Register Theme */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Ultra-Modern Cyber Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <button 
            onClick={() => navigate('/')} 
            className="group flex items-center gap-3 active:scale-95 transition-transform"
          >
            <div className="bg-gradient-to-br from-teal-500 to-teal-700 w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)] group-hover:rotate-6 transition-all">
              <span className="text-white font-black italic text-xl">C</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic hidden sm:block">
              CULINARIA
            </span>
          </button>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex gap-8 items-center text-[10px] font-black uppercase tracking-[0.3em]">
              <button onClick={() => navigate('/')} className="text-slate-400 hover:text-teal-400 transition-colors">Menu</button>
              {user && (
                <button onClick={() => navigate('/orders')} className="text-slate-400 hover:text-teal-400 transition-colors">Orders</button>
              )}
            </div>
            
            <div className="flex items-center gap-3 md:gap-6 md:border-l md:border-white/10 md:pl-8">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden lg:flex flex-col items-end leading-none">
                    <span className="text-[9px] font-black text-teal-500 uppercase tracking-widest mb-1">Authenticated</span>
                    <span className="text-xs font-black text-white uppercase italic">{user.name}</span>
                  </div>
                  <button 
                    onClick={logout} 
                    className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-rose-500/10 hover:border-rose-500/50 hover:text-rose-400 transition-all text-[9px] font-black uppercase tracking-widest text-slate-500"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/login')} 
                  className="bg-teal-600 text-white px-6 py-2.5 rounded-xl hover:bg-teal-500 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all text-[10px] font-black uppercase tracking-widest"
                >
                  Join
                </button>
              )}

              <button 
                onClick={() => navigate('/cart')} 
                className="relative w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 hover:border-teal-500/50 hover:bg-teal-500/5 transition-all group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-500 text-[9px] w-5 h-5 flex items-center justify-center rounded-lg border-2 border-black font-black text-black animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative pt-24 pb-20 md:pb-10 z-10"> 
        <Routes>
          <Route path="/" element={
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <MenuPage onUnauthorized={() => navigate('/login')} />
            </div>
          } />

          <Route path="/login" element={<LoginPage onRegister={() => navigate('/register')} />} />
          <Route path="/register" element={<RegisterPage onBack={() => navigate('/login')} />} />
          
          <Route path="/cart" element={user ? <CartPage onCheckout={() => navigate('/checkout')} /> : <Navigate to="/login" />} />
          
          <Route path="/checkout" element={user ? (
            <CheckoutPage onOrderPlaced={(id) => {
              if (id) {
                localStorage.setItem('activeTrackingId', id);
                localStorage.setItem('trackingStartTime', Date.now());
                navigate(`/order-detail/${id}`);
              } else {
                navigate('/orders');
              }
            }} />
          ) : <Navigate to="/login" />} />
          
          <Route path="/orders" element={user ? <OrdersPage /> : <Navigate to="/login" />} />
          <Route path="/order-detail/:id" element={user ? <OrderDetailPage /> : <Navigate to="/login" />} />
          <Route path="/track-order/:id" element={user ? <OrderTrackingPage /> : <Navigate to="/login" />} />
        </Routes>
      </main>

      {/* Mobile Floating Dock */}
      <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[320px]">
        <div className="bg-black/60 backdrop-blur-3xl border border-white/10 px-8 py-5 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-black/50">
          <button onClick={() => navigate('/')} className="text-xl hover:scale-125 transition-transform">🏠</button>
          <button onClick={() => navigate('/orders')} className="text-xl hover:scale-125 transition-transform">📋</button>
          <button onClick={() => navigate('/cart')} className="text-xl hover:scale-125 transition-transform relative">
            🛒
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal-500 rounded-full shadow-[0_0_10px_#14b8a6]"></span>}
          </button>
          <button onClick={() => navigate('/login')} className="text-xl hover:scale-125 transition-transform">👤</button>
        </div>
      </div>
    </div>
  );
}

export default AppContent;