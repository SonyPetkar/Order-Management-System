import { useState } from 'react';
import { useCart } from '../hooks/CartContext';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = ({ onOrderPlaced }) => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulating API Call
      const mockOrderId = Math.random().toString(36).substr(2, 9).toUpperCase();
      setTimeout(() => {
        clearCart();
        onOrderPlaced(mockOrderId);
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error("Order failed", err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 relative animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
          Final <span className="text-teal-500">Step</span>
        </h1>
        <p className="text-slate-500 font-black mt-4 uppercase tracking-[0.4em] text-[10px] flex items-center gap-3">
          <span className="w-8 h-[1px] bg-teal-500/50"></span>
          Review and confirm your feast
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Delivery Details */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-4">
              <span className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-sm not-italic shadow-lg shadow-teal-900/40">01</span>
              Delivery Destination
            </h2>
            
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Address</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Street, Apartment, Floor, Landmark..."
                  className="w-full px-8 py-6 bg-black/40 border border-white/10 rounded-[2rem] text-white outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all placeholder:text-slate-700 text-sm font-medium resize-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-8 py-5 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-teal-500/50 text-xs font-bold transition-all placeholder:text-slate-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Time</label>
                  <div className="w-full px-8 py-5 bg-teal-500/5 border border-teal-500/20 rounded-2xl text-teal-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center">
                    ASAP (~35 MIN)
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl">
             <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-4">
              <span className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-sm not-italic shadow-lg shadow-indigo-900/40">02</span>
              Payment Method
            </h2>
            <div className="p-6 rounded-2xl border-2 border-teal-500/50 bg-teal-500/5 flex items-center justify-between group cursor-pointer transition-all">
              <div className="flex items-center gap-4">
                <span className="text-2xl">💳</span>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Credit / Debit Card</p>
                  <p className="text-[9px] text-teal-500/70 font-bold uppercase mt-1">Encrypted & Secure</p>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full border-4 border-teal-500 bg-teal-500"></div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-32 bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-[3.5rem] p-10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl"></div>
            
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8">Summary</h3>
            
            <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-teal-500 italic">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white uppercase tracking-wider">{item.name}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">${Number(item.price).toFixed(2)} / unit</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-white italic">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-8 space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <span>Delivery Fee</span>
                <span className="text-teal-500">FREE</span>
              </div>
              <div className="flex justify-between pt-4">
                <span className="text-xl font-black text-white uppercase italic tracking-tighter">Total</span>
                <span className="text-2xl font-black text-teal-500 italic tracking-tighter">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !address}
              className="w-full mt-10 bg-teal-600 hover:bg-teal-500 text-white font-black py-6 rounded-[2rem] transition-all duration-500 shadow-xl shadow-teal-900/40 active:scale-95 disabled:opacity-30 disabled:grayscale uppercase tracking-[0.3em] text-[10px] relative overflow-hidden group/btn"
            >
              <span className="relative z-10">{loading ? 'Processing Transaction...' : 'Confirm & Pay Now'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
            </button>
            
            <p className="text-center text-[9px] text-slate-600 font-black uppercase tracking-widest mt-6">
              🔒 SSL Secure 256-bit Payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;