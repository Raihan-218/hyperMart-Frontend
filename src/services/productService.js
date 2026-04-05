import api from './api';

export const getProducts = (params) =>
  api.get('/products', { params });

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const getProductsByCategory = (category) =>
  api.get('/products', { params: { category } });

export const addProduct = (formData) =>
  api.post('/products/addproducts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
