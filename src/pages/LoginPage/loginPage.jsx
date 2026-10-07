import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';
import { useAuth } from '../../context/AuthContext';
import { resendVerificationEmail } from '../../services/authService';

const img = '/assets/hero.jpg';

const LoginPage = () => {
  // 3. Create state for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [canResendVerification, setCanResendVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setCanResendVerification(false);

    try {
      const res = await login({ email, password });
      if (res?.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const message = typeof err === 'string' ? err : err.message || 'Login failed';
      setError(message);
      setCanResendVerification(/verify your email/i.test(message));
    }
  };

  const handleResendVerification = async () => {
    setError('');
    setSuccessMessage('');
    setIsResending(true);

    try {
      const response = await resendVerificationEmail(email);
      setSuccessMessage(response.data.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : err.message || 'Could not resend the verification email.');
    } finally {
      setIsResending(false);
    }
  };


  return (
    <div className={styles.authContainer}>
      {/* Visual Side for Branding */}
      <div className={styles.visualSide}>
        <div className={styles.visualContent}>
          <img src={img} alt="Hypermart Logo" className={styles.logo} />
          <h1 className={styles.brandTitle}>Hypermart</h1>
          <p className={styles.brandTagline}>Your Wardrobe, Reimagined.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className={styles.formSide}>
        <div className={styles.authFormWrapper}>
          <h2 className={styles.formTitle}>Welcome Back!</h2>
          <p className={styles.formSubtitle}>Login to access your account and orders.</p>

          {successMessage && (
            <p style={{ color: '#16a34a', textAlign: 'center', margin: '0.5rem 0' }}>{successMessage}</p>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="yourname@example.com"
                required
                value={email} // 9. Control the input
                onChange={(e) => setEmail(e.target.value)} // 10. Update state
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                value={password} // 11. Control the input
                onChange={(e) => setPassword(e.target.value)} // 12. Update state
              />
            </div>

            {/* 13. Show any login errors */}
            {error && <p style={{ color: 'red', textAlign: 'center', margin: '0.5rem 0' }}>{error}</p>}

            <button type="submit" className={styles.submitButton}>Login</button>
          </form>

          {canResendVerification && (
            <button
              type="button"
              className={styles.socialButton}
              onClick={handleResendVerification}
              disabled={isResending || !email.trim()}
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </button>
          )}

          {/* Optional: Social Login Separator */}
          <div className={styles.separator}>
            <span>OR</span>
          </div>

          {/* Optional: Social Login Buttons */}
          <div className={styles.socialLogin}>
            <button className={styles.socialButton}>Continue with Google</button>
            <button className={styles.socialButton}>Continue with Facebook</button>
          </div>

          <p className={styles.redirectText}>
            Don't have an account? <Link to="/signup" className={styles.redirectLink}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;