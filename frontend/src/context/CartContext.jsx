// frontend/src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // 1. Load initial cart from browser localStorage so refreshes don't wipe the cart
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('qb_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Controls whether the slide-out Cart Drawer is visible on screen
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 2. Sync cart to localStorage every time an item is added or removed
  useEffect(() => {
    localStorage.setItem('qb_cart', JSON.stringify(cart));
  }, [cart]);

  // 3. Add item to cart (checks both Product ID and Selected Size)
  const addToCart = (product, selectedSize) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item._id === product._id && item.size === selectedSize
      );

      if (existingIndex > -1) {
        // Item with same ID and same size exists -> increase quantity
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        // New product or different size -> append new entry
        return [
          ...prevCart,
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            size: selectedSize,
            quantity: 1,
          },
        ];
      }
    });
    // Automatically open the cart drawer to give visual feedback
    setIsCartOpen(true);
  };

  // 4. Remove item from cart
  const removeFromCart = (id, size) => {
    setCart((prev) => prev.filter((item) => !(item._id === id && item.size === size)));
  };

  // 5. Derived values: Total Item Count and Subtotal Price
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);