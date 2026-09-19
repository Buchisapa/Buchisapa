<?php
/**
 * RESTAURANTE BUCHISAPA - API de Productos y Categorías
 * Endpoint: /php/products.php
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'all';

if ($method === 'GET') {
    // 1. Intentar consultar Supabase
    $supaProducts = supabaseRequest('products?select=*&order=popular.desc');
    $supaCategories = supabaseRequest('categories?select=*');
    $supaSauces = supabaseRequest('sauces?select=*');
    $supaPromos = supabaseRequest('promotions?select=*');

    if ($supaProducts['status'] === 200 && !empty($supaProducts['data'])) {
        if ($action === 'categories') {
            sendJsonResponse(['success' => true, 'data' => $supaCategories['data']]);
        } elseif ($action === 'sauces') {
            sendJsonResponse(['success' => true, 'data' => $supaSauces['data']]);
        } elseif ($action === 'promotions') {
            sendJsonResponse(['success' => true, 'data' => $supaPromos['data']]);
        } else {
            sendJsonResponse([
                'success' => true,
                'source' => 'supabase',
                'categories' => $supaCategories['data'] ?? [],
                'products' => $supaProducts['data'] ?? [],
                'sauces' => $supaSauces['data'] ?? [],
                'promotions' => $supaPromos['data'] ?? []
            ]);
        }
    }

    // 2. Intentar consultar MySQL si está conectado
    $pdo = getDbConnection();
    if ($pdo) {
        try {
            $stmtCats = $pdo->query("SELECT * FROM categories");
            $cats = $stmtCats->fetchAll();

            $stmtProds = $pdo->query("SELECT * FROM products WHERE available = 1");
            $prods = $stmtProds->fetchAll();

            $stmtSauces = $pdo->query("SELECT * FROM sauces");
            $sauces = $stmtSauces->fetchAll();

            $stmtPromos = $pdo->query("SELECT * FROM promotions");
            $promos = $stmtPromos->fetchAll();

            sendJsonResponse([
                'success' => true,
                'source' => 'mysql',
                'categories' => $cats,
                'products' => $prods,
                'sauces' => $sauces,
                'promotions' => $promos
            ]);
        } catch (Exception $e) {
            // Continuar al fallback
        }
    }

    // 3. Fallback estático con la carta completa
    sendJsonResponse([
        'success' => true,
        'source' => 'fallback',
        'message' => 'Catálogo cargado desde configuración local de Buchisapa'
    ]);
}

sendJsonResponse(['error' => 'Método no permitido'], 405);
