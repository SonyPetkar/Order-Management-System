import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const statusSteps = [
    { id: 'confirmed', label: 'Order Received', icon: '📩' },
    { id: 'preparing', label: 'Preparing Food', icon: '👨‍🍳' },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: '🛵' },
    { id: 'delivered', label: 'Delivered', icon: '✅' }
  ];

  const fetchOrder = async () => {
    try {
      const res = await orderService.getOrderById(id);
      const data = res.data?.data || res.data?.order || res.data;
      setOrder(data);
      
      if (data.status === 'delivered') {
        clearInterval(window.statusInterval);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not connect to tracking server.");
    }
  };

  useEffect(() => {
    fetchOrder();
    window.statusInterval = setInterval(fetchOrder, 5000);
    return () => clearInterval(window.statusInterval);
  }, [id]);

  if (error) return <div className="text-red-500 p-20 text-center font-black">{error}</div>;
  if (!order) return <div className="text-white p-20 text-center font-black animate-pulse">INITIALIZING TRACKER...</div>;

  const currentIdx = statusSteps.findIndex(s => s.id === order.status);

  return (
    <div className="max-w-lg mx-auto bg-white rounded-[3rem] p-10 shadow-2xl my-10 border border-slate-100">
      <div className="text-center mb-10">
        <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2">
          Live Status Update
        </div>
        <h2 className="text-3xl font-black italic tracking-tighter text-slate-900">TRACKING ORDER</h2>
        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">ID: {id}</p>
      </div>
      
      <div className="space-y-10 relative">
        <div className="absolute left-7 top-2 bottom-2 w-1 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="w-full bg-blue-600 transition-all duration-1000 ease-in-out" 
            style={{ height: `${(currentIdx / (statusSteps.length - 1)) * 100}%` }}
          />
        </div>

        {statusSteps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-6 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-all duration-700 ${
              index <= currentIdx 
              ? 'bg-blue-600 text-white scale-110 rotate-3 shadow-blue-200' 
              : 'bg-white text-slate-200 border border-slate-100'
            }`}>
              {step.icon}
            </div>
            <div className="flex-1">
              <p className={`font-black uppercase italic tracking-tight ${index <= currentIdx ? 'text-slate-900' : 'text-slate-300'}`}>
                {step.label}
              </p>
              {index === currentIdx && order.status !== 'delivered' && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">In Progress</p>
                </div>
              )}
              {index < currentIdx && (
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">Completed</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-xl">🏠</div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Delivering to</p>
          <p className="font-bold text-slate-900 text-sm truncate">{order.shippingAddress?.street || "Address not found"}</p>
        </div>
      </div>

      <button onClick={() => navigate('/')} className="w-full mt-8 bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all shadow-xl shadow-blue-100">
        Return to Menu
      </button>
    </div>
  );
};

export default OrderTrackingPage;