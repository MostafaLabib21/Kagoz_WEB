import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('kagoj-cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('kagoj-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const existingIndex = cartItems.findIndex(
      (existing) =>
        existing.productId === item.productId &&
        existing.variant === item.variant
    );

    if (existingIndex !== -1) {
      const newCart = [...cartItems];
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + item.quantity,
      };
      setCartItems(newCart);
    } else {
      setCartItems((prev) => [...prev, item]);
    }
  };

  const removeFromCart = (productId, variant) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variant === variant)
      )
    );
  };

  const updateQuantity = (productId, variant, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variant === variant
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('kagoj-cart');
  };

  // Computed Values
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () =>
      Math.round(
        cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) *
          100
      ) / 100,
    [cartItems]
  );

  const shipping = useMemo(() => {
    return 0;
  }, [subtotal]);

  const tax = useMemo(() => {
    return 0;
  }, [subtotal]);

  const total = useMemo(() => {
    return Math.round((subtotal + shipping + tax) * 100) / 100;
  }, [subtotal, shipping, tax]);

  const value = {
    cartItems,
    cartCount,
    subtotal,
    shipping,
    tax,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;