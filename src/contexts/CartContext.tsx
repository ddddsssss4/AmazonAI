import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { type Product } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColour: string;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, colour?: string) => void;
  removeFromCart: (productId: number, colour: string) => void;
  updateQuantity: (productId: number, colour: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity = 1, colour?: string) => {
    const selectedColour = colour ?? product.colours[0]?.name ?? product.colour;
    setItems(prev => {
      const existing = prev.find(
        item => item.product.id === product.id && item.selectedColour === selectedColour
      );
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedColour === selectedColour
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColour }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number, colour: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedColour === colour)
    ));
  }, []);

  const updateQuantity = useCallback((productId: number, colour: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(
        item => !(item.product.id === productId && item.selectedColour === colour)
      ));
      return;
    }
    setItems(prev => prev.map(item =>
      item.product.id === productId && item.selectedColour === colour
        ? { ...item, quantity }
        : item
    ));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.product.discount > 0
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity,
      clearCart, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
