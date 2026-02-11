import { useCart } from '../hooks/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = ({ onCheckout }) => {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, currentQty, delta) => {
    const newQty = Number(currentQty) + delta;
    if (newQty <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQty);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center animate-in fade-in duration-700">
        <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center text-5xl mb-8 border border-white/10 shadow-2xl">
          🛒
        </div>
        <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase mb-4">
          Your Cart is <span className="text-teal-500">Empty</span>
        </h2>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-10 leading-loose">
          Looks like you haven't added anything to your feast yet.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-teal-600 text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-teal-500 transition-all shadow-xl shadow-teal-900/40 active:scale-95"
        >
          Explore the Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Visual Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
        <div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-[0.8]">
            Your <span className="text-teal-500">Cart</span>
          </h1>
          <p className="text-slate-500 font-black mt-6 uppercase tracking-[0.4em] text-[10px] flex items-center gap-3">
            <span className="w-8 h-[1px] bg-teal-500/50"></span>
            Review your selection before checkout
          </p>
        </div>
        
        <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl backdrop-blur-xl">
          <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest block mb-1">Total Items</span>
          <span className="text-white text-xl font-black italic">{cart.length} Dishes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Item List */}
        <div className="lg:col-span-8 space-y-6">
          {cart.map((item) => (
            <div 
              key={item._id} 
              className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 hover:border-teal-500/30 transition-all duration-500 shadow-xl"
            >
              <div className="w-full md:w-32 h-32 rounded-3xl overflow-hidden border border-white/10 relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2 group-hover:text-teal-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest line-clamp-1 opacity-60 italic">
                  {item.description}
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 w-full md:w-auto">
                <div className="flex items-center bg-black/40 p-1.5 rounded-2xl border border-white/5">
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                    className="w-12 h-12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all font-black text-xl"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-black text-white italic text-lg">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                    className="w-12 h-12 flex items-center justify-center text-white/50 hover:text-white hover:bg-teal-600 rounded-xl transition-all font-black text-xl"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-right min-w-[100px]">
                  <p className="text-2xl font-black text-white italic tracking-tighter">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="text-rose-500 text-[9px] font-black uppercase tracking-widest mt-1 hover:text-rose-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 bg-teal-600 rounded-[3.5rem] p-10 shadow-2xl shadow-teal-900/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>

            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8 relative z-10">Order Summary</h3>
            
            <div className="space-y-4 mb-10 relative z-10">
              <div className="flex justify-between items-center text-teal-100/70 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>Dishes Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-teal-100/70 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>Service Fee</span>
                <span className="italic">Complimentary</span>
              </div>
              <div className="h-[1px] bg-white/20 my-4"></div>
              <div className="flex justify-between items-end">
                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Payable</span>
                <span className="text-white text-5xl font-black italic tracking-tighter">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={onCheckout}
              className="w-full bg-white text-teal-600 py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all duration-500 shadow-2xl active:scale-95 relative z-10"
            >
              Proceed to Checkout
            </button>
            
            <p className="text-center text-teal-900/40 text-[9px] font-black uppercase tracking-widest mt-6 relative z-10 leading-relaxed">
              Taxes and delivery calculated <br/> at the next step
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;