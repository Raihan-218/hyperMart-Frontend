import React from 'react';
import { useCart } from '../../context/CartContext';
import styles from './CartPage.module.css';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();

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
              <div key={item.id} className={styles.cartItem}>
                <img src={item.image} alt={item.name} className={styles.itemImage} />
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemPrice}>₹{item.price.toFixed(2)}</p>
                  <p className={styles.itemQuantity}>Quantity: {item.quantity}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)} 
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