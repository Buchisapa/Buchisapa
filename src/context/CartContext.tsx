import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '../data/menuData';
import { ApiService } from '../services/apiService';

export interface CartItem {
  cartId: string;
  item: MenuItem;
  quantity: number;
  selectedOption?: string;
  selectedAccompaniments?: string[];
  removedAccompaniments?: string[];
  selectedSauces: string[];
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup' | 'dinein';
  deliveryAddress?: string;
  deliveryReference?: string;
  tableNumber?: string;
  paymentMethod: 'yape' | 'plin' | 'efectivo' | 'transferencia';
  cashAmount?: number;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'recibido' | 'preparando' | 'en_camino' | 'entregado';
  notes?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity?: number,
    selectedOption?: string,
    selectedSauces?: string[],
    notes?: string,
    selectedAccompaniments?: string[],
    removedAccompaniments?: string[]
  ) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('buchisapa_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('buchisapa_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('buchisapa_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('buchisapa_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const addToCart = (
    item: MenuItem,
    quantity: number = 1,
    selectedOption?: string,
    selectedSauces: string[] = ["Mayonesa", "Tártara", "Ají de Rocoto"],
    notes?: string,
    selectedAccompaniments?: string[],
    removedAccompaniments?: string[]
  ) => {
    setCart(prevCart => {
      const sidesKey = (removedAccompaniments || []).slice().sort().join(',');
      const saucesKey = [...selectedSauces].sort().join(',');
      const cartId = `${item.id}-${selectedOption || 'def'}-sides:${sidesKey}-sauces:${saucesKey}-${notes || ''}`;
      const existingIndex = prevCart.findIndex(ci => ci.cartId === cartId);

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity
        };
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            cartId,
            item,
            quantity,
            selectedOption,
            selectedAccompaniments,
            removedAccompaniments,
            selectedSauces,
            notes
          }
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.cartId === cartId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.item.price * item.quantity, 0);

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order => {
    const newOrderNumber = orders.length > 0 ? Math.max(...orders.map(o => o.orderNumber)) + 1 : 101;
    const newOrder: Order = {
      ...orderData,
      id: `BS-${Date.now().toString(36).toUpperCase()}`,
      orderNumber: newOrderNumber,
      createdAt: new Date().toISOString(),
      status: 'recibido'
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Sincronizar en segundo plano con el backend PHP si está disponible
    ApiService.submitOrder(orderData).catch(() => {
      // Modo local activo
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        updateOrderStatus
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
