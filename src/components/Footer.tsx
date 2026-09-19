import React, { useState } from 'react';
import { Phone, BookOpen, Facebook, Instagram, ShieldCheck, ChevronDown, ChevronRight } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { LibroReclamacionesModal } from './LibroReclamacionesModal';

interface AccordionSection {
  id: string;
  title: string;
  items: { label: string; href?: string }[];
}

const FOOTER_SECTIONS: AccordionSection[] = [
  {
    id: 'nosotros',
    title: 'NOSOTROS',
    items: [
      { label: 'Historia', href: '#' },
      { label: 'Visión', href: '#' },
      { label: 'Valores', href: '#' },
      { label: 'Restaurantes', href: '#' },
    ],
  },
  {
    id: 'servicios',
    title: 'SERVICIOS',
    items: [
      { label: 'Reservas', href: '#' },
      { label: 'Catering', href: '#' },
      { label: 'Fiestas infantiles', href: '#' },
      { label: 'Vales y Giftcards', href: '#' },
    ],
  },
  {
    id: 'info-adicional',
    title: 'INFORMACIÓN ADICIONAL',
    items: [
      { label: 'Valores nutricionales', href: '#' },
      { label: 'Cartilla de alérgenos', href: '#' },
    ],
  },
  {
    id: 'politicas',
    title: 'POLÍTICAS Y TÉRMINOS',
    items: [
      { label: 'Políticas de privacidad', href: '#' },
      { label: 'Términos y condiciones', href: '#' },
      { label: 'Términos y condiciones promociones comerciales', href: '#' },
      { label: 'Términos y condiciones vales y giftcard', href: '#' },
    ],
  },
  {
    id: 'contactanos',
    title: 'CONTÁCTANOS',
    items: [
      { label: 'Escríbenos al WhatsApp', href: `https://wa.me/${RESTAURANT_INFO.phoneRaw}` },
      { label: 'Correo: buchisapaweb@gmail.com', href: `mailto:${RESTAURANT_INFO.email}` },
      { label: 'Trabaja con nosotros', href: `https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=${encodeURIComponent('Deseo postular a Buchisapa')}` },
      { label: 'Portal de proveedores', href: '#' },
    ],
  },
];

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const [isLibroOpen, setIsLibroOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <footer className="bg-[#18191c] text-neutral-300 text-xs pt-10 sm:pt-14 pb-12 sm:pb-16 border-t border-neutral-800 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Accordion View (< md) */}
          <div className="md:hidden divide-y divide-neutral-800/80 mb-8">
            {FOOTER_SECTIONS.map((section) => {
              const isOpen = !!openSections[section.id];
              return (
                <div key={section.id} className="py-3">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between text-left text-white font-extrabold text-xs tracking-wider uppercase py-1"
                  >
                    <span>{section.title}</span>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    )}
                  </button>

                  {isOpen && (
                    <ul className="pt-2 pb-1 space-y-2 text-neutral-400 text-xs animate-in fade-in slide-in-from-top-1 duration-150 pl-1">
                      {section.items.map((item, idx) => (
                        <li key={idx}>
                          <a
                            href={item.href || '#'}
                            target={item.href?.startsWith('http') ? '_blank' : undefined}
                            rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="hover:text-white transition-colors block py-0.5"
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            {/* Mobile Callout & Libro */}
            <div className="pt-4 flex flex-col gap-4">
              <button
                onClick={() => setIsLibroOpen(true)}
                className="w-full bg-white hover:bg-neutral-100 text-neutral-900 p-3 rounded-lg border border-neutral-300 flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm"
              >
                <BookOpen className="w-5 h-5 text-sky-700" />
                <div className="text-left">
                  <span className="block text-xs font-black uppercase text-sky-800 leading-tight">
                    Libro de Reclamaciones
                  </span>
                  <span className="block text-[10px] text-neutral-600 font-semibold leading-tight">
                    Conforme a lo establecido por INDECOPI
                  </span>
                </div>
              </button>

              <div className="text-center">
                <a
                  href={`tel:${RESTAURANT_INFO.phoneRaw}`}
                  className="inline-flex items-center gap-2 text-white font-black text-lg"
                >
                  <Phone className="w-4 h-4 text-red-500 fill-red-500" />
                  <span>{RESTAURANT_INFO.phone}</span>
                </a>
                <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                  LLÁMENOS 24 HORAS
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Multi-column Grid (>= md) matching Screenshot 3 & 4 */}
          <div className="hidden md:grid md:grid-cols-6 gap-6 lg:gap-8 mb-12">
            {/* Columns 1 to 5: Links */}
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.id}>
                <h4 className="text-white font-black uppercase tracking-wider text-xs mb-3.5">
                  {section.title}
                </h4>
                <ul className="space-y-2 text-neutral-400 text-xs">
                  {section.items.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href={item.href || '#'}
                        target={item.href?.startsWith('http') ? '_blank' : undefined}
                        rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="hover:text-white transition-colors block py-0.5"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Column 6: Libro de Reclamaciones & Phone (Screenshot 3 & 4) */}
            <div className="flex flex-col items-end text-right justify-start space-y-4">
              {/* Libro de Reclamaciones Badge */}
              <button
                onClick={() => setIsLibroOpen(true)}
                className="w-36 bg-white hover:bg-neutral-100 text-neutral-900 p-2.5 rounded-lg border border-neutral-300 shadow-sm flex flex-col items-center justify-center transition-all cursor-pointer group"
                title="Libro de Reclamaciones"
              >
                <span className="text-[10px] font-black uppercase text-sky-800 text-center leading-tight">
                  Libro de Reclamaciones
                </span>
                <div className="my-1.5 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-sky-700 stroke-[1.8] group-hover:scale-105 transition-transform" />
                </div>
                <span className="text-[8px] text-neutral-500 font-medium text-center leading-tight">
                  INDECOPI
                </span>
              </button>

              {/* Phone and LLÁMENOS */}
              <div className="pt-2">
                <a
                  href={`tel:${RESTAURANT_INFO.phoneRaw}`}
                  className="inline-flex items-center gap-1.5 text-white hover:text-red-400 font-black text-base lg:text-lg transition-colors"
                >
                  <Phone className="w-4 h-4 text-red-600 fill-red-600" />
                  <span>{RESTAURANT_INFO.phone}</span>
                </a>
                <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-extrabold mt-0.5">
                  LLÁMENOS
                </span>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Social Icons (Facebook, TikTok, Instagram, Email) */}
            <div className="flex items-center gap-4 text-white">
              <a
                href={RESTAURANT_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors p-1"
                aria-label="Facebook Buchisapa"
                title="Facebook Buchisapa"
              >
                <Facebook className="w-5 h-5 fill-white text-white" />
              </a>
              <a
                href={RESTAURANT_INFO.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors flex items-center justify-center font-black p-1 text-base leading-none"
                aria-label="TikTok Buchisapa"
                title="TikTok @buchisapa.web"
              >
                <span className="text-base font-black">♪</span>
              </a>
              <a
                href={RESTAURANT_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors p-1"
                aria-label="Instagram Buchisapa"
                title="Instagram Buchisapa"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {/* Payment & Security Badges (PCI, Mercado Pago, PagoEfectivo) */}
            <div className="flex items-center gap-3">
              {/* PCI Security Standards */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white text-neutral-900 text-[10px] font-bold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>PCI Security</span>
              </div>
              {/* Mercado Pago Badge */}
              <div className="px-2.5 py-1 rounded bg-[#009EE3] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                mercado pago
              </div>
              {/* PagoEfectivo Badge */}
              <div className="px-2.5 py-1 rounded bg-[#FFC700] text-neutral-950 text-[10px] font-black uppercase tracking-wider shadow-xs">
                PagoEfectivo
              </div>
            </div>
          </div>

          {/* Copyright Row */}
          <div className="mt-6 text-neutral-500 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-800/80 pt-4">
            <p>© 2026, Restaurante Buchisapa. Todos los derechos reservados</p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-neutral-500 hover:text-red-400 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>🔒 Panel de Administración</span>
              </button>
            )}
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
