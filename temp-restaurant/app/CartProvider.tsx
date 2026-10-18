
"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Cart = Record<number, number>;

type CartContextType = {
  cart: Cart;
  updateQuantity: (id: number, change: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});

  function updateQuantity(id: number, change: number) {
    setCart((current) => {
      const next = { ...current };
      const quantity = (next[id] || 0) + change;

      if (quantity <= 0) {
        delete next[id];
      } else {
        next[id] = quantity;
      }

      return next;
    });
  }

  function clearCart() {
    setCart({});
  }

  return (
    <CartContext.Provider value={{ cart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
