import api from './api';

export const getCart = () => api.get('/carts');

export const addToCart = (product_id, qty, color, size) =>
  api.post('/carts/add', { product_id, qty, color, size });

export const updateCartItemQuantity = (cartItemId, qty) =>
  api.patch(`/carts/update/${cartItemId}`, { qty });

export const removeCartItem = (cartItemId) =>
  api.delete(`/carts/remove/${cartItemId}`);

export const checkout = (shippingAddress) =>
  api.post('/carts/checkout', { shippingAddress });
