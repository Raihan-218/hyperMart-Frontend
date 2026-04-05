// src/pages/HomePage/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductsByCategory } from '../../services/productService';
import ProductCard from '../../components/ProductCard/productCards.jsx';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [featuredMen, setFeaturedMen] = useState([]);
  const [featuredWomen, setFeaturedWomen] = useState([]);
  const [featuredKids, setFeaturedKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menRes, womenRes, kidsRes] = await Promise.all([
          getProductsByCategory('men'),
          getProductsByCategory('women'),
          getProductsByCategory('kids')
        ]);

        // Assuming API returns { products: [...] }
        setFeaturedMen((menRes.data.products || menRes.data || []).slice(0, 5));
        setFeaturedWomen((womenRes.data.products || womenRes.data || []).slice(0, 5));
        setFeaturedKids((kidsRes.data.products || kidsRes.data || []).slice(0, 5));

      } catch (err) {
        console.error("Failed to fetch home page data", err);
        setError("Failed to load featured products.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>New Season Arrivals</h1>
          </div>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading featured products...</div>
      </div>
    );
  }

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

      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

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
          {featuredMen.map(product => <ProductCard key={product._id} product={product} />)}
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
          {featuredWomen.map(product => <ProductCard key={product._id} product={product} />)}
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
          {featuredKids.map(product => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>
    </div>
  );
};

export default HomePage;