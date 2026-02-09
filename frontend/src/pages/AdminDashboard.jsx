import { useEffect, useState } from 'react';
import { orderService } from '../services/api';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders({ page: 1, limit: 50 });
      setOrders(response.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) {
      return;
    }

    try {
      await orderService.updateOrderStatus(selectedOrder._id, newStatus);
      setOrders(
        orders.map((o) =>
          o._id === selectedOrder._id ? { ...o, status: newStatus } : o
        )
      );
      setSelectedOrder(null);
      setNewStatus('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order');
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
  };

  const statusColors = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Shipped</p>
            <p className="text-3xl font-bold text-purple-600">{stats.shipped}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Delivered</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.delivered}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600">
              ${stats.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Orders</h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-800 font-semibold">
                      Order #
                    </th>
                    <th className="px-4 py-3 text-left text-gray-800 font-semibold">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-gray-800 font-semibold">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-gray-800 font-semibold">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-gray-800 font-semibold">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-gray-800 font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-gray-800 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {order.userId.name}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-semibold">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        <span
                          className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                            order.paymentStatus === 'completed'
                              ? 'bg-green-500'
                              : 'bg-yellow-500'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                            statusColors[order.status]
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-500 hover:underline font-semibold"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Status Update */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Update Order Status
            </h2>
            <p className="text-gray-600 mb-4">
              Order: {selectedOrder.orderNumber}
            </p>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            >
              <option value="">Select new status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="flex gap-4">
              <button
                onClick={handleStatusUpdate}
                disabled={!newStatus}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setNewStatus('');
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
