import { useCart } from '../hooks/CartContext';
import { useNavigate } from 'react-router-dom';
import { HiOutlineTrash } from 'react-icons/hi'; // Modern trash icon

const CartPage = ({ onCheckout }) => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-slate-950 min-h-[70vh]">
        <div className="text-8xl mb-6 animate-bounce">🛒</div>
        <h2 className="text-3xl font-black text-slate-500 tracking-tight">Your cart is empty</h2>
        <p className="text-slate-600 mt-2 mb-8">Looks like you haven't added any delicacies yet.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 my-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">Shopping Cart</h1>
        <span className="bg-blue-600/10 text-blue-400 px-4 py-1 rounded-full text-sm font-bold">
          {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item._id} className="group flex items-center justify-between bg-slate-900/50 backdrop-blur-xl p-5 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all shadow-xl">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img src={item.image} className="w-24 h-24 object-cover rounded-2xl shadow-lg" alt={item.name} />
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="absolute -top-2 -left-2 bg-rose-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <HiOutlineTrash size={16} />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-white">{item.name}</h4>
                  <p className="text-blue-400 font-black text-lg">${item.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-800/50 rounded-2xl p-2 border border-white/5">
                <button 
                  onClick={() => updateQuantity(item._id, -1)} 
                  className="w-10 h-10 bg-slate-700 text-white rounded-xl shadow-inner font-black hover:bg-slate-600 transition-colors"
                >
                  −
                </button>
                <span className="w-6 text-center font-black text-white">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item._id, 1)} 
                  className="w-10 h-10 bg-blue-600 text-white rounded-xl shadow-lg font-black hover:bg-blue-500 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-blue-500/10">
            <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-widest text-sm">Order Summary</h3>
            
            <div className="space-y-3 mb-8 border-b border-slate-100 pb-6">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Delivery</span>
                <span className="text-green-600 font-bold underline">FREE</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-black mb-8">
              <span className="text-slate-800">Total</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={onCheckout} 
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
              Checkout Now
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            
            <p className="text-center text-slate-400 text-xs mt-6 font-medium uppercase tracking-tighter">
              Secure SSL Encrypted Payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;