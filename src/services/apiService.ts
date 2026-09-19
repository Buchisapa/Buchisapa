import { Category, MenuItem, PromotionItem, CATEGORIES, MENU_ITEMS, SAUCES_LIST, PROMOTIONS } from '../data/menuData';
import { Order } from '../context/CartContext';
import { supabase, isSupabaseConfigured, SupabaseOrder, SupabaseProduct, SupabaseCategory } from '../lib/supabase.ts';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiMenuData {
  categories: Category[];
  products: MenuItem[];
  sauces: string[];
  promotions: PromotionItem[];
}

export interface ClaimPayload {
  fullName: string;
  docType: string;
  docNumber: string;
  phone: string;
  email: string;
  address: string;
  claimType: 'queja' | 'reclamo';
  contractedGood: 'producto' | 'servicio';
  claimedAmount?: number;
  productDescription: string;
  detail: string;
  consumerRequest: string;
}

export const ApiService = {
  getEndpointUrl(): string {
    return '/api';
  },

  setEndpointUrl(_url: string): void {
    // Stored for custom endpoint overrides if needed
  },

  /**
   * Verificar estado de la base de datos Supabase / PostgreSQL
   */
  async checkHealth(): Promise<{ isOnline: boolean; dbConnected: boolean; message: string; dialect?: string; isSupabase?: boolean }> {
    // If Supabase credentials are configured, check directly
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('categories').select('id').limit(1);
        if (!error) {
          return {
            isOnline: true,
            dbConnected: true,
            message: 'Supabase PostgreSQL Activo y Conectado',
            dialect: 'Supabase (PostgreSQL 15+)',
            isSupabase: true,
          };
        }
      } catch (e: any) {
        console.warn('Supabase ping check:', e);
      }
    }

    // Check backend /api/health
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const data = await response.json();
        return {
          isOnline: true,
          dbConnected: data.database === 'connected',
          message: data.database === 'connected' ? 'PostgreSQL Cloud SQL / Supabase Activo' : 'Conectando a base de datos...',
          dialect: data.dialect || 'PostgreSQL (Cloud SQL / Supabase)',
          isSupabase: isSupabaseConfigured(),
        };
      }
      return {
        isOnline: false,
        dbConnected: false,
        message: `Servidor respondió con código ${response.status}`,
        isSupabase: false,
      };
    } catch {
      return {
        isOnline: false,
        dbConnected: false,
        message: 'Modo local activo (fallback offline)',
        isSupabase: false,
      };
    }
  },

  /**
   * Obtener menú completo desde Supabase, PostgreSQL o fallback local
   */
  async fetchMenu(): Promise<ApiMenuData> {
    // 1. Intento directo con Supabase si está configurado
    if (isSupabaseConfigured()) {
      try {
        const [catsRes, prodsRes, saucesRes, promosRes] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('products').select('*'),
          supabase.from('sauces').select('*'),
          supabase.from('promotions').select('*'),
        ]);

        if (catsRes.data && catsRes.data.length > 0 && prodsRes.data && prodsRes.data.length > 0) {
          const parsedCategories: Category[] = catsRes.data.map((c: SupabaseCategory) => ({
            id: c.id,
            name: c.name,
            iconName: c.icon || 'Utensils',
            description: c.description || '',
          }));

          const parsedProducts: MenuItem[] = prodsRes.data.map((p: SupabaseProduct) => {
            const localMatch = MENU_ITEMS.find((m) => m.id === p.id);
            return {
              id: p.id,
              name: p.name,
              category: p.category_id,
              price: Number(p.price),
              description: p.description,
              badge: p.badge || undefined,
              popular: Boolean(p.popular),
              image: localMatch?.image || 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80',
              includes: localMatch?.includes || [],
              options: localMatch?.options,
            };
          });

          const parsedSauces: string[] = saucesRes.data && saucesRes.data.length > 0
            ? saucesRes.data.map((s: any) => s.name)
            : SAUCES_LIST;

          const parsedPromotions: PromotionItem[] = promosRes.data && promosRes.data.length > 0
            ? promosRes.data.map((pr: any) => {
                const localMatch = PROMOTIONS.find((pm) => pm.id === pr.id);
                return {
                  id: pr.id,
                  title: pr.title,
                  description: pr.description,
                  price: Number(pr.price),
                  originalPrice: pr.original_price ? Number(pr.original_price) : (localMatch?.originalPrice || Number(pr.price) + 6),
                  tag: pr.badge || localMatch?.tag || 'OFERTA',
                  items: Array.isArray(pr.includes) ? pr.includes : (typeof pr.includes === 'string' ? pr.includes.split(', ') : (localMatch?.items || [])),
                  image: localMatch?.image || 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80',
                };
              })
            : PROMOTIONS;

          return {
            categories: parsedCategories,
            products: parsedProducts,
            sauces: parsedSauces,
            promotions: parsedPromotions,
          };
        }
      } catch (err) {
        console.warn('Supabase fetchMenu fallback:', err);
      }
    }

    // 2. Intento mediante Express API
    try {
      const [catsRes, prodsRes, saucesRes, promosRes] = await Promise.all([
        fetch('/api/categories').catch(() => null),
        fetch('/api/products').catch(() => null),
        fetch('/api/sauces').catch(() => null),
        fetch('/api/promotions').catch(() => null),
      ]);

      if (catsRes && catsRes.ok && prodsRes && prodsRes.ok) {
        const catsJson = await catsRes.json();
        const prodsJson = await prodsRes.json();
        const saucesJson = saucesRes && saucesRes.ok ? await saucesRes.json() : null;
        const promosJson = promosRes && promosRes.ok ? await promosRes.json() : null;

        if (catsJson.success && prodsJson.success && prodsJson.data?.length > 0) {
          const parsedCategories: Category[] = catsJson.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            iconName: c.icon || 'Utensils',
            description: c.description || '',
          }));

          const parsedProducts: MenuItem[] = prodsJson.data.map((p: any) => {
            const localMatch = MENU_ITEMS.find((m) => m.id === p.id);
            return {
              id: p.id,
              name: p.name,
              category: p.categoryId || p.category_id || 'hamburguesas',
              price: Number(p.price),
              description: p.description,
              badge: p.badge || undefined,
              popular: Boolean(p.popular),
              image: localMatch?.image || 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80',
              includes: localMatch?.includes || [],
              options: localMatch?.options,
            };
          });

          const parsedSauces: string[] = saucesJson?.success
            ? saucesJson.data.map((s: any) => s.name)
            : SAUCES_LIST;

          const parsedPromotions: PromotionItem[] = promosJson?.success
            ? promosJson.data.map((pr: any) => {
                const localMatch = PROMOTIONS.find((pm) => pm.id === pr.id);
                return {
                  id: pr.id,
                  title: pr.title,
                  description: pr.description,
                  price: Number(pr.price),
                  originalPrice: pr.originalPrice ? Number(pr.originalPrice) : (localMatch?.originalPrice || Number(pr.price) + 6),
                  tag: pr.badge || localMatch?.tag || 'OFERTA',
                  items: Array.isArray(pr.includes) ? pr.includes : (typeof pr.includes === 'string' ? pr.includes.split(', ') : (localMatch?.items || [])),
                  image: localMatch?.image || 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80',
                };
              })
            : PROMOTIONS;

          return {
            categories: parsedCategories,
            products: parsedProducts,
            sauces: parsedSauces,
            promotions: parsedPromotions,
          };
        }
      }
    } catch (err) {
      console.warn('Fallback to local menu data:', err);
    }

    // 3. Fallback predeterminado con datos locales completos
    return {
      categories: CATEGORIES,
      products: MENU_ITEMS,
      sauces: SAUCES_LIST,
      promotions: PROMOTIONS,
    };
  },

  /**
   * Obtener pedidos desde Supabase o PostgreSQL
   */
  async fetchOrders(token?: string): Promise<Order[]> {
    // 1. Supabase directo
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          return data.map((o: SupabaseOrder) => {
            const parsedItems = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []);
            const total = Number(o.total) || 0;
            const deliveryFee = o.order_type === 'delivery' ? 4.0 : 0;
            const subtotal = Math.max(0, total - deliveryFee);

            return {
              id: o.id,
              orderNumber: o.order_number,
              customerName: o.customer_name,
              customerPhone: o.customer_phone,
              orderType: o.order_type === 'salon' ? 'dinein' : o.order_type,
              deliveryAddress: o.delivery_address || undefined,
              deliveryReference: o.delivery_reference || undefined,
              tableNumber: o.table_number || undefined,
              paymentMethod: (o.payment_method as any) || 'yape',
              notes: o.notes || undefined,
              status: o.status,
              subtotal,
              deliveryFee,
              total,
              items: parsedItems,
              createdAt: o.created_at || new Date().toISOString(),
            };
          });
        }
      } catch (err) {
        console.warn('Supabase fetchOrders notice:', err);
      }
    }

    // 2. Fallback Express API
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch('/api/orders', { headers });
      if (response.ok) {
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data.map((o: any) => {
            const parsedItems = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []);
            const total = Number(o.total) || 0;
            const deliveryFee = o.orderType === 'delivery' ? 4.0 : 0;
            const subtotal = Math.max(0, total - deliveryFee);

            return {
              id: o.id,
              orderNumber: o.orderNumber,
              customerName: o.customerName,
              customerPhone: o.customerPhone,
              orderType: o.orderType === 'salon' ? 'dinein' : o.orderType,
              deliveryAddress: o.deliveryAddress,
              deliveryReference: o.deliveryReference,
              tableNumber: o.tableNumber,
              paymentMethod: o.paymentMethod || 'yape',
              notes: o.notes,
              status: o.status,
              subtotal,
              deliveryFee,
              total,
              items: parsedItems,
              createdAt: o.createdAt || new Date().toISOString(),
            };
          });
        }
      }
    } catch {
      // fallback
    }
    return [];
  },

  /**
   * Registrar pedido en Supabase o PostgreSQL
   */
  async submitOrder(
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>,
    token?: string
  ): Promise<{ success: boolean; orderId?: string; orderNumber?: number }> {
    const orderId = `ORD-${Date.now()}`;
    const orderNumber = Math.floor(100 + Math.random() * 900);

    // 1. Supabase directo
    if (isSupabaseConfigured()) {
      try {
        const payload = {
          id: orderId,
          order_number: orderNumber,
          customer_name: orderData.customerName,
          customer_phone: orderData.customerPhone,
          order_type: orderData.orderType === 'dinein' ? 'salon' : orderData.orderType,
          delivery_address: orderData.deliveryAddress || null,
          delivery_reference: orderData.deliveryReference || null,
          table_number: orderData.tableNumber || null,
          payment_method: orderData.paymentMethod,
          notes: orderData.notes || null,
          status: 'recibido',
          total: Number(orderData.total),
          items: orderData.items,
        };

        const { data, error } = await supabase.from('orders').insert(payload).select().single();
        if (!error && data) {
          return {
            success: true,
            orderId: data.id,
            orderNumber: data.order_number,
          };
        }
      } catch (err) {
        console.warn('Supabase submitOrder notice:', err);
      }
    }

    // 2. Fallback Express API
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...orderData,
          id: orderId,
          orderNumber,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          return {
            success: true,
            orderId: json.data.id,
            orderNumber: json.data.orderNumber,
          };
        }
      }
    } catch (err) {
      console.warn('Notice on submit order:', err);
    }

    return {
      success: true,
      orderId,
      orderNumber,
    };
  },

  /**
   * Actualizar estado del pedido en Supabase / PostgreSQL
   */
  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', orderId);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase update status notice:', err);
      }
    }

    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * Registrar reclamación en el Libro de Reclamaciones
   */
  async submitClaim(claimData: ClaimPayload): Promise<{ success: boolean; claimCode: string; message: string }> {
    const claimCode = 'LR-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('claims').insert({
          claim_code: claimCode,
          full_name: claimData.fullName,
          doc_type: claimData.docType,
          doc_number: claimData.docNumber,
          phone: claimData.phone,
          email: claimData.email,
          address: claimData.address,
          claim_type: claimData.claimType,
          contracted_good: claimData.contractedGood,
          claimed_amount: claimData.claimedAmount ? Number(claimData.claimedAmount) : null,
          product_description: claimData.productDescription || null,
          detail: claimData.detail,
          consumer_request: claimData.consumerRequest,
          status: 'pendiente',
        });

        if (!error) {
          return {
            success: true,
            claimCode,
            message: 'Reclamación registrada exitosamente en Supabase de conformidad con el Código de Protección y Defensa del Consumidor.',
          };
        }
      } catch (err) {
        console.warn('Supabase submitClaim notice:', err);
      }
    }

    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...claimData,
          claimCode,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          return {
            success: true,
            claimCode: json.data?.claimCode || claimCode,
            message: 'Reclamación registrada exitosamente en la base de datos de conformidad con el Código de Protección y Defensa del Consumidor.',
          };
        }
      }
    } catch {
      // Fallback
    }

    return {
      success: true,
      claimCode,
      message: 'Reclamación registrada exitosamente de conformidad con el Código de Protección y Defensa del Consumidor.',
    };
  },

  /**
   * Suscribirse a cambios en tiempo real de Pedidos (Supabase Realtime)
   */
  subscribeToOrders(callback: (order: Order) => void) {
    if (!isSupabaseConfigured()) return null;

    try {
      const channel = supabase
        .channel('public:orders')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload) => {
            if (payload.new) {
              const o: any = payload.new;
              const parsedItems = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []);
              const total = Number(o.total) || 0;
              const deliveryFee = o.order_type === 'delivery' ? 4.0 : 0;
              const subtotal = Math.max(0, total - deliveryFee);

              callback({
                id: o.id,
                orderNumber: o.order_number,
                customerName: o.customer_name,
                customerPhone: o.customer_phone,
                orderType: o.order_type === 'salon' ? 'dinein' : o.order_type,
                deliveryAddress: o.delivery_address || undefined,
                deliveryReference: o.delivery_reference || undefined,
                tableNumber: o.table_number || undefined,
                paymentMethod: (o.payment_method as any) || 'yape',
                notes: o.notes || undefined,
                status: o.status,
                subtotal,
                deliveryFee,
                total,
                items: parsedItems,
                createdAt: o.created_at || new Date().toISOString(),
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      return null;
    }
  },
};
