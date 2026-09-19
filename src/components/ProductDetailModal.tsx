import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  X,
  Plus,
  Minus,
  Check,
  Sparkles,
  ShieldAlert,
  Utensils,
  CheckCheck,
  RotateCcw
} from 'lucide-react';
import { MenuItem, SAUCES_LIST } from '../data/menuData';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const CLASSIC_SAUCES = ['Mayonesa', 'Mostaza', 'Ketchup', 'Ají de Rocoto'];

  const [quantity, setQuantity] = useState(1);
  const [selectedAccompaniments, setSelectedAccompaniments] = useState<string[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<string[]>([
    'Mayonesa',
    'Mostaza',
    'Ketchup',
    'Ají de Rocoto',
  ]);
  const [notes, setNotes] = useState('');
  const [showAllergens, setShowAllergens] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Non-beverage detection
  const isBeverage = item?.category === 'bebidas' || item?.category === 'refrescos';
  const hasAccompaniments = !!item?.includes && item.includes.length > 0;

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setNotes('');
      setIsAdded(false);
      setShowAllergens(false);

      // Default accompaniments (all included by default)
      if (item.includes && item.includes.length > 0) {
        setSelectedAccompaniments([...item.includes]);
      } else {
        setSelectedAccompaniments([]);
      }

      // Default sauces (if savory item, default to the 4 classics)
      if (!isBeverage) {
        setSelectedSauces(['Mayonesa', 'Mostaza', 'Ketchup', 'Ají de Rocoto']);
      } else {
        setSelectedSauces([]);
      }
    }
  }, [item, isBeverage]);

  if (!item) return null;

  // Toggle single accompaniment
  const toggleAccompaniment = (acc: string) => {
    if (selectedAccompaniments.includes(acc)) {
      setSelectedAccompaniments(prev => prev.filter(a => a !== acc));
    } else {
      setSelectedAccompaniments(prev => [...prev, acc]);
    }
  };

  const selectAllAccompaniments = () => {
    if (item.includes) {
      setSelectedAccompaniments([...item.includes]);
    }
  };

  const removeAllAccompaniments = () => {
    setSelectedAccompaniments([]);
  };

  // Sauces
  const toggleSauce = (sauce: string) => {
    if (selectedSauces.includes(sauce)) {
      setSelectedSauces(prev => prev.filter(s => s !== sauce));
    } else {
      setSelectedSauces(prev => [...prev, sauce]);
    }
  };

  const selectAllSauces = () => {
    setSelectedSauces([...SAUCES_LIST]);
  };

  const selectClassicSauces = () => {
    setSelectedSauces([...CLASSIC_SAUCES]);
  };

  const removeAllSauces = () => {
    setSelectedSauces([]);
  };

  // Removed accompaniments
  const removedAccompaniments = (item.includes || []).filter(
    acc => !selectedAccompaniments.includes(acc)
  );

  const handleAddToCart = () => {
    addToCart(
      item,
      quantity,
      undefined,
      selectedSauces,
      notes,
      selectedAccompaniments,
      removedAccompaniments
    );

    setIsAdded(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const totalPrice = (item.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white rounded-t-[28px] sm:rounded-3xl max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
        
        {/* Modal Top Header (Fixed/Sticky at the top of modal) */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 border-b border-neutral-100 bg-white shrink-0 z-20">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-neutral-700 hover:text-[#E6192B] font-bold text-xs sm:text-sm py-1 px-1.5 rounded-lg hover:bg-neutral-100 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Volver</span>
          </button>

          <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
            {item.category.replace('-', ' ')}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4.5 overscroll-contain">
          
          {/* Hero Image */}
          <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100 relative shadow-sm border border-neutral-100">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {item.badge && (
              <span className="absolute top-3 left-3 bg-amber-500 text-neutral-950 font-black text-[11px] uppercase px-2.5 py-1 rounded-lg shadow-sm">
                ★ {item.badge}
              </span>
            )}
            {item.popular && !item.badge && (
              <span className="absolute top-3 left-3 bg-[#E6192B] text-white font-black text-[11px] uppercase px-2.5 py-1 rounded-lg shadow-sm">
                🔥 Favorito
              </span>
            )}
          </div>

          {/* Title, Price and Description */}
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight font-heading">
                {item.name}
              </h1>
              <span className="text-xl sm:text-2xl font-black text-[#E6192B] tracking-tight font-mono shrink-0">
                S/ {item.price.toFixed(2)}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>

          {/* SECTION 1: ACOMPAÑAMIENTOS E INGREDIENTES */}
          {hasAccompaniments && (
            <div className="bg-neutral-50/80 rounded-2xl border border-neutral-200/80 p-3.5 sm:p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-neutral-200/60">
                <div className="flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-[#E6192B]" />
                  <h2 className="text-xs sm:text-sm font-bold text-neutral-900">
                    Acompañamientos
                  </h2>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={selectAllAccompaniments}
                    className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Con todo</span>
                  </button>
                  <button
                    type="button"
                    onClick={removeAllAccompaniments}
                    className="px-2 py-1 bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Quitar todo</span>
                  </button>
                </div>
              </div>

              {/* Accompaniments Checkbox Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.includes?.map((acc) => {
                  const isIncluded = selectedAccompaniments.includes(acc);
                  return (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => toggleAccompaniment(acc)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer text-left ${
                        isIncluded
                          ? 'bg-white border-emerald-300 text-neutral-900 shadow-2xs'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                            isIncluded
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-neutral-300'
                          }`}
                        >
                          {isIncluded && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={isIncluded ? 'text-neutral-900 font-medium' : 'text-neutral-700 font-normal'}>
                          {acc}
                        </span>
                      </div>

                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                        isIncluded
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-neutral-500 bg-neutral-100'
                      }`}>
                        {isIncluded ? 'Incluido' : 'Sin esto'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Removed note banner */}
              {removedAccompaniments.length > 0 && (
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px] flex items-center gap-1.5">
                  <span className="font-bold shrink-0">⚠️ Nota:</span>
                  <span>Sin {removedAccompaniments.join(', ')}</span>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: CREMAS Y SALSAS */}
          {!isBeverage && (
            <div className="bg-neutral-50/80 rounded-2xl border border-neutral-200/80 p-3.5 sm:p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-neutral-200/60">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#E6192B]" />
                  <h2 className="text-xs sm:text-sm font-bold text-neutral-900">
                    Cremas y Salsas
                  </h2>
                </div>

                {/* Quick actions for sauces */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={selectAllSauces}
                    className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Con todo</span>
                  </button>
                  <button
                    type="button"
                    onClick={selectClassicSauces}
                    className="px-2 py-1 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Clásicas
                  </button>
                  <button
                    type="button"
                    onClick={removeAllSauces}
                    className="px-2 py-1 bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Sin cremas</span>
                  </button>
                </div>
              </div>

              {/* Sauces Grid matching Accompaniments design */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAUCES_LIST.map((sauce) => {
                  const isChecked = selectedSauces.includes(sauce);
                  return (
                    <button
                      key={sauce}
                      type="button"
                      onClick={() => toggleSauce(sauce)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer text-left ${
                        isChecked
                          ? 'bg-white border-emerald-300 text-neutral-900 shadow-2xs'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-neutral-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={isChecked ? 'text-neutral-900 font-medium' : 'text-neutral-700 font-normal'}>
                          {sauce}
                        </span>
                      </div>

                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                        isChecked
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-neutral-500 bg-neutral-100'
                      }`}>
                        {isChecked ? 'Incluido' : 'Sin esto'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Removed sauces note banner */}
              {selectedSauces.length === 0 && (
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px] flex items-center gap-1.5">
                  <span className="font-bold shrink-0">⚠️ Nota:</span>
                  <span>Sin cremas ni salsas</span>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: INDICACIONES ESPECIALES */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 block">
              Indicaciones especiales para cocina (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Papas bien doraditas, cremas aparte, sin ensalada..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-[#E6192B] transition-all"
            />
          </div>

          {/* Allergen link */}
          <div className="text-xs text-neutral-500 pb-2">
            <p>
              ¿Tienes alguna alergia alimentaria?{' '}
              <button
                type="button"
                onClick={() => setShowAllergens(!showAllergens)}
                className="text-[#E6192B] font-semibold underline cursor-pointer hover:text-red-700"
              >
                Ver información de alérgenos
              </button>
            </p>

            {showAllergens && (
              <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Información de Alérgenos:</span>
                </div>
                <p>
                  Nuestros productos pueden contener o entrar en contacto con gluten (trigo), huevos, lácteos, soya y ajonjolí.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Modal Bottom Action Bar (always cleanly pinned inside the modal) */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-200/80 px-4 py-3 sm:px-6 sm:py-3.5 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] z-30 flex items-center gap-3">
          
          {/* Quantity Stepper Pill */}
          <div className="flex items-center gap-2 bg-neutral-100 px-2.5 py-1.5 rounded-2xl border border-neutral-200/80 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-xl bg-white shadow-2xs flex items-center justify-center text-neutral-700 hover:text-neutral-900 disabled:opacity-30 active:scale-95 transition-all cursor-pointer"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span className="text-sm font-black text-neutral-900 min-w-[18px] text-center font-mono">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-xl bg-white shadow-2xs flex items-center justify-center text-neutral-700 hover:text-neutral-900 active:scale-95 transition-all cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Add to Cart CTA Button */}
          <button
            id="product-detail-add-btn"
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between shadow-md shadow-red-500/20 active:scale-98 transition-all cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#E6192B] hover:bg-[#c91222] text-white'
            }`}
          >
            <span className="truncate pr-2 font-bold">
              {isAdded ? '✓ Agregado al pedido' : 'Agregar a mi pedido'}
            </span>
            <span className="text-xs sm:text-sm font-black whitespace-nowrap font-mono">
              S/ {totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
