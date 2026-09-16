import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Store,
  Utensils,
  CreditCard,
  Send,
  Sparkles,
  Phone,
  AlertCircle
} from 'lucide-react';
import { useCart, CartItem } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/menuData';

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
        if (item.selectedSauces && item.selectedSauces.length > 0) {
          details += `\n   Salsas: ${item.selectedSauces.join(', ')}`;
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl bg-neutral-50 border-l border-neutral-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#E6192B]" />
            <h3 className="text-lg font-black text-neutral-900 font-heading">
              {step === 'cart' ? 'Tu Pedido Buchisapa' : 'Datos para la Entrega'}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setStep('cart');
            }}
            className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                <ShoppingBag className="w-10 h-10 text-neutral-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-neutral-900 mb-1">Tu carrito está vacío</h4>
                <p className="text-xs text-neutral-600">
                  Explora nuestros platos amazónicos, caldos, hamburguesas y broaster para llenarlo de sabor.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-xs font-black rounded-xl transition-colors cursor-pointer"
              >
                Ver Menú y Platos
              </button>
            </div>
          ) : step === 'cart' ? (
            /* STEP 1: REVIEW CART ITEMS */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-600 pb-2 border-b border-neutral-200">
                <span>{cart.length} {cart.length === 1 ? 'plato en pedido' : 'platos en pedido'}</span>
                <button
                  onClick={clearCart}
                  className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vaciar</span>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cart.map((cartItem) => (
                  <div
                    key={cartItem.cartId}
                    className="p-3 bg-white border border-neutral-200 rounded-2xl space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex gap-3">
                        <img
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          className="w-14 h-14 object-cover rounded-xl shrink-0 bg-neutral-200"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900 leading-tight">
                            {cartItem.item.name}
                          </h4>
                          <span className="text-xs font-black text-[#E6192B]">
                            S/ {(cartItem.item.price * cartItem.quantity).toFixed(2)}
                          </span>
                          {cartItem.selectedOption && (
                            <p className="text-[11px] text-amber-700/90 font-medium">
                              {cartItem.selectedOption}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(cartItem.cartId)}
                        className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                        title="Eliminar plato"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Sauces & notes summary */}
                    {cartItem.selectedSauces && cartItem.selectedSauces.length > 0 && (
                      <div className="text-[11px] text-neutral-600 bg-neutral-50/60 p-2 rounded-lg">
                        <span className="text-neutral-700 font-semibold">Salsas: </span>
                        {cartItem.selectedSauces.join(', ')}
                        {cartItem.notes && (
                          <div className="text-amber-700/80 mt-1">
                            <span className="font-semibold">Nota: </span>
                            {cartItem.notes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-neutral-500">Cantidad:</span>
                      <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(cartItem.cartId, cartItem.quantity - 1)}
                          className="p-1 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-neutral-900">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(cartItem.cartId, cartItem.quantity + 1)}
                          className="p-1 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* STEP 2: CHECKOUT FORM */
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Order Mode Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Modalidad de Entrega
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      orderType === 'delivery'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-700'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      orderType === 'pickup'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-700'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Para Llevar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('dinein')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      orderType === 'dinein'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-700'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-800'
                    }`}
                  >
                    <Utensils className="w-4 h-4" />
                    <span>En Salón</span>
                  </button>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-neutral-600">
                    Nombre completo <span className="text-[#E6192B]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Carlos Ramos"
                    className="w-full mt-1 bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-600">
                    Teléfono / WhatsApp <span className="text-[#E6192B]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ej: 987 654 321"
                    className="w-full mt-1 bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Conditional: Delivery Address or Table */}
              {orderType === 'delivery' && (
                <div className="space-y-3 bg-neutral-100 p-3.5 rounded-2xl border border-neutral-200">
                  <div>
                    <label className="text-xs font-bold text-neutral-600">
                      Dirección exacta en Ate <span className="text-[#E6192B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Calle / Av., Número, Urbanización"
                      className="w-full mt-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-600">
                      Referencia
                    </label>
                    <input
                      type="text"
                      value={deliveryReference}
                      onChange={(e) => setDeliveryReference(e.target.value)}
                      placeholder="Ej: Frente al parque, reja negra, altura paradero..."
                      className="w-full mt-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {orderType === 'dinein' && (
                <div className="bg-neutral-100 p-3.5 rounded-2xl border border-neutral-200">
                  <label className="text-xs font-bold text-neutral-600">
                    Número de Mesa en Salón (opcional)
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Ej: Mesa 4"
                    className="w-full mt-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* Payment Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('yape')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'yape'
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-neutral-200 text-neutral-600'
                    }`}
                  >
                    <span className="font-black text-purple-600">YAPE</span>
                    <span className="text-[11px] text-neutral-600">943 312 024</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('plin')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'plin'
                        ? 'bg-cyan-100 border-cyan-500 text-cyan-700'
                        : 'bg-white border-neutral-200 text-neutral-600'
                    }`}
                  >
                    <span className="font-black text-cyan-600">PLIN</span>
                    <span className="text-[11px] text-neutral-600">943 312 024</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('efectivo')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'efectivo'
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                        : 'bg-white border-neutral-200 text-neutral-600'
                    }`}
                  >
                    <span className="font-black text-emerald-600">EFECTIVO</span>
                    <span className="text-[11px] text-neutral-600">Contra entrega</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transferencia')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'transferencia'
                        ? 'bg-amber-100 border-amber-500 text-amber-700'
                        : 'bg-white border-neutral-200 text-neutral-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#E6192B]" />
                    <span className="text-[11px] text-neutral-600">BCP / BBVA</span>
                  </button>
                </div>

                {paymentMethod === 'efectivo' && (
                  <div className="pt-2">
                    <label className="text-[11px] text-neutral-600">
                      ¿Con qué monto pagarás? (para llevar tu vuelto)
                    </label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      placeholder="Ej: S/ 50 ó S/ 100"
                      className="w-full mt-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              {/* General order note */}
              <div>
                <label className="text-xs font-bold text-neutral-600">
                  Observaciones adicionales
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Ej: Tocar timbre 202, enviar servilletas extra..."
                  className="w-full mt-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="text-xs text-[#E6192B] hover:text-amber-700 font-semibold cursor-pointer"
                >
                  ← Volver a modificar platos
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer (Sticky Totals + Action Button) */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-neutral-200 space-y-3">
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-neutral-900 font-medium">S/ {cartSubtotal.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Costo de envío (Ate):</span>
                  <span className="text-neutral-900 font-medium">S/ {deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total a Pagar:</span>
                <span className="text-[#E6192B] font-mono">S/ {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                id="cart-continue-btn"
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <span>Continuar con la Entrega</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="cart-submit-whatsapp-btn"
                onClick={handleCheckoutSubmit}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-neutral-900 font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Confirmar Pedido por WhatsApp</span>
              </button>
            )}

            <p className="text-[11px] text-neutral-500 text-center">
              Al confirmar se enviará tu orden lista al WhatsApp del restaurante (+51 943 312 024)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
