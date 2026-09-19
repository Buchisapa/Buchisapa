@extends('layouts.app')

@section('title', 'Libro de Reclamaciones Virtual | Buchisapa')

@section('content')
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="bg-stone-850 bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div class="flex items-center gap-4 border-b border-stone-800 pb-6 mb-8">
            <div class="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-2xl font-bold">
                📖
            </div>
            <div>
                <h1 class="text-2xl sm:text-3xl font-black text-white">Libro de Reclamaciones Virtual</h1>
                <p class="text-stone-400 text-sm">Conforme a lo dispuesto en el Código de Protección y Defensa del Consumidor (Ley N° 29571).</p>
            </div>
        </div>

        <form action="{{ route('claims.store') }}" method="POST" class="space-y-6" id="claim-form">
            @csrf
            
            <div class="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 space-y-4">
                <h2 class="text-amber-400 font-bold text-sm uppercase tracking-wider">1. Identificación del Consumidor</h2>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-stone-300 mb-1.5">Nombre Completo *</label>
                        <input type="text" name="full_name" required class="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-stone-300 mb-1.5">Correo Electrónico *</label>
                        <input type="email" name="email" required class="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-stone-300 mb-1.5">Tipo de Documento *</label>
                        <select name="document_type" required class="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm">
                            <option value="DNI">DNI</option>
                            <option value="CE">Carné de Extranjería</option>
                            <option value="PASAPORTE">Pasaporte</option>
                            <option value="RUC">RUC</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-stone-300 mb-1.5">Número de Documento *</label>
                        <input type="text" name="document_number" required class="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-stone-300 mb-1.5">Teléfono / Celular *</label>
                        <input type="tel" name="phone" required class="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-stone-300 mb-1.5">Domicilio</label>
                        <input type="text" name="address" class="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm">
                    </div>
                </div>
            </div>

            <div class="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 space-y-4">
                <h2 class="text-amber-400 font-bold text-sm uppercase tracking-wider">2. Detalle de la Reclamación</h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-stone-300 mb-1.5">Bien Contratado *</label>
                        <select name="contracted_type" required class="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm">
                            <option value="producto">Producto (Comida / Bebida)</option>
                            <option value="servicio">Servicio (Delivery / Atención en Salón)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-stone-300 mb-1.5">Monto Reclamado (S/) (Opcional)</label>
                        <input type="number" step="0.01" name="amount" placeholder="0.00" class="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 text-sm">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-stone-300 mb-2">Tipo *</label>
                    <div class="flex gap-6 text-sm">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="claim_type" value="reclamo" checked class="text-amber-500 focus:ring-amber-500">
                            <span><strong>Reclamo:</strong> Disconformidad relacionada a los productos o servicios.</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="claim_type" value="queja" class="text-amber-500 focus:ring-amber-500">
                            <span><strong>Queja:</strong> Malestar respecto a la atención al público.</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-stone-300 mb-1.5">Detalle del Reclamo o Queja *</label>
                    <textarea name="detail" rows="4" required placeholder="Describa claramente los hechos ocurridos..." class="w-full bg-stone-900 border border-stone-700 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 text-sm"></textarea>
                </div>
            </div>

            <button type="submit" class="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-4 rounded-xl shadow-xl transition transform active:scale-98">
                Enviar Hoja de Reclamación
            </button>
        </form>
    </div>
</div>
@endsection
