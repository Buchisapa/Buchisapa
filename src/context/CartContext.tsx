import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, MENU_ITEMS, RESTAURANT_INFO } from '../data/menuData';
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
  status: 'recibido' | 'preparando' | 'en_camino' | 'entregado' | 'cancelado';
  notes?: string;
}

export interface StoreSettings {
  isStoreOpen: boolean;
  deliveryFee: number;
  minOrder: number;
  deliveryTime: string;
  phone: string;
  yapePhone: string;
  yapeTitular: string;
  soundEnabled: boolean;
  noticeBanner?: string;
}

export interface Complaint {
  id: string;
  code: string;
  createdAt: string;
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  address: string;
  type: 'queja' | 'reclamo';
  detail: string;
  status: 'pendiente' | 'atendido';
  reply?: string;
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
  
  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  clearOrdersHistory: () => void;

  // Menu items dynamic management
  menuItems: MenuItem[];
  updateMenuItem: (updatedItem: MenuItem) => void;
  addMenuItem: (newItem: MenuItem) => void;
  deleteMenuItem: (itemId: string) => void;
  toggleItemAvailability: (itemId: string) => void;
  resetMenuItems: () => void;

  // Store settings
  storeSettings: StoreSettings;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => void;

  // Complaints / Libro de Reclamaciones
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'code' | 'createdAt' | 'status'>) => string;
  updateComplaintStatus: (id: string, status: 'pendiente' | 'atendido', reply?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart items
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('buchisapa_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('buchisapa_orders');
      if (saved) return JSON.parse(saved);
      
      // Default demo orders if empty to showcase admin capabilities right away
      return [
        {
          id: 'BS-A921',
          orderNumber: 104,
          createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(), // 8 min ago
          customerName: 'Carlos Mendoza',
          customerPhone: '987654321',
          orderType: 'delivery',
          deliveryAddress: 'Av. Javier Prado Este 4520, Dpto 402, Ate',
          deliveryReference: 'Frente a parque Los Sauces',
          paymentMethod: 'yape',
          items: [
            {
              cartId: 'demo-1',
              item: MENU_ITEMS[0], // Hamburguesa Clásica
              quantity: 2,
              selectedAccompaniments: ['Hamburguesa artesanal', 'Papas fritas crocantes', 'Ensalada fresca', 'Pan brioche'],
              removedAccompaniments: [],
              selectedSauces: ['Mayonesa', 'Mostaza', 'Ketchup', 'Ají de Rocoto'],
              notes: 'Papas bien crocantes por favor'
            },
            {
              cartId: 'demo-2',
              item: MENU_ITEMS[12], // Pecho Broaster
              quantity: 1,
              selectedAccompaniments: ['Presa de Pecho Broaster', 'Papas fritas crocantes', 'Arroz blanco', 'Ensalada fresca'],
              removedAccompaniments: [],
              selectedSauces: ['Mayonesa', 'Tártara', 'Ají de Rocoto']
            }
          ],
          subtotal: 38.00,
          deliveryFee: 4.00,
          total: 42.00,
          status: 'recibido',
          notes: 'Timbre no funciona, llamar al llegar.'
        },
        {
          id: 'BS-B108',
          orderNumber: 103,
          createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(), // 22 min ago
          customerName: 'Lucía Fernández',
          customerPhone: '912345678',
          orderType: 'delivery',
          deliveryAddress: 'Calle Las Begonias 145, Ate (Cerca a Real Plaza)',
          deliveryReference: 'Casa de rejas negras',
          paymentMethod: 'plin',
          items: [
            {
              cartId: 'demo-3',
              item: MENU_ITEMS[2], // La Suprema
              quantity: 1,
              selectedAccompaniments: ['Hamburguesa artesanal', 'Tocino crocante', 'Queso derretido', 'Huevo frito', 'Jamón inglés', 'Papas fritas', 'Ensalada fresca'],
              removedAccompaniments: [],
              selectedSauces: ['Mayonesa', 'Ají de Rocoto']
            },
            {
              cartId: 'demo-4',
              item: MENU_ITEMS[16], // Salchipapa A Lo Pobre
              quantity: 1,
              selectedAccompaniments: ['Papas fritas', 'Salchichas frankfurter', 'Huevo frito', 'Plátano maduro frito', 'Ensalada fresca'],
              removedAccompaniments: [],
              selectedSauces: ['Mayonesa', 'Mostaza', 'Ketchup']
            }
          ],
          subtotal: 28.00,
          deliveryFee: 4.00,
          total: 32.00,
          status: 'preparando'
        },
        {
          id: 'BS-C405',
          orderNumber: 102,
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          customerName: 'Javier Quiroga',
          customerPhone: '945678901',
          orderType: 'pickup',
          paymentMethod: 'efectivo',
          cashAmount: 50.00,
          items: [
            {
              cartId: 'demo-5',
              item: MENU_ITEMS[23], // Alitas Acevichadas
              quantity: 2,
              selectedAccompaniments: ['5 Alitas crocantes', 'Salsa Acevichada artesanal', 'Papas fritas', 'Ensalada fresca'],
              removedAccompaniments: [],
              selectedSauces: ['Mayonesa', 'Ají de Rocoto']
            }
          ],
          subtotal: 30.00,
          deliveryFee: 0.00,
          total: 30.00,
          status: 'en_camino'
        }
      ];
    } catch {
      return [];
    }
  });

  // Dynamic menu items (allows admin to edit prices, stock, descriptions)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('buchisapa_menu_items');
      if (saved) return JSON.parse(saved);
      return MENU_ITEMS.map(item => ({ ...item, isAvailable: true }));
    } catch {
      return MENU_ITEMS.map(item => ({ ...item, isAvailable: true }));
    }
  });

  // Store settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('buchisapa_store_settings');
      if (saved) return JSON.parse(saved);
      return {
        isStoreOpen: true,
        deliveryFee: RESTAURANT_INFO.deliveryFee || 4.00,
        minOrder: RESTAURANT_INFO.minOrder || 10.00,
        deliveryTime: RESTAURANT_INFO.deliveryTime || '25 - 40 min',
        phone: RESTAURANT_INFO.phone || '+51 943 312 024',
        yapePhone: RESTAURANT_INFO.yapeNumber || '943 312 024',
        yapeTitular: 'Restaurante Buchisapa S.A.C.',
        soundEnabled: true,
        noticeBanner: ''
      };
    } catch {
      return {
        isStoreOpen: true,
        deliveryFee: 4.00,
        minOrder: 10.00,
        deliveryTime: '25 - 40 min',
        phone: '+51 943 312 024',
        yapePhone: '943 312 024',
        yapeTitular: 'Restaurante Buchisapa S.A.C.',
        soundEnabled: true,
        noticeBanner: ''
      };
    }
  });

  // Complaints from Libro de Reclamaciones
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem('buchisapa_complaints');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'claim-1',
          code: 'LR-2026-001',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          fullName: 'Rosa Paredes',
          dni: '45892314',
          email: 'rosa.paredes@gmail.com',
          phone: '984123567',
          address: 'Ate, Lima',
          type: 'reclamo',
          detail: 'Mi pedido demoró 5 minutos más de lo estimado en hora punta.',
          status: 'atendido',
          reply: 'Se coordinó con la clienta y se le brindó una disculpa y cupón de cortesía.'
        }
      ];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persistence effects
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

  useEffect(() => {
    try {
      localStorage.setItem('buchisapa_menu_items', JSON.stringify(menuItems));
    } catch {
      // ignore
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem('buchisapa_store_settings', JSON.stringify(storeSettings));
    } catch {
      // ignore
    }
  }, [storeSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('buchisapa_complaints', JSON.stringify(complaints));
    } catch {
      // ignore
    }
  }, [complaints]);

  // Cart operations
  const addToCart = (
    item: MenuItem,
    quantity: number = 1,
    selectedOption?: string,
    selectedSauces: string[] = ["Mayonesa", "Mostaza", "Ketchup", "Ají de Rocoto"],
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

  // Order Operations
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

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const clearOrdersHistory = () => {
    setOrders([]);
  };

  // Menu Items Operations (Admin)
  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const addMenuItem = (newItem: MenuItem) => {
    setMenuItems(prev => [newItem, ...prev]);
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, isAvailable: item.isAvailable === false ? true : false };
      }
      return item;
    }));
  };

  const resetMenuItems = () => {
    setMenuItems(MENU_ITEMS.map(item => ({ ...item, isAvailable: true })));
  };

  // Store Settings Operations (Admin)
  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Complaints Operations
  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'code' | 'createdAt' | 'status'>): string => {
    const code = `LR-${new Date().getFullYear()}-${String(complaints.length + 1).padStart(3, '0')}`;
    const newComplaint: Complaint = {
      ...complaintData,
      id: `claim-${Date.now()}`,
      code,
      createdAt: new Date().toISOString(),
      status: 'pendiente'
    };

    setComplaints(prev => [newComplaint, ...prev]);
    return code;
  };

  const updateComplaintStatus = (id: string, status: 'pendiente' | 'atendido', reply?: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status, reply: reply !== undefined ? reply : c.reply } : c));
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
        updateOrderStatus,
        deleteOrder,
        clearOrdersHistory,
        menuItems,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        resetMenuItems,
        storeSettings,
        updateStoreSettings,
        complaints,
        addComplaint,
        updateComplaintStatus
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
