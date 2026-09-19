import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Clock,
  MessageCircle,
  Phone,
  Printer,
  Trash2,
  X,
  User,
  MapPin,
  CheckCircle,
  Truck,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { useCart, Order } from '../../context/CartContext';

interface AdminOrdersTabProps {
  onPrintTicket: (order: Order) => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({ onPrintTicket }) => {
  const {
    orders,
    updateOrderStatus,
    deleteOrder,
    clearOrdersHistory,
    menuItems,
    storeSettings,
    createOrder
  } = useCart();

  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('todos');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);

  const [manualOrderData, setManualOrderData] = useState({
    customerName: '',
    customerPhone: '',
    orderType: 'delivery' as 'delivery' | 'pickup' | 'dinein',
    deliveryAddress: '',
    deliveryReference: '',
    tableNumber: '',
    paymentMethod: 'yape' as 'yape' | 'plin' | 'efectivo',
    notes: '',
    selectedDishId: menuItems[0]?.id || '',
    quantity: 1
  });

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = orderStatusFilter === 'todos' || order.status === orderStatusFilter;
      const query = orderSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerPhone.includes(query) ||
        order.id.toLowerCase().includes(query) ||
        `#${order.orderNumber}`.includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  const handleCreateManualOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dish = menuItems.find(m => m.id === manualOrderData.selectedDishId) || menuItems[0];
    if (!dish) return;

    const subtotal = dish.price * manualOrderData.quantity;
    const deliveryFee = manualOrderData.orderType === 'delivery' ? storeSettings.deliveryFee : 0;
    const total = subtotal + deliveryFee;

    createOrder({
      customerName: manualOrderData.customerName || 'Cliente en Mostrador',
      customerPhone: manualOrderData.customerPhone || '999999999',
      orderType: manualOrderData.orderType,
      deliveryAddress: manualOrderData.deliveryAddress,
      deliveryReference: manualOrderData.deliveryReference,
      tableNumber: manualOrderData.tableNumber,
      paymentMethod: manualOrderData.paymentMethod,
      items: [
        {
          cartId: `manual-${Date.now()}`,
          item: dish,
          quantity: manualOrderData.quantity,
          selectedAccompaniments: dish.includes || [],
          removedAccompaniments: [],
          selectedSauces: ['Mayonesa', 'Mostaza', 'Ketchup', 'Ají de Rocoto'],
          notes: manualOrderData.notes
        }
      ],
      subtotal,
      deliveryFee,
      total,
      notes: manualOrderData.notes
    });

    setIsManualOrderOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar with Filter Pills and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-xs">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'recibido', label: '🔴 Nuevos' },
            { id: 'preparando', label: '🟡 En Cocina' },
            { id: 'en_camino', label: '🔵 En Delivery' },
            { id: 'entregado', label: '🟢 Entregados' },
            { id: 'cancelado', label: '⚪ Cancelados' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setOrderStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                orderStatusFilter === tab.id
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                  : 'bg-neutral-50 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & New Manual Order Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={orderSearchQuery}
              onChange={(e) => setOrderSearchQuery(e.target.value)}
              placeholder="Buscar cliente, orden..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all"
            />
          </div>

          <button
            onClick={() => setIsManualOrderOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Pedido Manual</span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 shadow-xs space-y-2">
          <div className="w-14 h-14 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center mx-auto text-neutral-400">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-neutral-800">No hay comandas en este estado</h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Los nuevos pedidos realizados por clientes o ingresados manualmente aparecerán aquí en vivo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrders.map(order => {
            const statusConfig = {
              recibido: {
                badge: 'bg-red-100 text-red-700 border-red-200',
                border: 'border-red-200',
                headerBg: 'bg-red-50/50',
                label: '🔴 Recibido'
              },
              preparando: {
                badge: 'bg-amber-100 text-amber-800 border-amber-200',
                border: 'border-amber-200',
                headerBg: 'bg-amber-50/50',
                label: '🟡 En Cocina'
              },
              en_camino: {
                badge: 'bg-blue-100 text-blue-800 border-blue-200',
                border: 'border-blue-200',
                headerBg: 'bg-blue-50/50',
                label: '🔵 En Camino'
              },
              entregado: {
                badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                border: 'border-emerald-200',
                headerBg: 'bg-emerald-50/50',
                label: '🟢 Entregado'
              },
              cancelado: {
                badge: 'bg-neutral-100 text-neutral-600 border-neutral-200',
                border: 'border-neutral-200',
                headerBg: 'bg-neutral-50/50',
                label: '⚪ Cancelado'
              }
            };

            const currentStatus = statusConfig[order.status] || statusConfig.recibido;

            return (
              <div
                key={order.id}
                className={`rounded-2xl border bg-white shadow-sm flex flex-col justify-between overflow-hidden transition-all hover:shadow-md ${currentStatus.border}`}
              >
                <div>
                  {/* Order Card Top Header */}
                  <div className={`flex items-center justify-between px-4 py-2.5 border-b border-neutral-200 ${currentStatus.headerBg}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-neutral-950 font-mono">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-700">
                        {order.orderType === 'delivery' ? '🛵 Delivery' : order.orderType === 'pickup' ? '🛍️ Recojo' : '🍽️ Salón'}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-amber-700">
                        {order.paymentMethod}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Customer info & Delivery location */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{order.customerName}</span>
                        </p>
                        {order.deliveryAddress && (
                          <p className="text-[11px] text-neutral-600 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                            <span>{order.deliveryAddress} {order.deliveryReference && `(${order.deliveryReference})`}</span>
                          </p>
                        )}
                        {order.tableNumber && (
                          <p className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                            🪑 Mesa N° {order.tableNumber}
                          </p>
                        )}
                      </div>

                      {/* WhatsApp & Phone contact pills */}
                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={`https://wa.me/51${order.customerPhone}?text=Hola%20${encodeURIComponent(order.customerName)},%20te%20escribimos%20de%20Restaurante%20Buchisapa%20sobre%20tu%20pedido%20%23${order.orderNumber}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 transition-all"
                          title="Contactar por WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="p-1.5 rounded-lg bg-neutral-50 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 border border-neutral-200 transition-all"
                          title="Llamar al cliente"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    {/* Dish breakdown list */}
                    <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 space-y-2">
                      {order.items.map((cartItem, cIdx) => (
                        <div key={cIdx} className="text-xs border-b border-neutral-200/80 pb-2 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between font-bold text-neutral-900">
                            <span>
                              <span className="text-red-600 font-mono font-black">{cartItem.quantity}x</span> {cartItem.item.name}
                            </span>
                            <span className="font-mono text-neutral-700 font-semibold">
                              S/ {(cartItem.item.price * cartItem.quantity).toFixed(2)}
                            </span>
                          </div>

                          {/* Removed Sides */}
                          {cartItem.removedAccompaniments && cartItem.removedAccompaniments.length > 0 && (
                            <p className="text-[11px] text-red-600 font-semibold mt-0.5">
                              ⚠️ SIN: {cartItem.removedAccompaniments.join(', ')}
                            </p>
                          )}

                          {/* Included Sides */}
                          {cartItem.selectedAccompaniments && cartItem.selectedAccompaniments.length > 0 && (
                            <p className="text-[11px] text-neutral-600 mt-0.5">
                              ✓ Con: {cartItem.selectedAccompaniments.join(', ')}
                            </p>
                          )}

                          {/* Sauces */}
                          {cartItem.selectedSauces && cartItem.selectedSauces.length > 0 && (
                            <p className="text-[11px] text-amber-800 font-medium mt-0.5">
                              Salsas: {cartItem.selectedSauces.join(', ')}
                            </p>
                          )}

                          {/* Kitchen Notes */}
                          {cartItem.notes && (
                            <p className="text-[11px] text-amber-900 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded mt-1 font-semibold">
                              Nota de cocina: "{cartItem.notes}"
                            </p>
                          )}
                        </div>
                      ))}

                      {order.notes && (
                        <div className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 p-2 rounded-lg font-medium">
                          <strong>Nota de Entrega:</strong> {order.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Total and Action Buttons */}
                <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Total a Cobrar:</span>
                    <span className="text-base font-black text-emerald-700 font-mono">
                      S/ {order.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onPrintTicket(order)}
                      className="p-2 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-xl transition-all cursor-pointer shadow-xs"
                      title="Imprimir Comanda Térmica"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {/* Status Advance Flow Buttons */}
                    {order.status === 'recibido' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparando')}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        🟡 Enviar a Cocina
                      </button>
                    )}

                    {order.status === 'preparando' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'en_camino')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        🔵 Despachar (En Camino)
                      </button>
                    )}

                    {order.status === 'en_camino' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'entregado')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        🟢 Marcar Entregado
                      </button>
                    )}

                    {order.status !== 'cancelado' && order.status !== 'entregado' && (
                      <button
                        onClick={() => {
                          if (confirm('¿Deseas cancelar esta orden?')) {
                            updateOrderStatus(order.id, 'cancelado');
                          }
                        }}
                        className="p-2 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Cancelar Orden"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clear old history helper button */}
      {orders.length > 0 && (
        <div className="text-right pt-2">
          <button
            onClick={() => {
              if (confirm('¿Deseas limpiar el historial de comandas antiguas?')) {
                clearOrdersHistory();
              }
            }}
            className="text-xs font-semibold text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            Limpiar historial de comandas
          </button>
        </div>
      )}

      {/* MODAL: NUEVO PEDIDO MANUAL */}
      {isManualOrderOpen && (
        <div className="fixed inset-0 z-60 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-neutral-900 rounded-3xl max-w-lg w-full p-6 border border-neutral-200 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-black text-sm uppercase text-neutral-950 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Registrar Pedido Manual (Salón / Teléfono)</span>
              </h3>
              <button onClick={() => setIsManualOrderOpen(false)} className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrderSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Nombre Cliente</label>
                  <input
                    type="text"
                    value={manualOrderData.customerName}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, customerName: e.target.value })}
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={manualOrderData.customerPhone}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, customerPhone: e.target.value })}
                    placeholder="999888777"
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Tipo de Pedido</label>
                  <select
                    value={manualOrderData.orderType}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, orderType: e.target.value as any })}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                  >
                    <option value="delivery">Delivery</option>
                    <option value="pickup">Para Llevar / Recojo</option>
                    <option value="dinein">En Salón (Mesa)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Medio de Pago</label>
                  <select
                    value={manualOrderData.paymentMethod}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, paymentMethod: e.target.value as any })}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                  >
                    <option value="yape">Yape</option>
                    <option value="plin">Plin</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </div>
              </div>

              {manualOrderData.orderType === 'delivery' && (
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Dirección de Entrega</label>
                  <input
                    type="text"
                    value={manualOrderData.deliveryAddress}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, deliveryAddress: e.target.value })}
                    placeholder="Av. Principal 123, Ate"
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              )}

              {manualOrderData.orderType === 'dinein' && (
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Número de Mesa</label>
                  <input
                    type="text"
                    value={manualOrderData.tableNumber}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, tableNumber: e.target.value })}
                    placeholder="Mesa 4"
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-neutral-700 block mb-1">Seleccionar Plato</label>
                  <select
                    value={manualOrderData.selectedDishId}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, selectedDishId: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                  >
                    {menuItems.map(m => (
                      <option key={m.id} value={m.id}>{m.name} - S/ {m.price.toFixed(2)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={manualOrderData.quantity}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, quantity: Math.max(1, Number(e.target.value)) })}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 font-mono font-bold focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Indicaciones de cocina</label>
                <input
                  type="text"
                  value={manualOrderData.notes}
                  onChange={(e) => setManualOrderData({ ...manualOrderData, notes: e.target.value })}
                  placeholder="Ej: Papas bien doraditas, cremas aparte..."
                  className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  Crear Comanda
                </button>
                <button
                  type="button"
                  onClick={() => setIsManualOrderOpen(false)}
                  className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
