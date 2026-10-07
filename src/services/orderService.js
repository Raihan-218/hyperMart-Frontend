import api from './api';

export const getMyOrders = () => api.get('/users/orders');
export const cancelMyOrder = (orderId, reason) =>
  api.post(`/users/orders/${orderId}/cancel`, { reason });

export const getAdminOrder = (orderId) => api.get(`/admin/orders/${orderId}`);
export const updateAdminOrder = (orderId, updates) =>
  api.put(`/admin/orders/${orderId}/status`, updates);
export const getDeliveryPeople = () => api.get('/admin/delivery-people');
