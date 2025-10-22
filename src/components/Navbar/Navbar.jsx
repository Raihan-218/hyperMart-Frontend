import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sun, Moon, ShoppingCart, User } from 'lucide-react';
import styles from './Navbar.module.css';
import { useCart } from '../../context/CartContext';

const Navbar = ({ theme, handleThemeSwitch }) => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.navContainer} container`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>hyperMart</Link>
        
        {/* Navigation Links - Centered */}
        <div className={styles.navLinks}>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Home</NavLink>
          <NavLink to="/men" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Men</NavLink>
          <NavLink to="/women" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Women</NavLink>
          <NavLink to="/kids" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Kids</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>About</NavLink>
          <NavLink to="/help" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Help</NavLink>
        </div>
        
        {/* Action Icons - Right Aligned */}
        <div className={styles.navActions}>
          <button onClick={handleThemeSwitch} className={styles.iconButton} aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link to="/cart" className={`${styles.iconButton} ${styles.cartIcon}`} aria-label="View shopping cart">
            <ShoppingCart size={20} />
            {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
          </Link>
          <Link to="/login" className={styles.iconButton} aria-label="Login or view profile">
            <User size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;