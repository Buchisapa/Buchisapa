import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { optionalAuth, requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUserByUid } from './src/db/users.ts';
import {
  getCategories,
  getProducts,
  getSauces,
  getPromotions,
  getOrders,
  createOrder,
  updateOrderStatus,
  getClaims,
  createClaim,
} from './src/db/queries.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES FIRST ---

  // Health check endpoint
  app.get('/api/health', async (req: Request, res: Response) => {
    try {
      const cats = await getCategories();
      res.json({
        status: 'ok',
        database: 'connected',
        dialect: 'postgresql',
        cloudSql: 'active',
        categoriesCount: cats.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Health check database connection notice:', error);
      res.json({
        status: 'ok',
        database: 'connecting',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Get categories
  app.get('/api/categories', async (req: Request, res: Response) => {
    try {
      const categories = await getCategories();
      res.json({ success: true, data: categories });
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ success: false, error: error.message || 'Error fetching categories' });
    }
  });

  // Get products
  app.get('/api/products', async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.category as string | undefined;
      const products = await getProducts(categoryId);
      res.json({ success: true, data: products });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      res.status(500).json({ success: false, error: error.message || 'Error fetching products' });
    }
  });

  // Get sauces
  app.get('/api/sauces', async (req: Request, res: Response) => {
    try {
      const sauces = await getSauces();
      res.json({ success: true, data: sauces });
    } catch (error: any) {
      console.error('Error fetching sauces:', error);
      res.status(500).json({ success: false, error: error.message || 'Error fetching sauces' });
    }
  });

  // Get promotions
  app.get('/api/promotions', async (req: Request, res: Response) => {
    try {
      const promotions = await getPromotions();
      res.json({ success: true, data: promotions });
    } catch (error: any) {
      console.error('Error fetching promotions:', error);
      res.status(500).json({ success: false, error: error.message || 'Error fetching promotions' });
    }
  });

  // Orders: Get all orders
  app.get('/api/orders', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
      const orders = await getOrders();
      res.json({ success: true, data: orders });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ success: false, error: error.message || 'Error fetching orders' });
    }
  });

  // Orders: Create new order
  app.post('/api/orders', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
      const {
        id,
        orderNumber,
        customerName,
        customerPhone,
        orderType,
        deliveryAddress,
        deliveryReference,
        tableNumber,
        paymentMethod,
        notes,
        status,
        total,
        items,
      } = req.body;

      if (!customerName || !customerPhone || !items) {
        return res.status(400).json({ success: false, error: 'Faltan campos requeridos en el pedido' });
      }

      const order = await createOrder({
        id: id || `ORD-${Date.now()}`,
        orderNumber: orderNumber || Math.floor(100 + Math.random() * 900),
        customerName,
        customerPhone,
        orderType: orderType || 'delivery',
        deliveryAddress,
        deliveryReference,
        tableNumber,
        paymentMethod: paymentMethod || 'Yape',
        notes,
        status: status || 'recibido',
        total: Number(total) || 0,
        items: typeof items === 'string' ? items : JSON.stringify(items),
        userId: req.user?.uid || undefined,
      });

      res.status(201).json({ success: true, data: order });
    } catch (error: any) {
      console.error('Error creating order:', error);
      res.status(500).json({ success: false, error: error.message || 'Error al guardar el pedido' });
    }
  });

  // Orders: Update status
  app.patch('/api/orders/:id/status', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ success: false, error: 'Estado requerido' });
      }

      const updated = await updateOrderStatus(id, status);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      res.status(500).json({ success: false, error: error.message || 'Error updating order status' });
    }
  });

  // Claims: Create claim in Libro de Reclamaciones
  app.post('/api/claims', async (req: Request, res: Response) => {
    try {
      const {
        claimCode,
        fullName,
        docType,
        docNumber,
        phone,
        email,
        address,
        claimType,
        contractedGood,
        claimedAmount,
        productDescription,
        detail,
        consumerRequest,
      } = req.body;

      if (!claimCode || !fullName || !phone || !email || !detail) {
        return res.status(400).json({ success: false, error: 'Faltan campos obligatorios para el reclamo' });
      }

      const claim = await createClaim({
        claimCode,
        fullName,
        docType: docType || 'DNI',
        docNumber: docNumber || '',
        phone,
        email,
        address: address || '',
        claimType: claimType || 'reclamo',
        contractedGood: contractedGood || 'producto',
        claimedAmount: claimedAmount ? Number(claimedAmount) : undefined,
        productDescription,
        detail,
        consumerRequest: consumerRequest || '',
      });

      res.status(201).json({ success: true, data: claim });
    } catch (error: any) {
      console.error('Error creating claim:', error);
      res.status(500).json({ success: false, error: error.message || 'Error al registrar el reclamo' });
    }
  });

  // Claims: Get all claims
  app.get('/api/claims', async (req: Request, res: Response) => {
    try {
      const claimsList = await getClaims();
      res.json({ success: true, data: claimsList });
    } catch (error: any) {
      console.error('Error fetching claims:', error);
      res.status(500).json({ success: false, error: error.message || 'Error al obtener reclamos' });
    }
  });

  // User auth sync endpoint
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || !req.user.uid) {
        return res.status(401).json({ error: 'No user authenticated' });
      }

      const { name, photoUrl } = req.body;
      const user = await getOrCreateUser(
        req.user.uid,
        req.user.email || '',
        name || req.user.name,
        photoUrl || req.user.picture
      );

      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Error syncing user:', error);
      res.status(500).json({ success: false, error: error.message || 'Error syncing user' });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
