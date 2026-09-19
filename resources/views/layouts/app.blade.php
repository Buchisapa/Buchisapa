<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Buchisapa - Pollería & Sabor Amazónico Tarapoto')</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/public/css/style.css">
    @yield('styles')
</head>
<body class="bg-stone-900 text-stone-100 min-h-screen flex flex-col font-sans">

    <!-- Header / Navbar -->
    <header class="sticky top-0 z-50 bg-stone-950/95 backdrop-blur border-b border-amber-900/40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <a href="/" class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 text-2xl font-black shadow-lg shadow-amber-500/20">
                    🍗
                </div>
                <div>
                    <span class="text-2xl font-black tracking-wider text-amber-400 block leading-none">BUCHISAPA</span>
                    <span class="text-xs text-stone-400 uppercase tracking-widest">Sabor Amazónico Tarapoto</span>
                </div>
            </a>

            <nav class="hidden md:flex items-center gap-8 font-medium text-stone-300">
                <a href="/" class="hover:text-amber-400 transition-colors">Carta</a>
                <a href="/#promociones" class="hover:text-amber-400 transition-colors">Promociones</a>
                <a href="/cocina" class="hover:text-amber-400 transition-colors flex items-center gap-2">
                    <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Pantalla Cocina
                </a>
                <a href="/libro-de-reclamaciones" class="hover:text-amber-400 transition-colors">Libro de Reclamaciones</a>
            </nav>

            <div class="flex items-center gap-4">
                <button id="cart-btn" class="relative bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2.5 transition transform hover:scale-105 shadow-md shadow-amber-500/20">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span>Ver Pedido</span>
                    <span id="cart-badge" class="bg-stone-950 text-amber-400 text-xs px-2 py-0.5 rounded-full font-black">0</span>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-stone-950 border-t border-stone-800 text-stone-400 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <h3 class="text-amber-400 font-black text-xl mb-3">BUCHISAPA</h3>
                <p class="text-sm text-stone-400 leading-relaxed mb-4">El auténtico sabor del pollo a la brasa con toque y sazón de la selva peruana en Tarapoto.</p>
                <div class="flex gap-4 text-amber-500">
                    <a href="#" class="hover:text-amber-400"><i class="fa-brands fa-facebook text-xl"></i></a>
                    <a href="#" class="hover:text-amber-400"><i class="fa-brands fa-instagram text-xl"></i></a>
                    <a href="#" class="hover:text-amber-400"><i class="fa-brands fa-whatsapp text-xl"></i></a>
                </div>
            </div>
            <div>
                <h4 class="text-white font-bold mb-3">Horario de Atención</h4>
                <p class="text-sm">Lunes a Domingo:</p>
                <p class="text-amber-400 font-semibold text-sm">12:00 PM - 11:30 PM</p>
                <p class="text-xs text-stone-500 mt-2">Delivery activo para todo Tarapoto, Morales y La Banda de Shilcayo.</p>
            </div>
            <div>
                <h4 class="text-white font-bold mb-3">Atención al Cliente</h4>
                <ul class="text-sm space-y-2">
                    <li><a href="/libro-de-reclamaciones" class="hover:text-amber-400 flex items-center gap-2"><i class="fa-solid fa-book"></i> Libro de Reclamaciones</a></li>
                    <li><a href="tel:+51942000000" class="hover:text-amber-400 flex items-center gap-2"><i class="fa-solid fa-phone"></i> +51 942 000 000</a></li>
                    <li><span class="flex items-center gap-2"><i class="fa-solid fa-location-dot"></i> Jr. San Martín, Tarapoto</span></li>
                </ul>
            </div>
            <div>
                <h4 class="text-white font-bold mb-3">Medios de Pago</h4>
                <div class="flex flex-wrap gap-2 text-xs">
                    <span class="bg-purple-900/60 text-purple-200 px-3 py-1 rounded border border-purple-700">Yape</span>
                    <span class="bg-cyan-900/60 text-cyan-200 px-3 py-1 rounded border border-cyan-700">Plin</span>
                    <span class="bg-emerald-900/60 text-emerald-200 px-3 py-1 rounded border border-emerald-700">Efectivo</span>
                    <span class="bg-blue-900/60 text-blue-200 px-3 py-1 rounded border border-blue-700">Tarjetas POS</span>
                </div>
            </div>
        </div>
        <div class="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-stone-800/80 text-center text-xs text-stone-500">
            &copy; {{ date('Y') }} Buchisapa Sabor Amazónico. Todos los derechos reservados.
        </div>
    </footer>

    <script src="/public/js/businessHours.js"></script>
    <script src="/public/js/cart.js"></script>
    <script src="/public/js/app.js"></script>
    @yield('scripts')
</body>
</html>
