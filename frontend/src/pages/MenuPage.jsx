import { useState } from 'react';
import { useMenu } from '../hooks/useMenu';
import { useAuth } from '../hooks/AuthContext';
import { useCart } from '../hooks/CartContext';

const MenuPage = ({ onUnauthorized }) => {
  const { menu } = useMenu();
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [activeMood, setActiveMood] = useState('All');
  const [isGroupSession, setIsGroupSession] = useState(false);
  const [sessionLink, setSessionLink] = useState('');

  const moods = ['All', 'Tired', 'Celebrating', 'Healthy', 'Lazy', 'Hungover'];

  const filteredMenu = activeMood === 'All' 
    ? menu 
    : menu.filter(item => item.moodTags?.includes(activeMood));

  const handleStartSession = () => {
    if (!user) {
      setShowModal(true);
      return;
    }
    const shareableUrl = `${window.location.origin}/menu?sharedCartId=${user._id || user.id}`;
    setSessionLink(shareableUrl);
    setIsGroupSession(true);
  };

  const handleAdd = (item) => {
    if (!user) {
      setShowModal(true);
      return;
    }
    addToCart({ ...item, quantity: 1 });
  };

  const getCartItem = (itemId) => cart.find((i) => i._id === itemId);

  const handleQuantityChange = (itemId, currentQty, delta) => {
    const newQty = Number(currentQty) + delta;
    if (newQty <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQty);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      {/* Auth Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
          <div className="bg-[#0a0a0a] border border-white/10 p-10 rounded-[3rem] max-w-sm text-center shadow-[0_0_50px_rgba(20,184,166,0.2)]">
            <div className="bg-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/40 transform -rotate-6">
               <span className="text-white text-3xl font-black italic">C</span>
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter mb-4 uppercase text-white">Join Culinaria</h2>
            <p className="mb-8 text-slate-500 font-bold text-[10px] uppercase tracking-widest leading-loose">Log in to start your journey or host a group session.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => onUnauthorized()} className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-teal-500 transition-all active:scale-95 shadow-lg shadow-teal-900/40">Login Now</button>
              <button onClick={() => setShowModal(false)} className="w-full bg-white/5 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-slate-500 hover:text-white transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl"></div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-[0.8]">The <br/><span className="text-teal-500">Menu</span></h1>
          <p className="text-slate-500 font-black mt-6 uppercase tracking-[0.4em] text-[10px] flex items-center gap-3">
            <span className="w-8 h-[1px] bg-teal-500/50"></span>
            Curated for your current vibe
          </p>
        </div>

        <div className="flex flex-wrap gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/5 backdrop-blur-sm">
          {moods.map(mood => (
            <button
              key={mood}
              onClick={() => setActiveMood(mood)}
              className={`px-6 py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                activeMood === mood 
                ? 'bg-teal-600 text-white shadow-[0_0_20px_rgba(20,184,166,0.4)] scale-105' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Group Session Feature */}
      <div className={`relative overflow-hidden p-8 md:p-12 rounded-[3.5rem] mb-20 transition-all duration-1000 border ${isGroupSession ? 'bg-teal-950/20 border-teal-500/30 shadow-[0_0_80px_rgba(20,184,166,0.1)]' : 'bg-white/5 border-white/10'}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-2xl transition-all duration-700 ${isGroupSession ? 'bg-teal-500 rotate-12 scale-110 shadow-teal-500/40' : 'bg-white/10 text-white'}`}>
              {isGroupSession ? '🚀' : '📱'}
            </div>
            <div>
              <h4 className={`font-black uppercase tracking-tighter text-3xl md:text-4xl italic ${isGroupSession ? 'text-white' : 'text-slate-200'}`}>
                {isGroupSession ? 'Session Live' : 'Group Order'}
              </h4>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500 mt-2">
                {isGroupSession ? 'Your unique QR code is ready' : 'Sync your cart with friends in real-time'}
              </p>
            </div>
          </div>

          {!isGroupSession ? (
            <button 
              onClick={handleStartSession}
              className="bg-white text-black px-12 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-teal-500 hover:text-white transition-all duration-500 shadow-xl"
            >
              Start Session
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-8 animate-in zoom-in duration-700">
              <div className="bg-white p-4 rounded-[2.5rem] shadow-[0_0_40px_rgba(20,184,166,0.3)] border-[6px] border-teal-500/20 group">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(sessionLink)}&bgcolor=ffffff&color=000000&margin=10`} 
                  alt="QR Session Link"
                  className="w-32 h-32 object-contain rounded-2xl"
                />
              </div>
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(sessionLink);
                    alert("Invite link copied!");
                  }}
                  className="bg-teal-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 transition-all text-center"
                >
                  Copy Link
                </button>
                <button 
                  onClick={() => setIsGroupSession(false)}
                  className="text-rose-500 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-rose-500/5 hover:bg-rose-500/10 transition-all text-center"
                >
                  End Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredMenu.map(item => {
          const cartItem = getCartItem(item._id);
          return (
            <div key={item._id} className="group relative bg-white/5 backdrop-blur-sm rounded-[3.5rem] overflow-hidden border border-white/5 hover:border-teal-500/30 transition-all duration-700 hover:-translate-y-4">
              <div className="relative h-80 overflow-hidden">
                <img src={item.image} className="h-full w-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt={item.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80"></div>
                
                <div className="absolute top-8 left-8 flex flex-col gap-2">
                  <span className="bg-black/60 backdrop-blur-xl text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] border border-white/10">{item.category}</span>
                  {item.moodTags?.slice(0, 1).map(tag => (
                    <span key={tag} className="bg-teal-600 text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] shadow-lg shadow-teal-900/40">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="p-10 relative mt-[-60px] bg-gradient-to-t from-[#0a0a0a] to-transparent">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-2xl text-white italic tracking-tighter uppercase leading-tight group-hover:text-teal-400 transition-colors">{item.name}</h3>
                  <span className="font-black text-teal-500 text-xl tracking-tighter">${Number(item.price).toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed mb-8 line-clamp-2 uppercase tracking-widest opacity-80 italic">
                  {item.description}
                </p>
                
                {cartItem ? (
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-[2rem] border border-white/10">
                    <button onClick={() => handleQuantityChange(item._id, cartItem.quantity, -1)} className="w-14 h-14 flex items-center justify-center bg-white/10 rounded-[1.5rem] text-white font-black hover:bg-teal-600 transition-all text-xl">−</button>
                    <span className="font-black text-white text-xl italic">{cartItem.quantity}</span>
                    <button onClick={() => handleQuantityChange(item._id, cartItem.quantity, 1)} className="w-14 h-14 flex items-center justify-center bg-teal-600 rounded-[1.5rem] text-white font-black hover:bg-teal-500 transition-all text-xl">+</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAdd(item)} 
                    className="w-full bg-white text-black py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-teal-500 hover:text-white transition-all duration-500 active:scale-95 shadow-2xl"
                  >
                    Add to Feast
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuPage;