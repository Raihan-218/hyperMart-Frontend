// src/pages/SignupPage/SignupPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../LoginPage/AuthForm.module.css'; // Reusing the same CSS file
import img from '../../assets/signup.webp'
const SignupPage = () => {
  return (
    <div className={styles.authContainer}>
      {/* Visual Side for Branding (Consistent with Login Page) */}
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
          <h2 className={styles.formTitle}>Create an Account</h2>
          <p className={styles.formSubtitle}>Join us and discover your new favorite style.</p>
          
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName" 
                placeholder="Enter your full name" 
                required 
              />
            </div>
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
                placeholder="Create a strong password" 
                required 
              />
            </div>
             <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                placeholder="Re-enter your password" 
                required 
              />
            </div>
            <button type="submit" className={styles.submitButton}>Create Account</button>
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