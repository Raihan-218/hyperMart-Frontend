import api from './api';

export const getMyOrders = () => api.get('/users/orders');
