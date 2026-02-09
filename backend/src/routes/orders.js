import express from 'express';
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, updateOrderStatus);
router.delete('/:id', protect, deleteOrder);

// Admin routes
router.get('/', protect, authorize('admin'), getAllOrders);

export default router;
