// frontend/src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('qb_archive_bag');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isBagOpen, setIsBagOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('qb_archive_bag', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync bag state', e);
    }
  }, [cart]);

  const addToCart = (product, selectedSize = 'L') => {
    setCart((prev) => {
      const pId = product._id || product.id;
      const existingIdx = prev.findIndex(
        (item) => item.productId === pId && item.size === selectedSize
      );

      const price = Number(product.price) || 0;
      const image =
        (product.images && product.images[0]) ||
        product.coverImage ||
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000';

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += 1;
        return next;
      }

      return [
        ...prev,
        {
          productId: pId,
          name: product.name,
          sku: product.sku || 'ARCHIVE',
          price,
          image,
          size: selectedSize,
          quantity: 1,
        },
      ];
    });
    setIsBagOpen(true);
  };

  const removeFromCart = (productId, size) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.size === size)));
  };

  const updateQuantity = (productId, size, qty) => {
    if (qty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('qb_archive_bag');
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalCount,
        isBagOpen,
        setIsBagOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}