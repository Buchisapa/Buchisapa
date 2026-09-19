@extends('layouts.app')

@section('title', 'KDS Cocina | Buchisapa')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
            <div class="flex items-center gap-3">
                <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping"></span>
                <h1 class="text-2xl sm:text-3xl font-black text-white">Sistema KDS Cocina en Tiempo Real</h1>
            </div>
            <p class="text-stone-400 text-sm">Monitoreo de pedidos al carbón en preparación y despacho.</p>
        </div>
        <div class="flex items-center gap-3 bg-stone-800 px-4 py-2 rounded-xl border border-stone-700 text-sm">
            <span class="text-stone-400">Actualización automática:</span>
            <span class="font-bold text-amber-400">Activo (5s)</span>
        </div>
    </div>

    <!-- Tablero KDS con columnas de estado -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="kds-columns">
        <!-- Columna: Recibidos -->
        <div class="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 flex flex-col h-[75vh]">
            <div class="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
                <h2 class="font-bold text-amber-400 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Nuevos / Recibidos
                </h2>
                <span class="bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full" id="count-recibido">0</span>
            </div>
            <div class="space-y-4 overflow-y-auto flex-grow pr-1" id="orders-recibido">
                <!-- Tarjetas inyectadas por JS -->
            </div>
        </div>

        <!-- Columna: En Preparación -->
        <div class="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 flex flex-col h-[75vh]">
            <div class="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
                <h2 class="font-bold text-blue-400 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    En Brasas / Cocina
                </h2>
                <span class="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full" id="count-preparacion">0</span>
            </div>
            <div class="space-y-4 overflow-y-auto flex-grow pr-1" id="orders-preparacion">
                <!-- Tarjetas inyectadas por JS -->
            </div>
        </div>

        <!-- Columna: Listo para Despacho -->
        <div class="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 flex flex-col h-[75vh]">
            <div class="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
                <h2 class="font-bold text-emerald-400 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    Listo para Entrega
                </h2>
                <span class="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full" id="count-listo">0</span>
            </div>
            <div class="space-y-4 overflow-y-auto flex-grow pr-1" id="orders-listo">
                <!-- Tarjetas inyectadas por JS -->
            </div>
        </div>
    </div>
</div>
@endsection
