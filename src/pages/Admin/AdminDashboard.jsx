import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './AdminDashboard.module.css'; // We'll create this file

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
        <Link to="/admin/add-product" className={styles.addButton}>+ Add New Product</Link>
      </div>
      <h2 className={styles.sectionTitle}>All Customer Orders</h2>

      {loading && <p>Loading orders...</p>}
      {error && <p className={styles.errorText}>Error: {error}</p>}

      {!loading && !error && (
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Email</th>
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
                <td>₹{order.totalAmount.toFixed(2)}</td>
                <td>
                  <span className={`${styles.status} ${styles[order.status?.toLowerCase().replace(' ', '')]}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className={styles.actionButton}>View/Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;