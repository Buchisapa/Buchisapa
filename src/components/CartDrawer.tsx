import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Truck,
  Store,
  Utensils,
  CreditCard,
  Send,
  Sparkles,
  Phone,
  AlertCircle,
  Clock,
  CheckCircle2,
  MapPin,
  FileText,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useCart, CartItem } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/menuData';
import { checkBusinessHours } from '../lib/businessHours';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    createOrder
  } = useCart();

  const businessHours = checkBusinessHours();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup' | 'dinein'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryReference, setDeliveryReference] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'plin' | 'efectivo' | 'transferencia'>('yape');
  const [cashAmount, setCashAmount] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Lock body scroll when cart is open (Full Screen View)
  useEffect(() => {
    if (isCartOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const deliveryFee = orderType === 'delivery' ? RESTAURANT_INFO.deliveryFee : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Por favor escribe tu nombre completo.');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage('Por favor ingresa tu número de teléfono / WhatsApp.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Por favor ingresa la dirección para la entrega.');
      return;
    }

    // Save order in local orders system
    const savedOrder = createOrder({
      customerName,
      customerPhone,
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      deliveryReference: orderType === 'delivery' ? deliveryReference : undefined,
      tableNumber: orderType === 'dinein' ? tableNumber : undefined,
      paymentMethod,
      cashAmount: paymentMethod === 'efectivo' && cashAmount ? parseFloat(cashAmount) : undefined,
      items: cart,
      subtotal: cartSubtotal,
      deliveryFee,
      total: grandTotal,
      notes: orderNotes
    });

    // Build structured WhatsApp message
    let orderTypeText = '🛵 Delivery a Domicilio';
    if (orderType === 'pickup') orderTypeText = '🛍️ Para Llevar (Recojo en Local)';
    if (orderType === 'dinein') orderTypeText = `🍽️ Consumo en Salón (Mesa: ${tableNumber || 'Por asignar'})`;

    let paymentMethodText = '💜 Yape (943 312 024)';
    if (paymentMethod === 'plin') paymentMethodText = '💙 Plin (943 312 024)';
    if (paymentMethod === 'efectivo') {
      paymentMethodText = `💵 Efectivo ${cashAmount ? `(Paga con: S/ ${cashAmount} - requiere vuelto)` : '(Monto exacto)'}`;
    }
    if (paymentMethod === 'transferencia') paymentMethodText = '🏦 Transferencia BCP / BBVA';

    let itemsListText = cart
      .map((item) => {
        let details = `• ${item.quantity}x *${item.item.name}* (S/ ${(item.item.price * item.quantity).toFixed(2)})`;
        if (item.selectedOption) {
          details += `\n   Opción: ${item.selectedOption}`;
        }
        if (item.removedAccompaniments && item.removedAccompaniments.length > 0) {
          details += `\n   ⚠️ *Sin:* ${item.removedAccompaniments.join(', ')}`;
        } else if (item.item.includes && item.item.includes.length > 0) {
          details += `\n   ✓ *Acompañamientos:* Con todo`;
        }
        if (item.selectedSauces && item.selectedSauces.length > 0) {
          details += `\n   Salsas: ${item.selectedSauces.join(', ')}`;
        } else if (item.item.category !== 'bebidas' && item.item.category !== 'refrescos') {
          details += `\n   Salsas: Sin cremas`;
        }
        if (item.notes) {
          details += `\n   Nota: ${item.notes}`;
        }
        return details;
      })
      .join('\n');

    let text = `👋 *¡HOLA BUCHISAPA! DESEO REALIZAR UN PEDIDO*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🔖 *Orden:* #${savedOrder.orderNumber}\n`;
    text += `👤 *Cliente:* ${customerName}\n`;
    text += `📱 *Teléfono:* ${customerPhone}\n`;
    text += `📍 *Modalidad:* ${orderTypeText}\n`;
    if (orderType === 'delivery') {
      text += `🏠 *Dirección:* ${deliveryAddress}\n`;
      if (deliveryReference) text += `🧭 *Referencia:* ${deliveryReference}\n`;
    }
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📋 *PRODUCTOS:* \n${itemsListText}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 *Subtotal:* S/ ${cartSubtotal.toFixed(2)}\n`;
    if (orderType === 'delivery') {
      text += `🛵 *Delivery:* S/ ${deliveryFee.toFixed(2)}\n`;
    }
    text += `🔥 *TOTAL A PAGAR: S/ ${grandTotal.toFixed(2)}*\n`;
    text += `💳 *Método de Pago:* ${paymentMethodText}\n`;
    if (orderNotes) {
      text += `📝 *Observación general:* ${orderNotes}\n`;
    }
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `¡Muchas gracias! Quedo atento a la confirmación.`;

    const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=${encodeURIComponent(text)}`;

    setIsCartOpen(false);
    setStep('cart');
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 w-full h-full bg-neutral-100 flex flex-col overflow-hidden animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      {/* Top Header Bar (Full width edge-to-edge) */}
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3.5 sm:py-4 border-b border-neutral-200 bg-white shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (step === 'checkout') {
                setStep('cart');
              } else {
                setIsCartOpen(false);
              }
            }}
            className="inline-flex items-center gap-2 text-neutral-800 hover:text-[#E6192B] font-extrabold text-sm sm:text-base py-2 px-3 rounded-xl hover:bg-neutral-100 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span className="hidden sm:inline">
              {step === 'checkout' ? 'Volver a revisar platos' : 'Seguir comprando'}
            </span>
            <span className="sm:hidden">
              {step === 'checkout' ? 'Atrás' : 'Volver'}
            </span>
          </button>
        </div>

        {/* Center Step Indicators */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#E6192B] shadow-2xs">
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 id="cart-title" className="text-sm sm:text-base font-black text-neutral-900 font-heading leading-none">
                Tu Pedido Buchisapa
              </h2>
              <p className="text-[11px] text-neutral-500 hidden sm:block mt-0.5">
                {step === 'cart' ? 'Paso 1: Lista de platos y adicionales' : 'Paso 2: Datos de envío y método de pago'}
              </p>
            </div>
          </div>

          {cart.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 ml-4 bg-neutral-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  step === 'cart'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                1. Platos ({cart.length})
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  step === 'checkout'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                2. Entrega y Pago
              </button>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors font-medium cursor-pointer"
              title="Vaciar todos los platos del carrito"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar pedido</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsCartOpen(false);
              setStep('cart');
            }}
            className="p-2 sm:p-2.5 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Cerrar pedido"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      {/* Main Full-Screen Content */}
      <div className="flex-1 overflow-y-auto bg-neutral-100">
        {cart.length === 0 ? (
          /* Empty Cart View */
          <div className="max-w-xl mx-auto min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-400">
              <ShoppingBag className="w-12 h-12 text-[#E6192B]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-neutral-900 font-heading">
                Tu pedido está vacío
              </h3>
              <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                Aún no has seleccionado ningún plato. Explora nuestras hamburguesas artesanales, broaster crocante, caldos y platos amazónicos.
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="px-8 py-3.5 bg-gradient-to-r from-[#E6192B] to-red-700 hover:from-red-600 hover:to-red-800 text-white text-sm font-black rounded-2xl shadow-lg shadow-red-600/20 active:scale-98 transition-all cursor-pointer"
            >
              Explorar la Carta y Pedir
            </button>
          </div>
        ) : (
          /* Two-Column Full-Screen Layout on Desktop */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* Left Column (Platos List or Checkout Form) - 7 cols on desktop */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-5">
                {/* Notice if outside business hours */}
                {!businessHours.isOpen && (
                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3.5 text-amber-900 shadow-xs">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm space-y-1">
                      <p className="font-bold text-amber-950 flex items-center gap-1.5">
                        <span>⏰ Fuera del Horario de Atención habitual</span>
                      </p>
                      <p className="text-amber-800 leading-relaxed">
                        Hora actual en Tarapoto: <strong className="text-amber-950">{businessHours.currentTimeString}</strong>. Horario de atención: <strong className="text-amber-950">{businessHours.scheduleDescription}</strong>.
                      </p>
                      <p className="text-xs text-amber-700 font-medium pt-0.5">
                        ℹ️ Puedes realizar tu pedido como <strong>pre-orden</strong>. La cocina de Buchisapa lo procesará apenas abra el turno.
                      </p>
                    </div>
                  </div>
                )}

                {step === 'cart' ? (
                  /* =========================================================================
                     STEP 1: LIST OF DISHES & DETAILS
                     ========================================================================= */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-neutral-800 uppercase tracking-wider">
                          Platos seleccionados ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                        </span>
                      </div>
                      <button
                        onClick={clearCart}
                        className="sm:hidden text-xs text-rose-500 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Vaciar</span>
                      </button>
                    </div>

                    {/* Cards for each item */}
                    <div className="space-y-3.5">
                      {cart.map((cartItem) => (
                        <div
                          key={cartItem.cartId}
                          className="p-4 sm:p-5 bg-white border border-neutral-200/90 rounded-2xl shadow-xs hover:border-neutral-300 transition-all space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3 sm:gap-4">
                            <div className="flex gap-3 sm:gap-4 items-start">
                              <img
                                src={cartItem.item.image}
                                alt={cartItem.item.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0 bg-neutral-100 border border-neutral-200/80 shadow-2xs"
                              />
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    {cartItem.item.category.replace('-', ' ')}
                                  </span>
                                </div>
                                <h4 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug">
                                  {cartItem.item.name}
                                </h4>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-sm sm:text-base font-black text-[#E6192B]">
                                    S/ {(cartItem.item.price * cartItem.quantity).toFixed(2)}
                                  </span>
                                  {cartItem.quantity > 1 && (
                                    <span className="text-xs text-neutral-500 font-medium">
                                      (S/ {cartItem.item.price.toFixed(2)} c/u)
                                    </span>
                                  )}
                                </div>
                                {cartItem.selectedOption && (
                                  <p className="text-xs text-amber-800 font-medium">
                                    Opción: {cartItem.selectedOption}
                                  </p>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => removeFromCart(cartItem.cartId)}
                              className="text-neutral-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Eliminar este plato"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>

                          {/* Accompaniments, Sauces & Notes summary */}
                          <div className="text-xs text-neutral-700 bg-neutral-50 p-3 sm:p-3.5 rounded-xl space-y-1.5 border border-neutral-200/80">
                            {/* Accompaniments */}
                            {cartItem.removedAccompaniments && cartItem.removedAccompaniments.length > 0 ? (
                              <div className="text-amber-800 font-semibold flex items-center gap-1.5">
                                <span>⚠️ Sin:</span>
                                <span className="font-normal">{cartItem.removedAccompaniments.join(', ')}</span>
                              </div>
                            ) : cartItem.item.includes && cartItem.item.includes.length > 0 ? (
                              <div className="text-emerald-700 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Con todos sus acompañamientos ({cartItem.item.includes.join(', ')})</span>
                              </div>
                            ) : null}

                            {/* Sauces */}
                            {cartItem.selectedSauces && cartItem.selectedSauces.length > 0 ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-neutral-900 font-bold">Cremas:</span>
                                <span>{cartItem.selectedSauces.join(', ')}</span>
                              </div>
                            ) : cartItem.item.category !== 'bebidas' && cartItem.item.category !== 'refrescos' ? (
                              <div className="text-neutral-500 italic">
                                Sin cremas seleccionadas
                              </div>
                            ) : null}

                            {/* Kitchen Note */}
                            {cartItem.notes && (
                              <div className="text-amber-900 pt-1 border-t border-neutral-200 mt-1 flex items-start gap-1">
                                <span className="font-bold shrink-0">Nota cocina:</span>
                                <span>{cartItem.notes}</span>
                              </div>
                            )}
                          </div>

                          {/* Bottom Row: Quantity increment/decrement */}
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs sm:text-sm font-medium text-neutral-600">
                              Cantidad a preparar:
                            </span>
                            <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-xl p-1 gap-1">
                              <button
                                onClick={() => updateQuantity(cartItem.cartId, cartItem.quantity - 1)}
                                className="w-8 h-8 rounded-lg bg-white hover:bg-neutral-200 text-neutral-800 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                aria-label="Disminuir cantidad"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-black text-neutral-900 font-mono">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(cartItem.cartId, cartItem.quantity + 1)}
                                className="w-8 h-8 rounded-lg bg-[#E6192B] hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add More Items button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCartOpen(false)}
                        className="w-full py-3 border-2 border-dashed border-neutral-300 hover:border-[#E6192B] text-neutral-700 hover:text-[#E6192B] bg-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar más platos de la carta</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* =========================================================================
                     STEP 2: CHECKOUT FORM & DETAILS
                     ========================================================================= */
                  <form onSubmit={handleCheckoutSubmit} className="space-y-5 bg-white p-5 sm:p-7 rounded-2xl border border-neutral-200 shadow-xs">
                    <div className="border-b border-neutral-200 pb-3">
                      <h3 className="text-base sm:text-lg font-black text-neutral-900 font-heading">
                        Completa tus datos de entrega y pago
                      </h3>
                      <p className="text-xs text-neutral-500">
                        La orden se generará y se enviará directamente al WhatsApp del restaurante.
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs sm:text-sm flex items-center gap-2.5">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span className="font-medium">{errorMessage}</span>
                      </div>
                    )}

                    {/* 1. Modalidad de Entrega */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-neutral-800 uppercase tracking-wider block">
                        1. Modalidad de Entrega <span className="text-[#E6192B]">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => setOrderType('delivery')}
                          className={`p-3 sm:p-4 rounded-2xl border text-xs sm:text-sm font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                            orderType === 'delivery'
                              ? 'bg-red-50 border-[#E6192B] text-[#E6192B] shadow-xs ring-2 ring-red-500/20'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          <Truck className="w-5 h-5" />
                          <span>Delivery</span>
                          <span className="text-[10px] font-normal text-neutral-500">Ate y alrededores</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setOrderType('pickup')}
                          className={`p-3 sm:p-4 rounded-2xl border text-xs sm:text-sm font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                            orderType === 'pickup'
                              ? 'bg-red-50 border-[#E6192B] text-[#E6192B] shadow-xs ring-2 ring-red-500/20'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          <Store className="w-5 h-5" />
                          <span>Para Llevar</span>
                          <span className="text-[10px] font-normal text-neutral-500">Recojo en local</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setOrderType('dinein')}
                          className={`p-3 sm:p-4 rounded-2xl border text-xs sm:text-sm font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                            orderType === 'dinein'
                              ? 'bg-red-50 border-[#E6192B] text-[#E6192B] shadow-xs ring-2 ring-red-500/20'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          <Utensils className="w-5 h-5" />
                          <span>En Salón</span>
                          <span className="text-[10px] font-normal text-neutral-500">Mesa de restaurante</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. Customer Contact */}
                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-black text-neutral-800 uppercase tracking-wider block">
                        2. Datos del Cliente
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-neutral-700 block mb-1">
                            Nombre y Apellido <span className="text-[#E6192B]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#E6192B] focus:bg-white transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-neutral-700 block mb-1">
                            Teléfono / WhatsApp <span className="text-[#E6192B]">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="Ej: 987 654 321"
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#E6192B] focus:bg-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Address or Table */}
                    {orderType === 'delivery' && (
                      <div className="space-y-3 pt-2 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                          <MapPin className="w-4 h-4 text-[#E6192B]" />
                          <span>Dirección de Entrega en Ate</span>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-neutral-700 block mb-1">
                            Dirección exacta <span className="text-[#E6192B]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Calle / Av., Número, Manzana, Lote, Urbanización"
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#E6192B]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-neutral-700 block mb-1">
                            Referencia de llegada
                          </label>
                          <input
                            type="text"
                            value={deliveryReference}
                            onChange={(e) => setDeliveryReference(e.target.value)}
                            placeholder="Ej: Frente al parque principal, portón negro, altura paradero..."
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#E6192B]"
                          />
                        </div>
                      </div>
                    )}

                    {orderType === 'dinein' && (
                      <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                        <label className="text-xs font-bold text-neutral-700 block">
                          Número de Mesa en el Restaurante (opcional)
                        </label>
                        <input
                          type="text"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          placeholder="Ej: Mesa 5"
                          className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#E6192B]"
                        />
                      </div>
                    )}

                    {/* 4. Payment Method */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-black text-neutral-800 uppercase tracking-wider block">
                        3. Método de Pago <span className="text-[#E6192B]">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('yape')}
                          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            paymentMethod === 'yape'
                              ? 'bg-purple-50 border-purple-500 text-purple-800 ring-2 ring-purple-500/20'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          <span className="font-black text-purple-600 text-sm">YAPE</span>
                          <span className="text-[10px] text-neutral-500">943 312 024</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('plin')}
                          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            paymentMethod === 'plin'
                              ? 'bg-cyan-50 border-cyan-500 text-cyan-800 ring-2 ring-cyan-500/20'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          <span className="font-black text-cyan-600 text-sm">PLIN</span>
                          <span className="text-[10px] text-neutral-500">943 312 024</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('efectivo')}
                          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            paymentMethod === 'efectivo'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          <span className="font-black text-emerald-600 text-sm">EFECTIVO</span>
                          <span className="text-[10px] text-neutral-500">Contra entrega</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('transferencia')}
                          className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                            paymentMethod === 'transferencia'
                              ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 text-amber-600" />
                          <span className="text-[10px] text-neutral-500">BCP / BBVA</span>
                        </button>
                      </div>

                      {paymentMethod === 'efectivo' && (
                        <div className="pt-2 bg-emerald-50/50 p-3 rounded-xl border border-emerald-200">
                          <label className="text-xs font-bold text-emerald-950 block mb-1">
                            ¿Con qué monto pagarás en efectivo? (para llevar tu vuelto)
                          </label>
                          <input
                            type="number"
                            value={cashAmount}
                            onChange={(e) => setCashAmount(e.target.value)}
                            placeholder="Ej: S/ 50 ó S/ 100"
                            className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      )}
                    </div>

                    {/* 5. Order Notes */}
                    <div className="pt-2">
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Observaciones adicionales para cocina / repartidor
                      </label>
                      <input
                        type="text"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Ej: Tocar timbre 202, enviar servilletas extra, salsas en envase separado..."
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#E6192B]"
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Right Column (Sticky Order Summary Card) - 5 cols on desktop */}
              <div className="lg:col-span-5 xl:col-span-4 sticky top-6 space-y-4">
                <div className="bg-white rounded-3xl border border-neutral-200 p-5 sm:p-6 shadow-sm space-y-5">
                  <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
                    <h3 className="text-base font-black text-neutral-900 font-heading">
                      Resumen del Pedido
                    </h3>
                    <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2.5 text-xs sm:text-sm text-neutral-600">
                    <div className="flex justify-between">
                      <span>Subtotal de platos:</span>
                      <span className="text-neutral-900 font-bold font-mono">S/ {cartSubtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Modalidad:</span>
                      <span className="text-neutral-800 font-semibold capitalize">
                        {orderType === 'delivery' ? '🛵 Delivery' : orderType === 'pickup' ? '🛍️ Para Llevar' : '🍽️ En Salón'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Costo de envío (Ate):</span>
                      <span className="font-bold font-mono text-neutral-900">
                        {orderType === 'delivery' ? `S/ ${deliveryFee.toFixed(2)}` : 'Gratis'}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                      <div>
                        <span className="text-sm font-black text-neutral-900 block">Total a Pagar:</span>
                        <span className="text-[10px] text-neutral-400 font-medium">IGV incluido</span>
                      </div>
                      <span className="text-2xl font-black text-[#E6192B] font-mono">
                        S/ {grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  {step === 'cart' ? (
                    <button
                      id="cart-continue-btn"
                      onClick={() => setStep('checkout')}
                      className="w-full py-4 px-5 bg-gradient-to-r from-[#E6192B] to-red-700 hover:from-red-600 hover:to-red-800 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 active:scale-98 transition-all cursor-pointer"
                    >
                      <span>Continuar con la Entrega</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      id="cart-submit-whatsapp-btn"
                      onClick={handleCheckoutSubmit}
                      className="w-full py-4 px-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-neutral-950 font-black text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-98 transition-all cursor-pointer"
                    >
                      <Send className="w-5 h-5" />
                      <span>Confirmar Pedido por WhatsApp</span>
                    </button>
                  )}

                  {/* WhatsApp note & guarantees */}
                  <div className="pt-2 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-500">
                    <p className="flex items-center gap-2 text-neutral-600">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Pedido directo a cocina (+51 943 312 024)</span>
                    </p>
                    <p className="text-center text-neutral-400">
                      Al confirmar se enviará la orden formateada con todos los detalles al WhatsApp de Buchisapa.
                    </p>
                  </div>
                </div>

                {/* Quick info card about Buchisapa */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs text-neutral-600 space-y-1.5">
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Sabor 100% Selva y Tradición</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-neutral-500">
                    Nuestros platos se preparan al momento con insumos traídos de la selva y empaques térmicos sellados.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
