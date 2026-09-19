@extends('layouts.app')

@section('title', 'Carta Digital | Buchisapa Pollería Tarapoto')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Hero Banner -->
    <div class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border border-amber-800/40 p-8 sm:p-12 mb-12 shadow-2xl">
        <div class="max-w-2xl">
            <span class="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                🔥 Brasas & Sazón Amazónica
            </span>
            <h1 class="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
                El Mejor Pollo a la Brasa de <span class="text-amber-400">Tarapoto</span>
            </h1>
            <p class="text-stone-300 text-base sm:text-lg mb-6 leading-relaxed">
                Disfruta de nuestros combos familiares dorados a la leña, acompañados de crocantes papas, chaufa con cecina y ají charapita artesanal.
            </p>
            <div class="flex flex-wrap gap-4">
                <a href="#menu" class="bg-amber-500 hover:bg-amber-400 text-stone-950 px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-500/30 transition">
                    Ver Toda la Carta
                </a>
                <a href="https://wa.me/51942000000" target="_blank" class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition">
                    <i class="fa-brands fa-whatsapp text-lg"></i> Pedir por WhatsApp
                </a>
            </div>
        </div>
    </div>

    <!-- Categorías -->
    <div id="menu" class="mb-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <a href="?category=all" class="px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap {{ ($category ?? 'all') == 'all' ? 'bg-amber-500 text-stone-950 shadow-md' : 'bg-stone-800 text-stone-300 hover:bg-stone-700' }}">
            Todos los Platos
        </a>
        <a href="?category=brasas" class="px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap {{ ($category ?? '') == 'brasas' ? 'bg-amber-500 text-stone-950 shadow-md' : 'bg-stone-800 text-stone-300 hover:bg-stone-700' }}">
            🍗 Pollos a la Brasa
        </a>
        <a href="?category=chaufas" class="px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap {{ ($category ?? '') == 'chaufas' ? 'bg-amber-500 text-stone-950 shadow-md' : 'bg-stone-800 text-stone-300 hover:bg-stone-700' }}">
            🍚 Chaufas & Mostritos
        </a>
        <a href="?category=bebidas" class="px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap {{ ($category ?? '') == 'bebidas' ? 'bg-amber-500 text-stone-950 shadow-md' : 'bg-stone-800 text-stone-300 hover:bg-stone-700' }}">
            🥤 Bebidas & Refrescos
        </a>
    </div>

    <!-- Listado de Productos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @forelse($products ?? [] as $product)
            <div class="bg-stone-800/80 border border-stone-700/80 rounded-2xl overflow-hidden flex flex-col hover:border-amber-500/50 transition group">
                <div class="relative h-48 sm:h-52 overflow-hidden bg-stone-900">
                    <img src="{{ $product->image_url }}" alt="{{ $product->name }}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    @if($product->is_featured)
                        <span class="absolute top-3 left-3 bg-red-600 text-white text-xs font-black uppercase px-2.5 py-1 rounded-md shadow">
                            Popular ⭐
                        </span>
                    @endif
                    @if($product->serves_count > 1)
                        <span class="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur text-stone-200 text-xs px-2.5 py-1 rounded-md">
                            Rinde: {{ $product->serves_count }} personas
                        </span>
                    @endif
                </div>

                <div class="p-5 flex flex-col flex-grow">
                    <h3 class="text-xl font-bold text-white mb-2">{{ $product->name }}</h3>
                    <p class="text-stone-400 text-sm mb-4 flex-grow line-clamp-2 leading-relaxed">{{ $product->description }}</p>

                    <div class="flex items-center justify-between pt-4 border-t border-stone-700/60">
                        <div>
                            @if($product->original_price)
                                <span class="text-xs text-stone-500 line-through mr-1">S/ {{ number_format($product->original_price, 2) }}</span>
                            @endif
                            <span class="text-2xl font-black text-amber-400">S/ {{ number_format($product->price, 2) }}</span>
                        </div>
                        <button onclick="addToCart({{ $product->id }}, '{{ addslashes($product->name) }}', {{ $product->price }})" class="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition active:scale-95 shadow">
                            <i class="fa-solid fa-plus"></i>
                            <span>Agregar</span>
                        </button>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-span-full text-center py-16 bg-stone-800/40 rounded-2xl border border-stone-700">
                <i class="fa-solid fa-utensils text-4xl text-amber-500 mb-4 block"></i>
                <p class="text-stone-300 font-bold text-lg">No hay productos en esta categoría</p>
                <p class="text-stone-500 text-sm">Prueba seleccionando otra sección del menú.</p>
            </div>
        @endforelse
    </div>
</div>
@endsection
