import React from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../../services/productService.js';
import ProductForm from './ProductForm.jsx';

const AddProductPage = () => {
  const navigate = useNavigate();

  const handleAddProduct = async (formData) => {
    await addProduct(formData);
    navigate('/admin/dashboard');
    return { message: 'Product added successfully.' };
  };

  return (
    <main className="container" style={{ maxWidth: '760px', marginTop: '40px', marginBottom: '40px' }}>
      <ProductForm title="Add new product" submitLabel="Add product" onSubmit={handleAddProduct} />
    </main>
  );
};

export default AddProductPage;
