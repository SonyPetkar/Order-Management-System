import { useState, useCallback } from 'react';
import { orderService } from '../services/api';

export const useOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.createOrder(orderData);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to create order';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserOrders = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getUserOrders(params);
      setOrders(response.data.orders);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to fetch orders';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllOrders = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getAllOrders(params);
      setOrders(response.data.orders);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to fetch orders';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.updateOrderStatus(id, status);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to update order';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    loading,
    error,
    createOrder,
    fetchUserOrders,
    fetchAllOrders,
    updateStatus,
  };
};
