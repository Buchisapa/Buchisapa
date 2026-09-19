-- ==============================================================================
-- RESTAURANTE BUCHISAPA - SUPABASE DATABASE SCHEMA & SEED DATA
-- Proyecto: viciehedjjpyykjbmzwe (Buchisapa-prod)
-- Ejecutar en: Supabase Dashboard -> SQL Editor (New Query -> Run)
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA PROFILES (Vinculada a auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  given_name TEXT,
  family_name TEXT,
  phone TEXT,
  doc_type TEXT DEFAULT 'DNI',
  doc_number TEXT,
  birth_date TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger para crear perfil automáticamente al registrarse con Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. TABLA CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT
);

-- 4. TABLA PRODUCTS (46 Platos con sus opciones y cremas)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT NOT NULL,
  badge TEXT,
  popular BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  options JSONB,
  includes_sauces BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA SAUCES (11 Cremas de la casa)
CREATE TABLE IF NOT EXISTS public.sauces (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_signature BOOLEAN DEFAULT false
);

-- 6. TABLA PROMOTIONS (6 Combos)
CREATE TABLE IF NOT EXISTS public.promotions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  badge TEXT NOT NULL,
  includes TEXT NOT NULL
);

-- 7. TABLA ORDERS (Pedidos en Tiempo Real)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'pickup', 'salon')),
  delivery_address TEXT,
  delivery_reference TEXT,
  table_number TEXT,
  payment_method TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'recibido' CHECK (status IN ('recibido', 'preparando', 'en_camino', 'entregado')),
  total NUMERIC(10, 2) NOT NULL,
  items JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABLA CLAIMS (Libro de Reclamaciones)
