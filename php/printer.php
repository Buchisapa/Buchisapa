<?php
/**
 * RESTAURANTE BUCHISAPA - Generador de Tickets Térmicos para Cocina y Comanda (80mm)
 * Endpoint: /php/printer.php?order_id=ORD-123
 */

require_once __DIR__ . '/config.php';

$orderId = $_GET['order_id'] ?? null;

if (!$orderId) {
    sendJsonResponse(['error' => 'ID de pedido requerido'], 400);
}

// Obtener datos del pedido
$orderRes = supabaseRequest('orders?id=eq.' . urlencode($orderId));
$order = $orderRes['data'][0] ?? null;

if (!$order) {
    sendJsonResponse(['error' => 'Pedido no encontrado'], 404);
}

$items = is_string($order['items']) ? json_decode($order['items'], true) : $order['items'];

// Si se pide formato HTML directo para impresión térmica
if (isset($_GET['format']) && $_GET['format'] === 'html') {
    header('Content-Type: text/html; charset=utf-8');
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Ticket #<?= htmlspecialchars($order['order_number']) ?> - Buchisapa</title>
        <style>
            @media print {
                body { margin: 0; padding: 0; }
                .no-print { display: none; }
            }
            body {
                font-family: 'Courier New', Courier, monospace;
                width: 76mm;
                margin: 0 auto;
                padding: 4mm;
                color: #000;
                font-size: 12px;
                line-height: 1.3;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 6px 0; }
            .double-divider { border-top: 2px solid #000; margin: 8px 0; }
            .row { display: flex; justify-content: space-between; margin-bottom: 3px; }
            .badge {
                display: inline-block;
                border: 2px solid #000;
                font-size: 16px;
                font-weight: 900;
                padding: 4px 8px;
                margin: 6px 0;
            }
            .item-sauces { font-size: 10px; padding-left: 10px; color: #333; }
        </style>
    </head>
    <body onload="window.print()">
        <div class="center">
            <div style="font-size: 18px; font-weight: 900;">🍗 BUCHISAPA 🍗</div>
            <div>Sabor y Tradición Amazónica</div>
            <div>Tarapoto, San Martín - Perú</div>
            <div>WhatsApp: +51 927 486 448</div>
            <div class="divider"></div>
            <div class="badge">ORDEN #<?= htmlspecialchars($order['order_number']) ?></div>
            <div>Tipo: <strong><?= strtoupper(htmlspecialchars($order['order_type'])) ?></strong></div>
            <div>Fecha: <?= date('d/m/Y H:i', strtotime($order['created_at'])) ?></div>
        </div>

        <div class="divider"></div>
        <div><strong>Cliente:</strong> <?= htmlspecialchars($order['customer_name']) ?></div>
        <div><strong>Teléfono:</strong> <?= htmlspecialchars($order['customer_phone']) ?></div>
        <?php if (!empty($order['delivery_address'])): ?>
            <div><strong>Dirección:</strong> <?= htmlspecialchars($order['delivery_address']) ?></div>
        <?php endif; ?>
        <?php if (!empty($order['delivery_reference'])): ?>
            <div><strong>Ref:</strong> <?= htmlspecialchars($order['delivery_reference']) ?></div>
        <?php endif; ?>
        <?php if (!empty($order['table_number'])): ?>
            <div><strong>Mesa:</strong> <?= htmlspecialchars($order['table_number']) ?></div>
        <?php endif; ?>

        <div class="double-divider"></div>
        <div class="center bold">DETALLE DE COMANDA</div>
        <div class="divider"></div>

        <?php foreach ($items as $item): ?>
            <div class="row bold">
                <span><?= $item['quantity'] ?>x <?= htmlspecialchars($item['name']) ?></span>
                <span>S/ <?= number_format($item['price'] * $item['quantity'], 2) ?></span>
            </div>
            <?php if (!empty($item['selectedSauces'])): ?>
                <div class="item-sauces">Cremas: <?= htmlspecialchars(implode(', ', $item['selectedSauces'])) ?></div>
            <?php endif; ?>
            <?php if (!empty($item['notes'])): ?>
                <div class="item-sauces">Nota: <?= htmlspecialchars($item['notes']) ?></div>
            <?php endif; ?>
        <?php endforeach; ?>

        <div class="double-divider"></div>
        <div class="row bold" style="font-size: 15px;">
            <span>TOTAL:</span>
            <span>S/ <?= number_format($order['total'], 2) ?></span>
        </div>
        <div class="row">
            <span>Método de Pago:</span>
            <span><?= strtoupper(htmlspecialchars($order['payment_method'])) ?></span>
        </div>

        <?php if (!empty($order['notes'])): ?>
            <div class="divider"></div>
            <div><strong>Observaciones:</strong> <?= htmlspecialchars($order['notes']) ?></div>
        <?php endif; ?>

        <div class="divider"></div>
        <div class="center" style="font-size: 10px; margin-top: 10px;">
            ¡Gracias por preferir Buchisapa!<br>
            www.buchisapaweb.vercel.app
        </div>
    </body>
    </html>
    <?php
    exit;
}

sendJsonResponse(['success' => true, 'order' => $order]);
