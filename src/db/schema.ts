import { pgTable, serial, text, timestamp, boolean, real, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (connected with Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  photoUrl: text('photo_url'),
  role: text('role').notNull().default('customer'), // 'admin', 'staff', 'customer'
  createdAt: timestamp('created_at').defaultNow(),
});

// Categories table
export const categories = pgTable('categories', {
  id: text('id').primaryKey(), // e.g. 'pollos-brasa'
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  description: text('description'),
});

// Products table (45 dishes)
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  categoryId: text('category_id')
    .references(() => categories.id)
    .notNull(),
  price: real('price').notNull(),
  description: text('description').notNull(),
  badge: text('badge'),
  popular: boolean('popular').default(false),
  available: boolean('available').default(true),
  options: text('options'), // JSON string array of options
  includesSauces: boolean('includes_sauces').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Sauces table (11 cremas de Buchisapa)
export const sauces = pgTable('sauces', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  isSignature: boolean('is_signature').default(false),
});

// Promotions table (6 combos / promos)
export const promotions = pgTable('promotions', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  originalPrice: real('original_price'),
  badge: text('badge').notNull(),
  includes: text('includes').notNull(),
});

// Orders table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: integer('order_number').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  orderType: text('order_type').notNull(), // 'delivery', 'pickup', 'salon'
  deliveryAddress: text('delivery_address'),
  deliveryReference: text('delivery_reference'),
  tableNumber: text('table_number'),
  paymentMethod: text('payment_method').notNull(),
  notes: text('notes'),
  status: text('status').notNull().default('recibido'), // 'recibido', 'preparando', 'en_camino', 'entregado'
  total: real('total').notNull(),
  items: text('items').notNull(), // JSON string with full cart details
  userId: text('user_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Claims table (Libro de Reclamaciones)
export const claims = pgTable('claims', {
  id: serial('id').primaryKey(),
  claimCode: text('claim_code').notNull().unique(),
  fullName: text('full_name').notNull(),
  docType: text('doc_type').notNull().default('DNI'),
  docNumber: text('doc_number').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  address: text('address').notNull(),
  claimType: text('claim_type').notNull().default('reclamo'), // 'queja', 'reclamo'
  contractedGood: text('contracted_good').notNull().default('producto'), // 'producto', 'servicio'
  claimedAmount: real('claimed_amount'),
  productDescription: text('product_description'),
  detail: text('detail').notNull(),
  consumerRequest: text('consumer_request').notNull(),
  status: text('status').notNull().default('pendiente'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
