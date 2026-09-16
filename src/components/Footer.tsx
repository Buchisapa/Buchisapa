import React from 'react';
import { Phone, MapPin, Clock, Heart, ArrowUp, MessageCircle, ShieldCheck } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Logo Buchisapa"
                className="w-12 h-12 rounded-full bg-neutral-900 ring-2 ring-amber-500/30"
              />
              <div>
                <span className="text-xl font-black text-white font-heading">
                  Buchi<span className="text-amber-400">Sapa</span>
                </span>
                <p className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                  Sabor que te llena
                </p>
              </div>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              El restaurante favorito de Ate con atención las 24 horas. Caldos reconfortantes, pollo broaster crocante, hamburguesas y auténtica comida amazónica.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-800/80 rounded-full text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Abierto 24 Horas / Todos los días</span>
            </div>
          </div>

          {/* Col 2: Carta & Categorías */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading">
              Especialidades
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#selva" className="hover:text-amber-400 transition-colors">
                  Tacacho con Cecina Ahumada
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  Juanes Tradicionales de Gallina
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  Pollo Broaster Pecho &amp; Pierna
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  Hamburguesas La Suprema &amp; Royal
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  Salchipapas &amp; Salchibroasters
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  Refrescos de Cocona, Aguajina &amp; Camu Camu
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contacto & Ubicación */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading">
              Contacto &amp; Ubicación
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Distrito de Ate, Lima - Perú (Cerca a Real Plaza Puruchuco)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href={`tel:${RESTAURANT_INFO.phoneRaw}`}
                  className="hover:text-emerald-400 font-bold text-white transition-colors"
                >
                  {RESTAURANT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Atención las 24 horas continuas</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Métodos de Pago y Seguridad */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading">
              Medios de Pago
            </h4>
            <p className="text-xs text-neutral-400 mb-3">
              Paga al instante de forma segura:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-md bg-purple-950 border border-purple-800 text-purple-300 font-bold text-xs">
                YAPE
              </span>
              <span className="px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold text-xs">
                PLIN
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold text-xs">
                EFECTIVO
              </span>
              <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 font-bold text-xs">
                BCP / BBVA
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Número de Yape / Plin oficial: <strong className="text-white">943 312 024</strong>
            </p>
          </div>
        </div>

        {/* Bottom micro bar */}
        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Restaurante Buchisapa. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Ate, Lima - Gastronomía Peruana y Amazónica</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Volver arriba"
              aria-label="Volver arriba"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Instant WhatsApp Button (Bottom Right) */}
      <a
        id="floating-whatsapp-btn"
        href={`https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=${encodeURIComponent('¡Hola Buchisapa! Deseo realizar una consulta o pedido 24h.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 font-black text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all group"
        aria-label="Pedir por WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 fill-neutral-950" />
        <span className="hidden sm:inline">WhatsApp 24h: {RESTAURANT_INFO.phone}</span>
      </a>
    </footer>
  );
};
