import api from './api';

export const getProducts = (params) =>
  api.get('/products', { params });

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const getProductsByCategory = (category, params = {}) =>
  api.get('/products', { params: { category, ...params } });

export const addProduct = (formData) =>
  api.post('/products/addproducts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateProduct = (id, payload) => api.put(
  `/products/updateProduct/${id}`,
  payload,
  payload instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
);
