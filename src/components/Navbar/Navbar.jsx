import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, ShoppingCart, User } from 'lucide-react';
import styles from './Navbar.module.css';
import { useCart } from '../../context/useCart';
import { useAuth } from '../../context/AuthContext';


const Navbar = ({ theme, handleThemeSwitch }) => {
  const { cartItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(false);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 901px)');
    let previousScrollY = window.scrollY;
    let isNavbarHidden = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        previousScrollY = 0;
        if (isNavbarHidden) {
          isNavbarHidden = false;
          setIsHidden(false);
        }
        return;
      }

      const scrollDelta = currentScrollY - previousScrollY;
      if (Math.abs(scrollDelta) < 8) return;

      previousScrollY = currentScrollY;
      const shouldHide = scrollDelta > 0;
      if (shouldHide !== isNavbarHidden) {
        isNavbarHidden = shouldHide;
        setIsHidden(shouldHide);
      }
    };

    const handleBreakpointChange = () => {
      previousScrollY = window.scrollY;
      if (desktopQuery.matches) {
        window.addEventListener('scroll', handleScroll, { passive: true });
      } else {
        window.removeEventListener('scroll', handleScroll);
        isNavbarHidden = false;
        setIsHidden(false);
      }
    };

    if (desktopQuery.matches) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    desktopQuery.addEventListener('change', handleBreakpointChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      desktopQuery.removeEventListener('change', handleBreakpointChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className={`${styles.navbar} ${isHidden ? styles.navbarHidden : ''}`}>
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

          {/* Show admin link if user is admin */}
          {isAuthenticated && user?.role === 'admin' && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            >
              Admin Panel
            </NavLink>
          )}
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

          {isAuthenticated ? (
            <>
              <Link to="/profile" className={styles.iconButton} aria-label="View account profile">
                <User size={20} />
              </Link>
              <button onClick={handleLogout} className={styles.iconButton}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className={styles.iconButton} aria-label="Login to your account">
              <User size={20} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;