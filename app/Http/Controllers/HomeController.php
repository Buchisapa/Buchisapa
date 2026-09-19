<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Muestra la carta principal de Buchisapa con categorías de pollos y platos amazónicos.
     */
    public function index(Request $request)
    {
        $category = $request->query('category', 'all');

        $query = Product::where('is_active', true);
        if ($category !== 'all') {
            $query->where('category', $category);
        }

        $products = $query->orderBy('sort_order', 'asc')->get();

        return view('home', compact('products', 'category'));
    }
}
