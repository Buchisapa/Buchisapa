<?php
/**
 * RESTAURANTE BUCHISAPA - API de Gestión de Pedidos (Cocina y Delivery)
 * Endpoint: /php/orders.php
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Listar pedidos recientes
    $supaOrders = supabaseRequest('orders?select=*&order=created_at.desc&limit=50');
    if ($supaOrders['status'] === 200) {
        sendJsonResponse([
            'success' => true,
            'source' => 'supabase',
            'data' => $supaOrders['data']
        ]);
    }

    $pdo = getDbConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 50");
            $orders = $stmt->fetchAll();
            foreach ($orders as &$o) {
                $o['items'] = json_decode($o['items'], true);
            }
            sendJsonResponse(['success' => true, 'source' => 'mysql', 'data' => $orders]);
        } catch (Exception $e) {
            sendJsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    sendJsonResponse(['success' => true, 'data' => []]);
}

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (!$data || empty($data['items']) || empty($data['customerName']) || empty($data['customerPhone'])) {
        sendJsonResponse(['error' => 'Datos de pedido incompletos o inválidos.'], 400);
    }

    $orderId = 'ORD-' . time();
    $orderNumber = rand(100, 999);

    $payload = [
        'id' => $orderId,
        'order_number' => $orderNumber,
        'customer_name' => $data['customerName'],
        'customer_phone' => $data['customerPhone'],
        'order_type' => $data['orderType'] ?? 'delivery',
        'delivery_address' => $data['deliveryAddress'] ?? null,
        'delivery_reference' => $data['deliveryReference'] ?? null,
        'table_number' => $data['tableNumber'] ?? null,
        'payment_method' => $data['paymentMethod'] ?? 'yape',
        'notes' => $data['notes'] ?? null,
        'status' => 'recibido',
        'total' => floatval($data['total'] ?? 0),
        'items' => $data['items']
    ];

    // 1. Guardar en Supabase
    $supaInsert = supabaseRequest('orders', 'POST', $payload);
    if ($supaInsert['status'] === 201 || $supaInsert['status'] === 200) {
        sendJsonResponse([
            'success' => true,
            'orderId' => $orderId,
            'orderNumber' => $orderNumber,
            'message' => '¡Pedido recibido y enviado a cocina en tiempo real!'
        ], 201);
    }

    // 2. Guardar en MySQL
    $pdo = getDbConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO orders (id, order_number, customer_name, customer_phone, order_type, delivery_address, delivery_reference, table_number, payment_method, notes, status, total, items)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
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
                $data['notes'] ?? null,
                'recibido',
                $data['total'],
                json_encode($data['items'], JSON_UNESCAPED_UNICODE)
            ]);

            sendJsonResponse([
                'success' => true,
                'orderId' => $orderId,
                'orderNumber' => $orderNumber,
                'message' => '¡Pedido guardado en base de datos!'
            ], 201);
        } catch (Exception $e) {
            sendJsonResponse(['error' => 'Error al guardar en base de datos: ' . $e->getMessage()], 500);
        }
    }

    sendJsonResponse([
        'success' => true,
        'orderId' => $orderId,
        'orderNumber' => $orderNumber,
        'message' => '¡Pedido registrado con éxito!'
    ]);
}

if ($method === 'PATCH' || $method === 'PUT') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    $orderId = $_GET['id'] ?? $data['id'] ?? null;
    $status = $data['status'] ?? null;

    if (!$orderId || !$status) {
        sendJsonResponse(['error' => 'ID de pedido y nuevo estado son requeridos'], 400);
    }

    // Actualizar en Supabase
    $supaUpdate = supabaseRequest('orders?id=eq.' . urlencode($orderId), 'PATCH', ['status' => $status]);
    if ($supaUpdate['status'] === 200 || $supaUpdate['status'] === 204) {
        sendJsonResponse(['success' => true, 'message' => 'Estado actualizado en Supabase']);
    }

    $pdo = getDbConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
            $stmt->execute([$status, $orderId]);
            sendJsonResponse(['success' => true, 'message' => 'Estado actualizado']);
        } catch (Exception $e) {
            sendJsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    sendJsonResponse(['success' => true, 'message' => 'Estado actualizado']);
}

sendJsonResponse(['error' => 'Método no soportado'], 405);
