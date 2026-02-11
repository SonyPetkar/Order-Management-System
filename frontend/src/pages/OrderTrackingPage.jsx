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
    { id: 'confirmed', label: 'Authorized', icon: '📩' },
    { id: 'preparing', label: 'In Production', icon: '👨‍🍳' },
    { id: 'out_for_delivery', label: 'Deployment', icon: '🛵' },
    { id: 'delivered', label: 'Completed', icon: '✅' }
  ];

  const fetchOrder = async () => {
    try {
      const res = await orderService.getOrderById(id);
      const data = res.data?.data || res.data?.order || res.data;
      setOrder(Array.isArray(data) ? data[0] : data);
      
      if (data.status === 'delivered') {
        clearInterval(window.statusInterval);
      }
    } catch (err) {
      setError("Satellite link interrupted. Retrying...");
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
          setTimeLeft('ARRIVING NOW');
          clearInterval(timer);
        } else {
          const mins = Math.floor(diff / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${mins}M ${secs}S`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [order]);

  const qualityColor = useMemo(() => {
    const score = order?.deliveryMetrics?.qualityScore || 100;
    if (score > 90) return 'text-teal-400';
    if (score > 75) return 'text-amber-400';
    return 'text-rose-500';
  }, [order]);

  if (error) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-20">
       <div className="text-rose-500 font-black uppercase tracking-[0.4em] border border-rose-500/20 p-10 rounded-[3rem] bg-rose-500/5 backdrop-blur-xl">
         {error}
       </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-t-2 border-teal-500 rounded-full animate-spin"></div>
          <p className="text-white font-black uppercase text-[10px] tracking-[0.5em] animate-pulse">Initializing Radar...</p>
       </div>
    </div>
  );

  const currentIdx = statusSteps.findIndex(s => s.id === order.status);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-teal-500/5 rounded-full animate-ping pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
            Live <span className="text-teal-500">Tracker</span>
          </h1>
          <p className="text-slate-500 font-black mt-4 uppercase tracking-[0.4em] text-[10px] flex items-center gap-3">
            <span className="w-8 h-[1px] bg-teal-500/50"></span>
            Real-Time Logistics Data
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: THE STATUS LINE */}
          <div className="flex-1 bg-white/5 backdrop-blur-2xl rounded-[3.5rem] p-10 border border-white/10 shadow-2xl">
            <div className="text-center mb-12">
              <div className="inline-block px-6 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[9px] font-black uppercase tracking-[0.2em] mb-6">
                System Status: {order.status.replace(/_/g, ' ')}
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-7xl md:text-9xl font-black text-white tracking-tighter italic leading-none">
                  {timeLeft || '--'}
                </span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.8em] mt-4 ml-3">Estimated Arrival</span>
              </div>
            </div>
            
            <div className="space-y-12 relative max-w-md mx-auto py-4">
              {/* Vertical Progress Bar */}
              <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="w-full bg-teal-500 transition-all duration-1000 ease-in-out shadow-[0_0_20px_#14b8a6]" 
                  style={{ height: `${(currentIdx / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>

              {statusSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-8 relative z-10 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-700 border ${
                    index <= currentIdx 
                    ? 'bg-teal-500 border-teal-400 text-white scale-110 shadow-[0_0_30px_rgba(20,184,166,0.3)]' 
                    : 'bg-black border-white/10 text-slate-700'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-xl font-black uppercase italic tracking-tighter transition-colors duration-500 ${index <= currentIdx ? 'text-white' : 'text-slate-700'}`}>
                      {step.label}
                    </p>
                    {index === currentIdx && order.status !== 'delivered' && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping"></span>
                        <p className="text-[9px] text-teal-500 font-black uppercase tracking-widest">Active Phase</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: METRICS */}
          <div className="w-full lg:w-96 space-y-6">
            
            {/* Quality Score - Vibrant No Grayscale */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Thermal Integrity</h4>
              <div className="flex items-baseline gap-2">
                <span className={`text-6xl font-black tracking-tighter ${qualityColor}`}>{order.deliveryMetrics?.qualityScore}%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase italic">Freshness</span>
              </div>
              <div className="mt-8 h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full transition-all duration-1000 shadow-lg ${order.deliveryMetrics?.qualityScore > 80 ? 'bg-teal-500 shadow-teal-500/50' : 'bg-amber-500 shadow-amber-500/50'}`}
                  style={{ width: `${order.deliveryMetrics?.qualityScore}%` }}
                />
              </div>
              <p className="text-[9px] text-slate-500 mt-6 leading-relaxed font-bold uppercase tracking-widest">
                {order.status === 'delivered' ? 'SENSORS CONFIRM: OPTIMAL TEMPERATURE' : 'ROUTING DATA: MINIMIZING THERMAL LEAKAGE'}
              </p>
            </div>

            {/* Eco Savings */}
            <div className="bg-teal-500 rounded-[2.5rem] p-10 text-black shadow-2xl shadow-teal-900/20 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Ecological Impact</span>
                  <span className="text-3xl">🌱</span>
                </div>
                <p className="text-5xl font-black tracking-tighter leading-none italic uppercase">
                  {order.ecoData?.co2SavedKg}kg <br/>
                  <span className="text-[12px] uppercase font-black opacity-60 tracking-widest">Offset CO2</span>
                </p>
                {order.ecoData?.isBatchDelivery && (
                  <div className="mt-8 py-3 px-4 bg-black text-white rounded-2xl text-[9px] font-black uppercase tracking-widest text-center border border-white/10">
                    BATTLED-ENCRYPTED BATCH DELIVERY
                  </div>
                )}
              </div>
              <div className="absolute -right-4 -bottom-4 text-black/10 text-9xl font-black italic select-none">ECO</div>
            </div>

            {/* Provenance List - Colorful */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Dish Provenance</h4>
              <div className="space-y-6">
                {order.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-black rounded-xl border border-white/10 flex items-center justify-center text-xl group-hover:border-teal-500 transition-colors">
                      🍱
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-tighter">{item.productName}</p>
                      <p className="text-[9px] font-bold text-teal-500 uppercase tracking-widest">Source Verified</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => navigate('/')} 
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-6 rounded-[2rem] font-black text-[10px] tracking-[0.4em] uppercase transition-all active:scale-95 shadow-xl"
            >
              Exit Terminal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;