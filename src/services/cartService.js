import api from './api';

export const getCart = () => api.get('/carts');

export const addToCart = (product_id, qty) =>
  api.post('/carts/add', { product_id, qty });

export const removeCartItem = (product_id) =>
  api.delete(`/carts/remove/${product_id}`);

export const checkout = () =>
  api.post('/carts/checkout');
