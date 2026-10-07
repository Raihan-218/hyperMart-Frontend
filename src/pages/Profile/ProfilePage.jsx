import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { updateUserProfile } from '../../services/authService.js';
import { cancelMyOrder, getMyOrders } from '../../services/orderService.js';
import { getWishlist, removeWishlistItem } from '../../services/wishlistService.js';
import styles from './ProfilePage.module.css';

const defaultFormState = (user) => {
  const address = user?.address || {};

  return {
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    street: address.street || '',
    city: address.city || '',
    state: address.state || '',
    postalCode: address.postalCode || '',
    country: address.country || 'India'
  };
};

const ProfilePage = () => {
  const { user, refreshUser, logout } = useAuth();
  const [formData, setFormData] = useState(defaultFormState(user));
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [wishlist, setWishlist] = useState([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [wishlistError, setWishlistError] = useState('');
  const [removingProductId, setRemovingProductId] = useState('');
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [ordersLoadError, setOrdersLoadError] = useState('');
  const [ordersMessage, setOrdersMessage] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState('');

  useEffect(() => {
    setFormData(defaultFormState(user));
  }, [user]);

  const addressSummary = useMemo(() => {
    const parts = [formData.street, formData.city, formData.state, formData.postalCode]
      .filter(Boolean)
      .join(', ');

    return parts || 'No address added yet';
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const openWishlist = async () => {
    setActiveSection('wishlist');
    setWishlistError('');
    setIsLoadingWishlist(true);

    try {
      const response = await getWishlist();
      setWishlist(response.data?.wishlist || []);
    } catch (loadError) {
      setWishlistError(typeof loadError === 'string' ? loadError : loadError.message || 'Could not load your wishlist.');
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    setWishlistError('');
    setRemovingProductId(productId);

    try {
      await removeWishlistItem(productId);
      setWishlist((items) => items.filter((item) => String(item._id || item.id) !== productId));
    } catch (removeError) {
      setWishlistError(typeof removeError === 'string' ? removeError : removeError.message || 'Could not remove this product from your wishlist.');
    } finally {
      setRemovingProductId('');
    }
  };

  const openOrderHistory = async () => {
    setActiveSection('orders');
    setOrdersError('');
    setOrdersLoadError('');
    setOrdersMessage('');
    setIsLoadingOrders(true);

    try {
      const response = await getMyOrders();
      setOrders(Array.isArray(response.data?.orders) ? response.data.orders : []);
    } catch (loadError) {
      setOrdersLoadError(typeof loadError === 'string' ? loadError : loadError.message || 'Could not load your order history.');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (cancellingOrderId || !window.confirm('Cancel this order? This action cannot be undone.')) return;

    setCancellingOrderId(orderId);
    setOrdersError('');
    setOrdersMessage('');
    try {
      const response = await cancelMyOrder(orderId);
      const updatedOrder = response.data?.order;
      if (!updatedOrder) throw new Error('The cancellation response did not include the updated order.');
      setOrders((currentOrders) => currentOrders.map((order) =>
        order._id === orderId ? updatedOrder : order
      ));
      setOrdersMessage(response.data.message || 'Order cancelled successfully.');
    } catch (cancelError) {
      setOrdersError(cancelError?.response?.data?.message || cancelError?.message || 'Could not cancel this order.');
    } finally {
      setCancellingOrderId('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!formData.fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    try {
      setIsSaving(true);
      await updateUserProfile({
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country.trim() || 'India'
        }
      });

      await refreshUser();
      setMessage('Profile updated successfully.');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Could not update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-12 text-center">
        <p className="text-lg font-medium">Please log in to view your account.</p>
      </div>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.profileBadge}>
            <div className={styles.avatar}>{user.fullName?.charAt(0)?.toUpperCase() || 'U'}</div>
            <div>
              <p className={styles.greeting}>Hello</p>
              <h2>{user.fullName || 'Customer'}</h2>
            </div>
          </div>

          <nav className={styles.navList}>
            <button
              type="button"
              className={`${styles.navItem} ${activeSection === 'profile' ? styles.active : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              My Profile
            </button>
            {/* <button
              type="button"
              className={`${styles.navItem} ${activeSection === 'orders' ? styles.active : ''}`}
              onClick={openOrderHistory}
            >
              My Orders
            </button> */}
            <button
              type="button"
              className={`${styles.navItem} ${activeSection === 'orders' ? styles.active : ''}`}
              onClick={openOrderHistory}
            >
              Order History
            </button>
            <button
              type="button"
              className={`${styles.navItem} ${activeSection === 'wishlist' ? styles.active : ''}`}
              onClick={openWishlist}
            >
              Wishlist
            </button>
            <Link className={styles.navItem} to="/cart">Cart</Link>
            <button type="button" className={styles.navItem}>Account Settings</button>
            <button type="button" className={`${styles.navItem} ${styles.logout}`} onClick={logout}>Logout</button>
          </nav>
        </aside>

        <main className={styles.content}>
          <div className={styles.headerRow}>
            <div>
              <p className={styles.kicker}>My Account</p>
              <h1>
                {activeSection === 'wishlist'
                  ? 'My Wishlist'
                  : activeSection === 'orders'
                    ? 'Order History'
                    : 'My Profile'}
              </h1>
            </div>
            {activeSection === 'profile' && !isEditing && (
              <button type="button" className={styles.primaryButton} onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          {message && <div className={styles.successMessage}>{message}</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}

          {activeSection === 'orders' ? (
            <section aria-label="Order history">
              {ordersMessage && <div className={styles.successMessage} role="status">{ordersMessage}</div>}
              {ordersError && <div className={styles.errorMessage} role="alert">{ordersError}</div>}
              {isLoadingOrders ? (
                <p className={styles.wishlistStatus} role="status">Loading your orders...</p>
              ) : ordersLoadError ? (
                <div className={styles.errorMessage} role="alert">{ordersLoadError}</div>
              ) : orders.length === 0 ? (
                <div className={styles.emptyWishlist}>
                  <h2>No orders yet</h2>
                  <p>Your completed and current orders will appear here.</p>
                  <Link to="/" className={styles.primaryButton}>Start shopping</Link>
                </div>
              ) : (
                <div className={styles.orderList}>
                  {orders.map((order) => {
                    const itemsSubtotal = Number(order.subtotal ?? (order.items || []).reduce(
                      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
                      0
                    ));
                    const taxAmount = Number(order.taxAmount ?? Math.max(0, Number(order.totalAmount || 0) - itemsSubtotal));
                    const isCancellable = ['Pending', 'Confirmed', 'Processing'].includes(order.status || 'Pending');

                    return (
                    <article className={styles.orderCard} key={order._id}>
                      <header className={styles.orderHeader}>
                        <div>
                          <h2>Order #{String(order._id).slice(-8).toUpperCase()}</h2>
                          <p>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date unavailable'}</p>
                        </div>
                        <div className={styles.orderStatus}>
                          <span className={order.status === 'Cancelled' ? styles.cancelledStatus : ''}>{order.status || 'Pending'}</span>
                          <strong>₹{Number(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                          {order.refundStatus === 'pending' && <small>Refund pending</small>}
                        </div>
                      </header>
                      <ul className={styles.orderItems}>
                        {(Array.isArray(order.items) ? order.items : []).map((item, index) => (
                          <li key={`${order._id}-${item.product || item.name}-${index}`}>
                            <span>
                              {item.name || 'Product'} × {item.quantity || 1}
                              {(item.color || item.size) && (
                                <small>{[item.color, item.size].filter(Boolean).join(' / ')}</small>
                              )}
                            </span>
                            <strong>₹{(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                          </li>
                        ))}
                      </ul>
                      <div className={styles.orderBreakdown}>
                        <div><span>Items subtotal</span><span>₹{itemsSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                        <div><span>GST (18%)</span><span>₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
                        <div><span>Shipping</span><span>{Number(order.shippingAmount || 0) === 0 ? 'Free' : `₹${Number(order.shippingAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}</span></div>
                        {Number(order.discountAmount || 0) > 0 && <div><span>Discount</span><span>-₹{Number(order.discountAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>}
                        <div className={styles.orderTotal}><strong>Total</strong><strong>₹{Number(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div>
                      </div>
                      <section className={styles.customerTimeline} aria-label={`Delivery updates for order ${String(order._id).slice(-8)}`}>
                        <h3>Delivery updates</h3>
                        <p className={styles.customerCurrentStatus}>Current status: <strong>{order.status || 'Pending'}</strong></p>
                        {Array.isArray(order.trackingHistory) && order.trackingHistory.length > 0 ? (
                          <ol>
                            {order.trackingHistory.map((entry, index) => (
                              <li key={`${order._id}-history-${index}`}>
                                <strong>{entry.status || 'Status update'}</strong>
                                <time>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Time unavailable'}</time>
                              </li>
                            ))}
                          </ol>
                        ) : <p>No tracking updates are available yet.</p>}
                      </section>
                      {isCancellable && (
                        <div className={styles.cancelOrderRow}>
                          <button
                            type="button"
                            className={styles.cancelOrderButton}
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={Boolean(cancellingOrderId)}
                          >
                            {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                        </div>
                      )}
                    </article>
                    );
                  })}
                </div>
              )}
            </section>
          ) : activeSection === 'wishlist' ? (
            <section aria-label="Wishlist">
              {isLoadingWishlist ? (
                <p className={styles.wishlistStatus} role="status">Loading your wishlist...</p>
              ) : wishlistError ? (
                <div className={styles.errorMessage} role="alert">{wishlistError}</div>
              ) : wishlist.length === 0 ? (
                <div className={styles.emptyWishlist}>
                  <h2>Your wishlist is empty</h2>
                  <p>Save products you like and they will appear here.</p>
                  <Link to="/" className={styles.primaryButton}>Explore products</Link>
                </div>
              ) : (
                <div className={styles.wishlistGrid}>
                  {wishlist.map((product) => {
                    const productId = String(product._id || product.id);
                    const image = typeof product.images?.[0] === 'string'
                      ? product.images[0]
                      : product.images?.[0]?.url;

                    return (
                      <article className={styles.wishlistCard} key={productId}>
                        <Link to={`/product/${productId}`} className={styles.wishlistProductLink}>
                          {image ? (
                            <img src={image} alt={product.name} className={styles.wishlistImage} />
                          ) : (
                            <div className={styles.wishlistImagePlaceholder}>No image</div>
                          )}
                          <h2>{product.name}</h2>
                        </Link>
                        <p className={styles.wishlistPrice}>₹{Number(product.price || 0).toLocaleString('en-IN')}</p>
                        <button
                          type="button"
                          className={styles.removeWishlistButton}
                          onClick={() => handleRemoveFromWishlist(productId)}
                          disabled={removingProductId === productId}
                        >
                          {removingProductId === productId ? 'Removing...' : 'Remove'}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          ) : !isEditing ? (
            <div className={styles.detailsGrid}>
              <div className={styles.detailCard}>
                <h3>Account information</h3>
                <div className={styles.detailRow}>
                  <span>Name</span>
                  <strong>{user.fullName || 'Not provided'}</strong>
                </div>
                <div className={styles.detailRow}>
                  <span>Email</span>
                  <strong>{user.email || 'Not provided'}</strong>
                </div>
                <div className={styles.detailRow}>
                  <span>Phone</span>
                  <strong>{user.phoneNumber || 'Not provided'}</strong>
                </div>
              </div>

              <div className={styles.detailCard}>
                <h3>Address</h3>
                <p>{addressSummary}</p>
              </div>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <label>
                  <span>Full Name</span>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} />
                </label>

                <label>
                  <span>Email</span>
                  <input name="email" value={formData.email} onChange={handleChange} disabled />
                </label>

                <label>
                  <span>Phone Number</span>
                  <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter phone number" />
                </label>

                <label>
                  <span>Street Address</span>
                  <input name="street" value={formData.street} onChange={handleChange} placeholder="House number, street" />
                </label>

                <label>
                  <span>City</span>
                  <input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                </label>

                <label>
                  <span>State</span>
                  <input name="state" value={formData.state} onChange={handleChange} placeholder="State" />
                </label>

                <label>
                  <span>Postal Code</span>
                  <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal code" />
                </label>

                <label>
                  <span>Country</span>
                  <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
                </label>
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.secondaryButton} onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;