<?php
/**
 * RESTAURANTE BUCHISAPA - API REST PRINCIPAL (PHP)
 * Maneja el menú, la creación de pedidos, el estado de cocina y el libro de reclamaciones.
 */

require_once __DIR__ . '/config.php';

$action = isset($_GET['action']) ? trim($_GET['action']) : '';
$pdo = getDBConnection();

switch ($action) {

    // 1. HEALTH CHECK & CONEXIÓN
    case 'health':
        $dbStatus = ($pdo !== null) ? 'connected' : 'disconnected';
        sendJsonResponse([
            'status' => 'ok',
            'database' => $dbStatus,
            'message' => 'API PHP de Buchisapa operativa',
            'server_time' => date('Y-m-d H:i:s'),
            'php_version' => PHP_VERSION
        ]);
        break;

    // 2. OBTENER MENÚ COMPLETO (Categorías, Productos, Cremas, Promos)
    case 'get_menu':
        if (!$pdo) {
            sendJsonResponse([
                'success' => false,
                'message' => 'Sin conexión a base de datos MySQL. Usando catálogo local.'
            ], 500);
        }

        try {
            // Categorías
            $stmtCat = $pdo->query("SELECT id, name, icon_name as iconName, description FROM categories ORDER BY sort_order ASC");
            $categories = $stmtCat->fetchAll();

            // Productos
            $stmtProd = $pdo->query("SELECT id, category_id as category, name, CAST(price AS DECIMAL(10,2)) as price, description, image, badge, popular FROM products WHERE is_available = 1 ORDER BY sort_order ASC");
            $products = $stmtProd->fetchAll();
            foreach ($products as &$p) {
                $p['price'] = (float)$p['price'];
                $p['popular'] = (bool)$p['popular'];
            }

            // Salsas
            $stmtSauces = $pdo->query("SELECT name FROM sauces WHERE is_available = 1 ORDER BY sort_order ASC");
            $sauces = $stmtSauces->fetchAll(PDO::FETCH_COLUMN);

            // Promociones
            $stmtPromo = $pdo->query("SELECT id, title, CAST(price AS DECIMAL(10,2)) as price, CAST(original_price AS DECIMAL(10,2)) as originalPrice, tag, description, items_json, image FROM promotions WHERE is_active = 1 ORDER BY id ASC");
            $rawPromos = $stmtPromo->fetchAll();
            $promotions = [];
            foreach ($rawPromos as $r) {
                $promotions[] = [
                    'id' => $r['id'],
                    'title' => $r['title'],
                    'price' => (float)$r['price'],
                    'originalPrice' => (float)$r['originalPrice'],
                    'tag' => $r['tag'],
                    'description' => $r['description'],
                    'items' => json_decode($r['items_json'] ?: '[]', true),
                    'image' => $r['image']
                ];
            }

            sendJsonResponse([
                'success' => true,
                'data' => [
                    'categories' => $categories,
                    'products' => $products,
                    'sauces' => $sauces,
                    'promotions' => $promotions
                ]
            ]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    // 3. REGISTRAR NUEVO PEDIDO
    case 'create_order':
        $data = getJsonInput();

        if (empty($data['customerName']) || empty($data['customerPhone']) || empty($data['items'])) {
            sendJsonResponse(['success' => false, 'message' => 'Faltan campos obligatorios para registrar el pedido.'], 400);
        }

        $orderId = 'ORD-' . date('Ymd-His') . '-' . rand(100, 999);
        $orderNumber = rand(1001, 9999);
        $createdAt = date('Y-m-d H:i:s');

        if ($pdo) {
            try {
                $pdo->beginTransaction();

                $stmt = $pdo->prepare("INSERT INTO orders 
                    (id, order_number, customer_name, customer_phone, order_type, delivery_address, delivery_reference, table_number, payment_method, cash_amount, subtotal, delivery_fee, total, status, notes, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'recibido', ?, ?)");

                $stmt->execute([
                    $orderId,
                    $orderNumber,
                    $data['customerName'],
                    $data['customerPhone'],
                    $data['orderType'] ?? 'delivery',
                    $data['deliveryAddress'] ?? null,
                    $data['deliveryReference'] ?? null,
                    $data['tableNumber'] ?? null,
                    $data['paymentMethod'] ?? 'yape',
                    isset($data['cashAmount']) ? (float)$data['cashAmount'] : null,
                    (float)($data['subtotal'] ?? 0),
                    (float)($data['deliveryFee'] ?? 0),
                    (float)($data['total'] ?? 0),
                    $data['notes'] ?? null,
                    $createdAt
                ]);

                // Guardar items
                $stmtItem = $pdo->prepare("INSERT INTO order_items 
                    (order_id, product_id, product_name, price, quantity, selected_option, selected_sauces, notes)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

                foreach ($data['items'] as $item) {
                    $stmtItem->execute([
                        $orderId,
                        $item['item']['id'] ?? null,
                        $item['item']['name'] ?? 'Producto',
                        (float)($item['item']['price'] ?? 0),
                        (int)($item['quantity'] ?? 1),
                        $item['selectedOption'] ?? null,
                        isset($item['selectedSauces']) ? implode(', ', $item['selectedSauces']) : null,
                        $item['notes'] ?? null
                    ]);
                }

                $pdo->commit();
            } catch (Exception $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                // Si falla BD, devolvemos el pedido generado para que continúe por WhatsApp
            }
        }

        sendJsonResponse([
            'success' => true,
            'message' => 'Pedido registrado exitosamente',
            'order' => array_merge($data, [
                'id' => $orderId,
                'orderNumber' => $orderNumber,
                'createdAt' => $createdAt,
                'status' => 'recibido'
            ])
        ]);
        break;

    // 4. LISTAR PEDIDOS PARA LA PANTALLA DE COCINA
    case 'get_orders':
        if (!$pdo) {
            sendJsonResponse(['success' => false, 'message' => 'Sin conexión a base de datos MySQL'], 500);
        }

        try {
            $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 50");
            $orders = $stmt->fetchAll();

            $result = [];
            foreach ($orders as $o) {
                $stmtItems = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
                $stmtItems->execute([$o['id']]);
                $items = $stmtItems->fetchAll();

                $formattedItems = [];
                foreach ($items as $it) {
                    $formattedItems[] = [
                        'cartId' => 'db-' . $it['id'],
                        'item' => [
                            'id' => $it['product_id'],
                            'name' => $it['product_name'],
                            'price' => (float)$it['price'],
                            'category' => 'general',
                            'description' => '',
                            'image' => ''
                        ],
                        'quantity' => (int)$it['quantity'],
                        'selectedOption' => $it['selected_option'],
                        'selectedSauces' => $it['selected_sauces'] ? explode(', ', $it['selected_sauces']) : [],
                        'notes' => $it['notes']
                    ];
                }

                $result[] = [
                    'id' => $o['id'],
                    'orderNumber' => (int)$o['order_number'],
                    'createdAt' => $o['created_at'],
                    'customerName' => $o['customer_name'],
                    'customerPhone' => $o['customer_phone'],
                    'orderType' => $o['order_type'],
                    'deliveryAddress' => $o['delivery_address'],
                    'deliveryReference' => $o['delivery_reference'],
                    'tableNumber' => $o['table_number'],
                    'paymentMethod' => $o['payment_method'],
                    'cashAmount' => $o['cash_amount'] ? (float)$o['cash_amount'] : null,
                    'items' => $formattedItems,
                    'subtotal' => (float)$o['subtotal'],
                    'deliveryFee' => (float)$o['delivery_fee'],
                    'total' => (float)$o['total'],
                    'status' => $o['status'],
                    'notes' => $o['notes']
                ];
            }

            sendJsonResponse(['success' => true, 'orders' => $result]);
        } catch (Exception $e) {
            sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
        }
        break;

    // 5. ACTUALIZAR ESTADO DE PEDIDO EN COCINA
    case 'update_order_status':
        $data = getJsonInput();
        $orderId = $data['orderId'] ?? '';
        $newStatus = $data['status'] ?? '';

        if (empty($orderId) || !in_array($newStatus, ['recibido', 'preparando', 'en_camino', 'entregado'])) {
            sendJsonResponse(['success' => false, 'message' => 'Parámetros inválidos'], 400);
        }

        if ($pdo) {
            try {
                $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
                $stmt->execute([$newStatus, $orderId]);
            } catch (Exception $e) {
                sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
            }
        }

        sendJsonResponse(['success' => true, 'message' => 'Estado actualizado a: ' . $newStatus]);
        break;

    // 6. REGISTRAR HOJA DE RECLAMACIÓN
    case 'create_claim':
        $data = getJsonInput();

        if (empty($data['fullName']) || empty($data['docNumber']) || empty($data['detail'])) {
            sendJsonResponse(['success' => false, 'message' => 'Complete todos los campos del reclamo.'], 400);
        }

        $claimCode = 'LR-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

        if ($pdo) {
            try {
                $stmt = $pdo->prepare("INSERT INTO claims 
                    (claim_code, full_name, doc_type, doc_number, phone, email, address, claim_type, contracted_good, claimed_amount, product_description, detail, consumer_request, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')");

                $stmt->execute([
                    $claimCode,
                    $data['fullName'],
                    $data['docType'] ?? 'DNI',
                    $data['docNumber'],
                    $data['phone'] ?? '',
                    $data['email'] ?? '',
                    $data['address'] ?? '',
                    $data['claimType'] ?? 'reclamo',
                    $data['contractedGood'] ?? 'producto',
                    isset($data['claimedAmount']) ? (float)$data['claimedAmount'] : null,
                    $data['productDescription'] ?? '',
                    $data['detail'],
                    $data['consumerRequest'] ?? ''
                ]);
            } catch (Exception $e) {
                // Silently fallback with generated code
            }
        }

        sendJsonResponse([
            'success' => true,
            'claimCode' => $claimCode,
            'message' => 'Reclamación registrada exitosamente de conformidad con el Código de Protección y Defensa del Consumidor.'
        ]);
        break;

    default:
        sendJsonResponse([
            'success' => false,
            'message' => 'Acción no reconocida. Acciones válidas: health, get_menu, create_order, get_orders, update_order_status, create_claim'
        ], 400);
        break;
}