CREATE TABLE IF NOT EXISTS public.claims (
  id SERIAL PRIMARY KEY,
  claim_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  doc_type TEXT NOT NULL DEFAULT 'DNI',
  doc_number TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  claim_type TEXT NOT NULL CHECK (claim_type IN ('queja', 'reclamo')),
  contracted_good TEXT NOT NULL CHECK (contracted_good IN ('producto', 'servicio')),
  claimed_amount NUMERIC(10, 2),
  product_description TEXT,
  detail TEXT NOT NULL,
  consumer_request TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. TABLA PRINTER_CONFIG (Configuración de Impresora Térmica de Cocina)
CREATE TABLE IF NOT EXISTS public.printer_config (
  id SERIAL PRIMARY KEY,
  printer_name TEXT NOT NULL DEFAULT 'Impresora Térmica Cocina 80mm',
  connection_type TEXT NOT NULL DEFAULT 'usb' CHECK (connection_type IN ('usb', 'bluetooth', 'network', 'raw_bt')),
  paper_width INTEGER NOT NULL DEFAULT 80,
  auto_print BOOLEAN NOT NULL DEFAULT true,
  ip_address TEXT,
  port INTEGER DEFAULT 9100,
  footer_message TEXT DEFAULT '¡Gracias por su preferencia! - Restaurante Buchisapa',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- DATOS INICIALES (SEED DATA COMPLETO)
-- ==============================================================================

-- Categorías
INSERT INTO public.categories (id, name, icon, description) VALUES
  ('pollo-brasa', 'Pollo a la Brasa', 'Flame', 'El auténtico sabor peruano con nuestra receta secreta y papas crujientes.'),
  ('mostritos', 'Mostritos', 'UtensilsCrossed', 'La combinación legendaria de chaufa al wok con pollo a la brasa o broaster.'),
  ('hamburguesas', 'Hamburguesas', 'Beef', 'Hamburguesas artesanales de pura carne a la parrilla con combinaciones únicas.'),
  ('salchipapas', 'Salchipapas', 'Utensils', 'Papas crocantes con salchicha frankfurter premium y tus cremas favoritas.'),
  ('broaster', 'Broaster', 'Drumstick', 'Pollo crocante y jugoso con empanizado especial al estilo Buchisapa.'),
  ('alitas', 'Alitas', 'Sparkles', 'Alitas crujientes bañadas en nuestras salsas artesanales irresistibles.'),
  ('bebidas', 'Bebidas & Refrescos', 'Coffee', 'Chicha morada casera, maracuyá y gaseosas heladas.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, description = EXCLUDED.description;

-- Salsas y Cremas
INSERT INTO public.sauces (name, is_signature) VALUES
  ('Ají de Pollería Clásico', true),
  ('Tártara Criolla', true),
  ('Mayonesa de la Casa', false),
  ('Kétchup', false),
  ('Mostaza', false),
  ('Golf Especial', false),
  ('Crema de Rocoto Macho', true),
  ('Crema Huancaína', true),
  ('Salsa BBQ Ahumada', false),
  ('Salsa Acevichada', true),
  ('Chimichurri Selvático', true)
ON CONFLICT (name) DO NOTHING;

-- Configuración Inicial de Impresora
INSERT INTO public.printer_config (id, printer_name, connection_type, paper_width, auto_print, footer_message)
VALUES (1, 'Impresora Cocina Buchisapa 80mm', 'usb', 80, true, '¡Gracias por su preferencia! - Restaurante Buchisapa')
ON CONFLICT (id) DO NOTHING;

-- Platos (Productos de la Carta)
INSERT INTO public.products (id, name, category_id, price, description, badge, popular, available, options, includes_sauces) VALUES
  ('pb-1', '1 Pollo a la Brasa Entero', 'pollo-brasa', 68.00, 'Pollo entero marinado con nuestra receta tradicional, acompañado de abundantes papas fritas y ensalada fresca.', 'MÁS PEDIDO', true, true, '["Papas Clásicas", "Papas Nativas", "Ensalada Clásica", "Ensalada Cocida"]'::jsonb, true),
  ('pb-2', '1/2 Pollo a la Brasa', 'pollo-brasa', 38.00, 'Medio pollo dorado a la perfección, servido con crocantes papas fritas y ensalada fresca.', 'POPULAR', true, true, '["Papas Clásicas", "Papas Nativas", "Ensalada Clásica", "Ensalada Cocida"]'::jsonb, true),
  ('pb-3', '1/4 Pollo a la Brasa (Pecho)', 'pollo-brasa', 21.00, 'Cuarto de pollo parte pecho jugoso, con generosa porción de papas fritas y ensalada.', 'CLÁSICO', true, true, '["Papas Clásicas", "Papas Nativas", "Ensalada Clásica", "Ensalada Cocida"]'::jsonb, true),
  ('pb-4', '1/4 Pollo a la Brasa (Pierna)', 'pollo-brasa', 19.50, 'Cuarto de pollo parte pierna con encuentro, acompañado de papas fritas y ensalada.', null, false, true, '["Papas Clásicas", "Papas Nativas", "Ensalada Clásica", "Ensalada Cocida"]'::jsonb, true),
  ('pb-5', 'Combo Familiar Buchisapa', 'pollo-brasa', 82.00, '1 Pollo entero + Papas familiares + Ensalada grande + Gaseosa 1.5L + Plátano frito y porción de tequeños.', 'OFERTA FAMILIAR', true, true, null, true),

  ('mos-1', 'Mostrito Clásico de la Brasa', 'mostritos', 22.00, '1/4 de pollo a la brasa + generoso arroz chaufa al wok con huevo y cebollita china + papas fritas.', 'FAVORITO', true, true, '["Parte Pecho (+S/1.50)", "Parte Pierna"]'::jsonb, true),
  ('mos-2', 'Mostrito Broaster', 'mostritos', 21.00, 'Pieza de pollo broaster súper crocante + arroz chaufa al wok + papas fritas y cremas.', 'RECOMENDADO', true, true, null, true),
  ('mos-3', 'Mostrito Salvaje Buchisapa', 'mostritos', 26.00, '1/4 Pollo a la brasa + Arroz chaufa al wok + Huevo frito a la inglesa + Plátano bellaco frito + Salchicha.', 'ESPECIAL', true, true, null, true),
  ('mos-4', 'Mostrito Alitas BBQ / Acevichadas', 'mostritos', 24.00, '4 Alitas bañadas en tu salsa favorita + Arroz chaufa al wok + Papas fritas crocantes.', null, false, true, '["Salsa BBQ", "Salsa Acevichada", "Salsa Búfalo"]'::jsonb, true),
  ('mos-5', 'Mostrito Doble Poder', 'mostritos', 32.00, '1/2 Pollo a la brasa + Doble porción de chaufa al wok + Papas familiares.', 'PARA COMPARTIR', true, true, null, true),

  ('hamb-1', 'Hamburguesa Clásica Royal', 'hamburguesas', 14.50, 'Carne artesanal 150g, queso cheddar fundido, huevo frito, lechuga hidropónica, tomate y papas al hilo.', 'CLÁSICA', true, true, null, true),
  ('hamb-2', 'Hamburguesa A lo Pobre', 'hamburguesas', 16.50, 'Carne artesanal 150g, plátano frito, huevo a la inglesa, queso, cebolla caramelizada y salsa tártara.', 'FAVORITA', true, true, null, true),
  ('hamb-3', 'Hamburguesa Tocino & Cheddar', 'hamburguesas', 17.50, 'Carne a la parrilla 150g, doble queso cheddar, láminas de tocino crocante y salsa BBQ.', 'DELUXE', true, true, null, true),
  ('hamb-4', 'Hamburguesa Buchisapa Monster', 'hamburguesas', 23.00, 'Doble carne artesanal (300g), doble queso cheddar, doble tocino, huevo, plátano y aros de cebolla.', 'ESPECIAL DE LA CASA', true, true, null, true),
  ('hamb-5', 'Hamburguesa Crispy Chicken', 'hamburguesas', 15.00, 'Filete de pechuga empanizada súper crujiente, queso, lechuga fresca y tártara casera.', null, false, true, null, true),

  ('sal-1', 'Salchipapa Clásica', 'salchipapas', 12.00, 'Papas fritas crocantes con rodajas de hot dog frankfurter y todas las cremas.', 'CLÁSICA', true, true, null, true),
  ('sal-2', 'Salchipapa Mixta', 'salchipapas', 15.00, 'Papas fritas con salchicha frankfurter, chorizo parrillero ahumado en rodajas y huevo frito.', 'POPULAR', true, true, null, true),
  ('sal-3', 'Salchipapa A lo Pobre', 'salchipapas', 16.00, 'Salchipapa clásica con huevo frito montado, plátano frito dulce y queso rallado.', 'RECOMENDADA', true, true, null, true),
  ('sal-4', 'Salchipapa Buchisapa Brutal', 'salchipapas', 24.00, 'Papas crocantes, salchicha, chorizo, trozos de pollo broaster, tocino crocante, queso fundido y huevo.', 'BRUTAL', true, true, null, true),

  ('bro-1', '1 Pieza Broaster con Papas', 'broaster', 13.00, 'Pieza de pollo seleccionada con empanizado crocante, acompañada de papas fritas y ensalada.', null, false, true, null, true),
  ('bro-2', '2 Piezas Broaster Clásicas', 'broaster', 20.00, 'Dos piezas doradas y crujientes con papas fritas y ensalada fresca.', 'POPULAR', true, true, null, true),
  ('bro-3', 'Combo Broastero 3 Piezas', 'broaster', 27.00, '3 Piezas crujientes + papas fritas + ensalada + gaseosa personal.', 'RECOMENDADO', true, true, null, true),
  ('bro-4', 'Balde Broaster Buchisapa (6 Piezas)', 'broaster', 49.00, '6 Piezas de pollo broaster crocante + papas familiares + porción de cremas gigantes.', 'PARA COMPARTIR', true, true, null, true),

  ('ali-1', 'Alitas BBQ Clásicas (6 uds)', 'alitas', 19.00, 'Alitas bañadas en salsa BBQ ahumada con toque de miel y sésamo, con papas fritas.', 'MÁS VENDIDO', true, true, null, true),
  ('ali-2', 'Alitas Acevichadas (6 uds)', 'alitas', 20.00, 'Alitas crocantes bañadas en nuestra salsa acevichada de la casa con toques de culantro.', 'ESPECIAL', true, true, null, true),
  ('ali-3', 'Alitas Búfalo Picantes (6 uds)', 'alitas', 19.50, 'Alitas picantes estilo Nueva York con salsa spicy y bastones de apio con crema tártara.', null, false, true, null, true),
  ('ali-4', 'Docena de Alitas Mixtas (12 uds)', 'alitas', 35.00, '12 Alitas a elegir hasta 2 salsas (BBQ, Acevichadas, Búfalo) con papas familiares.', 'COMBO DÚO', true, true, null, true),

  ('beb-1', 'Chicha Morada Casera (1 Litro)', 'bebidas', 11.00, 'Preparada diariamente con maíz morado, piña, manzana, canela y clavo de olor.', '100% NATURAL', true, true, null, false),
  ('beb-2', 'Refresco de Maracuyá (1 Litro)', 'bebidas', 11.00, 'Pura fruta natural bien heladita.', 'REFRESCANTE', false, true, null, false),
  ('beb-3', 'Inca Kola 1.5L', 'bebidas', 10.00, 'La bebida de sabor nacional.', null, false, true, null, false),
  ('beb-4', 'Coca Cola 1.5L', 'bebidas', 10.00, 'Sabor original helada.', null, false, true, null, false)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  category_id = EXCLUDED.category_id, 
  price = EXCLUDED.price, 
  description = EXCLUDED.description, 
  badge = EXCLUDED.badge, 
  popular = EXCLUDED.popular, 
  available = EXCLUDED.available;

-- Promociones
INSERT INTO public.promotions (id, title, description, price, original_price, badge, includes) VALUES
  ('promo-1', 'Super Combo Pareja', '1/2 Pollo a la brasa + Papas fritas + Ensalada + 2 Chichas personales + 4 Tequeños.', 46.00, 56.00, '25% DSCTO', '1/2 Pollo, Papas, Ensalada, 2 Bebidas, 4 Tequeños'),
  ('promo-2', 'Combo Mostritero Dúo', '2 Mostritos clásicos de la brasa + 2 Bebidas heladas + Porción de tequeños de queso.', 44.00, 52.00, 'POPULAR', '2 Mostritos, 2 Bebidas, 4 Tequeños'),
  ('promo-3', 'Mega Banquete Familiar', '1 Pollo entero + 1 Porción de Chaufa grande + Papas familiares + Gaseosa 1.5L + Ensalada.', 88.00, 102.00, 'FAMILIAR', '1 Pollo, 1 Chaufa Familiar, Papas, Gaseosa 1.5L'),
  ('promo-4', 'Fiesta de Alitas (18 uds)', '18 Alitas en 3 salsas distintas + Doble porción de papas fritas + Gaseosa 1.5L.', 54.00, 65.00, 'AMIGOS', '18 Alitas, Papas Dobles, Gaseosa 1.5L'),
  ('promo-5', 'Combo Burger Cuádruple', '4 Hamburguesas Clásicas Royal + 4 Papas fritas + 4 Bebidas.', 58.00, 72.00, 'OFERTÓN', '4 Hamburguesas Royal, 4 Papas, 4 Bebidas')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  badge = EXCLUDED.badge,
  includes = EXCLUDED.includes;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sauces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.printer_config ENABLE ROW LEVEL SECURITY;

-- Políticas de Lectura Pública
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Sauces" ON public.sauces;
CREATE POLICY "Public Read Sauces" ON public.sauces FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Promotions" ON public.promotions;
CREATE POLICY "Public Read Promotions" ON public.promotions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Printer Config" ON public.printer_config;
CREATE POLICY "Public Read Printer Config" ON public.printer_config FOR SELECT USING (true);

-- Perfiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Pedidos (Creación y Lectura)
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
CREATE POLICY "Anyone can view orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can update orders status" ON public.orders;
CREATE POLICY "Anyone can update orders status" ON public.orders FOR UPDATE USING (true);

-- Reclamaciones
DROP POLICY IF EXISTS "Anyone can submit claims" ON public.claims;
CREATE POLICY "Anyone can submit claims" ON public.claims FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view claims" ON public.claims;
CREATE POLICY "Anyone can view claims" ON public.claims FOR SELECT USING (true);

-- ==============================================================================
-- PUBLICACIÓN EN TIEMPO REAL (REALTIME)
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END $$;
