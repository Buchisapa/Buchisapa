<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class KitchenController extends Controller
{
    /**
     * Vista de la pantalla de cocina (KDS).
     */
    public function index()
    {
        return view('cocina');
    }

    /**
     * API para obtener órdenes activas en tiempo real para la cocina.
     */
    public function getActiveOrders()
    {
        $orders = Order::with('items')
            ->whereIn('status', ['recibido', 'en_preparacion', 'listo'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Actualizar estado de orden (recibido -> en_preparacion -> listo -> entregado).
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:recibido,en_preparacion,listo,entregado,cancelado'
        ]);

        $order = Order::findOrFail($id);
        $order->status = $validated['status'];
        $order->save();

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }
}
