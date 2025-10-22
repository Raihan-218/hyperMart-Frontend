// src/pages/LoginPage/LoginPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthForm.module.css';
import img from '../../assets/loginpage.webp'
// You can add your logo here
// import logo from '../../assets/hypermart-logo.svg'; 

const LoginPage = () => {
  return (
    <div className={styles.authContainer}>
      {/* Visual Side for Branding */}
      <div className={styles.visualSide}>
        <div className={styles.visualContent}>
          { <img src={img} alt="Hypermart Logo" className={styles.logo} /> }
          <h1 className={styles.brandTitle}>Hypermart</h1>
          <p className={styles.brandTagline}>Your Wardrobe, Reimagined.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className={styles.formSide}>
        <div className={styles.authFormWrapper}>
          <h2 className={styles.formTitle}>Welcome Back!</h2>
          <p className={styles.formSubtitle}>Login to access your account and orders.</p>
          
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="yourname@example.com" 
                required 
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Enter your password" 
                required 
              />
            </div>
            <button type="submit" className={styles.submitButton}>Login</button>
          </form>

          {/* Optional: Social Login Separator */}
          <div className={styles.separator}>
            <span>OR</span>
          </div>
          
          {/* Optional: Social Login Buttons */}
          <div className={styles.socialLogin}>
            <button className={styles.socialButton}>
              {/* Add an SVG icon here for Google */}
              Continue with Google
            </button>
            <button className={styles.socialButton}>
              {/* Add an SVG icon here for Facebook */}
              Continue with Facebook
            </button>
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