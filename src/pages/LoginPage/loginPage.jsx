import React, { useState } from 'react'; // 1. Import useState
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';
const img = '/assets/hero.jpg';
import { useAuth } from '../../context/AuthContext';


const LoginPage = () => {
  // 3. Create state for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 4. Get hooks
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from our context

  // 5. Create the submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      // Redirect based on role
      if (res?.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
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

          {/* 8. Connect the form to the handler */}
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