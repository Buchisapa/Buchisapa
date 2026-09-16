import React, { useState, useMemo } from 'react';
import { Search, Utensils, Sparkles, Plus, Check, Star, Info } from 'lucide-react';
import { CATEGORIES, MENU_ITEMS, MenuItem } from '../data/menuData';
import { useCart } from '../context/CartContext';

interface MenuSectionProps {
  onSelectItem: (item: MenuItem) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  externalSearchTerm?: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onSelectItem,
  selectedCategory,
  setSelectedCategory,
  externalSearchTerm = '',
}) => {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  const effectiveSearch = externalSearchTerm || searchTerm;

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'todos' && item.category !== selectedCategory) {
        return false;
      }
      // Popular filter
      if (onlyPopular && !item.popular) {
        return false;
      }
      // Search term filter
      if (effectiveSearch.trim() !== '') {
        const term = effectiveSearch.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(term);
        const matchesDesc = item.description.toLowerCase().includes(term);
        const matchesCategory = item.category.toLowerCase().includes(term);
        const matchesIncludes = item.includes?.some(inc => inc.toLowerCase().includes(term));
        return matchesName || matchesDesc || matchesCategory || matchesIncludes;
      }
      return true;
    });
  }, [selectedCategory, onlyPopular, effectiveSearch]);

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    // If it has required options, open modal instead
    if (item.options && item.options.length > 0) {
      onSelectItem(item);
      return;
    }
    addToCart(item, 1, undefined, ["Mayonesa Casera", "Tártara Especial", "Ají de Cocona con Charapita"]);
    setQuickAddedId(item.id);
    setTimeout(() => setQuickAddedId(null), 1500);
  };

  return (
    <section id="menu" className="py-14 sm:py-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
            <Utensils className="w-3.5 h-3.5" />
            <span>Nuestra Carta Completa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight">
            Descubre los Platos de Buchisapa
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            Desde los clásicos de la Amazonía hasta las hamburguesas y broaster más crocantes de Ate.
            ¡Todo preparado al momento con los ingredientes más frescos!
          </p>
        </div>

        {/* Search & Quick Filters Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-neutral-900/70 p-3.5 rounded-2xl border border-neutral-800">
          {/* Search input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por plato, ingrediente (cecina, broaster, royal...)"
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Quick toggle chips */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setOnlyPopular(!onlyPopular)}
              className={`text-xs font-semibold px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                onlyPopular
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Solo Más Populares</span>
            </button>

            <span className="text-xs text-neutral-500 hidden sm:inline">
              ({filteredItems.length} platos disponibles)
            </span>
          </div>
        </div>

        {/* Category Tabs: scrollable on mobile, wrapping flex toolbar on tablet and desktop */}
        <div className="flex items-center gap-2 overflow-x-auto md:flex-wrap md:justify-start pb-3 md:pb-0 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer border shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-neutral-900/40 rounded-3xl border border-neutral-800">
            <p className="text-lg font-bold text-white mb-2">No encontramos ningún plato para "{searchTerm}"</p>
            <p className="text-xs text-neutral-400 mb-4">Prueba buscando por otra palabra clave o selecciona otra categoría.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('todos');
                setOnlyPopular(false);
              }}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-amber-400 rounded-xl cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                id={`item-card-${item.id}`}
                onClick={() => onSelectItem(item)}
                className="group relative bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-200 flex flex-col justify-between cursor-pointer h-full"
              >
                {/* Image & Badges */}
                <div className="relative h-44 sm:h-48 md:h-44 lg:h-48 w-full overflow-hidden bg-neutral-950">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />

                  {/* Top Badge */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    {item.badge && (
                      <span className="bg-amber-500 text-neutral-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow">
                        {item.badge}
                      </span>
                    )}
                    {item.popular && (
                      <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow">
                        TOP
                      </span>
                    )}
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-2.5 right-2.5 bg-neutral-950/90 border border-neutral-700/80 px-2.5 py-1 rounded-lg text-amber-400 font-black text-sm sm:text-base shadow-md">
                    S/ {item.price.toFixed(2)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {item.includes && item.includes.length > 0 && (
                      <div className="mt-2 text-[11px] text-neutral-400 flex items-center gap-1 truncate">
                        <span className="text-emerald-400 font-semibold">Incluye:</span>
                        <span>{item.includes[0]}</span>
                        {item.includes.length > 1 && (
                          <span className="text-neutral-500">+{item.includes.length - 1} más</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 mt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <Info className="w-3 h-3 text-neutral-500" />
                      <span>Click para detalles</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                        quickAddedId === item.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200'
                      }`}
                      title="Agregar al pedido"
                    >
                      {quickAddedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Listo</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Pedir</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
