import React, { useState } from 'react';
import { ArrowLeft, Tag, Plus, Check } from 'lucide-react';
import { PROMOTIONS, MenuItem } from '../data/menuData';
import { useCart } from '../context/CartContext';

interface PromotionsViewProps {
  onBackToCategories: () => void;
  onSelectItem: (item: MenuItem) => void;
}

export const PromotionsView: React.FC<PromotionsViewProps> = ({
  onBackToCategories,
  onSelectItem,
}) => {
  const { addToCart } = useCart();
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  const handleAddPromo = (promo: (typeof PROMOTIONS)[0]) => {
    const promoMenuItem: MenuItem = {
      id: promo.id,
      name: promo.title,
      category: 'promociones',
      price: promo.price,
      description: promo.description,
      includes: promo.items,
      badge: promo.tag,
      image:
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    };

    addToCart(promoMenuItem, 1, 'Combo Completo', [
      'Mayonesa Casera',
      'Tártara Especial',
      'Ají de Pollería',
    ]);
    setQuickAddedId(promo.id);
    setTimeout(() => setQuickAddedId(null), 1500);
  };

  return (
    <div className="bg-neutral-50 min-h-[60vh] py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back to Categories Header */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-neutral-200">
          <button
            onClick={onBackToCategories}
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold text-sm sm:text-base py-1.5 px-3 rounded-xl hover:bg-red-50 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span>Volver a Categorías</span>
          </button>

          <span className="text-xs text-neutral-500 font-semibold">
            {PROMOTIONS.length} Promociones activas
          </span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase font-heading tracking-tight">
            PROMOCIONES
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Combos y banquetes pensados para compartir y disfrutar con el mejor ahorro.
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROMOTIONS.map((promo) => {
            const isAdded = quickAddedId === promo.id;
            return (
              <div
                key={promo.id}
                className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">
                      <Tag className="w-3 h-3" />
                      <span>{promo.tag}</span>
                    </span>
                    <div className="text-right">
                      <span className="text-xs text-neutral-400 line-through mr-1.5">
                        S/ {promo.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-lg font-black text-neutral-900">
                        S/ {promo.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-neutral-900 mb-1.5">
                    {promo.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                    {promo.description}
                  </p>

                  <div className="bg-neutral-50 rounded-xl p-2.5 border border-neutral-100 mb-4 space-y-1">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                      Incluye:
                    </span>
                    {promo.items.map((it, idx) => (
                      <div key={idx} className="text-xs text-neutral-700 font-medium flex items-center gap-1.5">
                        <span className="text-red-600 text-xs font-bold">•</span>
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddPromo(promo)}
                  className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-sm active:scale-95'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Agregado al Pedido</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Pedir Combo</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
