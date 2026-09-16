import React from 'react';
import { Sparkles, Phone, ArrowRight, Clock, ShieldCheck, Flame, UtensilsCrossed, Heart } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface HeroProps {
  onExploreMenu: () => void;
  onExploreSelva: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu, onExploreSelva }) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-6 pb-14 sm:py-16 lg:py-20 bg-neutral-950">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-48 -left-24 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content (Left Column) */}
          <div className="md:col-span-7 lg:col-span-7 space-y-6 text-center md:text-left">
            {/* 24-hour badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-amber-500/30 text-xs sm:text-sm font-semibold text-neutral-200 shadow-sm">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-amber-400 font-bold">ABIERTO 24 HORAS</span>
              <span className="text-neutral-500">•</span>
              <span>¡Matamos tu hambre a cualquier hora!</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-heading leading-none">
                El auténtico <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">sabor</span> que{' '}
                <span className="underline decoration-amber-500 decoration-wavy decoration-2">te llena</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-neutral-300 max-w-2xl font-normal leading-relaxed">
                Disfruta de los más contundentes <span className="text-amber-300 font-semibold">Caldos</span>,{' '}
                <span className="text-amber-300 font-semibold">Pollo Broaster</span> super crocante,{' '}
                <span className="text-amber-300 font-semibold">Hamburguesas artesanales</span> y auténtica{' '}
                <span className="text-emerald-400 font-semibold">Comida Amazónica</span> (Tacacho con cecina, Juanes y Chaufa).
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 pt-2">
              <button
                id="hero-order-btn"
                onClick={onExploreMenu}
                className="w-full sm:w-auto px-6 lg:px-7 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
              >
                <UtensilsCrossed className="w-5 h-5 text-neutral-950" />
                <span>Ver la Carta &amp; Pedir</span>
                <ArrowRight className="w-4 h-4 text-neutral-950" />
              </button>

              <button
                id="hero-selva-btn"
                onClick={onExploreSelva}
                className="w-full sm:w-auto px-5 lg:px-6 py-3.5 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold text-sm sm:text-base rounded-xl border border-neutral-700/80 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Platos de la Selva</span>
              </button>

              <a
                id="hero-whatsapp-btn"
                href={`https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=${encodeURIComponent('¡Hola Buchisapa! Quiero consultar la carta y hacer un pedido.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 transition-all whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp 24h</span>
              </a>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-4 border-t border-neutral-800/80">
              <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/60 text-left">
                <div className="flex items-center gap-1.5 sm:gap-2 text-amber-400 font-bold text-xs sm:text-sm">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>24 Horas</span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">Atención día y noche</p>
              </div>

              <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/60 text-left">
                <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
                  <Flame className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>100% Selva</span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">Cecina artesanal</p>
              </div>

              <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/60 text-left">
                <div className="flex items-center gap-1.5 sm:gap-2 text-amber-400 font-bold text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Yape &amp; Plin</span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">Pagos seguros</p>
              </div>

              <div className="bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/60 text-left">
                <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
                  <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Bien Servido</span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">Platos contundentes</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase (Right Column) */}
          <div className="md:col-span-5 lg:col-span-5 relative mt-4 md:mt-0">
            <div className="relative mx-auto max-w-sm md:max-w-md lg:max-w-none">
              {/* Main Card with Logo & Signature Specialties */}
              <div className="relative rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 border border-neutral-800 shadow-2xl overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -top-20 -right-20 w-52 h-52 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
                
                {/* Floating Logo Badge */}
                <div className="flex flex-col items-center text-center pb-6 border-b border-neutral-800">
                  <div className="relative mb-3">
                    <img
                      src="/logo.svg"
                      alt="Restaurante Buchisapa Mascot"
                      className="w-36 h-36 object-contain drop-shadow-xl hover:scale-105 transition-transform"
                    />
                    <div className="absolute -bottom-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-black text-xs px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                      Ate • Lima
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white font-heading tracking-wide">
                    Buchisapa
                  </h3>
                  <p className="text-xs text-amber-400 font-semibold tracking-wider uppercase mt-0.5">
                    Caldos • Broaster • Hamburguesas &amp; Selva
                  </p>
                </div>

                {/* Specialty Highlights Showcase */}
                <div className="py-4 space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/50 hover:bg-neutral-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌴</span>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">Tacacho con Cecina Ahumada</p>
                        <p className="text-xs text-neutral-400">Plátano verde + ají de cocona</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      S/ 12
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/50 hover:bg-neutral-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🍗</span>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">Pollo Broaster Pecho Crujiente</p>
                        <p className="text-xs text-neutral-400">Papas doradas + arroz + ensalada</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      S/ 18
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/50 hover:bg-neutral-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🍔</span>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">La Suprema Buchisapa</p>
                        <p className="text-xs text-neutral-400">Carne, tocino, queso, huevo y jamón</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      S/ 15
                    </span>
                  </div>
                </div>

                {/* Bottom interactive card banner */}
                <div className="pt-2 text-center">
                  <div className="inline-flex items-center gap-2 text-xs text-neutral-400">
                    <span className="text-emerald-400 font-semibold">📍 Delivery en Ate:</span>
                    <span>25 a 40 min aprox.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
