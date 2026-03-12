import React, { createContext, useContext, useEffect, useState } from 'react';

const CART_STORAGE_KEY = 'cartItems';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (item) => {
    console.log('addToCart stub', item);
  };

  const removeFromCart = (id) => {
  };

  const clearCart = () => {
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        cartCount,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;