import { db } from './index.ts';
import { categories, products, sauces, promotions, orders, claims } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getCategories() {
  try {
    return await db.select().from(categories);
  } catch (error) {
    console.error('Failed to get categories:', error);
    throw new Error('Could not retrieve categories.', { cause: error });
  }
}

export async function getProducts(categoryId?: string) {
  try {
    if (categoryId && categoryId !== 'todos') {
      return await db.select().from(products).where(eq(products.categoryId, categoryId));
    }
    return await db.select().from(products);
  } catch (error) {
    console.error('Failed to get products:', error);
    throw new Error('Could not retrieve products.', { cause: error });
  }
}

export async function getSauces() {
  try {
    return await db.select().from(sauces);
  } catch (error) {
    console.error('Failed to get sauces:', error);
    throw new Error('Could not retrieve sauces.', { cause: error });
  }
}

export async function getPromotions() {
  try {
    return await db.select().from(promotions);
  } catch (error) {
    console.error('Failed to get promotions:', error);
    throw new Error('Could not retrieve promotions.', { cause: error });
  }
}

export async function getOrders() {
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Failed to get orders:', error);
    throw new Error('Could not retrieve orders.', { cause: error });
  }
}

export async function createOrder(data: {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  orderType: string;
  deliveryAddress?: string;
  deliveryReference?: string;
  tableNumber?: string;
  paymentMethod: string;
  notes?: string;
  status: string;
  total: number;
  items: string;
  userId?: string;
}) {
  try {
    const inserted = await db.insert(orders).values(data).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to create order:', error);
    throw new Error('Could not create order.', { cause: error });
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const updated = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))
      .returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw new Error('Could not update order status.', { cause: error });
  }
}

export async function getClaims() {
  try {
    return await db.select().from(claims).orderBy(desc(claims.createdAt));
  } catch (error) {
    console.error('Failed to get claims:', error);
    throw new Error('Could not retrieve claims.', { cause: error });
  }
}

export async function createClaim(data: {
  claimCode: string;
  fullName: string;
  docType: string;
  docNumber: string;
  phone: string;
  email: string;
  address: string;
  claimType: string;
  contractedGood: string;
  claimedAmount?: number;
  productDescription?: string;
  detail: string;
  consumerRequest: string;
}) {
  try {
    const inserted = await db.insert(claims).values(data).returning();
    return inserted[0];
  } catch (error) {
    console.error('Failed to create claim:', error);
    throw new Error('Could not create claim.', { cause: error });
  }
}
