import { useState } from 'react';
import { useCart } from '../hooks/CartContext';
import { orderService } from '../services/api'; 
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const CheckoutPage = ({ onOrderPlaced }) => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentStage, setPaymentStage] = useState('idle');
  const [formData, setFormData] = useState({ 
    name: '', 
    address: '', 
    phone: '', 
    payment: 'UPI' 
  });
  
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b']
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate initial gateway connection
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPaymentStage('processing');
    setLoading(false);
  };

  const finalizeOrder = async () => {
    setLoading(true);

    // Map UI selection to the ENUMS in your Order.js model
    const mappedPaymentMethod = 
      formData.payment === 'Card' ? 'credit_card' : 
      formData.payment === 'UPI' ? 'bank_transfer' : 'bank_transfer';

    const orderData = {
      items: cart.map(item => ({
        productId: item._id, 
        productName: item.name,
        image: item.image, 
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity 
      })),
      paymentMethod: mappedPaymentMethod,
      shippingAddress: {
        street: formData.address, 
        city: 'Pune',             
        state: 'Maharashtra',     
        postalCode: '411001',     
        country: 'India'
      },
      totalAmount: total,
      status: 'confirmed',      
      paymentStatus: 'completed' 
    };

    try {
      const response = await orderService.createOrder(orderData);
      
      // Handle different response structures from backend
      const createdOrder = response.data?.data || response.data?.order || response.data;
      const orderId = createdOrder?._id || createdOrder?.id;
      
      if (orderId) {
        // Save tracking info for the Tracking Page
        localStorage.setItem('activeTrackingId', String(orderId));
        localStorage.setItem('trackingStartTime', String(Date.now()));

        setPaymentStage('idle');
        fireConfetti();
        clearCart();
        setShowModal(String(orderId)); 
      } else {
        throw new Error("Order created but server returned no ID");
      }
    } catch (err) {
      console.error("Order Finalization Error:", err.response?.data || err.message);
      const errorDetail = err.response?.data?.message || "Server Error (Connection Reset)";
      alert(`Order failed: ${errorDetail}`);
      setPaymentStage('idle');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-950 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl text-slate-500 font-black tracking-tight">CART IS EMPTY</h2>
        <button onClick={() => navigate('/')} className="text-blue-500 font-bold underline mt-4">
          RETURN TO MENU
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 my-10 bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden relative">
      
      {/* Payment Processing Overlay */}
      {paymentStage === 'processing' && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-2xl text-center border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic">S</div>
                <span className="font-black text-slate-900 tracking-tighter">SECURE_PAY</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Mode</span>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 uppercase mb-2">Authorize Payment</h3>
            <p className="text-4xl font-black text-blue-600 italic tracking-tighter mb-8">${total.toFixed(2)}</p>
            
            <div className="bg-slate-50 p-5 rounded-2xl mb-8 border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Method</span>
                <span className="font-black text-slate-900 uppercase italic">{formData.payment}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setPaymentStage('idle')} className="py-4 rounded-2xl bg-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                Cancel
              </button>
              <button onClick={finalizeOrder} disabled={loading} className="py-4 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                {loading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Pay'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3.5rem] p-12 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✨</div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter italic uppercase">Order Placed!</h3>
            <p className="text-slate-500 font-bold leading-relaxed mb-8 text-sm text-center">
              Thank you for placing the order with us! We value your time and will deliver the food in a short span.
            </p>
            <button onClick={() => { 
              const orderId = typeof showModal === 'string' ? showModal : null;
              setShowModal(false); 
              onOrderPlaced(orderId); 
            }} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] hover:bg-slate-800 transition-all uppercase">
              Track Order
            </button>
          </div>
        </div>
      )}

      <div className="bg-slate-900 -mx-6 -mt-6 p-10 mb-8 text-center">
        <h2 className="text-3xl font-black text-white tracking-tighter italic">CHECKOUT</h2>
        <div className="h-1 w-20 bg-blue-500 mx-auto mt-2 rounded-full"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <input required type="text" placeholder="Full Name" 
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
          
          <textarea required placeholder="Delivery Address" 
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none h-28 resize-none" 
            onChange={(e) => setFormData({...formData, address: e.target.value})} />
          
          <input required type="tel" placeholder="Phone Number" 
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} />
        </div>
        
        <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
          <h3 className="font-black mb-4 text-slate-800 text-xs uppercase tracking-widest ml-1">Payment Options</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {['UPI', 'Card', 'Cash'].map(mode => (
              <button key={mode} type="button" 
                onClick={() => setFormData({...formData, payment: mode})}
                className={`py-3 rounded-2xl border-2 font-black text-xs transition-all ${
                  formData.payment === mode 
                  ? 'border-blue-600 bg-blue-600 text-white shadow-lg' 
                  : 'border-white bg-white text-slate-400'
                }`}>
                {mode}
              </button>
            ))}
          </div>

          {formData.payment === 'Card' && (
            <div className="space-y-3 p-4 bg-white rounded-2xl border border-slate-200 animate-in fade-in zoom-in duration-300">
              <div className="relative">
                <input type="text" placeholder="Card Number" className="w-full p-3 bg-slate-50 rounded-xl border-none text-sm" />
                <span className="absolute right-4 top-3 text-slate-300">💳</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="MM/YY" className="p-3 bg-slate-50 rounded-xl border-none text-sm" />
                <input type="text" placeholder="CVC" className="p-3 bg-slate-50 rounded-xl border-none text-sm" />
              </div>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full ${loading ? 'bg-slate-800 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'} text-white py-5 rounded-[2rem] font-black text-xl transition-all shadow-xl active:scale-95`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>PROCESSING...</span>
            </div>
          ) : (
            `PLACE ORDER $${total.toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;