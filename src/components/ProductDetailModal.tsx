import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, ChevronDown, ChevronUp, Check, ShieldAlert } from 'lucide-react';
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
    'Mayonesa',
    'Tártara',
    'Ají de Rocoto',
  ]);
  const [notes, setNotes] = useState('');
  const [showAllergens, setShowAllergens] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Generate dynamic customization sections based on item category
  const sections: CustomOptionSection[] = React.useMemo(() => {
    if (!item) return [];

    const list: CustomOptionSection[] = [];

    // 1. Primary choice (Sánguche / Presa / Término / Preparación)
    if (item.category === 'hamburguesas') {
      list.push({
        id: 'sanguche',
        title: 'Sánguche',
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
        'Chicha Pardos Personal (500ml)',
        'Botella Inca Kola Personal',
        'Botella Inca Kola sin azúcar Personal',
        'Botella Coca Cola Personal',
        'Botella Coca Cola sin azúcar Personal',
        'Refresco Natural de Cocona (500ml)',
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
        // Open the last section (Bebida) as shown in the screenshot
        if (sec.id === 'bebida') {
          initialOpen[sec.id] = true;
        } else {
          initialOpen[sec.id] = false;
        }
      });

      setSelectedChoices(defaults);
      setOpenSections(initialOpen);
      setSelectedSauces(['Mayonesa', 'Tártara', 'Ají de Rocoto']);
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
    }, 450);
  };

  const totalPrice = (item.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white min-h-screen flex flex-col justify-between">
      {/* Container max-w matching the exact mobile/desktop view */}
      <div className="w-full max-w-xl mx-auto flex-1 flex flex-col px-4 sm:px-6 py-4 pb-28">
        {/* 1. Top Volver Header (Exact Screenshot_20260918-001124_Chrome.png) */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-neutral-800 hover:text-[#E6192B] font-bold text-sm sm:text-base py-1 px-1 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span>Volver</span>
          </button>
        </div>

        {/* 2. Product Title & Quantity Controls Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h1 className="text-lg sm:text-xl font-black text-neutral-900 leading-snug font-heading flex-1">
            {item.name}
          </h1>

          {/* Inline Quantity Controls [-] 1 [+] */}
          <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-400 hover:text-neutral-700 disabled:opacity-30 transition-all cursor-pointer bg-white"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span className="text-sm sm:text-base font-bold text-neutral-800 min-w-[14px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-full border border-red-300 flex items-center justify-center text-red-500 hover:text-red-700 active:scale-95 transition-all cursor-pointer bg-white"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* 3. Big Product Image Full Width (Exact to Screenshot) */}
        <div className="w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden bg-neutral-100 mb-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-neutral-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 4. Description and Price Row */}
        <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-neutral-100">
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed flex-1 font-normal">
            {item.description}
          </p>
          <div className="text-right shrink-0">
            <span className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight whitespace-nowrap">
              S/ {item.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 5. Instruction Title Banner */}
        <div className="mb-3.5">
          <h2 className="text-sm sm:text-base font-black text-neutral-900 leading-tight font-heading">
            Por favor, elige todas las opciones necesarias para avanzar con tu pedido.
          </h2>
        </div>

        {/* 6. Accordion Customization Sections */}
        <div className="space-y-2.5 mb-5">
          {sections.map((sec) => {
            const isOpen = !!openSections[sec.id];
            const selectedValue = selectedChoices[sec.id];

            return (
              <div
                key={sec.id}
                className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden transition-all"
              >
                {/* Accordion Bar Header */}
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

                {/* Accordion Radio Options List (Screenshot_20260918-001128_Chrome.png) */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 space-y-3 border-t border-neutral-100 bg-white">
                    {sec.choices.map((choice) => {
                      const isSelected = selectedValue === choice;
                      return (
                        <label
                          key={choice}
                          onClick={() => handleSelectChoice(sec.id, choice)}
                          className="flex items-center gap-3 py-1 cursor-pointer group select-none"
                        >
                          {/* Circular Radio Indicator */}
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
                            className={`text-xs sm:text-sm leading-snug ${
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
              <div className="px-4 pb-4 pt-1 border-t border-neutral-100 bg-white">
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
          <div className="pt-2">
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

        {/* 7. Allergen Warning Text (Exact to Screenshot) */}
        <div className="pt-2 pb-3 text-xs text-neutral-600">
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

      {/* 8. Fixed Bottom Action Bar with Pill Button (Exact Screenshot_20260918-001128_Chrome.png) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 border-t border-neutral-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex justify-center">
        <div className="w-full max-w-md">
          <button
            id="product-detail-add-btn"
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-3.5 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-between shadow-md active:scale-98 transition-all cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#E6192B] hover:bg-[#c91222] text-white'
            }`}
          >
            {/* Left Quantity Circle Pill */}
            <span className="w-6 h-6 rounded-full bg-white/25 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {quantity}
            </span>

            {/* Center Label */}
            <span className="text-center font-bold px-2 truncate">
              {isAdded ? '¡Agregado al pedido!' : 'Agregar a mi pedido'}
            </span>

            {/* Right Total Price */}
            <span className="text-xs sm:text-sm font-black whitespace-nowrap">
              S/ {totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
