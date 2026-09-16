import React from 'react';
import { Sparkles, Palmtree, ArrowRight, HeartHandshake, Award } from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '../data/menuData';

interface SelvaHighlightProps {
  onSelectItem: (item: MenuItem) => void;
  onViewAllSelva: () => void;
}

export const SelvaHighlight: React.FC<SelvaHighlightProps> = ({ onSelectItem, onViewAllSelva }) => {
  const selvaItems = MENU_ITEMS.filter((i) => i.category === 'selvaticos').slice(0, 4);

  return (
    <section id="selva" className="py-16 sm:py-20 bg-gradient-to-b from-neutral-950 via-emerald-950/20 to-neutral-950 border-t border-neutral-800 relative overflow-hidden">
      {/* Decorative leaf / jungle ambient light */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Palmtree className="w-3.5 h-3.5" />
              <span>Gastronomía de Nuestra Amazonía</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight">
              Auténtico Sabor Selvático en Ate
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mt-2 leading-relaxed">
              En <strong className="text-emerald-400">Buchisapa</strong> traemos la tradición culinaria de la selva peruana a tu mesa: cecina ahumada con leña aromática, plátano bellaco de primera, ají charapita y hierbas tradicionales como el sachaculantro.
            </p>
          </div>

          <button
            onClick={onViewAllSelva}
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/80 px-5 py-3 rounded-xl transition-all self-start lg:self-auto cursor-pointer"
          >
            <span>Ver Todos los Platos Amazónicos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Cards Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {selvaItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="bg-neutral-900/90 border border-emerald-900/40 hover:border-emerald-500/60 rounded-2xl overflow-hidden shadow-lg transition-all group cursor-pointer flex flex-col justify-between h-full"
            >
              <div className="relative h-44 sm:h-48 lg:h-44 xl:h-48 overflow-hidden bg-neutral-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-70" />
                <div className="absolute top-2 left-2 bg-emerald-700 text-emerald-100 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                  Selva 100%
                </div>
                <div className="absolute bottom-2 right-2 bg-neutral-950/90 px-2.5 py-0.5 rounded-md text-amber-400 font-black text-sm border border-neutral-700">
                  S/ {item.price.toFixed(2)}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    Ají de cocona incluido
                  </span>
                  <span className="text-xs text-neutral-300 font-bold group-hover:text-white flex items-center gap-1">
                    <span>Pedir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Amazonian trust banner */}
        <div className="mt-12 bg-neutral-900/80 border border-emerald-900/30 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Cecina y Chorizo Auténticos</p>
              <p className="text-xs text-neutral-400">Ahumados de manera artesanal y traídos frescos.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Refrescos 100% de Pulpa</p>
              <p className="text-xs text-neutral-400">Cocona, aguajina y camu camu con todo su poder nutritivo.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Atención Cálida y Rápida</p>
              <p className="text-xs text-neutral-400">Te atendemos con la alegría y calidez característica de la selva.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
