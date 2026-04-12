import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/protectedRoute.jsx';

// CONTEXT PROVIDER
import { CartProvider } from './context/CartContext.jsx';

// LAYOUT COMPONENTS
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';

// PAGE COMPONENTS
import HomePage from './pages/HomePage/homePage.jsx';
import MensPage from './pages/MensPage/mensPage.jsx';
import WomensPage from './pages/WomensPage/WomensPage.jsx';
import KidsPage from './pages/KidsPage/KidsPage.jsx';
import LoginPage from './pages/LoginPage/loginPage.jsx';
import SignUpPage from './pages/SignUp/SignUpPage.jsx';
import CartPage from './pages/CartPage/CartPage.jsx';
import ProductDetailPage from './pages/productDetails/productDetails.jsx';

// Import Admin components
import AdminRoute from './components/AdminRoute.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AddProductPage from './pages/Admin/AddProductPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  // --- THEME LOGIC ---
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <AuthProvider>

      <CartProvider>
        <div className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 min-h-screen flex flex-col">
          <Router>
            <Navbar theme={theme} handleThemeSwitch={handleThemeSwitch} />

            <main className="flex-grow">
              <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/men" element={<MensPage />} />
                <Route path="/women" element={<WomensPage />} />
                <Route path="/kids" element={<KidsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="/product/:id" element={<ProductDetailPage />} />

                {/* --- Admin Protected Routes --- */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/add-product" element={<AddProductPage />} />
                </Route>

              </Routes>
            </main>

            <Footer />
          </Router>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;