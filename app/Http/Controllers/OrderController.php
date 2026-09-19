<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Procesar y registrar una nueva orden de Buchisapa.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:120',
            'phone' => 'required|string|max:25',
            'delivery_address' => 'nullable|string|max:255',
            'order_type' => 'nullable|string|in:delivery,pickup,table',
            'payment_method' => 'required|string|in:yape,efectivo,tarjeta,plin',
            'notes' => 'nullable|string|max:500',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer',
            'items.*.product_name' => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $subtotal += $item['price'] * $item['quantity'];
            }
            $deliveryFee = ($validated['order_type'] ?? 'delivery') === 'delivery' ? 4.00 : 0.00;
            $total = $subtotal + $deliveryFee;

            $orderNumber = 'BUCHI-' . strtoupper(substr(uniqid(), -5));

            $order = Order::create([
                'order_number' => $orderNumber,
                'customer_name' => $validated['customer_name'],
                'phone' => $validated['phone'],
                'delivery_address' => $validated['delivery_address'] ?? 'Para Llevar / Salón',
                'order_type' => $validated['order_type'] ?? 'delivery',
                'payment_method' => $validated['payment_method'],
                'subtotal' => $subtotal,
                'delivery_fee' => $deliveryFee,
                'total' => $total,
                'status' => 'recibido',
                'notes' => $validated['notes'] ?? null,
                'user_id' => auth()->id() ?? null
            ]);

            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['price'] * $item['quantity'],
                    'notes' => $item['notes'] ?? null,
                    'sauces' => json_encode($item['sauces'] ?? [])
                ]);
            }

            // Limpiar carrito si existía en sesión
            $request->session()->forget('cart');

            return response()->json([
                'success' => true,
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'total' => $order->total,
                'message' => '¡Pedido recibido con éxito! En breve comenzaremos su preparación al carbón.'
            ], 201);
        });
    }

    /**
     * Consultar estado de un pedido por número.
     */
    public function show($orderNumber)
    {
        $order = Order::with('items')->where('order_number', $orderNumber)->firstOrFail();
        return response()->json($order);
    }
}
