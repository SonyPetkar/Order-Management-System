import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrderById(id);
        const data = res.data?.data || res.data?.order || res.data;
        if (data) {
          setOrder(Array.isArray(data) ? data[0] : data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Fetching Order Details...</p>
      </div>
    );
  }

  if (!order || !order._id) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🔍</div>
        <h2 className="text-white text-2xl font-black mb-2 uppercase italic">Order Not Found</h2>
        <p className="text-slate-500 mb-8 font-medium">We couldn't retrieve the details for this order ID.</p>
        <button onClick={() => navigate('/orders')} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-500 transition-all">
          Return to History
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate('/orders')} className="text-slate-500 hover:text-white flex items-center gap-2 transition font-black text-[10px] uppercase tracking-widest">
          ← Back to Order History
        </button>
        <button 
          onClick={() => navigate(`/track-order/${order._id}`)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <span>🛵</span> Track Order
        </button>
      </div>

      <div className="bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-100">
        <div className="bg-slate-900 p-10 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                {order.orderNumber || `ID: ${order._id.slice(-6)}`}
              </p>
              <h2 className="text-4xl font-black tracking-tighter italic">RECEIPT</h2>
              <p className="opacity-50 text-xs font-bold mt-2 uppercase tracking-wider">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg ${
              order.status === 'delivered' ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
            }`}>
              {order.status}
            </div>
          </div>
        </div>

        <div className="p-10 space-y-10">
          <div className="space-y-4">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Ordered Items</p>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-slate-50 p-6 rounded-[2.2rem] border border-slate-100">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden flex items-center justify-center shadow-sm border border-slate-100">
                      {item.image ? (
                        <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">🍔</span>
                      )}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg leading-tight">{item.productName}</p>
                      <p className="text-[10px] font-black text-blue-500 uppercase mt-1 tracking-wider">
                        ${item.price?.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-black text-slate-900 text-lg">${(item.subtotal || item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-[2.5rem] p-8 space-y-4 border border-slate-100">
            <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
              <span>Payment Type</span>
              <span className="text-slate-900">{order.paymentMethod?.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
              <span>Payment Status</span>
              <span className="text-emerald-600 font-black italic">{order.paymentStatus}</span>
            </div>
            <div className="h-px bg-slate-200 w-full mt-2"></div>
            <div className="flex justify-between text-3xl font-black text-slate-950 pt-2">
              <span className="tracking-tighter italic">TOTAL PAID</span>
              <span className="text-blue-600">${order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Delivery To</p>
              <div className="space-y-1">
                <p className="font-black text-2xl tracking-tight leading-none mb-2">
                   {order.shippingAddress?.street || 'Default Address'}
                </p>
                <p className="text-sm font-bold opacity-60">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                </p>
                <p className="text-xs font-black text-blue-500 uppercase mt-2 tracking-[0.2em]">{order.shippingAddress?.country || 'India'}</p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 text-white/5 text-8xl font-black italic select-none uppercase group-hover:text-white/10 transition-all">
              {order.shippingAddress?.city?.slice(0, 4) || 'HOME'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;