import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Flame } from 'lucide-react';

interface HeroCarouselProps {
  onOrderNow: () => void;
  onExplorePromo: () => void;
  onExploreSelva: () => void;
}

interface Slide {
  id: string;
  tag?: string;
  title: string;
  highlightText: string;
  subtitle: string;
  image: string;
  ctaText: string;
  action: 'promo' | 'order' | 'selva';
}

const SLIDES: Slide[] = [
  {
    id: 'slide-1',
    tag: 'PROMO EXCLUSIVA 24H',
    title: 'PROMO',
    highlightText: 'TU CHICHA & COMBOS',
    subtitle: 'El auténtico Pollo Broaster crocante con papas amarillas, ensalada fresca y botella helada de Chicha Morada o Cocona.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'PIDE AQUÍ',
    action: 'promo',
  },
  {
    id: 'slide-2',
    tag: '100% SABOR AMAZÓNICO',
    title: 'ESPECIALIDADES',
    highlightText: 'DE LA SELVA EN ATE',
    subtitle: 'Tacacho con Cecina ahumada traída de Tarapoto, Chorizo selvático, Juane tradicional y Ají de Cocona con charapita.',
    image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'VER CARTA SELVA',
    action: 'selva',
  },
  {
    id: 'slide-3',
    tag: 'SUPER CROCANTE & JUGOSO',
    title: 'POLLO BROASTER',
    highlightText: '& HAMBURGUESAS ROYAL',
    subtitle: 'Porciones bien servidas de pecho o pierna broaster con papas crocantes, cremas ilimitadas y hamburguesas artesanales.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'EXPLORAR CARTA',
    action: 'order',
  },
  {
    id: 'slide-4',
    tag: 'RECONSTITUYENTES DÍA Y NOCHE',
    title: 'CALDOS CALIENTES',
    highlightText: 'DE GALLINA & AMAZÓNICO',
    subtitle: 'Caldos poderosos servidos hirviendo las 24 horas continuas con presa entera, huevo duro, yuca, sachaculantro y canchita.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'PEDIR CALDO',
    action: 'order',
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onOrderNow,
  onExplorePromo,
  onExploreSelva,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handleAction = (action: 'promo' | 'order' | 'selva') => {
    if (action === 'promo') onExplorePromo();
    else if (action === 'selva') onExploreSelva();
    else onOrderNow();
  };

  return (
    <section
      className="relative w-full bg-neutral-950 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="relative min-h-[380px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px] flex items-center justify-center">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Dark Vignette */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-7000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/75 to-neutral-950/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/30" />

              {/* Slide Content Overlay */}
              <div className="relative max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-16 flex flex-col justify-center text-left">
                <div className="max-w-xl lg:max-w-2xl space-y-3 sm:space-y-4">
                  {slide.tag && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-md">
                      <Flame className="w-3.5 h-3.5 fill-white" />
                      <span>{slide.tag}</span>
                    </div>
                  )}

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none uppercase font-heading">
                    {slide.title} <br className="hidden sm:inline" />
                    <span className="text-red-500 font-extrabold tracking-wide">
                      {slide.highlightText}
                    </span>
                  </h1>

                  <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-normal leading-relaxed max-w-lg line-clamp-3 sm:line-clamp-none">
                    {slide.subtitle}
                  </p>

                  <div className="pt-2 sm:pt-4">
                    <button
                      onClick={() => handleAction(slide.action)}
                      className="px-6 sm:px-8 py-3 sm:py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-xl shadow-red-600/30 transition-all flex items-center gap-2 cursor-pointer group"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Prev/Next Navigation Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-900/60 hover:bg-neutral-900 text-white flex items-center justify-center backdrop-blur-sm border border-neutral-700/50 transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Diapositiva anterior"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-900/60 hover:bg-neutral-900 text-white flex items-center justify-center backdrop-blur-sm border border-neutral-700/50 transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Diapositiva siguiente"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="py-3 sm:py-4 bg-white flex items-center justify-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentSlide
                ? 'w-6 h-2.5 bg-neutral-900'
                : 'w-2.5 h-2.5 bg-neutral-300 hover:bg-neutral-400'
            }`}
            aria-label={`Ir a la diapositiva ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
