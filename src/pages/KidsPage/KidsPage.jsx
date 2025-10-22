import React, { useState } from 'react';
import { products } from '../../data/products.js';
import ProductCard from '../../components/ProductCard/productCards.jsx';
import styles from '../MensPage/CategoryPage.module.css'; // Reusing styles

const KidsPage = () => {
  const kidsProducts = products.filter(p => p.category === 'kids');
  const subCategories = [...new Set(kidsProducts.map(p => p.type))];
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProducts = activeFilter === 'All'
    ? kidsProducts
    : kidsProducts.filter(p => p.type === activeFilter);

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
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default KidsPage;