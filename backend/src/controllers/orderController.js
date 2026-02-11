import Order from '../models/Order.js';
import mongoose from 'mongoose';

const simulateStatusUpdates = (orderId) => {
  const statuses = ['preparing', 'out_for_delivery', 'delivered'];
  const intervals = [10000, 30000, 60000]; 

  statuses.forEach((status, index) => {
    setTimeout(async () => {
      try {
        const updateData = { status, updatedAt: Date.now() };
        
        if (status === 'out_for_delivery') {
          updateData['deliveryMetrics.qualityScore'] = 85;
        }
        if (status === 'delivered') {
          updateData['deliveryMetrics.qualityScore'] = 70;
        }

        await Order.findByIdAndUpdate(orderId, updateData);
        console.log(`Simulation: Order ${orderId} updated to ${status}`);
      } catch (err) {
        console.error("Simulation update failed:", err.message);
      }
    }, intervals[index]);
  });
};

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items' });
    }

    const orderData = {
      userId: req.user.id,
      items: items.map(item => ({
        ...item,
        productId: mongoose.Types.ObjectId.isValid(item.productId) ? item.productId : new mongoose.Types.ObjectId()
      })),
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'confirmed',
      paymentStatus: 'completed',
      ecoData: {
        co2SavedKg: (Math.random() * 2).toFixed(2),
        isBatchDelivery: Math.random() > 0.5
      },
      deliveryMetrics: {
        estimatedArrival: new Date(Date.now() + 30 * 60000),
        qualityScore: 100
      }
    };

    const order = await Order.create(orderData);
    simulateStatusUpdates(order._id);

    return res.status(201).json({
      success: true,
      order,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};
    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate('userId', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.status(200).json({ success: true, message: 'Order updated successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};