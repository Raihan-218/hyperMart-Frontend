// src/context/CartContext.jsx
// (Copy and replace the entire file)

import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
const CartContext = createContext();

// 2. Create a custom hook for easy access
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Create the Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 1. addToCart now accepts the product AND its selected options
  const addToCart = (product, color, size, quantityToAdd) => {
    setCartItems(prevItems => {
      // 2. Check if this *exact* item (by ID, color, AND size) is already in the cart
      const existingItem = prevItems.find(
        item => item.id === product.id && item.color === color && item.size === size
      );

      if (existingItem) {
        // 3. If it exists, just update its quantity
        return prevItems.map(item =>
          item.id === product.id && item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      } else {
        // 4. If it's a new item, add it to the cart with all its info
        // We add a 'cartItemId' to make it easy to remove or update a specific item
        const newItem = {
          ...product,
          color,
          size,
          quantity: quantityToAdd,
          cartItemId: Date.now() // A unique ID for this specific cart entry
        };
        return [...prevItems, newItem];
      }
    });
    console.log('Product added to cart:', { product, color, size, quantityToAdd });
  };

  // 5. removeFromCart should use the unique 'cartItemId'
  const removeFromCart = (cartItemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  // 6. (Bonus) A function to update quantity directly in the cart
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      // If quantity is 0 or less, remove the item
      removeFromCart(cartItemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // 7. (Bonus) A function to clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // 8. Expose all functions to the app
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};