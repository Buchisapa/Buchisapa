-- ==========================================================
-- RESTAURANTE BUCHISAPA - BASE DE DATOS MYSQL COMPLETA
-- Compatible con phpMyAdmin, cPanel, Hostinger, XAMPP, RDS
-- Codificación: UTF-8 (utf8mb4)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `buchisapa_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `buchisapa_db`;

-- 1. TABLA DE CATEGORÍAS
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `icon_name` VARCHAR(50) NOT NULL DEFAULT 'Utensils',
  `description` TEXT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABLA DE PRODUCTOS Y PLATOS
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(60) NOT NULL PRIMARY KEY,
  `category_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `description` TEXT NULL,
  `image` TEXT NULL,
  `badge` VARCHAR(50) NULL,
  `popular` TINYINT(1) NOT NULL DEFAULT 0,
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABLA DE SALSAS Y CREMAS
CREATE TABLE IF NOT EXISTS `sauces` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(80) NOT NULL UNIQUE,
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABLA DE PROMOCIONES
CREATE TABLE IF NOT EXISTS `promotions` (
  `id` VARCHAR(60) NOT NULL PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `original_price` DECIMAL(10,2) NOT NULL,
  `tag` VARCHAR(50) NOT NULL DEFAULT 'OFERTA',
  `description` TEXT NULL,
  `items_json` TEXT NULL,
  `image` TEXT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABLA DE PEDIDOS
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(60) NOT NULL PRIMARY KEY,
  `order_number` INT NOT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(30) NOT NULL,
  `order_type` ENUM('delivery', 'pickup', 'dinein') NOT NULL DEFAULT 'delivery',
  `delivery_address` TEXT NULL,
  `delivery_reference` TEXT NULL,
  `table_number` VARCHAR(20) NULL,
  `payment_method` ENUM('yape', 'plin', 'efectivo', 'transferencia') NOT NULL DEFAULT 'yape',
  `cash_amount` DECIMAL(10,2) NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `delivery_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(10,2) NOT NULL,
  `status` ENUM('recibido', 'preparando', 'en_camino', 'entregado') NOT NULL DEFAULT 'recibido',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABLA DE DETALLES DE PEDIDO (ITEMS)
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(60) NOT NULL,
  `product_id` VARCHAR(60) NULL,
  `product_name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `selected_option` VARCHAR(100) NULL,
  `selected_sauces` TEXT NULL,
  `notes` TEXT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABLA DE LIBRO DE RECLAMACIONES
CREATE TABLE IF NOT EXISTS `claims` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `claim_code` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `doc_type` VARCHAR(20) NOT NULL,
  `doc_number` VARCHAR(30) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `address` TEXT NOT NULL,
  `claim_type` ENUM('queja', 'reclamo') NOT NULL DEFAULT 'reclamo',
  `contracted_good` ENUM('producto', 'servicio') NOT NULL DEFAULT 'producto',
  `claimed_amount` DECIMAL(10,2) NULL,
  `product_description` TEXT NOT NULL,
  `detail` TEXT NOT NULL,
  `consumer_request` TEXT NOT NULL,
  `status` ENUM('pendiente', 'en_revision', 'atendido') NOT NULL DEFAULT 'pendiente',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- POBLADO DE DATOS INICIALES (SEMILLA)
-- ==========================================================

-- Categorías
INSERT INTO `categories` (`id`, `name`, `icon_name`, `description`, `sort_order`) VALUES
('hamburguesas', 'HAMBURGUESAS', 'Beef', 'Hamburguesas artesanales de res y pollo con papas al hilo', 1),
('broaster', 'BROASTER', 'Drumstick', 'Pollo broaster ultra crocante con papas doradas y ensalada fresca', 2),
('salchipapas', 'SALCHIPAPAS', 'UtensilsCrossed', 'Salchipapas y salchibroasters contundentes con variedad de embutidos', 3),
('alitas', 'ALITAS', 'Flame', 'Alitas crocantes bañadas en salsa BBQ y salsa Acevichada', 4),
('amazonicos', 'PLATOS DE LA SELVA', 'Palmtree', 'Tradición de la selva: tacacho con cecina, juanes, caldos y chaufa amazónico', 5),
('bebidas', 'BEBIDAS', 'CupSoda', 'Gaseosas heladas personalizadas e hidratantes', 6),
('refrescos', 'REFRESCOS E INFUSIONES', 'GlassWater', 'Refrescos naturales de frutos amazónicos, chicha morada e infusiones calientes', 7)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Cremas y Salsas Oficiales de Buchisapa
INSERT INTO `sauces` (`name`, `is_available`, `sort_order`) VALUES
('Acevichada', 1, 1),
('BBQ', 1, 2),
('Aceituna', 1, 3),
('Ají de Rocoto', 1, 4),
('Salsa Golf', 1, 5),
('Ocopa', 1, 6),
('Mayonesa', 1, 7),
('Vinagreta', 1, 8),
('Tártara', 1, 9),
('Mostaza', 1, 10),
('Ketchup', 1, 11)
ON DUPLICATE KEY UPDATE `is_available` = 1;

-- Platos y Productos (45 productos oficiales)
INSERT INTO `products` (`id`, `category_id`, `name`, `price`, `description`, `image`, `badge`, `popular`, `sort_order`) VALUES
('hamb-clasica', 'hamburguesas', 'Hamburguesa Clásica', 8.00, 'Carne de res especial, lechuga fresca, tomate, papas al hilo y salsas de la casa.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80', NULL, 0, 1),
('hamb-choripan', 'hamburguesas', 'Choripan', 10.00, 'Chorizo parrillero a la brasa en pan crocante con chimichurri y salsas.', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1000&q=80', NULL, 0, 2),
('hamb-hawaiana-carne', 'hamburguesas', 'Hawaiana Carne', 12.00, 'Carne jugosa de res, piña a la parrilla, queso derretido, jamón y papas al hilo.', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80', NULL, 1, 3),
('hamb-hawaiana-pollo', 'hamburguesas', 'Hawaiana Pollo', 12.00, 'Filete de pollo, piña a la parrilla, queso derretido, jamón y papas al hilo.', 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?auto=format&fit=crop&w=1000&q=80', NULL, 0, 4),
('hamb-pollo-deshilachado', 'hamburguesas', 'Pollo Deshilachado', 10.00, 'Jugoso pollo deshilachado con mayonesa casera, lechuga y papas al hilo.', 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=1000&q=80', NULL, 0, 5),
('hamb-filete-pollo', 'hamburguesas', 'Filete de Pollo', 11.00, 'Pechuga de pollo a la plancha doradita, lechuga, tomate y salsas de la casa.', 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=1000&q=80', NULL, 0, 6),
('hamb-cheese-burguer', 'hamburguesas', 'Cheese Burguer', 11.00, 'Carne de res artesanal con doble queso cheddar derretido y vegetales frescos.', 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=1000&q=80', NULL, 0, 7),
('hamb-bacon-burguer', 'hamburguesas', 'Bacon Burguer', 13.00, 'Carne artesanal, tocino crocante, queso cheddar derretido y salsa barbacoa.', 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=1000&q=80', NULL, 1, 8),
('hamb-la-suprema', 'hamburguesas', 'La Suprema', 15.00, 'Doble carne artesanal, tocino crocante, queso, huevo frito, plátano y papas al hilo.', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80', 'Especial', 0, 9),
('hamb-a-lo-pobre', 'hamburguesas', 'Hamburguesa A Lo Pobre', 13.00, 'Carne artesanal de res, huevo frito, plátano frito maduro y queso derretido.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80', NULL, 0, 10),
('hamb-royal', 'hamburguesas', 'Hamburguesa Royal', 12.00, 'Carne artesanal, huevo frito, queso cheddar derretido y papas al hilo.', 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=1000&q=80', NULL, 0, 11),
('hamb-royal-a-lo-pobre', 'hamburguesas', 'Royal a lo Pobre', 15.00, 'Carne artesanal, huevo frito, plátano frito, queso, tocino y todas las salsas.', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80', NULL, 0, 12),

('broaster-pecho', 'broaster', 'Pecho Broaster', 18.00, 'Crujiente y jugosa presa de Pecho Broaster servida con papas fritas y ensalada fresca.', 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=80', NULL, 1, 13),
('broaster-pierna', 'broaster', 'Pierna Broaster', 12.00, 'Jugosa pierna broaster crocante con papas fritas doraditas y ensalada casera.', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=80', NULL, 0, 14),
('broaster-encuentro', 'broaster', 'Encuentro Broaster', 13.00, 'Sabroso encuentro broaster bien crocante acompañado de papas fritas y cremas.', 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=80', NULL, 0, 15),
('broaster-ala', 'broaster', 'Ala Broaster', 10.00, 'Crocante ala broaster doradita con porción de papas fritas crocantes y cremas.', 'https://images.unsplash.com/photo-1527477378408-1bc0602f06b9?auto=format&fit=crop&w=1000&q=80', NULL, 0, 16),

('salchi-clasica', 'salchipapas', 'Salchipapa Clásica', 10.00, 'Salchichas frankfurter cortadas sobre abundante porción de papas fritas crocantes.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=80', NULL, 0, 17),
('salchi-a-lo-pobre', 'salchipapas', 'Salchipapa A Lo Pobre', 13.00, 'Abundante salchipapa con huevo frito, plátano maduro frito y todas las cremas.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=80', NULL, 1, 18),
('salchi-broaster-pecho', 'salchipapas', 'Salchibroaster Pecho', 20.00, 'Papas fritas, salchichas, huevo + jugosa presa de Pecho Broaster crocante.', 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=80', 'Contundente', 0, 19),
('salchi-broaster-pierna', 'salchipapas', 'Salchibroaster Pierna', 14.00, 'Papas fritas, salchichas + jugosa Pierna Broaster crocante con cremas.', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=80', NULL, 0, 20),
('salchi-broaster-encuentro', 'salchipapas', 'Salchibroaster Encuentro', 16.00, 'Papas fritas, salchichas + jugoso Encuentro Broaster bien dorado.', 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=80', NULL, 0, 21),
('salchi-broaster-ala', 'salchipapas', 'Salchibroaster Ala', 13.00, 'Papas fritas, salchichas + Ala Broaster crocante con salsas de la casa.', 'https://images.unsplash.com/photo-1527477378408-1bc0602f06b9?auto=format&fit=crop&w=1000&q=80', NULL, 0, 22),
('salchi-chorizo', 'salchipapas', 'Salchichorizo', 13.00, 'Abundante porción de papas fritas con cortes de salchicha frankfurter y chorizo parrillero.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=80', NULL, 0, 23),

('alitas-acevichadas', 'alitas', 'Alitas Acevichadas', 15.00, '5 alitas crocantes bañadas en cremosa salsa acevichada de la casa + papas fritas.', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1000&q=80', NULL, 1, 24),
('alitas-bbq', 'alitas', 'Alitas BBQ', 15.00, '5 alitas doradas glaseadas en abundante salsa BBQ artesanal + papas fritas.', 'https://images.unsplash.com/photo-1527477378408-1bc0602f06b9?auto=format&fit=crop&w=1000&q=80', NULL, 0, 25),

('amaz-tacacho-cecina', 'amazonicos', 'Tacacho con Cecina', 12.00, 'Auténticas bolas de plátano asado al carbón con manteca y jugosa cecina de cerdo traída de la selva.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80', 'Tradición', 1, 26),
('amaz-juanes', 'amazonicos', 'Juanes', 15.00, 'Arroz sazonado con palillo y especias amazónicas, presa de gallina de chacra y huevo envuelto en hoja de bijao.', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1000&q=80', NULL, 0, 27),
('amaz-chilcano', 'amazonicos', 'Chilcano de Carachama o Pescado del Día', 15.00, 'Reconfortante y sustancioso caldo de pescado amazónico con sachaculantro y ají charapita.', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80', NULL, 0, 28),
('amaz-palometa-frita', 'amazonicos', 'Palometa Frita con Maduro o Plátano', 15.00, 'Fresco corte de palometa de río frita crocante servida con patacones o plátano maduro.', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=80', NULL, 0, 29),
('amaz-patacones-chorizo', 'amazonicos', 'Patacones con Chorizo', 12.00, 'Crujientes patacones de plátano verde acompañado de jugoso chorizo ahumado de la selva.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80', NULL, 0, 30),
('amaz-caldo-amazonico', 'amazonicos', 'Caldo Amazónico', 12.00, 'Concentrado y reconfortante caldo con sachaculantro, especias regionales y carnes seleccionadas.', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80', NULL, 0, 31),
('amaz-chaufa-amazonico', 'amazonicos', 'Arroz Chaufa Amazónico', 15.00, 'Granado arroz chaufa salteado al wok con trozos de cecina ahumada, chorizo regional y plátano maduro.', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80', NULL, 1, 32),

('beb-inca-kola', 'bebidas', 'Inca Kola 500ml', 5.00, 'Gaseosa helada 500ml personal.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80', NULL, 0, 33),
('beb-coca-cola', 'bebidas', 'Coca Cola 500ml', 5.00, 'Gaseosa helada 500ml personal.', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1000&q=80', NULL, 0, 34),
('beb-fanta', 'bebidas', 'Fanta 500ml', 3.50, 'Gaseosa helada sabor naranja 500ml.', 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=1000&q=80', NULL, 0, 35),
('beb-pepsi', 'bebidas', 'Pepsi', 2.00, 'Gaseosa helada personal.', 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=1000&q=80', NULL, 0, 36),
('beb-agua-cielo', 'bebidas', 'Agua Cielo', 2.50, 'Agua de mesa personal sin gas 600ml.', 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1000&q=80', NULL, 0, 37),

('refr-maracuya', 'refrescos', 'Refresco de Maracuyá', 3.00, 'Refresco natural helado de maracuyá fresca (1/2 litro).', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80', NULL, 1, 38),
('refr-chicha', 'refrescos', 'Refresco de Chicha Morada', 3.00, 'Chicha morada natural helada preparada con maíz morado y frutas.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80', NULL, 1, 39),
('refr-cocona', 'refrescos', 'Refresco de Cocona', 3.00, 'Auténtico refresco de cocona amazónica bien helado.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80', NULL, 0, 40),
('refr-aguajina', 'refrescos', 'Refresco de Aguajina', 3.00, 'Delicioso y cremoso refresco tradicional de aguaje selvático.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80', NULL, 0, 41),
('refr-camu-camu', 'refrescos', 'Refresco de Camu Camu', 3.00, 'Refresco super nutritivo y natural de camu camu selvático.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80', NULL, 0, 42),
('refr-anis', 'refrescos', 'Infusión de Anís', 2.50, 'Infusión caliente digestiva de anís.', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80', NULL, 0, 43),
('refr-te', 'refrescos', 'Infusión de Té', 2.50, 'Infusión caliente de té puro.', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80', NULL, 0, 44),
('refr-cafe', 'refrescos', 'Café Caliente', 3.00, 'Café pasado caliente peruano de intenso aroma.', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80', NULL, 0, 45)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `price` = VALUES(`price`), `description` = VALUES(`description`);

-- Promociones
INSERT INTO `promotions` (`id`, `title`, `price`, `original_price`, `tag`, `description`, `items_json`, `image`) VALUES
('promo-1', 'Promoción Broaster Para Mí', 18.90, 24.00, 'MÁS PEDIDO', '1/4 Pollo Broaster crocante + papas fritas doradas + ensalada fresca + chicha morada personal.', '["1/4 Pollo Broaster (Pecho o Pierna)", "Papas Fritas artesanales", "Ensalada del día", "Refresco Chicha Morada 500ml"]', 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80'),
('promo-2', 'Combo Salchibroaster Familiar', 32.00, 38.00, 'PROMO 24H', '1 Salchibroaster Pecho + 1 Salchipapa Clásica + 2 Refrescos de Maracuyá o Chicha.', '["1 Salchibroaster Pecho", "1 Salchipapa Clásica", "2 Refrescos 1/2L", "Salsas de la casa"]', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'),
('promo-3', 'Banquete Selva & Broaster', 35.00, 42.00, 'ESPECIALIDAD', '1 Tacacho con Cecina ahumada + 1 Pecho Broaster crocante + papas, ensalada y 1 Refresco Cocona.', '["1 Tacacho con Cecina", "1 Pecho Broaster", "Papas y ensalada", "1 Refresco Cocona"]', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'),
('promo-4', 'Dúo Hamburguesas Royal & Bebida', 24.50, 29.00, 'OFERTA', '2 Hamburguesas Royal con queso, huevo y papas al hilo + 2 Bebidas personales.', '["2 Hamburguesas Royal", "2 Bebidas 500ml", "Papas al hilo", "Cremas ilimitadas"]', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'),
('promo-5', 'Combo Alitas BBQ & Papas x10', 28.00, 34.00, 'PARA COMPARTIR', '10 Alitas crocantes bañadas en BBQ artesanal o Acevichada + papas fritas familiares.', '["10 Alitas crocantes", "Papas familiares", "Salsas de la casa"]', 'https://images.unsplash.com/photo-1527477378408-1bc0602f06b9?auto=format&fit=crop&w=800&q=80'),
('promo-6', 'Combo Hamburguesa Clásica + Alitas', 26.90, 32.00, 'SUPER COMBO', '1 Hamburguesa Clásica con papas + 4 Alitas Acevichadas + 1 Bebida personal helada.', '["1 Hamburguesa Clásica", "4 Alitas Acevichadas", "1 Bebida personal", "Papas fritas"]', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `price` = VALUES(`price`);
