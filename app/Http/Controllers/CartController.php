<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Obtener los items del carrito almacenados en sesión.
     */
    public function index(Request $request)
    {
        $cart = $request->session()->get('cart', []);
        $total = 0;
        foreach ($cart as $item) {
            $total += $item['price'] * $item['quantity'];
        }

        return response()->json([
            'items' => array_values($cart),
            'count' => array_sum(array_column($cart, 'quantity')),
            'subtotal' => $total,
            'delivery' => 4.00,
            'total' => $total + 4.00
        ]);
    }

    /**
     * Agregar un producto al carrito.
     */
    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer',
            'quantity' => 'nullable|integer|min:1',
            'notes' => 'nullable|string|max:250',
            'sauces' => 'nullable|array'
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $cart = $request->session()->get('cart', []);

        $itemKey = $product->id . '_' . md5(json_encode($validated['sauces'] ?? []));

        if (isset($cart[$itemKey])) {
            $cart[$itemKey]['quantity'] += $validated['quantity'] ?? 1;
        } else {
            $cart[$itemKey] = [
                'key' => $itemKey,
                'id' => $product->id,
                'name' => $product->name,
                'price' => (float)$product->price,
                'image' => $product->image_url,
                'quantity' => $validated['quantity'] ?? 1,
                'notes' => $validated['notes'] ?? '',
                'sauces' => $validated['sauces'] ?? ['Aji de la Casa', 'Mayonesa']
            ];
        }

        $request->session()->put('cart', $cart);

        return response()->json(['success' => true, 'cart' => $cart]);
    }

    /**
     * Actualizar cantidad o eliminar item.
     */
    public function update(Request $request, $key)
    {
        $cart = $request->session()->get('cart', []);
        $quantity = (int)$request->input('quantity', 1);

        if ($quantity <= 0) {
            unset($cart[$key]);
        } elseif (isset($cart[$key])) {
            $cart[$key]['quantity'] = $quantity;
        }

        $request->session()->put('cart', $cart);
        return response()->json(['success' => true, 'cart' => $cart]);
    }

    /**
     * Vaciar carrito.
     */
    public function clear(Request $request)
    {
        $request->session()->forget('cart');
        return response()->json(['success' => true]);
    }
}
