import api from './api';

export const getReviews = (productId) => api.get(`/reviews/${productId}`);

export const addReview = (productId, payload) => api.post(`/reviews/${productId}`, payload);

export const deleteReview = (commentId) => api.delete(`/reviews/comment/${commentId}`);
