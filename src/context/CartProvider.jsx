import React, { useState, useEffect } from 'react';
import CartContext from './CartContext';
import { useAuth } from './AuthContext';
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItemQuantity as apiUpdateCartItemQuantity,
  removeCartItem as apiRemoveCartItem,
  checkout as apiCheckout,
} from '../services/cartService';

const emptyCartTotals = {
  subtotal: 0,
  taxAmount: 0,
  shippingAmount: 0,
  discountAmount: 0,
  totalAmount: 0
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotals, setCartTotals] = useState(emptyCartTotals);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
      setCartTotals(emptyCartTotals);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      setCartTotals(res.data.totals || emptyCartTotals);
      setCartItems((res.data.cartItems || []).map((item) => ({
        ...item,
        cartItemId: item._id,
        name: item.product?.name,
        image: item.product?.images?.[0]?.url,
        quantity: item.qty,
        price: item.product?.price ?? item.price,
      })));
    } catch (error) {
      console.error('Failed to fetch cart', error);
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
      console.error('Failed to add to cart', error);
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
      setCartItems((previousItems) => previousItems.filter((item) => item.cartItemId !== cartItemId));
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove item', error);
    }
  };

  const checkoutCart = async (shippingAddress) => {
    if (!isAuthenticated) {
      throw new Error('Please sign in to complete checkout.');
    }

    try {
      const response = await apiCheckout(shippingAddress);
      setCartItems([]);
      setCartTotals(emptyCartTotals);
      return response.data;
    } catch (error) {
      console.error('Failed to complete checkout', error);
      throw error;
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartTotals(emptyCartTotals);
  };

  const value = {
    cartItems,
    cartTotals,
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
