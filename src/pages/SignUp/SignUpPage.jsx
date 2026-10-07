// src/pages/SignUp/SignUpPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../LoginPage/AuthForm.module.css';
import { registerUser } from '../../services/authService';

const img = '/assets/signup.webp';

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await registerUser({ fullName, email, password });
      navigate('/login', {
        state: {
          successMessage: response.data.message || 'Registration successful. Please verify your email.'
        }
      });
    } catch (err) {
      setError(typeof err === 'string' ? err : err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.visualSide}>
        <div className={styles.visualContent}>
          <img src={img} alt="Hypermart Logo" className={styles.logo} />
          <h1 className={styles.brandTitle}>Hypermart</h1>
          <p className={styles.brandTagline}>Your Wardrobe, Reimagined.</p>
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.authFormWrapper}>
          <h2 className={styles.formTitle}>Create an Account</h2>
          <p className={styles.formSubtitle}>Join us and discover your new favorite style.</p>
          
          {/* 5. Connect the handler to the form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                placeholder="Enter your full name"
                value={fullName} // 6. Control the input
                onChange={(e) => setFullName(e.target.value)} // 7. Update state
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="yourname@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Create a strong password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className={styles.redirectText}>
            Already have an account? <Link to="/login" className={styles.redirectLink}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;