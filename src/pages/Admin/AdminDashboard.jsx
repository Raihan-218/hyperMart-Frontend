import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/admin/orders`, {
          credentials: 'include' // Important: Send cookies with the request
        }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  return (
    <div className={`${styles.dashboardContainer} container`}>
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '.75rem' }}>
          <Link to="/admin/inventory" className={styles.addButton}>Manage Inventory</Link>
          <Link to="/admin/add-product" className={styles.addButton}>+ Add New Product</Link>
        </div>
      </div>
      <h2 className={styles.sectionTitle}>All Customer Orders</h2>

      {loading && <p>Loading orders...</p>}
      {error && <p className={styles.errorText}>Error: {error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className={styles.emptyOrders}>No customer orders yet.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className={styles.tableWrap}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Email</th>
              <th>Order Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.email || 'N/A'}</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}</td>
                <td>₹{Number(order.totalAmount || 0).toFixed(2)}</td>
                <td>
                  <span className={`${styles.status} ${styles[order.status?.toLowerCase().replaceAll(' ', '')] || ''}`}>
                    {order.status || 'Pending'}
                  </span>
                </td>
                <td>
                  <Link to={`/admin/orders/${order._id}`} className={styles.actionButton}>View details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
