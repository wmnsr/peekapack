/**
 * 📚 LEARNING NOTE: React Context
 * 
 * Context is like a "shared storage" that any component can access.
 * Without context, we'd have to pass the cart data through every
 * single component like a relay race. With context, any component
 * can just "reach in" and grab the cart data directly!
 * 
 * We store the cart in localStorage so it survives page refreshes.
 */

"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext();

/**
 * Custom hook to use the cart from any component.
 * Usage: const { cart, addToCart, removeFromCart } = useCart();
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage when the app starts
  useEffect(() => {
    try {
      const saved = localStorage.getItem("peekapack-cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("peekapack-cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  /**
   * Add an item to the cart.
   * If the same product + size already exists, increase quantity.
   * Max 10 per item.
   */
  const addToCart = useCallback((product, variant, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variantId === variant.id
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, 10);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }

      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant.id,
          name: product.name,
          size: variant.size,
          price: variant.price,
          image: product.images?.[0] || "/images/placeholder.png",
          quantity: Math.min(quantity, 10),
          maxStock: variant.stock_count,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((variantId) => {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId, quantity) => {
    if (quantity < 1) return;
    if (quantity > 10) return;
    setCart((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoaded,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
