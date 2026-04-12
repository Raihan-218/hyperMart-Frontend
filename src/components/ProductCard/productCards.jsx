// src/components/ProductCard/productCards.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductCards.module.css';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className={styles.productCard}>
      <div className={styles.imageContainer}>
        <img src={product.images?.[0]?.url} alt={product.name} className={styles.productImage} />
        
      
        <div className={styles.viewOverlay}>
          <span>View Details</span>
        </div>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productPrice}>₹{product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
