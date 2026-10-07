import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { verifyUserEmail } from '../../services/authService.js';
import styles from './VerifyEmailPage.module.css';

const VerifyEmailPage = () => {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token was provided.');
      return;
    }

    let isMounted = true;

    const verify = async () => {
      try {
        const response = await verifyUserEmail(token);
        if (isMounted) {
          setStatus('success');
          setMessage(response.data.message || 'Email verified successfully.');
        }
      } catch (error) {
        if (isMounted) {
          setStatus('error');
          setMessage(typeof error === 'string' ? error : error.message || 'We could not verify your email.');
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden="true">
          {status === 'success' ? '✓' : status === 'error' ? '!' : '…'}
        </div>
        <h1>
          {status === 'success' ? 'Email Verified' : status === 'error' ? 'Verification Failed' : 'Verifying Email'}
        </h1>
        <p>{message}</p>

        {status === 'success' && (
          <Link to="/login" className={styles.button}>
            Go to Login
          </Link>
        )}

        {status === 'error' && (
          <div className={styles.actions}>
            <Link to="/signup" className={styles.secondaryButton}>Create an account</Link>
            <Link to="/login" className={styles.button}>Back to login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;