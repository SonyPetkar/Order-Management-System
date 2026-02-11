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
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-teal-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-b-2 border-indigo-500 animate-spin-slow"></div>
        </div>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Decrypting Receipt Data...</p>
      </div>
    );
  }

  if (!order || !order._id) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl border border-rose-500/20">🔍</div>
        <h2 className="text-white text-4xl font-black mb-4 uppercase italic tracking-tighter">Order <span className="text-rose-500">Not Found</span></h2>
        <p className="text-slate-500 mb-10 font-bold text-xs uppercase tracking-widest">The requested transaction ID does not exist in the vault.</p>
        <button onClick={() => navigate('/orders')} className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-teal-500 hover:text-white transition-all">
          Back to Archive
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 relative animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-teal-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <button onClick={() => navigate('/orders')} className="group text-slate-500 hover:text-teal-400 flex items-center gap-3 transition-all font-black text-[10px] uppercase tracking-[0.3em]">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to History
        </button>
        
        <button 
          onClick={() => navigate(`/track-order/${order._id}`)}
          className="w-full md:w-auto bg-teal-600 hover:bg-teal-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-900/40 active:scale-95"
        >
          <span>🛵</span> Track Live Deployment
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 to-black p-10 md:p-14 border-b border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <p className="text-teal-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                {order.orderNumber || `TXN-REF: ${order._id.slice(-8).toUpperCase()}`}
              </p>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic text-white leading-none uppercase">Receipt</h2>
              <p className="text-slate-500 text-[10px] font-black mt-4 uppercase tracking-[0.2em]">
                Authorized on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border shadow-2xl ${
              order.status === 'delivered' ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
            }`}>
              {order.status}
            </div>
          </div>
        </div>

        <div className="p-8 md:p-14 space-y-12">
          {/* Items Section */}
          <div className="space-y-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Inventory Breakdown</p>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row justify-between items-center bg-black/40 p-6 md:p-8 rounded-[2.5rem] border border-white/5 group hover:border-teal-500/30 transition-all duration-500">
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl overflow-hidden flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-500">
                      {item.image ? (
                        <img src={item.image} alt={item.productName} className="w-full h-full object-cover transition-all" />
                      ) : (
                        <span className="text-3xl">🍽️</span>
                      )}
                    </div>
                    <div>
                      <p className="font-black text-white text-xl italic uppercase tracking-tighter leading-tight">{item.productName}</p>
                      <p className="text-[10px] font-black text-teal-500 uppercase mt-2 tracking-widest">
                        ${item.price?.toFixed(2)} <span className="text-slate-600 mx-2">×</span> {item.quantity} units
                      </p>
                    </div>
                  </div>
                  <p className="font-black text-white text-2xl italic tracking-tighter w-full sm:w-auto text-right mt-4 sm:mt-0">
                    ${(item.subtotal || item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Financials & Delivery Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Billing Summary */}
            <div className="bg-white/5 rounded-[3rem] p-10 border border-white/5 space-y-6">
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <span>Transaction</span>
                <span className="text-white">{order.paymentMethod?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <span>Log Status</span>
                <span className="text-teal-500 italic">{order.paymentStatus}</span>
              </div>
              <div className="h-[1px] bg-white/10 w-full"></div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-2">Grand Total</span>
                <span className="text-5xl font-black text-teal-500 italic tracking-tighter shadow-teal-500/20 shadow-2xl">
                  ${order.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em] mb-6">Drop-off Coordinates</p>
                <div className="space-y-2">
                  <p className="font-black text-3xl tracking-tighter italic uppercase leading-tight">
                    {order.shippingAddress?.street || 'Central Command'}
                  </p>
                  <p className="text-xs font-bold text-indigo-100/70 uppercase tracking-widest">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                  </p>
                  <div className="inline-block mt-4 px-4 py-1.5 bg-black/20 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                    {order.shippingAddress?.country || 'India'}
                  </div>
                </div>
              </div>
              {/* Background watermark */}
              <div className="absolute -right-6 -bottom-6 text-white/10 text-9xl font-black italic select-none uppercase pointer-events-none group-hover:scale-110 transition-transform duration-700">
                {order.shippingAddress?.city?.slice(0, 3) || 'LOC'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-center text-[9px] font-black text-slate-700 uppercase tracking-[1em] mt-12">
        Cyber-Gourmet Protocol Secured
      </p>
    </div>
  );
}

export default OrderDetailPage;