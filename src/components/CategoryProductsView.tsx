import React, { useMemo } from 'react';
import { ArrowLeft, Plus, Check, Star } from 'lucide-react';
import { CATEGORIES, MENU_ITEMS, MenuItem } from '../data/menuData';
import { useCart } from '../context/CartContext';

interface CategoryProductsViewProps {
  categoryKey: string;
  onBackToCategories: () => void;
  onSelectItem: (item: MenuItem) => void;
  searchQuery?: string;
}

export const CategoryProductsView: React.FC<CategoryProductsViewProps> = ({
  categoryKey,
  onBackToCategories,
  onSelectItem,
  searchQuery = '',
}) => {
  const { addToCart } = useCart();
  const [quickAddedId, setQuickAddedId] = React.useState<string | null>(null);

  // Find category information
  const categoryInfo = CATEGORIES.find((c) => c.id === categoryKey) || {
    id: categoryKey,
    name: categoryKey.toUpperCase(),
    description: 'Nuestra selección exclusiva',
  };

  const items = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category match
      const inCategory = categoryKey === 'todos' || item.category === categoryKey;
      if (!inCategory && !searchQuery) return false;

      // Search query filter if present
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesIncludes = item.includes?.some((inc) => inc.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesIncludes;
      }

      return inCategory;
    });
  }, [categoryKey, searchQuery]);

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    if (item.options && item.options.length > 0) {
      onSelectItem(item);
      return;
    }
    addToCart(item, 1, undefined, [
      'Mayonesa Casera',
      'Tártara Especial',
      'Ají de Pollería',
    ]);
    setQuickAddedId(item.id);
    setTimeout(() => setQuickAddedId(null), 1500);
  };

  return (
    <div className="bg-neutral-50 min-h-[60vh] py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Sticky Header with Back Button */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-neutral-200">
          <button
            onClick={onBackToCategories}
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold text-sm sm:text-base py-1.5 px-3 rounded-xl hover:bg-red-50 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span>Volver a Categorías</span>
          </button>

          <span className="text-xs text-neutral-500 font-semibold">
            {items.length} {items.length === 1 ? 'plato' : 'platos'}
          </span>
        </div>

        {/* Category Title & Description */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase font-heading tracking-tight">
            {searchQuery ? `Resultados para "${searchQuery}"` : categoryInfo.name}
          </h1>
          {categoryInfo.description && !searchQuery && (
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              {categoryInfo.description}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-neutral-200 my-8">
            <p className="text-neutral-600 text-sm font-medium">
              No se encontraron platos en esta sección.
            </p>
            <button
              onClick={onBackToCategories}
              className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase rounded-lg hover:bg-red-700"
            >
              Ver todas las categorías
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {items.map((item) => {
              const isAdded = quickAddedId === item.id;
              return (
                <div
                  key={item.id}
                  id={`product-${item.id}`}
                  onClick={() => onSelectItem(item)}
                  className="bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-300 shadow-sm hover:shadow-md transition-all p-3 sm:p-4 flex gap-3.5 sm:gap-4 cursor-pointer group active:scale-[0.99]"
                >
                  {/* Product Thumbnail */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.popular && (
                      <span className="absolute top-1 left-1 bg-amber-500 text-neutral-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-neutral-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-neutral-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100">
                      <span className="text-base sm:text-lg font-black text-neutral-900">
                        S/ {item.price.toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, item)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white shadow-sm active:scale-95'
                        }`}
                      >
                        {isAdded ? (
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
