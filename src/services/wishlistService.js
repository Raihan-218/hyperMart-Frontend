import api from './api';

export const getWishlist = () => api.get('/users/wishlist');

export const toggleWishlist = (productId) => api.post(`/users/wishlist/${productId}`);

export const removeWishlistItem = (productId) => api.delete(`/users/wishlist/${productId}`);
