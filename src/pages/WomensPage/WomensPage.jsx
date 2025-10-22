import React, { useState } from 'react';
import { products } from '../../data/products.js';
import ProductCard from '../../components/ProductCard/productCards.jsx';
import styles from '../MensPage/CategoryPage.module.css'; // Reusing styles from MensPage

const WomensPage = () => {
  const womensProducts = products.filter(p => p.category === 'women');
  const subCategories = [...new Set(womensProducts.map(p => p.type))];
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProducts = activeFilter === 'All'
    ? womensProducts
    : womensProducts.filter(p => p.type === activeFilter);

  return (
    <div className="container">
      <h1 className={styles.pageTitle}>Women's Collection</h1>
        <p className={styles.pageDescription}>Discover the latest in women's fashion. Shop elegant dresses, casual wear, and accessories to express your unique style.</p>
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
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WomensPage;