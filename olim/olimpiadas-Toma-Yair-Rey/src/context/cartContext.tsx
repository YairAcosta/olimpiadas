"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Articulo } from "@/src/types/Articulos";

interface CartContextType {
  cartItems: Articulo[];
  addToCart: (articulo: Articulo) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Inicializamos el carrito como un array vacío.
  const [cartItems, setCartItems] = useState<Articulo[]>([]);

  const addToCart = (articulo: Articulo) => {
    setCartItems((prevItems) => {
      // Verifica si el artículo ya existe en el carrito para evitar duplicados
      const exists = prevItems.find((item) => item.Id === articulo.Id);
      if (exists) {
        console.log(`${articulo.Titulo} ya está en el carrito.`);
        return prevItems; // No agregamos si ya existe
      }
      return [...prevItems, articulo]; // Agrega el nuevo artículo
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.Id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
