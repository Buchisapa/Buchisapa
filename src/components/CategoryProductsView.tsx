import React, { useMemo, useState } from 'react';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
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
  const { addToCart, menuItems } = useCart();
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Find category information
  const categoryInfo = CATEGORIES.find((c) => c.id === categoryKey) || {
    id: categoryKey,
    name: categoryKey.toUpperCase(),
    description: 'Nuestra selección exclusiva de la casa',
  };

  const items = useMemo(() => {
    return menuItems.filter((item) => {
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
  }, [menuItems, categoryKey, searchQuery]);

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
    <div className="bg-[#f8f9fa] min-h-[85vh] py-3 sm:py-5 px-3 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4 pb-2 border-b border-neutral-200">
          <button
            onClick={onBackToCategories}
            className="inline-flex items-center gap-1.5 text-neutral-800 hover:text-[#E6192B] font-bold text-xs sm:text-sm py-1.5 px-2 rounded-xl hover:bg-neutral-200/60 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Volver</span>
          </button>
        </div>

        {/* Category Title & Description */}
        {searchQuery && (
          <div className="mb-3">
            <h1 className="text-lg sm:text-xl font-bold text-neutral-900">
              Resultados para "{searchQuery}"
            </h1>
          </div>
        )}

        {/* Products List (Exact Pardos-style layout with full-size image) */}
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-neutral-200 my-6 shadow-xs">
            <p className="text-neutral-600 text-sm font-medium">
              No se encontraron platos en esta sección.
            </p>
            <button
              onClick={onBackToCategories}
              className="mt-4 px-5 py-2.5 bg-[#E6192B] hover:bg-[#c91222] text-white text-xs font-bold uppercase rounded-2xl transition-all cursor-pointer"
            >
              Ver todas las categorías
            </button>
          </div>
        ) : (
          <div className="space-y-3.5 sm:space-y-4">
            {items.map((item) => {
              const isAdded = quickAddedId === item.id;
              return (
                <div
                  key={item.id}
                  id={`product-${item.id}`}
                  onClick={() => onSelectItem(item)}
                  className="bg-white rounded-3xl border border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all overflow-hidden flex flex-row items-stretch cursor-pointer group active:scale-[0.99]"
                >
                  {/* Product Image on the left - full bleed flush with the left edge */}
                  <div className="w-36 h-36 sm:w-44 sm:h-44 shrink-0 relative overflow-hidden bg-neutral-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Details on the right */}
                  <div className="p-3.5 sm:p-4.5 flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug line-clamp-2">
                        {item.name}
                      </h3>

                      {/* Description with inline VER MÁS */}
                      <p className="text-xs sm:text-sm text-neutral-500 leading-snug line-clamp-2 mt-1">
                        {item.description}{' '}
                        <span className="font-bold text-neutral-900 hover:text-[#E6192B] uppercase inline">
                          VER MÁS
                        </span>
                      </p>
                    </div>

                    {/* Price and Add Button */}
                    <div className="flex items-center justify-between gap-2 mt-2 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
                          S/{item.price.toFixed(2)}
                        </span>
                        {item.isAvailable === false && (
                          <span className="text-[10px] font-bold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded-md">
                            Agotado
                          </span>
                        )}
                      </div>

                      {item.isAvailable === false ? (
                        <button
                          type="button"
                          disabled
                          className="px-4 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-semibold bg-neutral-100 text-neutral-400 cursor-not-allowed"
                        >
                          Agotado
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(e, item)}
                          className={`px-4 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#E6192B] hover:bg-[#c91222] text-white'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4 stroke-[2.5]" />
                              <span>Agregado</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                              <span>Agregar</span>
                            </>
                          )}
                        </button>
                      )}
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

