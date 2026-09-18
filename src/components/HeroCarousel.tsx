import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles, Award, Heart, Scissors } from 'lucide-react';

interface HeroCarouselProps {
  onPideAqui: (actionKey: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onPideAqui }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Desktop Slides matching real categories
  const desktopSlides = [
    {
      id: 'hamburguesas-slide',
      title: 'HAMBURGUESAS ARTESANALES',
      subtitle: 'Clásica, Royal, Hawaiana, Bacon y La Suprema con papas al hilo',
      badge: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1920&q=80',
      buttonText: 'PIDE AQUÍ',
      actionKey: 'hamburguesas',
    },
    {
      id: 'broaster-slide',
      title: 'POLLO BROASTER CROCANTE',
      subtitle: 'Pecho, Pierna, Encuentro y Ala bien doraditos con papas y ensalada',
      badge: 'ESPECIALIDAD',
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1920&q=80',
      buttonText: 'PIDE AQUÍ',
      actionKey: 'broaster',
    },
    {
      id: 'amazonicos-slide',
      title: 'PLATOS DE LA SELVA',
      subtitle: 'Tacacho con Cecina, Juanes, Chaufa Amazónico y Chilcano de Pescado',
      badge: 'TRADICIÓN',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80',
      buttonText: 'PIDE AQUÍ',
      actionKey: 'amazonicos',
    },
    {
      id: 'salchipapas-slide',
      title: 'SALCHIPAPAS & SALCHIBROASTERS',
      subtitle: 'A lo Pobre, Salchichorizo y Salchibroasters contundentes',
      badge: 'FAVORITOS',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1920&q=80',
      buttonText: 'PIDE AQUÍ',
      actionKey: 'salchipapas',
    },
  ];

