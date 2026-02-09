import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  }
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (!error.response) {
      console.error("Network Error: Please check if your backend server is running on http://localhost:5000");
      return Promise.reject(new Error("Server connection lost. Please try again."));
    }

    const status = error.response?.status;
    
    if (status === 401) {
      const url = error.config.url || '';
      const isAuthPage = url.includes('/auth/login');
      const isPublicPage = url.includes('/menu');

      if (!isAuthPage && !isPublicPage) {
        localStorage.removeItem('token');
  
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'; 
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
};

export const menuService = {
  getMenuItems: () => api.get('/menu'),
};

export const orderService = {
 
  createOrder: (orderData) => api.post('/orders', orderData),
  getUserOrders: () => api.get('/orders/my-orders'), 
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export default api;