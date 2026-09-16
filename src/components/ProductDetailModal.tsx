import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, ShoppingBag, Flame, Sparkles } from 'lucide-react';
import { MenuItem, SAUCES_LIST } from '../data/menuData';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedSauces, setSelectedSauces] = useState<string[]>([
    "Mayonesa Casera",
    "Tártara Especial",
    "Ají de Cocona con Charapita"
  ]);
  const [notes, setNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setNotes('');
      setIsAdded(false);
      if (item.options && item.options.length > 0) {
        setSelectedOption(item.options[0].choices[0]);
      } else {
        setSelectedOption('');
      }
      // Default sauces
      setSelectedSauces(["Mayonesa Casera", "Tártara Especial", "Ají de Cocona con Charapita"]);
    }
  }, [item]);

  if (!item) return null;

  const toggleSauce = (sauce: string) => {
    if (selectedSauces.includes(sauce)) {
      setSelectedSauces(selectedSauces.filter(s => s !== sauce));
    } else {
      setSelectedSauces([...selectedSauces, sauce]);
    }
  };

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedOption, selectedSauces, notes);
    setIsAdded(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const totalPrice = (item.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-950/70 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Item Header Banner */}
        <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-neutral-950">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/40" />

          {item.badge && (
            <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{item.badge}</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                {item.name}
              </h3>
              <span className="text-2xl font-black text-amber-400">
                S/ {item.price.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Includes badge list */}
          {item.includes && item.includes.length > 0 && (
            <div className="bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800/80">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                ¿Qué incluye esta delicia?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-neutral-200">
                {item.includes.map((inc, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Options if any (e.g. Meat choices) */}
          {item.options && item.options.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {item.options[0].name} (Elige 1)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.options[0].choices.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setSelectedOption(choice)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedOption === choice
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span>{choice}</span>
                    {selectedOption === choice && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cremas / Salsas preference (very important in Peruvian fast food) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Salsas y Cremas Buchisapa
              </label>
              <span className="text-[11px] text-neutral-500">Selecciona las de tu gusto</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAUCES_LIST.map((sauce) => {
                const checked = selectedSauces.includes(sauce);
                return (
                  <button
                    key={sauce}
                    type="button"
                    onClick={() => toggleSauce(sauce)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                      checked
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-medium'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${checked ? 'bg-amber-400' : 'bg-neutral-700'}`} />
                    <span>{sauce}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Indicaciones especiales para la cocina
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Sin cebolla, papas bien doradas, salsa aparte..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer actions: Quantity + Add to Cart */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-4">
          {/* Quantity selector */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-40 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            id="modal-add-to-cart-btn"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-neutral-950" />
            <span>Agregar • S/ {totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
