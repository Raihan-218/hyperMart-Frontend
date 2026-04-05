import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard/productCards.jsx';
import styles from './CategoryPage.module.css';
import { getProductsByCategory } from '../../services/productService';

const MensPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Assuming the backend returns { products: [...] } or just [...]
        // Adjusting based on common patterns, usually res.data is the payload.
        // If the backend filters by category via query param:
        const response = await getProductsByCategory('men');
        // Check if response.data is the array or response.data.products
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

  // Get unique sub-categories from the fetched products
  const subCategories = [...new Set(products.map(p => p.type))];

  // Filter products based on the active filter
  const filteredProducts = activeFilter === 'All'
    ? products
    : products.filter(p => p.type === activeFilter);

  return (
    <div className="container">
      <h1 className={styles.pageTitle}>Men's Collection</h1>
      <p className={styles.pageDescription}>Upgrade your wardrobe with our latest men's wear. From everyday essentials to statement pieces, find everything you need for a fresh look.</p>
      {/* Filter Buttons */}
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

      {/* Products Grid */}
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

export default MensPage;