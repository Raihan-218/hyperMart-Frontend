// src/pages/SignUp/SignUpPage.jsx

import React, { useState } from 'react'; // 1. Import useState
import { Link, useNavigate } from 'react-router-dom'; // 2. Import useNavigate
import styles from '../LoginPage/AuthForm.module.css';
import img from '../../assets/signup.webp';

const SignupPage = () => {
  // 3. Create state for your form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // For showing errors from the backend
  const navigate = useNavigate(); // To redirect on success

  // 4. Create the function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the form from reloading the page
    setError(''); // Clear previous errors

    // Basic validation
    if (!fullName || !email || !password) {
      setError('All fields are required.');
      return;
    }
    
    // (You can add password confirmation logic here)

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the server responded with an error (like 409 "User already exists")
        throw new Error(data.message || 'Something went wrong');
      }

      // Success!
      console.log('Registration successful:', data.user);
      alert('Registration successful! Please log in.');
      navigate('/login'); // Redirect to the login page

    } catch (err) {
      console.error('Registration Error:', err);
      setError(err.message);
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
            
            {/* 8. Show any errors */}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

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