  // Mobile Slides (Slide 0 is the exact Jorge Salinas campaign banner from mobile screenshot)
  const mobileSlidesCount = 4;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mobileSlidesCount);
    }, 6000);
    return () => clearInterval(timer);
  }, [mobileSlidesCount]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? mobileSlidesCount - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mobileSlidesCount);
  };

  return (
    <section className="relative w-full bg-white select-none">
      {/* =========================================================================
          1. MOBILE CAROUSEL (< md) EXACTLY AS IN Screenshot_20260916-121646_Chrome.png
         ========================================================================= */}
      <div id="mobile-hero-carousel" className="md:hidden">
        {/* Banner container with relative positioning and navigation arrows */}
        <div className="relative w-full bg-[#f4f3ef] overflow-hidden border-b border-neutral-200">
          {/* SLIDE 0: Especialidad Pollo Broaster Buchisapa */}
          {currentSlide === 0 && (
            <div className="relative w-full min-h-[490px] p-5 flex flex-col justify-between animate-in fade-in duration-300 bg-gradient-to-br from-amber-50 via-white to-orange-50/50">
              {/* Background Broaster Photo on the right with soft blend */}
              <div className="absolute right-0 top-0 bottom-10 w-3/5 pointer-events-none overflow-hidden flex items-center justify-end">
                <img
                  src="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=80"
                  alt="Pollo Broaster Crocante Buchisapa"
                  className="w-full h-full object-cover object-center filter contrast-110"
                  style={{
                    maskImage:
                      'linear-gradient(to left, black 70%, transparent 100%)',
                    WebkitMaskImage:
                      'linear-gradient(to left, black 70%, transparent 100%)',
                  }}
                />
              </div>

              {/* Top Branding Header */}
              <div className="relative z-10 flex items-center justify-between pt-1 pb-1">
                <div className="flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                  <span>Especialidad de la Casa</span>
                </div>
                <span className="text-xs font-black italic tracking-wide text-red-600 font-heading">
                  BUCHISAPA
                </span>
              </div>

              {/* Main Content (Left Column) */}
              <div className="relative z-10 max-w-[62%] space-y-2.5 pt-1">
                {/* Big Bold Headline */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 uppercase leading-none font-heading">
                    POLLO BROASTER
                  </h1>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-red-600 uppercase leading-none font-heading mt-0.5">
                    ULTRA CROCANTE
                  </h2>
                </div>

                {/* Subtext description */}
                <p className="text-[11px] leading-tight text-neutral-700 font-medium pr-1">
                  Empanizado artesanal dorado a la perfección, jugoso por dentro con papas crocantes y nuestras mejores cremas caseras.
                </p>

                {/* Combo Promo Highlight Box */}
                <div className="bg-white/95 backdrop-blur-xs p-2.5 rounded-2xl border border-amber-200/90 shadow-xs space-y-0.5">
                  <p className="text-[10px] font-black text-red-600 uppercase leading-none flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>RECETA SECRETA BUCHISAPA</span>
                  </p>
                  <p className="text-[10px] text-neutral-700 font-bold leading-tight">
                    Pecho, Pierna, Encuentro y Alitas desde <span className="text-red-600 font-black">S/ 12.00</span>
                  </p>
                </div>

                {/* Red CTA Button */}
                <button
                  onClick={() => onPideAqui('broaster')}
                  className="w-full bg-[#E6192B] hover:bg-[#c91222] active:scale-95 text-white font-black text-[11px] uppercase tracking-wider py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>PIDE TU BROASTER AQUÍ</span>
                </button>

                {/* 3 Circle Badge Features */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border border-amber-300 bg-amber-50/80 flex items-center justify-center text-amber-900 mb-1 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 stroke-[2] text-amber-600" />
                    </div>
                    <span className="text-[8px] font-black leading-tight text-neutral-800 uppercase tracking-tighter">
                      100% POLLO FRESCO
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border border-amber-300 bg-amber-50/80 flex items-center justify-center text-amber-900 mb-1 shadow-2xs">
                      <Award className="w-3.5 h-3.5 stroke-[2] text-amber-600" />
                    </div>
                    <span className="text-[8px] font-black leading-tight text-neutral-800 uppercase tracking-tighter">
                      EMPANIZADO CRUJIENTE
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border border-amber-300 bg-amber-50/80 flex items-center justify-center text-amber-900 mb-1 shadow-2xs">
                      <Heart className="w-3.5 h-3.5 stroke-[2] text-amber-600" />
                    </div>
                    <span className="text-[8px] font-black leading-tight text-neutral-800 uppercase tracking-tighter">
                      CREMAS CASERAS
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Strip: "Sabor, crocancia y pasión en cada presa." */}
              <div className="relative z-10 mt-3 -mx-5 -mb-5 bg-neutral-950 text-white px-4 py-2.5 flex items-center justify-between">
                <span className="font-serif italic text-xs sm:text-sm text-neutral-200">
                  Crocante por fuera, jugoso por dentro.
                </span>
                <div className="flex items-center gap-1.5 bg-red-600 px-2.5 py-0.5 rounded-md text-white text-[9px] font-bold uppercase tracking-wider">
                  <span>BUCHISAPA BROASTER</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 1: TU CHICHA Promo Slide */}
          {currentSlide === 1 && (
            <div className="relative w-full h-[460px] bg-neutral-950 overflow-hidden flex flex-col justify-end p-6 animate-in fade-in duration-300">
              <img
                src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1000&q=80"
                alt="Promo Tu Chicha"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 text-right space-y-2">
                <span className="text-red-500 font-black tracking-widest text-xs uppercase block">
                  PROMO
                </span>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight font-heading leading-none">
                  TU CHICHA
                </h1>
                <p className="text-neutral-300 text-xs font-medium">
                  1 Pollo a la brasa + papas familiares + ensalada + 1L Chicha Morada
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onPideAqui('promociones')}
                    className="bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-lg"
                  >
                    PIDE AQUÍ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Buchisapa Brasa Slide */}
          {currentSlide === 2 && (
            <div className="relative w-full h-[460px] bg-neutral-950 overflow-hidden flex flex-col justify-end p-6 animate-in fade-in duration-300">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80"
                alt="Pollo a la Brasa"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 text-right space-y-2">
                <span className="text-red-500 font-black tracking-widest text-xs uppercase block">
                  ESPECIALIDAD
                </span>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight font-heading leading-none">
                  POLLO A LA BRASA
                </h1>
                <p className="text-neutral-300 text-xs font-medium">
                  Piel dorada y crocante con papas nativas y las mejores salsas caseras.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onPideAqui('brasa')}
                    className="bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-lg"
                  >
                    PIDE AQUÍ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: Fuego & Carbón Anticuchos */}
          {currentSlide === 3 && (
            <div className="relative w-full h-[460px] bg-neutral-950 overflow-hidden flex flex-col justify-end p-6 animate-in fade-in duration-300">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                alt="Anticuchos y Parrillas"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 text-right space-y-2">
                <span className="text-red-500 font-black tracking-widest text-xs uppercase block">
                  PARRILLAS
                </span>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight font-heading leading-none">
                  FUEGO & CARBÓN
                </h1>
                <p className="text-neutral-300 text-xs font-medium">
                  Anticuchos de corazón, mollejitas tiernas y cortes parrilleros jugosos.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onPideAqui('anticuchos')}
                    className="bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-lg"
                  >
                    PIDE AQUÍ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Left Arrow Button (< as in mobile screenshot) */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md transition-all z-20 cursor-pointer"
            aria-label="Anterior diapositiva"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right Arrow Button (> as in mobile screenshot) */}
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md transition-all z-20 cursor-pointer"
            aria-label="Siguiente diapositiva"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Mobile Pagination Dots matching Screenshot_20260916-121646_Chrome.png */}
        <div className="py-2.5 flex items-center justify-center gap-2 bg-white">
          {Array.from({ length: mobileSlidesCount }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`rounded-full transition-all cursor-pointer ${
                currentSlide === idx
                  ? 'w-2 h-2 bg-neutral-800 scale-125'
                  : 'w-2 h-2 bg-neutral-300 hover:bg-neutral-400'
              }`}
              aria-label={`Ir a slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* =========================================================================
          2. DESKTOP & TABLET CAROUSEL (>= md) EXACTLY AS IN Desktop Screenshot 1
         ========================================================================= */}
      <div id="desktop-hero-carousel" className="hidden md:block relative w-full bg-[#111215] overflow-hidden border-b border-neutral-800">
        <div className="relative w-full md:h-96 lg:h-[420px] max-w-[1400px] mx-auto overflow-hidden">
          {/* Background Image with Dark Vignette */}
          <img
            key={desktopSlides[currentSlide]?.id || 0}
            src={desktopSlides[currentSlide]?.image}
            alt={desktopSlides[currentSlide]?.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            className="w-full h-full object-cover object-center animate-in fade-in duration-700 brightness-90"
          />

          {/* Gradient Overlay matching Screenshot 1 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />

          {/* Desktop Right-aligned Content */}
          <div className="absolute inset-0 max-w-7xl mx-auto px-8 lg:px-12 flex flex-col justify-center items-end text-right">
            <div className="max-w-md lg:max-w-lg space-y-3 animate-in slide-in-from-right-4 duration-500">
              <span className="text-red-500 font-black tracking-[0.25em] text-xs sm:text-sm uppercase block">
                {desktopSlides[currentSlide]?.badge}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight font-heading leading-none drop-shadow-md">
                {desktopSlides[currentSlide]?.title}
              </h1>

              <p className="text-neutral-300 text-sm md:text-base font-medium leading-snug line-clamp-2">
                {desktopSlides[currentSlide]?.subtitle}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onPideAqui(desktopSlides[currentSlide]?.actionKey || 'promociones')}
                  className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-sm uppercase tracking-wider px-8 py-3 rounded-lg shadow-lg hover:shadow-red-600/30 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>{desktopSlides[currentSlide]?.buttonText || 'PIDE AQUÍ'}</span>
                </button>
              </div>

              <span className="block text-[10px] text-neutral-400 italic pt-1">
                Imagen referencial. Aplican términos y condiciones.
              </span>
            </div>
          </div>

          {/* Desktop Left Arrow Button */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white flex items-center justify-center transition-all backdrop-blur-xs cursor-pointer"
            aria-label="Anterior diapositiva"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Desktop Right Arrow Button */}
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white flex items-center justify-center transition-all backdrop-blur-xs cursor-pointer"
            aria-label="Siguiente diapositiva"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Desktop Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {desktopSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Ir a slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
