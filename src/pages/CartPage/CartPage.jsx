// src/pages/CartPage/CartPage.jsx

import React from 'react';
import { useCart } from '../../context/CartContext';
import styles from './CartPage.module.css';
import { Link } from 'react-router-dom';

const CartPage = () => {
  // 1. Get updateQuantity as well, just in case
  const { cartItems, removeFromCart, updateQuantity } = useCart(); 

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`${styles.cartContainer} container`}>
      <h1 className={styles.pageTitle}>Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is empty.</p>
          <Link to="/" className={styles.shopLink}>Continue Shopping</Link>
        </div>
      ) : (
        <div className={styles.cartGrid}>
          <div className={styles.cartItems}>
            {cartItems.map(item => (
              // 2. Use item.cartItemId for the key, as it's truly unique
              <div key={item.cartItemId} className={styles.cartItem}> 
                <img src={item.image} alt={item.name} className={styles.itemImage} />
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemPrice}>₹{item.price.toFixed(2)}</p>
                  
                  {/* 3. Added item color and size for clarity */}
                  <p className={styles.itemOptions}>{item.color} / {item.size}</p> 
                  
                  {/* 4. (Optional) Add a quantity updater */}
                  <div className={styles.quantityControls}>
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button 
                  // 5. THE FIX: Use item.cartItemId here
                  onClick={() => removeFromCart(item.cartItemId)} 
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className={styles.cartSummary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryLine}>
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryLine}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={`${styles.summaryLine} ${styles.summaryTotal}`}>
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <button className={styles.checkoutButton}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;