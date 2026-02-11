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
    // Updated: Ensure the URL is properly formatted for the QR generator
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
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Auth Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-10 rounded-[2.5rem] max-w-sm text-center shadow-2xl">
            <h2 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">Join Culinaria</h2>
            <p className="mb-8 text-gray-500 font-medium text-sm">Login to start your journey or host a group session.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => onUnauthorized()} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">Login Now</button>
              <button onClick={() => setShowModal(false)} className="w-full bg-gray-100 py-4 rounded-2xl font-black uppercase tracking-widest text-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter text-slate-900 uppercase">The Menu</h1>
          <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-[10px]">Curated for your current vibe</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {moods.map(mood => (
            <button
              key={mood}
              onClick={() => setActiveMood(mood)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeMood === mood 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-200'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Group Session Feature (REPAIRED QR) */}
      <div className={`border p-8 rounded-[3rem] mb-12 transition-all duration-700 ${isGroupSession ? 'bg-slate-950 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' : 'bg-indigo-50 border-indigo-100'}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl shadow-sm transition-all duration-500 ${isGroupSession ? 'bg-indigo-600 rotate-12' : 'bg-white'}`}>
              {isGroupSession ? '🚀' : '📱'}
            </div>
            <div>
              <h4 className={`font-black uppercase tracking-tighter text-2xl ${isGroupSession ? 'text-white' : 'text-indigo-900'}`}>
                {isGroupSession ? 'Session Active' : 'Group Order'}
              </h4>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isGroupSession ? 'text-indigo-500' : 'text-indigo-400'}`}>
                {isGroupSession ? 'Your unique QR code is ready' : 'Sync your cart with friends in real-time'}
              </p>
            </div>
          </div>

          {!isGroupSession ? (
            <button 
              onClick={handleStartSession}
              className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-200"
            >
              Start Session
            </button>
          ) : (
            <div className="flex items-center gap-8 animate-in zoom-in slide-in-from-right duration-700">
              <div className="bg-white p-3 rounded-[2rem] shadow-[0_0_30px_rgba(79,70,229,0.3)] border-4 border-indigo-600/20">
                {/* FIXED QR IMAGE SOURCE */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(sessionLink)}&bgcolor=ffffff&color=000000&margin=10`} 
                  alt="QR Session Link"
                  className="w-28 h-28 object-contain rounded-xl"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=QR+READY";
                  }}
                />
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(sessionLink);
                    alert("Invite link copied to clipboard!");
                  }}
                  className="bg-white/5 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all text-center"
                >
                  Copy Link
                </button>
                <button 
                  onClick={() => setIsGroupSession(false)}
                  className="text-red-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all text-center"
                >
                  End Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredMenu.map(item => {
          const cartItem = getCartItem(item._id);
          return (
            <div key={item._id} className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-3 transition-all duration-700">
              <div className="relative h-72 overflow-hidden">
                <img src={item.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.name} />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <span className="bg-white/95 backdrop-blur w-fit px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">{item.category}</span>
                  {item.moodTags?.slice(0, 1).map(tag => (
                    <span key={tag} className="bg-indigo-600 text-white w-fit px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="p-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-2xl text-slate-900 italic tracking-tighter uppercase leading-tight">{item.name}</h3>
                  <div className="bg-indigo-50 px-3 py-1 rounded-lg">
                    <span className="font-black text-indigo-600 text-lg">${Number(item.price).toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-10 line-clamp-2 uppercase tracking-tight italic">
                  {item.description}
                </p>
                
                {cartItem ? (
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <button onClick={() => handleQuantityChange(item._id, cartItem.quantity, -1)} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-indigo-600 font-black hover:bg-indigo-600 hover:text-white transition-all text-xl">−</button>
                    <span className="font-black text-slate-900 text-lg">{cartItem.quantity}</span>
                    <button onClick={() => handleQuantityChange(item._id, cartItem.quantity, 1)} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-indigo-600 font-black hover:bg-indigo-600 hover:text-white transition-all text-xl">+</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAdd(item)} 
                    className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 transition-all active:scale-95"
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