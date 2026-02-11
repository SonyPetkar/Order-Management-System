import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

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
      setError("Could not connect to tracking server.");
    }
  };

  useEffect(() => {
    fetchOrder();
    window.statusInterval = setInterval(fetchOrder, 5000);
    return () => clearInterval(window.statusInterval);
  }, [id]);

  useEffect(() => {
    if (order?.deliveryMetrics?.estimatedArrival) {
      const timer = setInterval(() => {
        const diff = new Date(order.deliveryMetrics.estimatedArrival) - new Date();
        if (diff <= 0) {
          setTimeLeft('Arriving now');
          clearInterval(timer);
        } else {
          const mins = Math.floor(diff / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${mins}m ${secs}s`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [order]);

  const qualityColor = useMemo(() => {
    const score = order?.deliveryMetrics?.qualityScore || 100;
    if (score > 90) return 'text-emerald-500';
    if (score > 75) return 'text-orange-500';
    return 'text-red-500';
  }, [order]);

  if (error) return <div className="text-red-500 p-20 text-center font-black">{error}</div>;
  if (!order) return <div className="text-white p-20 text-center font-black animate-pulse">INITIALIZING TRACKER...</div>;

  const currentIdx = statusSteps.findIndex(s => s.id === order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
      
      {/* LEFT COLUMN: LIVE TRACKING */}
      <div className="flex-1 bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2">
            Status: {order.status.replace(/_/g, ' ')}
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Live Tracker</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-4xl font-black text-slate-900 tracking-tighter">{timeLeft || '--'}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase vertical-text">ETA</span>
          </div>
        </div>
        
        <div className="space-y-10 relative">
          <div className="absolute left-7 top-2 bottom-2 w-1 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="w-full bg-blue-600 transition-all duration-1000 ease-in-out shadow-[0_0_10px_#2563eb]" 
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
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest animate-pulse">Live Update...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: IMPACT & INSIGHTS */}
      <div className="w-full lg:w-80 space-y-6">
        
        {/* Feature 5: Freshness Timer */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Quality Index</h4>
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-black tracking-tighter ${qualityColor}`}>{order.deliveryMetrics?.qualityScore}%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Fresh</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-4 leading-relaxed font-bold uppercase tracking-widest">
            {order.status === 'delivered' ? 'Food served at peak flavor' : 'Optimizing route for temperature retention'}
          </p>
          <div className="mt-6 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${order.deliveryMetrics?.qualityScore > 80 ? 'bg-emerald-500' : 'bg-orange-500'}`}
              style={{ width: `${order.deliveryMetrics?.qualityScore}%` }}
            />
          </div>
        </div>

        {/* Feature 1: Eco-Savings */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Eco-Impact</span>
            <span className="text-xl">🌱</span>
          </div>
          <p className="text-2xl font-black text-emerald-900 tracking-tighter leading-none">
            {order.ecoData?.co2SavedKg}kg <br/>
            <span className="text-[10px] uppercase font-bold text-emerald-600">CO2 Saved</span>
          </p>
          {order.ecoData?.isBatchDelivery && (
            <div className="mt-4 py-2 px-3 bg-white/50 rounded-xl border border-emerald-100 text-[9px] font-black text-emerald-700 uppercase tracking-tighter">
              Part of a Batch Delivery
            </div>
          )}
        </div>

        {/* Feature 2: Ingredient Transparency */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Provenance</h4>
          <div className="space-y-4">
            {order.items.slice(0, 2).map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{item.productName}</p>
                  <p className="text-[9px] font-bold text-slate-400 italic">Farm-to-fork verified</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => navigate('/')} className="w-full bg-slate-100 text-slate-400 py-5 rounded-[2rem] font-black text-[10px] tracking-widest uppercase hover:bg-slate-900 hover:text-white transition-all">
          Close Tracker
        </button>
      </div>
    </div>
  );
};

export default OrderTrackingPage;