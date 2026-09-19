<?php
/**
 * RESTAURANTE BUCHISAPA - INSTALADOR WEB Y VERIFICADOR DE BASE DE DATOS
 * Abre este archivo en tu navegador para crear automáticamente las tablas e importar los 45 platos.
 */

require_once __DIR__ . '/config.php';

$message = '';
$messageType = '';
$isInstalled = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['install_db'])) {
    $pdo = getDBConnection();
    if (!$pdo) {
        $message = "❌ Error: No se pudo conectar a MySQL. Verifica las credenciales en config.php (Host: " . DB_HOST . ", Usuario: " . DB_USER . ", BD: " . DB_NAME . ")";
        $messageType = "danger";
    } else {
        try {
            $sqlFile = __DIR__ . '/database.sql';
            if (!file_exists($sqlFile)) {
                throw new Exception("No se encontró el archivo database.sql");
            }

            $sqlContent = file_get_contents($sqlFile);
            
            // Ejecutar multi-queries
            $pdo->exec($sqlContent);

            $message = "✅ ¡Base de datos instalada exitosamente! Se crearon todas las tablas y se poblaron los 45 platos, 7 categorías, 11 cremas y 6 promociones de Buchisapa.";
            $messageType = "success";
            $isInstalled = true;
        } catch (Exception $e) {
            $message = "❌ Error durante la instalación: " . $e->getMessage();
            $messageType = "danger";
        }
    }
}

$pdoCheck = getDBConnection();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instalador de Base de Datos - Restaurante Buchisapa</title>
  <style>
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #0f172a; color: #f8fafc; margin: 0; padding: 40px 20px; display: flex; justify-content: center; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; max-width: 640px; width: 100%; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    h1 { color: #f59e0b; margin-top: 0; font-size: 24px; display: flex; items-center; gap: 10px; }
    .status-badge { display: inline-block; padding: 6px 12px; border-radius: 9999px; font-size: 13px; font-weight: bold; margin-bottom: 20px; }
    .status-ok { background: #065f46; color: #34d399; }
    .status-bad { background: #7f1d1d; color: #fca5a5; }
    .alert { padding: 14px 18px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; line-height: 1.5; }
    .alert-success { background: #064e3b; border: 1px solid #059669; color: #a7f3d0; }
    .alert-danger { background: #7f1d1d; border: 1px solid #dc2626; color: #fecaca; }
    .btn { background: #e11d48; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 15px; font-weight: bold; cursor: pointer; transition: 0.2s; width: 100%; }
    .btn:hover { background: #be123c; }
    .info-box { background: #0f172a; padding: 16px; border-radius: 8px; border: 1px solid #334155; font-size: 13px; color: #94a3b8; margin: 20px 0; }
    .info-box code { color: #fbbf24; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🍗 Restaurante Buchisapa - Backend PHP</h1>
    <p style="color: #94a3b8; font-size: 14px;">Instalador y asistente de conexión para cPanel, Hostinger, XAMPP o servidores Apache/Nginx.</p>

    <?php if ($pdoCheck): ?>
      <div class="status-badge status-ok">● Conexión a MySQL Exitosa (<?php echo htmlspecialchars(DB_NAME); ?>)</div>
    <?php else: ?>
      <div class="status-badge status-bad">● Sin Conexión MySQL - Configura config.php</div>
    <?php endif; ?>

    <?php if ($message): ?>
      <div class="alert alert-<?php echo $messageType; ?>">
        <?php echo $message; ?>
      </div>
    <?php endif; ?>

    <div class="info-box">
      <strong>Configuración Actual:</strong><br>
      • Servidor BD: <code><?php echo htmlspecialchars(DB_HOST); ?>:<?php echo htmlspecialchars(DB_PORT); ?></code><br>
      • Base de Datos: <code><?php echo htmlspecialchars(DB_NAME); ?></code><br>
      • Usuario: <code><?php echo htmlspecialchars(DB_USER); ?></code><br>
      • Endpoint API: <code>api.php?action=get_menu</code>
    </div>

    <form method="POST">
      <button type="submit" name="install_db" class="btn">
        🚀 Instalar / Restaurar Tablas y Platos en MySQL
      </button>
    </form>

    <div style="margin-top: 24px; font-size: 13px; color: #64748b; text-align: center;">
      Restaurante Buchisapa • Atención las 24 horas • Ate, Lima
    </div>
  </div>
</body>
</html>
