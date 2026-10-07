import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductById, updateProduct } from '../../services/productService.js';
import ProductForm from './ProductForm.jsx';
import styles from './AddProductPage.module.css';

const AdminProductEditPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getProductById(productId)
      .then(({ data }) => {
        if (active) setProduct(data?.product || null);
        if (active && !data?.product) setError('Product details were not returned by the server.');
      })
      .catch((loadError) => {
        if (active) setError(loadError?.response?.data?.message || (typeof loadError === 'string' ? loadError : loadError?.message) || 'Unable to load product details.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [productId]);

  const saveProduct = async (formData) => {
    const { data } = await updateProduct(productId, formData);
    if (!data?.updatedProduct) throw new Error('The update response did not include the updated product.');
    setProduct(data.updatedProduct);
    return data;
  };

  return (
    <main className={`container ${styles.editPage}`}>
      <Link className={styles.backLink} to="/admin/inventory">← Back to products</Link>
      {loading ? <p role="status">Loading product…</p> : error ? (
        <p className={styles.errorMessage} role="alert">{error}</p>
      ) : product ? (
        <ProductForm
          product={product}
          title="Edit product"
          submitLabel="Save changes"
          onSubmit={saveProduct}
        />
      ) : <p className={styles.errorMessage} role="alert">Product not found.</p>}
    </main>
  );
};

export default AdminProductEditPage;
