import React from 'react';
import { Tag, Sparkles, Plus, Check } from 'lucide-react';
import { PROMOTIONS, MenuItem, MENU_ITEMS } from '../data/menuData';
import { useCart } from '../context/CartContext';

export const PromotionsSection: React.FC = () => {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const handleAddPromo = (promo: typeof PROMOTIONS[0]) => {
    // Construct a custom promo item for cart
    const promoMenuItem: MenuItem = {
      id: promo.id,
      name: promo.title,
      category: 'promos',
      price: promo.price,
      description: promo.description,
      includes: promo.items,
      badge: promo.tag,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    };

    addToCart(promoMenuItem, 1, 'Combo Completo', ["Mayonesa Casera", "Tártara Especial", "Ají de Cocona con Charapita"]);
    setAddedId(promo.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section id="promos" className="py-12 bg-neutral-900/50 border-y border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Combos &amp; Promociones Especiales</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Ahorra y disfruta con los Combos Buchisapa
            </h2>
          </div>
          <p className="text-sm text-neutral-400 mt-2 md:mt-0 max-w-md">
            Combinaciones preparadas para satisfacer tu antojo con el mejor precio y la auténtica sazón.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {PROMOTIONS.map((promo) => (
            <div
              key={promo.id}
              id={`promo-${promo.id}`}
              className="relative rounded-2xl bg-neutral-950 border border-neutral-800 p-5 sm:p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/5 group h-full"
            >
              {/* Badge Tag */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black uppercase px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                  <Tag className="w-3 h-3 shrink-0" />
                  <span>{promo.tag}</span>
                </span>
                <div className="text-right whitespace-nowrap">
                  <span className="text-xs text-neutral-500 line-through mr-1.5 sm:mr-2">
                    S/ {promo.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-lg sm:text-xl font-black text-white">
                    S/ {promo.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3 mb-6">
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {promo.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {promo.description}
                </p>

                {/* Items included list */}
                <div className="pt-2 space-y-1.5">
                  {promo.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Button */}
              <button
                id={`add-promo-${promo.id}-btn`}
                onClick={() => handleAddPromo(promo)}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  addedId === promo.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200'
                }`}
              >
                {addedId === promo.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Agregado al Carrito!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Pedir este Combo (S/ {promo.price.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
