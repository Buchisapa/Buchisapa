import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Store,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export const InfoSection: React.FC = () => {
  const [copiedYape, setCopiedYape] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCopyYape = () => {
    navigator.clipboard.writeText("943312024");
    setCopiedYape(true);
    setTimeout(() => setCopiedYape(false), 2000);
  };

  const faqs = [
    {
      q: '¿Realmente atienden las 24 horas del día?',
      a: '¡Sí! Buchisapa cuenta con cocina activa las 24 horas del día, los 7 días de la semana. Ya sea para un desayuno contundente con caldo de gallina o tacacho en la mañana, un almuerzo de juanes o chaufa, o un antojo nocturno de madrugada de hamburguesas supremas, broaster o salchipapas, estamos siempre listos para atenderte.'
    },
    {
      q: '¿Cómo hago un pedido para delivery por WhatsApp?',
      a: 'Es muy sencillo: arma tu carrito aquí mismo en la página web, haz clic en "Confirmar Pedido por WhatsApp", y se generará automáticamente tu pedido con todos los platos, salsas elegidas, dirección y monto exacto. También puedes escribirnos o llamarnos directamente al 943 312 024.'
    },
    {
      q: '¿Cuáles son las zonas de cobertura de delivery?',
      a: 'Cubrimos todo el distrito de Ate (zonas aledañas a Real Plaza Puruchuco, Mayorazgo, Vitarte, Ceres, Salamanca, Gloria) y puntos limítrofes con Santa Anita y La Molina. Puedes consultarnos por WhatsApp tu ubicación en tiempo real.'
    },
    {
      q: '¿Qué medios de pago aceptan?',
      a: 'Aceptamos Yape y Plin al número 943 312 024, pagos en efectivo contra entrega (solo indícanos con qué billete pagarás para llevar tu vuelto exacto) y transferencias inmediatas BCP / BBVA.'
    },
    {
      q: '¿Puedo pedir para recoger en el local o comer en salón?',
      a: '¡Por supuesto! Puedes visitarnos en nuestro salón para disfrutar de tus platos recién salidos del fuego o hacer tu pedido para llevar y tenerlo listo cuando llegues sin esperar cola.'
    },
    {
      q: '¿De dónde traen los insumos de la selva?',
      a: 'Nuestra cecina ahumada, chorizo regional y plátanos bellacos son traídos con regularidad directamente desde la Amazonía peruana (San Martín y Ucayali) para garantizar el sabor auténtico y tradicional que nos caracteriza.'
    }
  ];

  return (
    <section id="info" className="py-16 sm:py-20 bg-neutral-900/60 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
            <Store className="w-3.5 h-3.5" />
            <span>Toda la Información Oficial</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight">
            Restaurante Buchisapa
          </h2>
          <p className="text-sm sm:text-base text-neutral-300">
            Conoce nuestros horarios continuos, dirección exacta en Ate, números de contacto y métodos de pago.
          </p>
        </div>

        {/* 4 Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {/* Card 1: Horario 24 Horas */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden shadow-lg flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-xl w-fit mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Horario 24 Horas</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-3">
                Atención continua todos los días de la semana, incluyendo feriados y madrugadas.
              </p>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Abierto ahora (24/7)</span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 mt-4 border-t border-neutral-800/80 pt-3">
              Cocina caliente activa en todo momento
            </p>
          </div>

          {/* Card 2: Ubicación en Ate */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden shadow-lg flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="p-3 bg-amber-500/15 text-amber-400 rounded-xl w-fit mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ubicación &amp; Salón</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-2">
                Distrito de Ate, Lima - Perú.
              </p>
              <p className="text-xs text-amber-300/90 font-medium">
                📍 Cerca a Real Plaza Puruchuco y Carretera Central.
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Real+Plaza+Puruchuco+Ate+Lima"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>Abrir en Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: Teléfonos & WhatsApp */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden shadow-lg flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-xl w-fit mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Central de Pedidos</h3>
              <p className="text-xs text-neutral-400 mb-1">WhatsApp &amp; Llamadas:</p>
              <p className="text-lg font-black text-white font-heading">
                {RESTAURANT_INFO.phone}
              </p>
            </div>
            <a
              href={`https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=${encodeURIComponent('¡Hola Buchisapa! Deseo hacer un pedido.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Escribir al WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 4: Delivery & Pagos */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden shadow-lg flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="p-3 bg-amber-500/15 text-amber-400 rounded-xl w-fit mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Medios de Pago</h3>
              <p className="text-xs sm:text-sm text-neutral-300 mb-2">
                Aceptamos <strong>Yape</strong>, <strong>Plin</strong>, efectivo contra entrega y transferencias.
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] bg-purple-900/60 text-purple-200 border border-purple-700/60 font-black px-2 py-0.5 rounded">
                  YAPE
                </span>
                <span className="text-[10px] bg-cyan-900/60 text-cyan-200 border border-cyan-700/60 font-black px-2 py-0.5 rounded">
                  PLIN
                </span>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-200 border border-emerald-700/60 font-black px-2 py-0.5 rounded">
                  EFECTIVO
                </span>
              </div>
            </div>
            <button
              onClick={handleCopyYape}
              className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer w-full text-left"
            >
              <span>{copiedYape ? '¡Número copiado!' : 'Copiar Yape: 943 312 024'}</span>
              {copiedYape ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Interactive Payment Showcase & Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
          {/* Yape & Plin Card */}
          <div className="md:col-span-5 lg:col-span-4 bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-6 text-center shadow-xl flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Paga Fácil con Yape / Plin</h4>
              <p className="text-xs text-neutral-400 mb-4">Escanea o transfiere directamente al número:</p>

              {/* QR Simulation Card */}
              <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto mb-4">
                <div className="w-40 h-40 bg-neutral-950 rounded-xl flex flex-col items-center justify-center p-2 text-white relative">
                  <div className="absolute inset-2 border-2 border-dashed border-amber-400/60 rounded-lg flex flex-col items-center justify-center text-center p-2">
                    <span className="text-2xl font-black text-purple-400">yape</span>
                    <span className="text-[11px] font-bold text-cyan-300">&amp; plin</span>
                    <span className="text-[10px] text-neutral-400 mt-1 font-mono">943 312 024</span>
                    <span className="text-[9px] text-neutral-500 mt-0.5">Buchisapa</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-black text-white font-mono">943 312 024</span>
                <button
                  onClick={handleCopyYape}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedYape ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedYape ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 mt-3 pt-3 border-t border-neutral-800">
              Titular: Restaurante Buchisapa
            </p>
          </div>

          {/* Delivery & Service Info */}
          <div className="md:col-span-7 lg:col-span-8 bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Truck className="w-4 h-4" />
                <span>Servicio de Reparto y Salón</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-heading">
                ¿Cómo funciona el servicio en Buchisapa?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-xl">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg w-fit mb-2">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">1. Delivery Rápido</h4>
                  <p className="text-xs text-neutral-400">
                    Llega caliente y bien sellado a tu puerta en 25 a 40 minutos en Ate y zonas cercanas.
                  </p>
                </div>

                <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-xl">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit mb-2">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">2. Para Llevar</h4>
                  <p className="text-xs text-neutral-400">
                    Pide por adelantado y recoge en nuestro local sin esperar colas ni demoras.
                  </p>
                </div>

                <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-xl">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg w-fit mb-2">
                    <Store className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">3. En Salón</h4>
                  <p className="text-xs text-neutral-400">
                    Disfruta en nuestras mesas con atención rápida, cremas ilimitadas y bebidas heladitas.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom prompt */}
            <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-neutral-400 text-center sm:text-left">
                ¿Tienes una reunión familiar o evento especial? Consúltanos por paquetes al por mayor.
              </div>
              <a
                href={`https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=${encodeURIComponent('Hola Buchisapa, deseo consultar por pedidos especiales.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
              >
                <span>Consultar Pedidos Especiales</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div id="faq" className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Resolvemos tus dudas</span>
            </div>
            <h3 className="text-2xl font-black text-white font-heading">
              Preguntas Frecuentes
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-neutral-900/50 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-white">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-900 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
