import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ChevronDown, ChevronUp, Check, Info, ShieldAlert } from 'lucide-react';
import { MenuItem, SAUCES_LIST } from '../data/menuData';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

interface CustomOptionSection {
  id: string;
  title: string;
  required: boolean;
  choices: string[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [selectedSauces, setSelectedSauces] = useState<string[]>([
    'Mayonesa Casera',
    'Tártara Especial',
    'Ají de Pollería',
  ]);
  const [notes, setNotes] = useState('');
  const [showAllergens, setShowAllergens] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Derive customized option sections based on the selected item's category/name
  const sections: CustomOptionSection[] = React.useMemo(() => {
    if (!item) return [];

    const list: CustomOptionSection[] = [];

    // 1. Primary choice (Sánguche / Presa / Término / Preparación)
    if (item.category === 'hamburguesas') {
      list.push({
        id: 'sanguche',
        title: 'Sánguche / Pan',
        required: true,
        choices: [
          'Pan Brioche Brasa',
          'Pan Clásico Tostado',
          'Pan Integral de Granos',
        ],
      });
    } else if (item.category === 'broaster') {
      list.push({
        id: 'presa',
        title: 'Presa Broaster',
        required: true,
        choices: [
          'Pecho Broaster Crocante',
          'Pierna Broaster Crocante',
          'Encuentro Broaster Jugoso',
        ],
      });
    } else if (item.category === 'amazonicos') {
      list.push({
        id: 'guarnicion_selva',
        title: 'Preparación / Estilo',
        required: true,
        choices: [
          'Tacacho Tradicional con Cecina',
          'Plátano Bellaco Frito con Cecina',
          'Yuca Frita Amazónica',
        ],
      });
    } else if (item.category === 'alitas') {
      list.push({
        id: 'salsa_alitas',
        title: 'Sabor de Baño',
        required: true,
        choices: [
          'Salsa BBQ Ahumada Artesanal',
          'Salsa Acevichada Especial',
          'Alitas Crocantes Naturales',
        ],
      });
    } else if (item.options && item.options.length > 0) {
      list.push({
        id: 'opcion_principal',
        title: item.options[0].name,
        required: true,
        choices: item.options[0].choices,
      });
    }

    // 2. Complemento / Guarnición
    if (item.category !== 'bebidas' && item.category !== 'refrescos') {
      list.push({
        id: 'complemento',
        title: 'Complemento',
        required: true,
        choices: [
          'Papas Fritas (1 Ají y 1 Mayonesa)',
          'Papas Doradas Nativas',
          'Ensalada Fresca de la Casa',
          'Yuca Frita Crocante',
        ],
      });
    }

    // 3. Bebida
    list.push({
      id: 'bebida',
      title: 'Bebida',
      required: true,
      choices: [
        'Chicha Buchisapa Personal (500ml)',
        'Refresco Natural de Cocona (500ml)',
        'Botella Inca Kola Personal',
        'Botella Inca Kola sin azúcar Personal',
        'Botella Coca Cola Personal',
        'Botella Coca Cola sin azúcar Personal',
        'Refresco Natural de Maracuyá (500ml)',
        'Sin bebida adicional',
      ],
    });

    return list;
  }, [item]);

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setNotes('');
      setIsAdded(false);
      setShowAllergens(false);

      // Default selections for each section
      const defaults: Record<string, string> = {};
      const initialOpen: Record<string, boolean> = {};

      sections.forEach((sec, idx) => {
        defaults[sec.id] = sec.choices[0];
        // Open the last required section or first section by default like in Pardos
        if (sec.id === 'bebida' || idx === 0) {
          initialOpen[sec.id] = true;
        } else {
          initialOpen[sec.id] = false;
        }
      });

      setSelectedChoices(defaults);
      setOpenSections(initialOpen);
      setSelectedSauces(['Mayonesa Casera', 'Tártara Especial', 'Ají de Pollería']);
    }
  }, [item, sections]);

  if (!item) return null;

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleSelectChoice = (sectionId: string, choice: string) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [sectionId]: choice,
    }));
  };

  const toggleSauce = (sauce: string) => {
    if (selectedSauces.includes(sauce)) {
      setSelectedSauces(selectedSauces.filter((s) => s !== sauce));
    } else {
      setSelectedSauces([...selectedSauces, sauce]);
    }
  };

  const handleAddToCart = () => {
    const combinedOption = Object.entries(selectedChoices)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ');

    addToCart(item, quantity, combinedOption, selectedSauces, notes);
    setIsAdded(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const totalPrice = (item.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] border border-neutral-100">
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 line-clamp-1">
              {item.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Top Product Summary */}
          <div className="flex gap-3 items-center pb-3 border-b border-neutral-100">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 bg-neutral-100 border border-neutral-100 shadow-xs"
            />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                {item.name}
              </h3>
              <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-snug">
                {item.description}
              </p>
              <span className="text-base sm:text-lg font-bold text-neutral-900 block mt-1">
                S/{item.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Prompt Instruction (Exact match to screenshot) */}
          <div className="pt-1">
            <h4 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
              Por favor, elige todas las opciones necesarias para avanzar con tu pedido.
            </h4>
          </div>

          {/* Accordion Customization Sections */}
          <div className="space-y-2.5">
            {sections.map((sec) => {
              const isOpen = !!openSections[sec.id];
              const selectedValue = selectedChoices[sec.id];

              return (
                <div
                  key={sec.id}
                  className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden transition-all"
                >
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleSection(sec.id)}
                    className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-neutral-50/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center flex-wrap gap-1.5 pr-2">
                      <span className="font-bold text-sm sm:text-base text-neutral-900">
                        {sec.title}:
                      </span>
                      {isOpen ? (
                        <span className="bg-neutral-400 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                          {sec.required ? 'Obligatorio' : 'Opcional'}
                        </span>
                      ) : (
                        selectedValue && (
                          <span className="text-emerald-700 font-semibold text-xs sm:text-sm">
                            ({selectedValue})
                          </span>
                        )
                      )}
                    </div>

                    <div className="shrink-0 text-neutral-800">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Choices List */}
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 space-y-2.5 border-t border-neutral-100 bg-neutral-50/40">
                      {sec.choices.map((choice) => {
                        const isSelected = selectedValue === choice;
                        return (
                          <label
                            key={choice}
                            onClick={() => handleSelectChoice(sec.id, choice)}
                            className="flex items-center gap-3 py-1.5 cursor-pointer group"
                          >
                            {/* Custom Radio Circle */}
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                                isSelected
                                  ? 'border-neutral-900 bg-white'
                                  : 'border-neutral-300 group-hover:border-neutral-400 bg-white'
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                              )}
                            </div>
                            <span
                              className={`text-xs sm:text-sm leading-tight select-none ${
                                isSelected
                                  ? 'text-neutral-900 font-medium'
                                  : 'text-neutral-700 font-normal'
                              }`}
                            >
                              {choice}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Salsas y Cremas Section */}
            <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setOpenSections((p) => ({ ...p, salsas: !p.salsas }))
                }
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-neutral-50/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center flex-wrap gap-1.5 pr-2">
                  <span className="font-bold text-sm sm:text-base text-neutral-900">
                    Salsas y Cremas:
                  </span>
                  {!openSections.salsas ? (
                    <span className="text-emerald-700 font-semibold text-xs sm:text-sm">
                      ({selectedSauces.length} seleccionadas)
                    </span>
                  ) : (
                    <span className="bg-neutral-300 text-neutral-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                      Opcional
                    </span>
                  )}
                </div>
                <div className="shrink-0 text-neutral-800">
                  {openSections.salsas ? (
                    <ChevronUp className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                  )}
                </div>
              </button>

              {openSections.salsas && (
                <div className="px-4 pb-4 pt-1 border-t border-neutral-100 bg-neutral-50/40">
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {SAUCES_LIST.map((sauce) => {
                      const isChecked = selectedSauces.includes(sauce);
                      return (
                        <button
                          key={sauce}
                          type="button"
                          onClick={() => toggleSauce(sauce)}
                          className={`text-left px-2.5 py-2 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? 'bg-red-50 border-[#E6192B] text-neutral-900'
                              : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                          }`}
                        >
                          <span className="line-clamp-1">{sauce}</span>
                          {isChecked && (
                            <Check className="w-3.5 h-3.5 text-[#E6192B] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Special Instructions Note Input */}
            <div className="pt-1">
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Indicaciones especiales para la cocina
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Sin ensalada, papas bien doradas..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-neutral-400 transition-all"
              />
            </div>
          </div>

          {/* Allergen Notice (Exact to Screenshot) */}
          <div className="pt-2 pb-1 text-xs text-neutral-600">
            <p>
              Si tienes alguna alergia por favor revisa nuestra{' '}
              <button
                type="button"
                onClick={() => setShowAllergens(!showAllergens)}
                className="text-[#E6192B] font-semibold underline cursor-pointer hover:text-red-700"
              >
                Carta de Alérgenos
              </button>
            </p>

            {showAllergens && (
              <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs space-y-1 animate-in fade-in duration-150">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Información de Alérgenos Buchisapa:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Nuestros productos pueden contener o entrar en contacto con
                  gluten (trigo), huevos (mayonesas), lácteos (queso), soya y
                  ajonjolí. Si tienes requerimientos especiales, indícalo en las
                  notas.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom Action Bar with Pill Button (Exact Pardos Style) */}
        <div className="sticky bottom-0 z-30 bg-white px-4 py-3 border-t border-neutral-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center bg-neutral-100 rounded-2xl p-1 shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="p-1.5 rounded-xl hover:bg-neutral-200 text-neutral-700 disabled:opacity-30 transition-colors cursor-pointer"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className="w-7 text-center text-xs font-bold text-neutral-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 rounded-xl hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Floating Red Pill Button */}
            <button
              id="modal-add-to-cart-btn"
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-between shadow-md active:scale-98 transition-all cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#E6192B] hover:bg-[#c91222] text-white'
              }`}
            >
              {/* Quantity indicator circle */}
              <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {quantity}
              </span>

              {/* Text */}
              <span className="text-center font-bold px-2">
                {isAdded ? '¡Agregado al pedido!' : 'Agregar a mi pedido'}
              </span>

              {/* Total Price */}
              <span className="text-xs sm:text-sm font-black whitespace-nowrap">
                S/ {totalPrice}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

