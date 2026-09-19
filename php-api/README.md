# 🍗 Restaurante Buchisapa - Backend PHP & MySQL

Paquete de servidor backend en PHP y base de datos MySQL para el sitio web y sistema de pedidos de **Buchisapa**.

---

## 📁 Archivos Incluidos

1. `config.php`: Conexión PDO a MySQL, configuración de cabeceras CORS y respuestas JSON.
2. `database.sql`: Script SQL completo con las tablas y los **45 platos oficiales, 7 categorías, 11 cremas y 6 promociones** de Buchisapa.
3. `api.php`: Endpoint REST que procesa:
   - `?action=get_menu`: Retorna el catálogo completo en tiempo real.
   - `?action=create_order`: Guarda el pedido en la base de datos MySQL con soporte WhatsApp.
   - `?action=get_orders`: Lista los pedidos para la pantalla de cocina / caja.
   - `?action=update_order_status`: Cambia estados (*recibido*, *preparando*, *en_camino*, *entregado*).
   - `?action=create_claim`: Registra las reclamaciones del Libro de Reclamaciones.
   - `?action=health`: Diagnóstico del servidor y conexión a base de datos.
4. `setup.php`: Asistente web para instalar la base de datos con 1 solo clic desde tu navegador.
5. `.htaccess`: Configuración Apache para permitir CORS y proteger archivos sensibles.

---

## 🚀 Guía de Instalación en cPanel / Hostinger / XAMPP

### Paso 1: Subir los Archivos PHP
- En tu administrador de archivos (cPanel o Hostinger), crea una carpeta llamada `php-api` dentro de `public_html/`.
- Sube todos los archivos de esta carpeta (`config.php`, `database.sql`, `api.php`, `setup.php`, `.htaccess`).

### Paso 2: Crear la Base de Datos MySQL
1. En cPanel o Hostinger, ve a **Bases de Datos MySQL** (o Asistente de Bases de Datos).
2. Crea una base de datos (por ejemplo: `u123456_buchisapa_db`).
3. Crea un usuario MySQL con su contraseña y dale **Todos los Privilegios** sobre la base de datos.

### Paso 3: Configurar `config.php`
Abre `config.php` y coloca tus credenciales:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'tu_base_de_datos');
define('DB_USER', 'tu_usuario_mysql');
define('DB_PASS', 'tu_password_mysql');
```

### Paso 4: Ejecutar el Instalador
- Abre en tu navegador: `https://tudominio.com/php-api/setup.php`
- Haz clic en **"Instalar / Restaurar Tablas y Platos en MySQL"**.
- ¡Listo! Tu backend PHP estará 100% operativo.
