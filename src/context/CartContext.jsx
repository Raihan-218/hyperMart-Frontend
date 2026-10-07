/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItemQuantity as apiUpdateCartItemQuantity,
  removeCartItem as apiRemoveCartItem,
  checkout as apiCheckout,
} from '../services/cartService';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

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
      setCartItems((res.data.cartItems || []).map((item) => ({
        ...item,
        cartItemId: item._id,
        name: item.product?.name,
        image: item.product?.images?.[0]?.url,
        quantity: item.qty,
        price: item.price ?? item.product?.price,
      })));
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, color, size, quantityToAdd) => {
    if (!isAuthenticated) {
      throw new Error('Please sign in to add items to your cart.');
    }

    try {
      const productId = product?._id || product?.id;
      if (!productId) throw new Error('This product is missing an identifier.');

      await apiAddToCart(productId, quantityToAdd, color, size);
      await fetchCart();
    } catch (error) {
      console.error("Failed to add to cart", error);
      throw error;
    }
  };

  const updateQuantity = async (cartItemId, nextQuantity) => {
    if (!isAuthenticated) return;

    if (!Number.isInteger(Number(nextQuantity)) || Number(nextQuantity) < 1) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      await apiUpdateCartItemQuantity(cartItemId, Number(nextQuantity));
      await fetchCart();
    } catch (error) {
      console.error('Failed to update quantity', error);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!isAuthenticated) return;

    try {
      await apiRemoveCartItem(cartItemId);
      setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const checkoutCart = async (shippingAddress) => {
    if (!isAuthenticated) {
      throw new Error('Please sign in to complete checkout.');
    }

    try {
      const response = await apiCheckout(shippingAddress);
      setCartItems([]);
      return response.data;
    } catch (error) {
      console.error('Failed to complete checkout', error);
      throw error;
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    checkoutCart,
    clearCart,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
