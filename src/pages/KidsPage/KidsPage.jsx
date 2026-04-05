import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard/productCards.jsx';
import styles from '../MensPage/CategoryPage.module.css'; // Reusing styles
import { getProductsByCategory } from '../../services/productService';

const KidsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProductsByCategory('kids');
        setProducts(response.data.products || response.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">{error}</div>;

  const subCategories = [...new Set(products.map(p => p.type))];

  const filteredProducts = activeFilter === 'All'
    ? products
    : products.filter(p => p.type === activeFilter);

  return (
    <div className="container">
      <h1 className={styles.pageTitle}>Kids' Collection</h1>
      <p className={styles.pageDescription}>Shop the coolest and comfiest kidswear. From playful prints to everyday basics, find outfits your kids will love.</p>
      <div className={styles.filterContainer}>
        <button
          onClick={() => setActiveFilter('All')}
          className={activeFilter === 'All' ? styles.activeButton : styles.filterButton}
        >
          All
        </button>
        {subCategories.map(sub => (
          <button
            key={sub}
            onClick={() => setActiveFilter(sub)}
            className={activeFilter === sub ? styles.activeButton : styles.filterButton}
          >
            {sub}
          </button>
        ))}
      </div>

      <div className={styles.productGrid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default KidsPage;