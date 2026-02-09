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
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-slate-500 font-bold animate-pulse uppercase text-xs tracking-widest">Loading Orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-white text-xl font-bold mb-4">Connection Error</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold">Retry</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black text-white mb-8 tracking-tight italic">ORDER HISTORY</h1>
      
      {sortedOrders.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-white/5 border-dashed">
          <p className="text-slate-500 font-black mb-6 uppercase tracking-widest">No orders found in your account</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl"
          >
            START SHOPPING
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => {
            const isPaid = order.paymentStatus === 'completed' || order.status === 'confirmed' || order.status === 'delivered';
            
            return (
              <div 
                key={order._id || Math.random()}
                onClick={() => navigate(`/order-detail/${order._id}`)}
                className="group bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] hover:border-blue-500/40 transition-all cursor-pointer flex justify-between items-center shadow-lg"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl flex items-center justify-center text-2xl shadow-inner">
                    📦
                  </div>
                  <div>
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                      {order.orderNumber || `ID: ${order._id?.slice(-8).toUpperCase()}`}
                    </p>
                    <h3 className="text-white font-black text-lg">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      }) : 'Date Unknown'}
                    </h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">
                      {order.items?.length || 0} Items • {order.paymentMethod?.replace('_', ' ') || 'Method Unknown'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-white font-black text-2xl mb-1 tracking-tighter">
                    ${order.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                  <div className="flex justify-end">
                    <span className={`text-[9px] uppercase font-black px-4 py-1.5 rounded-full tracking-widest ${
                      isPaid ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {isPaid ? 'Confirmed' : (order.status || 'Pending')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;