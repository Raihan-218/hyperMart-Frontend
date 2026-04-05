import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addToCart as apiAddToCart, removeCartItem as apiRemoveCartItem } from '../services/cartService';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      // Backend returns { cartItems: [...] }
      setCartItems(res.data.cartItems || []);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, color, size, quantityToAdd) => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      // Call Backend
      await apiAddToCart(product.id, quantityToAdd);

      // Refresh Cart
      await fetchCart();
      console.log('Product added to cart:', product.name);
    } catch (error) {
      console.error("Failed to add to cart", error);
      alert("Failed to add item to cart.");
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      await apiRemoveCartItem(productId);
      // Optimistic update or refresh
      setCartItems(prev => prev.filter(item => item.product._id !== productId && item.product.id !== productId));
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
