import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/useCart';
import { useAuth } from '../../context/AuthContext';
import styles from './CartPage.module.css';

const defaultAddress = (user) => ({
  street: user?.address?.street || '',
  city: user?.address?.city || '',
  state: user?.address?.state || '',
  postalCode: user?.address?.postalCode || '',
  country: user?.address?.country || 'India',
});

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartTotals, removeFromCart, updateQuantity, checkoutCart, loading } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [shippingAddress, setShippingAddress] = useState(defaultAddress(user));

  useEffect(() => {
    setShippingAddress(defaultAddress(user));
  }, [user]);

  const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const updateAddressField = (field, value) => {
    setShippingAddress((current) => ({ ...current, [field]: value }));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    const missing = !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode;
    if (missing) {
      setCheckoutError('Please add a complete shipping address before checkout.');
      return;
    }

    try {
      setCheckoutLoading(true);
      setCheckoutError('');
      await checkoutCart(shippingAddress);
      navigate('/profile');
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to create your order right now.';
      setCheckoutError(message);
    } finally {
      setCheckoutLoading(false);
    }
  };

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
            {cartItems.map((item) => (
              <div key={item.cartItemId} className={styles.cartItem}>
                <img src={item.image} alt={item.name} className={styles.itemImage} />
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemPrice}>₹{Number(item.price || 0).toFixed(2)}</p>
                  <p className={styles.itemOptions}>{item.color || 'Default'} / {item.size || 'One Size'}</p>
                  <div className={styles.quantityControls}>
                    <button type="button" onClick={() => updateQuantity(item.cartItemId, Number(item.quantity || 0) - 1)} aria-label="Decrease quantity">-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.cartItemId, Number(item.quantity || 0) + 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <button type="button" onClick={() => removeFromCart(item.cartItemId)} className={styles.removeButton}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className={styles.cartSummary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryLine}>
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{Number(cartTotals.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className={styles.summaryLine}>
              <span>GST (18%)</span>
              <span>₹{Number(cartTotals.taxAmount || 0).toFixed(2)}</span>
            </div>
            <div className={styles.summaryLine}>
              <span>Shipping</span>
              <span>{Number(cartTotals.shippingAmount || 0) === 0 ? 'Free' : `₹${Number(cartTotals.shippingAmount).toFixed(2)}`}</span>
            </div>
            {Number(cartTotals.discountAmount || 0) > 0 && (
              <div className={styles.summaryLine}>
                <span>Discount</span>
                <span>-₹{Number(cartTotals.discountAmount).toFixed(2)}</span>
              </div>
            )}
            <div className={`${styles.summaryLine} ${styles.summaryTotal}`}>
              <span>Total</span>
              <span>₹{Number(cartTotals.totalAmount || 0).toFixed(2)}</span>
            </div>

            <div className={styles.addressSection}>
              <h3>Shipping Address</h3>
              <div className={styles.addressFields}>
                <input value={shippingAddress.street} onChange={(event) => updateAddressField('street', event.target.value)} placeholder="Street address" />
                <input value={shippingAddress.city} onChange={(event) => updateAddressField('city', event.target.value)} placeholder="City" />
                <input value={shippingAddress.state} onChange={(event) => updateAddressField('state', event.target.value)} placeholder="State" />
                <input value={shippingAddress.postalCode} onChange={(event) => updateAddressField('postalCode', event.target.value)} placeholder="Postal code" />
                <input value={shippingAddress.country} onChange={(event) => updateAddressField('country', event.target.value)} placeholder="Country" />
              </div>
            </div>

            {checkoutError && <p className={styles.errorMessage} role="alert">{checkoutError}</p>}
            <button className={styles.checkoutButton} onClick={handleCheckout} disabled={checkoutLoading || loading}>
              {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;