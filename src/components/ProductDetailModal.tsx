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
    <div 
      className="fixed inset-0 z-50 w-full h-full bg-white flex flex-col overflow-hidden animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      {/* Top Header Bar (Full width edge-to-edge) */}
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 border-b border-neutral-200 bg-white shrink-0 z-30 shadow-xs">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-neutral-800 hover:text-[#E6192B] font-extrabold text-sm sm:text-base py-2 px-3 rounded-xl hover:bg-neutral-100 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          <span>Volver a la carta</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#E6192B] bg-red-50 border border-red-200 px-4 py-1.5 rounded-full shadow-2xs">
            {item.category.replace('-', ' ')}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-all cursor-pointer"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>
      </header>

      {/* Main Full-Screen Content (Split Screen on Desktop) */}
      <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Full Height Product Photo Showcase on Desktop (5 cols on lg/xl) */}
        <div className="lg:col-span-5 xl:col-span-5 bg-neutral-950 relative flex flex-col justify-between overflow-hidden shrink-0 border-b lg:border-b-0 lg:border-r border-neutral-200">
          <div className="relative w-full aspect-[16/10] lg:aspect-auto lg:h-full min-h-[240px] lg:min-h-full bg-neutral-950 flex items-center justify-center overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent lg:from-black/90 lg:via-black/25" />

            {/* Floating Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              {item.badge && (
                <span className="bg-amber-500 text-neutral-950 font-black text-xs sm:text-sm uppercase px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                  ★ {item.badge}
                </span>
              )}
              {item.popular && !item.badge && (
                <span className="bg-[#E6192B] text-white font-black text-xs sm:text-sm uppercase px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                  🔥 Más Vendido
                </span>
              )}
              {item.isAvailable === false && (
                <span className="bg-neutral-800 text-white font-black text-xs sm:text-sm uppercase px-3.5 py-1.5 rounded-xl shadow-md">
                  Agotado Temporalmente
                </span>
              )}
            </div>

            {/* Desktop Bottom Showcase Info */}
            <div className="absolute bottom-6 left-6 right-6 hidden lg:block text-white space-y-2 z-10">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-200 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                  Restaurante Buchisapa
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  ● Preparado al momento
                </span>
              </div>
              <p className="text-sm text-neutral-200 leading-relaxed max-w-lg">
                Cocinado con ingredientes seleccionados y recetas auténticas de la selva y clásicos peruanos.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Product Information, Customization & Options (7 cols on lg/xl) */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col min-h-0 bg-neutral-50/50">
          
          {/* Scrollable Configuration Details */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 space-y-6 overscroll-contain">
            
            {/* Title, Price and Description */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6">
                <div className="space-y-1">
                  <h1 id="product-detail-title" className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 leading-tight font-heading">
                    {item.name}
                  </h1>
                  <p className="text-xs sm:text-sm font-bold uppercase text-neutral-400 tracking-wider">
                    Categoría: {item.category.replace('-', ' ')}
                  </p>
                </div>
                <div className="sm:text-right shrink-0">
                  <span className="text-3xl lg:text-4xl font-black text-[#E6192B] tracking-tight font-mono block">
                    S/ {item.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">Precio unitario</span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal pt-1 border-t border-neutral-100">
                {item.description}
              </p>
            </div>

            {/* SECTION 1: ACOMPAÑAMIENTOS E INGREDIENTES */}
            {hasAccompaniments && (
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-200/70">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-100 text-[#E6192B] flex items-center justify-center">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-neutral-900 leading-none">
                        Acompañamientos e Ingredientes
                      </h2>
                      <span className="text-xs text-neutral-500">Personaliza lo que incluye tu plato</span>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={selectAllAccompaniments}
                      className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span>Con todo</span>
                    </button>
                    <button
                      type="button"
                      onClick={removeAllAccompaniments}
                      className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Quitar</span>
                    </button>
                  </div>
                </div>

                {/* Accompaniments Checkbox Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {item.includes?.map((acc) => {
                    const isIncluded = selectedAccompaniments.includes(acc);
                    return (
                      <button
                        key={acc}
                        type="button"
                        onClick={() => toggleAccompaniment(acc)}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer text-left ${
                          isIncluded
                            ? 'bg-emerald-50/40 border-emerald-300 text-neutral-900 shadow-2xs ring-1 ring-emerald-400/30'
                            : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 opacity-80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                              isIncluded
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'bg-neutral-50 border-neutral-300'
                            }`}
                          >
                            {isIncluded && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className={isIncluded ? 'text-neutral-900 font-bold' : 'text-neutral-600 font-normal line-through'}>
                            {acc}
                          </span>
                        </div>

                        <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg transition-colors ${
                          isIncluded
                            ? 'text-emerald-700 bg-emerald-100/70'
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
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm flex items-center gap-2">
                    <span className="font-black shrink-0">⚠️ Nota para cocina:</span>
                    <span>Sin {removedAccompaniments.join(', ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 2: CREMAS Y SALSAS */}
            {!isBeverage && (
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-200/70">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-100 text-[#E6192B] flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-neutral-900 leading-none">
                        Cremas y Salsas de la Casa
                      </h2>
                      <span className="text-xs text-neutral-500">Selecciona las cremas que deseas</span>
                    </div>
                  </div>

                  {/* Quick actions for sauces */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={selectAllSauces}
                      className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span>Todas</span>
                    </button>
                    <button
                      type="button"
                      onClick={selectClassicSauces}
                      className="px-3 py-1.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                    >
                      Clásicas
                    </button>
                    <button
                      type="button"
                      onClick={removeAllSauces}
                      className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Ninguna</span>
                    </button>
                  </div>
                </div>

                {/* Sauces Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAUCES_LIST.map((sauce) => {
                    const isChecked = selectedSauces.includes(sauce);
                    return (
                      <button
                        key={sauce}
                        type="button"
                        onClick={() => toggleSauce(sauce)}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer text-left ${
                          isChecked
                            ? 'bg-emerald-50/40 border-emerald-300 text-neutral-900 shadow-2xs ring-1 ring-emerald-400/30'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                              isChecked
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'bg-neutral-50 border-neutral-300'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className={isChecked ? 'text-neutral-900 font-bold' : 'text-neutral-600 font-normal'}>
                            {sauce}
                          </span>
                        </div>

                        <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg transition-colors ${
                          isChecked
                            ? 'text-emerald-700 bg-emerald-100/70'
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
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm flex items-center gap-2">
                    <span className="font-black shrink-0">⚠️ Nota:</span>
                    <span>Sin cremas ni salsas (plato seco)</span>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: INDICACIONES ESPECIALES */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-2xs space-y-2">
              <label className="text-xs sm:text-sm font-bold text-neutral-800 block">
                Indicaciones especiales para la cocina (opcional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Papas bien crocantes, cremas aparte en táper, pechuga bien dorada..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-[#E6192B] focus:ring-2 focus:ring-red-500/10 transition-all"
              />
            </div>

            {/* Allergen link */}
            <div className="text-xs sm:text-sm text-neutral-500 pb-4">
              <p>
                ¿Tienes alguna alergia alimentaria?{' '}
                <button
                  type="button"
                  onClick={() => setShowAllergens(!showAllergens)}
                  className="text-[#E6192B] font-bold underline cursor-pointer hover:text-red-700"
                >
                  Ver información de alérgenos
                </button>
              </p>

              {showAllergens && (
                <div className="mt-3 p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                    <span>Información de Alérgenos:</span>
                  </div>
                  <p>
                    Nuestros productos se preparan en cocina compartida y pueden contener o entrar en contacto con trazas de gluten (trigo), huevos, lácteos, soya, maní y ajonjolí.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Action Bar inside Right Column */}
          <div className="bg-white border-t border-neutral-200 px-4 sm:px-8 lg:px-12 py-4 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] z-30 flex items-center gap-4">
            
            {/* Quantity Stepper Pill */}
            <div className="flex items-center gap-2.5 bg-neutral-100 px-3.5 py-2 rounded-2xl border border-neutral-200 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 rounded-xl bg-white shadow-2xs flex items-center justify-center text-neutral-700 hover:text-neutral-900 disabled:opacity-30 active:scale-95 transition-all cursor-pointer font-bold"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className="text-lg font-black text-neutral-900 min-w-[24px] text-center font-mono">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-xl bg-white shadow-2xs flex items-center justify-center text-neutral-700 hover:text-neutral-900 active:scale-95 transition-all cursor-pointer font-bold"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Add to Cart CTA Button */}
            {item.isAvailable === false ? (
              <button
                type="button"
                disabled
                className="flex-1 py-4 px-6 rounded-2xl font-bold text-base bg-neutral-100 text-neutral-400 cursor-not-allowed text-center"
              >
                Producto Agotado
              </button>
            ) : (
              <button
                id="product-detail-add-btn"
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-between shadow-lg shadow-red-500/20 active:scale-98 transition-all cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#E6192B] hover:bg-[#c91222] text-white'
                }`}
              >
                <span className="truncate pr-2 font-bold text-base sm:text-lg">
                  {isAdded ? '✓ ¡Agregado a tu pedido!' : 'Agregar a mi pedido'}
                </span>
                <span className="text-base sm:text-lg font-black whitespace-nowrap font-mono bg-black/15 px-3 py-1 rounded-xl">
                  S/ {totalPrice}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
