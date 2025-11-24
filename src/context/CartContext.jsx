import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {

    // Buscar si existe ya ese producto mismo id-talla-color
    const existing = cart.find(
      p =>
        p.id_producto === item.id_producto &&
        p.talla === item.talla &&
        p.color === item.color
    );

    if (existing) {
      // Si ya existe, solo sumamos la cantidad
      const updated = cart.map(p =>
        p === existing
          ? { ...p, cantidad: p.cantidad + item.cantidad }
          : p
      );
      setCart(updated);
    } else {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
