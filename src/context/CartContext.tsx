import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { FoodItem, CartItem } from '../types';
import { api } from '../services/api';

interface CartContextType {
  items: CartItem[];
  addItem: (foodItem: FoodItem, quantity?: number) => void;
  removeItem: (foodItemId: string) => void;
  updateQuantity: (foodItemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  taxRate: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'sc_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [taxRate, setTaxRate] = useState<number>(5.0);

  useEffect(() => {
    api.getSettings().then((s) => {
      if (s?.tax_rate_percent !== undefined) {
        setTaxRate(Number(s.tax_rate_percent));
      }
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to local storage', e);
    }
  }, [items]);

  const addItem = (foodItem: FoodItem, quantity = 1) => {
    if (!foodItem.is_available) return;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.foodItem.id === foodItem.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { foodItem, quantity: Math.max(1, quantity) }];
    });
  };

  const removeItem = (foodItemId: string) => {
    setItems((prev) => prev.filter((i) => i.foodItem.id !== foodItemId));
  };

  const updateQuantity = (foodItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(foodItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.foodItem.id === foodItemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0),
    [items]
  );

  const taxAmount = useMemo(
    () => Number(((subtotal * taxRate) / 100).toFixed(2)),
    [subtotal, taxRate]
  );

  const totalAmount = useMemo(
    () => Number((subtotal + taxAmount).toFixed(2)),
    [subtotal, taxAmount]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        taxAmount,
        totalAmount,
        taxRate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
