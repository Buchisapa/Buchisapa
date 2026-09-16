import React, { useState } from 'react';
import { Phone, BookOpen, Facebook, Instagram, Music2, ShieldCheck, CreditCard } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { LibroReclamacionesModal } from './LibroReclamacionesModal';

export const Footer: React.FC = () => {
  const [isLibroOpen, setIsLibroOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#18191c] text-neutral-300 text-xs pt-12 pb-8 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main 5 Columns Grid + Libro de Reclamaciones */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            {/* Col 1: NOSOTROS */}
            <div>
              <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-4">
                NOSOTROS
              </h4>
              <ul className="space-y-2.5 text-neutral-400">
                <li>
                  <a href="#hero" className="hover:text-white transition-colors">
                    Historia
                  </a>
                </li>
                <li>
                  <a href="#hero" className="hover:text-white transition-colors">
                    Visión y Pasión
                  </a>
                </li>
                <li>
                  <a href="#hero" className="hover:text-white transition-colors">
                    Valores
                  </a>
                </li>
                <li>
                  <a href="#info" className="hover:text-white transition-colors">
                    Restaurante en Ate
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 2: SERVICIOS */}
            <div>
              <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-4">
                SERVICIOS
              </h4>
              <ul className="space-y-2.5 text-neutral-400">
                <li>
                  <a href="#info" className="hover:text-white transition-colors">
                    Reservas &amp; Salón
                  </a>
                </li>
                <li>
                  <a href="#info" className="hover:text-white transition-colors">
                    Catering Amazónico
                  </a>
                </li>
                <li>
                  <a href="#info" className="hover:text-white transition-colors">
                    Fiestas &amp; Eventos
                  </a>
                </li>
                <li>
                  <a href="#menu" className="hover:text-white transition-colors">
                    Delivery 24 Horas
                  </a>
                </li>
                <li>
                  <a href="#info" className="hover:text-white transition-colors">
                    Vales y Promociones
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: INFORMACIÓN ADICIONAL */}
            <div>
              <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-4">
                INFORMACIÓN ADICIONAL
              </h4>
              <ul className="space-y-2.5 text-neutral-400">
                <li>
                  <a href="#info" className="hover:text-white transition-colors">
                    Valores nutricionales
                  </a>
                </li>
                <li>
                  <a href="#info" className="hover:text-white transition-colors">
                    Cartilla de alérgenos
                  </a>
                </li>
                <li>
                  <a href="#info" className="hover:text-white transition-colors">
                    Zonas de cobertura Ate
                  </a>
                </li>
                <li>
                  <a href="#info" className="hover:text-white transition-colors">
                    Atención continua 24H
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: POLÍTICAS Y TÉRMINOS */}
            <div>
              <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-4">
                POLÍTICAS Y TÉRMINOS
              </h4>
              <ul className="space-y-2.5 text-neutral-400">
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    Políticas de privacidad
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    Términos y condiciones
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    Términos promociones
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    Políticas de entrega
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 5: CONTÁCTANOS */}
            <div>
              <h4 className="text-white font-extrabold uppercase tracking-wider text-xs mb-4">
                CONTÁCTANOS
              </h4>
              <ul className="space-y-2.5 text-neutral-400">
                <li>
                  <a
                    href={`https://wa.me/${RESTAURANT_INFO.phoneRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Escríbenos al WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=Deseo%20trabajar%20con%20ustedes`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Trabaja con nosotros
                  </a>
                </li>
                <li>
                  <a href="#info" className="hover:text-white transition-colors">
                    Portal de atención
                  </a>
                </li>
                <li>
                  <span className="text-neutral-500">Ate, Lima - Perú</span>
                </li>
              </ul>
            </div>

            {/* Col 6: Libro de Reclamaciones & Teléfono */}
            <div className="flex flex-col items-start lg:items-end justify-start space-y-4">
              {/* Libro de Reclamaciones Badge */}
              <button
                onClick={() => setIsLibroOpen(true)}
                className="bg-white p-3 rounded-lg border border-neutral-300 text-center w-40 hover:bg-neutral-50 transition-all cursor-pointer shadow-md group"
                title="Abrir Libro de Reclamaciones Virtual"
              >
                <div className="flex items-center justify-center gap-1.5 text-sky-700 font-extrabold text-[11px] uppercase tracking-tighter mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                  <span>Libro de Reclamaciones</span>
                </div>
                {/* Book graphic representation */}
                <div className="flex items-center justify-center py-1">
                  <div className="w-16 h-8 border-2 border-neutral-400 rounded-sm flex items-center justify-center bg-neutral-100 shadow-inner group-hover:border-sky-600 transition-colors">
                    <span className="text-[10px] text-neutral-600 font-bold">INDECOPI</span>
                  </div>
                </div>
              </button>

              {/* Phone contact callout */}
              <div className="text-left lg:text-right">
                <a
                  href={`tel:${RESTAURANT_INFO.phoneRaw}`}
                  className="flex items-center gap-2 text-white font-extrabold text-base hover:text-red-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-red-500 fill-red-500" />
                  <span>{RESTAURANT_INFO.phone}</span>
                </a>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold block mt-0.5">
                  LLÁMENOS 24 HORAS
                </span>
              </div>
            </div>
          </div>

          {/* Social Icons & Payment Certification Badges */}
          <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-4 text-neutral-400">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-white hover:bg-neutral-800 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-white hover:bg-neutral-800 transition-colors font-bold text-xs"
                aria-label="X / Twitter"
              >
                𝕏
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-white hover:bg-neutral-800 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-white hover:bg-neutral-800 transition-colors"
                aria-label="TikTok"
              >
                <Music2 className="w-4 h-4" />
              </a>
            </div>

            {/* Payment & Security Logos */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px]">PCI Security Certified</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-purple-950/70 border border-purple-800/80 text-purple-300 font-bold text-[11px]">
                <span>Yape</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 font-bold text-[11px]">
                <span>Plin</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-amber-950/70 border border-amber-800/80 text-amber-300 font-bold text-[11px]">
                <span>PagoEfectivo</span>
              </div>
            </div>
          </div>

          {/* Copyright Line */}
          <div className="pt-6 mt-6 border-t border-neutral-800/50 text-neutral-500 text-[11px] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026, Restaurante Buchisapa. Todos los derechos reservados.</p>
            <p>Atención 24 Horas • Ate, Lima - Perú</p>
          </div>
        </div>
      </footer>

      {/* Libro de Reclamaciones Modal */}
      <LibroReclamacionesModal
        isOpen={isLibroOpen}
        onClose={() => setIsLibroOpen(false)}
      />
    </>
  );
};
