<?php
/**
 * RESTAURANTE BUCHISAPA - Libro de Reclamaciones Virtual
 * Endpoint: /php/claims.php
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (empty($data['fullName']) || empty($data['documentNumber']) || empty($data['detail'])) {
        sendJsonResponse(['error' => 'Por favor complete todos los campos obligatorios.'], 400);
    }

    $year = date('Y');
    $claimNumber = 'REC-' . $year . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

    $payload = [
        'claim_number' => $claimNumber,
        'full_name' => $data['fullName'],
        'document_type' => $data['documentType'] ?? 'DNI',
        'document_number' => $data['documentNumber'],
        'phone' => $data['phone'] ?? '',
        'email' => $data['email'] ?? '',
        'address' => $data['address'] ?? '',
        'claim_type' => $data['claimType'] ?? 'reclamo',
        'contracted_type' => $data['contractedType'] ?? 'servicio',
        'amount' => floatval($data['amount'] ?? 0),
        'description' => $data['description'] ?? '',
        'detail' => $data['detail'],
        'order_number' => $data['orderNumber'] ?? null,
        'status' => 'pendiente'
    ];

    // 1. Guardar en Supabase
    $supaInsert = supabaseRequest('claims', 'POST', $payload);

    // 2. Guardar en MySQL si está disponible
    $pdo = getDbConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO claims (claim_number, full_name, document_type, document_number, phone, email, address, claim_type, contracted_type, amount, description, detail, order_number, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $claimNumber,
                $data['fullName'],
                $data['documentType'] ?? 'DNI',
                $data['documentNumber'],
                $data['phone'] ?? '',
                $data['email'] ?? '',
                $data['address'] ?? '',
                $data['claimType'] ?? 'reclamo',
                $data['contractedType'] ?? 'servicio',
                floatval($data['amount'] ?? 0),
                $data['description'] ?? '',
                $data['detail'],
                $data['orderNumber'] ?? null,
                'pendiente'
            ]);
        } catch (Exception $e) {
            // Ignorar y retornar respuesta
        }
    }

    sendJsonResponse([
        'success' => true,
        'claimNumber' => $claimNumber,
        'message' => 'Su reclamo o queja ha sido registrado formalmente conforme a las normas de INDECOPI (Perú). Nos comunicaremos en un plazo máximo de 15 días hábiles.',
        'data' => $payload
    ], 201);
}

if ($method === 'GET') {
    $claimNumber = $_GET['number'] ?? null;
    if ($claimNumber) {
        $res = supabaseRequest('claims?claim_number=eq.' . urlencode($claimNumber));
        if ($res['status'] === 200 && !empty($res['data'])) {
            sendJsonResponse(['success' => true, 'data' => $res['data'][0]]);
        }
    }
    sendJsonResponse(['success' => false, 'message' => 'Reclamo no encontrado'], 404);
}

sendJsonResponse(['error' => 'Método no soportado'], 405);
