import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getUserOrders();
        
        let extractedOrders = [];
        if (res.data && Array.isArray(res.data)) {
          extractedOrders = res.data;
        } else if (res.data && res.data.orders && Array.isArray(res.data.orders)) {
          extractedOrders = res.data.orders;
        } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
          extractedOrders = res.data.data;
        }

        setOrders(extractedOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const sortedOrders = orders && orders.length > 0 
    ? [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-teal-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-b-2 border-indigo-500 animate-spin-slow"></div>
        </div>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">
          Synchronizing History...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <div className="bg-rose-500/10 border border-rose-500/20 p-12 rounded-[3.5rem] backdrop-blur-xl">
          <h2 className="text-white text-3xl font-black italic tracking-tighter uppercase mb-4">Connection <span className="text-rose-500">Lost</span></h2>
          <p className="text-slate-400 font-bold text-sm mb-10 max-w-xs mx-auto">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-white text-black px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-500 hover:text-white transition-all shadow-xl"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 relative animate-in fade-in duration-1000">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="mb-16">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-[0.8]">
          Order <span className="text-teal-500">Vault</span>
        </h1>
        <p className="text-slate-500 font-black mt-8 uppercase tracking-[0.5em] text-[10px] flex items-center gap-4">
          <span className="w-12 h-[1px] bg-teal-500/50"></span>
          Your Archive
        </p>
      </header>
      
      {sortedOrders.length === 0 ? (
        <div className="text-center py-24 bg-white/5 backdrop-blur-md rounded-[4rem] border border-white/10 border-dashed">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">📂</div>
          <p className="text-slate-500 font-black mb-10 uppercase tracking-[0.3em] text-xs">No entries found in the neural link</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-teal-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95"
          >
            Start First Transaction
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {sortedOrders.map((order) => {
            const isPaid = order.paymentStatus === 'completed' || order.status === 'confirmed' || order.status === 'delivered';
            
            return (
              <div 
                key={order._id || Math.random()}
                onClick={() => navigate(`/order-detail/${order._id}`)}
                className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] hover:border-teal-500/40 hover:bg-white/[0.08] transition-all duration-500 cursor-pointer flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl"
              >
                {/* Left Side: Identity */}
                <div className="flex items-center gap-8 w-full md:w-auto">
                  <div className="w-20 h-20 bg-black border border-white/10 rounded-3xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:border-teal-500/50 transition-all duration-500 shadow-inner">
                    📦
                  </div>
                  <div>
                    <p className="text-teal-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                      {order.orderNumber || `REF: ${order._id?.slice(-8).toUpperCase()}`}
                    </p>
                    <h3 className="text-white font-black text-2xl italic tracking-tighter uppercase">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      }) : 'Null Date'}
                    </h3>
                    <div className="flex gap-3 mt-2">
                       <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-md">
                        {order.items?.length || 0} Dishes
                       </span>
                       <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-md">
                        {order.paymentMethod?.replace('_', ' ') || 'Method Unknown'}
                       </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Status & Total */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                  <p className="text-white font-black text-4xl italic tracking-tighter group-hover:text-teal-400 transition-colors">
                    ${order.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                  
                  <div className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-500 ${
                    isPaid ? 'bg-teal-500/10 text-teal-400 border-teal-500/20 shadow-[0_0_20px_rgba(20,184,166,0.1)]' : 
                    order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {isPaid ? 'CONFIRMED' : (order.status || 'PENDING')}
                  </div>
                </div>

                {/* Hover Arrow Accessory */}
                <div className="hidden lg:flex absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-teal-500">
                  <span className="text-2xl">→</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Decoration */}
      <div className="mt-20 border-t border-white/5 pt-12 text-center">
        <p className="text-[9px] font-black text-slate-700 uppercase tracking-[1em]">Secure End-to-End Encryption</p>
      </div>
    </div>
  );
}

export default OrdersPage;