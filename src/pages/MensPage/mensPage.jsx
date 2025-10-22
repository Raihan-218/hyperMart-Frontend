import React, { useState } from 'react';
import { products } from '../../data/products';
import ProductCard from '../../components/ProductCard/productCards.jsx';
import styles from './CategoryPage.module.css'; // We'll use a generic name for reusability

const MensPage = () => {
  // 1. Filter products for the 'men' category
  const mensProducts = products.filter(p => p.category === 'men');

  // 2. Get unique sub-categories for filter buttons
  const subCategories = [...new Set(mensProducts.map(p => p.type))];

  // 3. State to manage the active filter
  const [activeFilter, setActiveFilter] = useState('All');

  // 4. Filter products based on the active filter
  const filteredProducts = activeFilter === 'All'
    ? mensProducts
    : mensProducts.filter(p => p.type === activeFilter);

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
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MensPage;