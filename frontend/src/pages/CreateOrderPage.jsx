import { useState } from 'react';
import { useOrder } from '../hooks/useOrder';

function CreateOrderPage() {
  const { createOrder, loading, error } = useOrder();
  const [formData, setFormData] = useState({
    items: [{ productName: '', quantity: 1, price: 0 }],
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    paymentMethod: 'credit_card',
    notes: '',
  });
  const [message, setMessage] = useState('');

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'quantity' || field === 'price' ? Number(value) : value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productName: '', quantity: 1, price: 0 }],
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: { ...prev.shippingAddress, [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      setMessage('Please add at least one item');
      return;
    }

    try {
      await createOrder(formData);
      setMessage('Order created successfully!');
      setFormData({
        items: [{ productName: '', quantity: 1, price: 0 }],
        shippingAddress: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
        paymentMethod: 'credit_card',
        notes: '',
      });
      // Redirect to orders
      setTimeout(() => {
        window.location.href = '/orders';
      }, 1500);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const totalAmount = formData.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Create New Order
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {message && (
            <div
              className={`px-4 py-3 rounded mb-4 ${
                message.includes('successfully')
                  ? 'bg-green-100 border border-green-400 text-green-700'
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Items Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Items</h2>
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-gray-300 rounded-lg"
                >
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={item.productName}
                      onChange={(e) =>
                        handleItemChange(index, 'productName', e.target.value)
                      }
                      className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, 'quantity', e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="1"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, 'price', e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">
                      Subtotal: ${(item.quantity * item.price).toFixed(2)}
                    </p>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddItem}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
              >
                Add Item
              </button>

              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-lg font-bold text-gray-800">
                  Total Amount: ${totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Street"
                  value={formData.shippingAddress.street}
                  onChange={(e) =>
                    handleAddressChange('street', e.target.value)
                  }
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.shippingAddress.city}
                  onChange={(e) =>
                    handleAddressChange('city', e.target.value)
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.shippingAddress.state}
                  onChange={(e) =>
                    handleAddressChange('state', e.target.value)
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={formData.shippingAddress.postalCode}
                  onChange={(e) =>
                    handleAddressChange('postalCode', e.target.value)
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.shippingAddress.country}
                  onChange={(e) =>
                    handleAddressChange('country', e.target.value)
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Payment Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment</h2>
              <select
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentMethod: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Notes Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Notes</h2>
              <textarea
                placeholder="Order notes (optional)"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Creating Order...' : 'Create Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateOrderPage;
