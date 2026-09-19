<?php
/**
 * RESTAURANTE BUCHISAPA - CONFIGURACIÓN DE BASE DE DATOS Y CABECERAS
 * Compatible con cPanel, Hostinger, XAMPP, Apache y Nginx con PHP 7.4 - 8.3+
 */

// Permitir solicitudes CORS desde cualquier origen (para frontend React / móviles)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Manejo de preflight CORS (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de conexión MySQL (Editar con los datos de tu hosting)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'buchisapa_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_PORT', getenv('DB_PORT') ?: '3306');

/**
 * Obtener conexión PDO a la base de datos MySQL
 */
function getDBConnection() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Si falla la conexión a MySQL
            return null;
        }
    }
    return $pdo;
}

/**
 * Respuesta JSON estandarizada
 */
function sendJsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

/**
 * Obtener cuerpo de solicitud JSON (POST / PUT)
 */
function getJsonInput() {
    $rawInput = file_get_contents('php://input');
    if (empty($rawInput)) {
        return $_POST;
    }
    $decoded = json_decode($rawInput, true);
    return is_array($decoded) ? $decoded : [];
}
