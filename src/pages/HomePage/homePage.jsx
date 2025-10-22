// src/pages/HomePage/HomePage.jsx
// No changes are needed here. The existing code works perfectly with the new styles.

import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import ProductCard from '../../components/ProductCard/productCards.jsx';
import styles from './HomePage.module.css';

const HomePage = () => {
  // Get up to 5 items from each category to feature
  const featuredMen = products.filter(p => p.category === 'men').slice(0, 5);
  const featuredWomen = products.filter(p => p.category === 'women').slice(0, 5);
  const featuredKids = products.filter(p => p.category === 'kids').slice(0, 5);

  return (
    <div className="container">
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>New Season Arrivals</h1>
          <p className={styles.heroSubtitle}>Check out all the new trends for this season</p>
          <Link to="/men" className={styles.heroButton}>Shop The Collection</Link>
        </div>
      </div>

      {/* Featured Men's Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>For Men</h2>
            <p className={styles.sectionDescription}>Discover the latest trends in men's fashion, from casual wear to formal attire.</p>
          </div>
          <Link to="/men" className={styles.viewAllLink}>View All</Link>
        </div>
        <div className={styles.productGrid}>
          {featuredMen.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      {/* Featured Women's Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>For Women</h2>
            <p className={styles.sectionDescription}>Explore our women's collection for chic, comfortable, and stylish outfits.</p>
          </div>
          <Link to="/women" className={styles.viewAllLink}>View All</Link>
        </div>
        <div className={styles.productGrid}>
          {featuredWomen.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
      
      {/* Featured Kid's Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>For Kids</h2>
            <p className={styles.sectionDescription}>Fun, durable, and trendy kidswear for every age. Shop playful prints and comfy basics.</p>
          </div>
          <Link to="/kids" className={styles.viewAllLink}>View All</Link>
        </div>
        <div className={styles.productGrid}>
          {featuredKids.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
};

export default HomePage;