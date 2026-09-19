<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\KitchenController;
use App\Http\Controllers\ClaimController;

/*
|--------------------------------------------------------------------------
| Web Routes - Buchisapa Pollería Tarapoto
|--------------------------------------------------------------------------
*/

// Página Principal / Menú
Route::get('/', [HomeController::class, 'index'])->name('home');

// Carrito de compras
Route::get('/carrito', [CartController::class, 'index'])->name('cart.index');
Route::post('/carrito/agregar', [CartController::class, 'add'])->name('cart.add');
Route::post('/carrito/actualizar/{key}', [CartController::class, 'update'])->name('cart.update');
Route::post('/carrito/vaciar', [CartController::class, 'clear'])->name('cart.clear');

// Pedidos y Checkout
Route::post('/pedidos', [OrderController::class, 'store'])->name('orders.store');
Route::get('/pedidos/{orderNumber}', [OrderController::class, 'show'])->name('orders.show');

// Pantalla de Cocina KDS
Route::get('/cocina', [KitchenController::class, 'index'])->name('kitchen.index');
Route::get('/cocina/ordenes', [KitchenController::class, 'getActiveOrders'])->name('kitchen.orders');
Route::post('/cocina/ordenes/{id}/estado', [KitchenController::class, 'updateStatus'])->name('kitchen.updateStatus');

// Libro de Reclamaciones
Route::get('/libro-de-reclamaciones', [ClaimController::class, 'index'])->name('claims.index');
Route::post('/libro-de-reclamaciones', [ClaimController::class, 'store'])->name('claims.store');

// Autenticación
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/registro', [AuthController::class, 'register'])->name('register');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
