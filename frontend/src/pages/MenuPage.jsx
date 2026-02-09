import { useState } from 'react';
import { useMenu } from '../hooks/useMenu';
import { useAuth } from '../hooks/AuthContext';
import { useCart } from '../hooks/CartContext';

const MenuPage = ({ onUnauthorized }) => {
  const { menu } = useMenu();
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const [showModal, setShowModal] = useState(false);

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white p-8 rounded-2xl max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-4">Join Culinaria</h2>
            <p className="mb-6 text-gray-600">Please login or register to place an order.</p>
            <div className="flex gap-4">
              <button onClick={() => onUnauthorized()} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">Login</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">Browse More</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {menu.map(item => {
          const cartItem = getCartItem(item._id);
          
          return (
            <div key={item._id} className="border rounded-2xl overflow-hidden shadow-sm">
              <img src={item.image} className="h-48 w-full object-cover" alt={item.name} />
              <div className="p-4">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-600">${Number(item.price).toFixed(2)}</span>
                  
                  {cartItem ? (
                    <div className="flex items-center bg-indigo-50 rounded-xl overflow-hidden border border-indigo-100">
                      <button 
                        onClick={() => handleQuantityChange(item._id, cartItem.quantity, -1)}
                        className="px-3 py-2 text-indigo-600 hover:bg-indigo-100 transition-colors font-bold"
                      >
                        −
                      </button>
                      <span className="px-2 font-black text-indigo-600 text-sm w-8 text-center">
                        {cartItem.quantity}
                      </span>
                      <button 
                        onClick={() => handleQuantityChange(item._id, cartItem.quantity, 1)}
                        className="px-3 py-2 text-indigo-600 hover:bg-indigo-100 transition-colors font-bold"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleAdd(item)} 
                      className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuPage;