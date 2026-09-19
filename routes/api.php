<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\KitchenController;
use App\Http\Controllers\ClaimController;

/*
|--------------------------------------------------------------------------
| API Routes - Buchisapa
|--------------------------------------------------------------------------
*/

Route::get('/products', function () {
    return \App\Models\Product::where('is_active', true)->orderBy('sort_order', 'asc')->get();
});

Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);

Route::get('/kitchen/orders', [KitchenController::class, 'getActiveOrders']);
Route::post('/kitchen/orders/{id}/status', [KitchenController::class, 'updateStatus']);

Route::post('/claims', [ClaimController::class, 'store']);
