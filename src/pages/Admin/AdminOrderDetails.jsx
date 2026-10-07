import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAdminOrder, getDeliveryPeople, updateAdminOrder } from '../../services/orderService.js';
import styles from './AdminOrderDetails.module.css';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
const NEXT_ORDER_STATUS = {
  Pending: 'Confirmed',
  Confirmed: 'Processing',
  Processing: 'Shipped',
  Shipped: 'Out for Delivery',
  'Out for Delivery': 'Delivered'
};

const currency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const errorMessage = (error, fallback) => error?.response?.data?.message || (typeof error === 'string' ? error : error?.message) || fallback;

const formatAddress = (address) => [
  address?.street,
  address?.city,
  address?.state,
  address?.postalCode,
  address?.country
].filter(Boolean);

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [deliveryPeople, setDeliveryPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deliveryPeopleError, setDeliveryPeopleError] = useState('');
  const [message, setMessage] = useState('');
  const [statusDraft, setStatusDraft] = useState('');
  const [deliveryPersonDraft, setDeliveryPersonDraft] = useState('');

  useEffect(() => {
    let active = true;
    const loadOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await getAdminOrder(orderId);
        if (!data?.order) throw new Error('The order details response was empty.');
        if (active) {
          setOrder(data.order);
          setStatusDraft(data.order.status || 'Pending');
          setDeliveryPersonDraft(data.order.deliveryPerson?._id || '');
        }
      } catch (loadError) {
        if (active) setError(errorMessage(loadError, 'Unable to load order details.'));
      } finally {
        if (active) setLoading(false);
      }
    };

    const loadDeliveryPeople = async () => {
      try {
        const { data } = await getDeliveryPeople();
        if (active) setDeliveryPeople(Array.isArray(data?.deliveryPeople) ? data.deliveryPeople : []);
      } catch (loadError) {
        if (active) setDeliveryPeopleError(errorMessage(loadError, 'Unable to load delivery staff.'));
      }
    };

    loadOrder();
    loadDeliveryPeople();
    return () => { active = false; };
  }, [orderId]);

  const itemsSubtotal = useMemo(() => {
    if (!order) return 0;
    const lineSubtotal = (order.items || []).reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
    return Number(order.subtotal) > 0 || lineSubtotal === 0 ? Number(order.subtotal || 0) : lineSubtotal;
  }, [order]);

  const taxAmount = order
    ? Number(order.taxAmount ?? Math.max(0, Number(order.totalAmount || 0) + Number(order.discountAmount || 0) - itemsSubtotal - Number(order.shippingAmount || 0)))
    : 0;

  const handleSave = async (event) => {
    event.preventDefault();
    if (!order || saving) return;
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const updates = { deliveryPerson: deliveryPersonDraft || null };
      if (statusDraft !== order.status) updates.status = statusDraft;
      const { data } = await updateAdminOrder(order._id, updates);
      if (!data?.order) throw new Error('The update response did not include the order.');
      setOrder(data.order);
      setStatusDraft(data.order.status || 'Pending');
      setDeliveryPersonDraft(data.order.deliveryPerson?._id || '');
      setMessage(data.message || 'Order updated successfully.');
    } catch (updateError) {
      setError(errorMessage(updateError, 'Unable to update this order.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className={`container ${styles.page}`}><p className={styles.state} role="status">Loading order details…</p></main>;
  }

  if (error && !order) {
    return (
      <main className={`container ${styles.page}`}>
        <Link className={styles.backLink} to="/admin/dashboard">← Back to orders</Link>
        <section className={styles.stateError} role="alert">{error}</section>
      </main>
    );
  }

  if (!order) {
    return <main className={`container ${styles.page}`}><section className={styles.state}>Order not found.</section></main>;
  }

  const addressLines = formatAddress(order.shippingAddress);
  const orderStatus = order.status || 'Pending';
  const statusChanged = statusDraft !== orderStatus;
  const canChangeStatus = !['Delivered', 'Cancelled'].includes(orderStatus);
  const currentStatusOptions = canChangeStatus
    ? [orderStatus, ...(NEXT_ORDER_STATUS[orderStatus] ? [NEXT_ORDER_STATUS[orderStatus]] : [])]
    : [orderStatus];
  const paymentStatus = order.refundStatus === 'pending'
    ? 'Refund pending'
    : order.refundStatus === 'processed'
      ? 'Refund processed'
      : order.paymentId && order.paymentId !== 'pending'
        ? 'Paid'
        : 'Payment pending';
  const trackingHistory = Array.isArray(order.trackingHistory) ? [...order.trackingHistory] : [];
  const currentHistoryIndex = trackingHistory.reduce(
    (latestIndex, item, index) => item.status === orderStatus ? index : latestIndex,
    -1
  );
  const highlightedHistoryIndex = currentHistoryIndex;

  return (
    <main className={`container ${styles.page}`}>
      <Link className={styles.backLink} to="/admin/dashboard">← Back to orders</Link>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Admin / Orders</p>
          <h1>Order details</h1>
          <p className={styles.orderId}>Order #{order._id}</p>
        </div>
        <span className={`${styles.statusBadge} ${styles[orderStatus.toLowerCase().replaceAll(' ', '')] || ''}`}>
          {orderStatus}
        </span>
      </header>

      {message && <p className={styles.success} role="status">{message}</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <section className={styles.panel}>
            <h2>Items ({Array.isArray(order.items) ? order.items.length : 0})</h2>
            {!order.items?.length ? (
              <p className={styles.muted}>This order has no item details.</p>
            ) : (
              <div className={styles.itemList}>
                {order.items.map((item, index) => {
                  const product = item.product && typeof item.product === 'object' ? item.product : null;
                  const image = product?.images?.[0]?.url;
                  const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);
                  return (
                    <article className={styles.item} key={`${item.product?._id || item.product || item.name}-${index}`}>
                      {image
                        ? <img className={styles.productImage} src={image} alt={product?.name || item.name || 'Product'} />
                        : <div className={styles.imagePlaceholder} aria-label="Product image unavailable">Image unavailable</div>}
                      <div className={styles.itemInfo}>
                        <h3>{product?.name || item.name || 'Product no longer available'}</h3>
                        {product && <p>{[product.category, product.type].filter(Boolean).join(' · ')}</p>}
                        {(item.color || item.size) && (
                          <p>Variant: {[item.color, item.size].filter(Boolean).join(' / ')}</p>
                        )}
                        <p>Quantity: {Number(item.quantity || 0)} × {currency(item.price)}</p>
                      </div>
                      <strong className={styles.lineTotal}>Item subtotal: {currency(lineTotal)}</strong>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className={styles.panel}>
            <h2>Order timeline</h2>
            {trackingHistory.length === 0 ? (
              <p className={styles.muted}>No tracking updates are available yet.</p>
            ) : (
              <ol className={styles.timeline}>
                {trackingHistory.map((entry, index) => (
                  <li className={`${styles.timelineEntry} ${index === highlightedHistoryIndex ? styles.currentTimelineEntry : ''}`} key={`${entry.status}-${entry.timestamp || index}-${index}`}>
                    <span className={styles.timelineMarker} aria-hidden="true" />
                    <div>
                      <strong>{entry.status || 'Status update'}</strong>
                      <time>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Time unavailable'}</time>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className={styles.sideColumn}>
          <section className={styles.panel}>
            <h2>Customer</h2>
            <dl className={styles.details}>
              <div><dt>Name</dt><dd>{order.user?.fullName || 'Customer information unavailable'}</dd></div>
              <div><dt>Email</dt><dd>{order.user?.email || 'Not available'}</dd></div>
              <div><dt>Phone</dt><dd>{order.user?.phoneNumber || 'Not provided'}</dd></div>
              <div><dt>Order date</dt><dd>{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Not available'}</dd></div>
            </dl>
          </section>

          <section className={styles.panel}>
            <h2>Shipping address</h2>
            {addressLines.length
              ? <address>{addressLines.map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}</address>
              : <p className={styles.muted}>Shipping address unavailable.</p>}
          </section>

          <section className={styles.panel}>
            <h2>Payment & total</h2>
            <dl className={styles.details}>
              <div><dt>Payment status</dt><dd>{paymentStatus}</dd></div>
              {order.paymentId && order.paymentId !== 'pending' && <div><dt>Payment reference</dt><dd>{order.paymentId}</dd></div>}
              <div><dt>Items subtotal</dt><dd>{currency(itemsSubtotal)}</dd></div>
              <div><dt>Shipping</dt><dd>{Number(order.shippingAmount || 0) === 0 ? 'Free' : currency(order.shippingAmount)}</dd></div>
              <div><dt>Tax / GST</dt><dd>{currency(taxAmount)}</dd></div>
              {Number(order.discountAmount || 0) > 0 && <div><dt>Discount</dt><dd>−{currency(order.discountAmount)}</dd></div>}
              <div className={styles.total}><dt>Final total</dt><dd>{currency(order.totalAmount)}</dd></div>
            </dl>
          </section>

          <section className={styles.panel}>
            <h2>Delivery management</h2>
            {order.deliveryPerson ? (
              <p className={styles.assignedPerson}>
                <strong>{order.deliveryPerson.fullName || 'Employee'}</strong>
                <span>{order.deliveryPerson.email || 'Email unavailable'}</span>
                {order.deliveryPerson.phoneNumber && <span>{order.deliveryPerson.phoneNumber}</span>}
              </p>
            ) : <p className={styles.muted}>Not assigned</p>}
            {deliveryPeopleError && <p className={styles.error} role="alert">{deliveryPeopleError}</p>}
            <form className={styles.updateForm} onSubmit={handleSave}>
              <label>
                Order status
                <select
                  value={statusDraft}
                  onChange={(event) => setStatusDraft(event.target.value)}
                  disabled={!canChangeStatus || saving}
                >
                  {currentStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
              <label>
                Delivery person
                <select
                  value={deliveryPersonDraft}
                  onChange={(event) => setDeliveryPersonDraft(event.target.value)}
                  disabled={saving || Boolean(deliveryPeopleError) || !canChangeStatus}
                >
                  <option value="">Not assigned</option>
                  {deliveryPeople.map((person) => (
                    <option value={person._id} key={person._id}>
                      {person.fullName}{person.email ? ` — ${person.email}` : ''}
                    </option>
                  ))}
                </select>
              </label>
              {orderStatus === 'Delivered' && <p className={styles.muted}>Delivered orders are final and cannot be changed.</p>}
              {orderStatus === 'Cancelled' && <p className={styles.muted}>Cancelled orders cannot be changed.</p>}
              <button className={styles.saveButton} type="submit" disabled={saving || !canChangeStatus || (!statusChanged && deliveryPersonDraft === (order.deliveryPerson?._id || '')) || (Boolean(deliveryPeopleError) && deliveryPersonDraft !== (order.deliveryPerson?._id || ''))}>
                {saving ? 'Saving…' : 'Save updates'}
              </button>
            </form>
          </section>
        </aside>
      </div>
    </main>
  );
};

export default AdminOrderDetails;
