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
  X
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
      {/* Top Bar with Filter Pills and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                orderStatusFilter === tab.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-800 hover:text-white'
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
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            onClick={() => setIsManualOrderOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Pedido Manual</span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-neutral-950/60 rounded-3xl p-10 text-center border border-neutral-800 space-y-2">
          <ShoppingBag className="w-10 h-10 text-neutral-600 mx-auto" />
          <h4 className="text-sm font-bold text-neutral-300">No hay comandas en este estado</h4>
          <p className="text-xs text-neutral-500">
            Los nuevos pedidos de clientes ingresarán aquí en tiempo real.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {filteredOrders.map(order => {
            const statusColors = {
              recibido: 'border-red-500/40 bg-red-950/20 text-red-400',
              preparando: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
              en_camino: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
              entregado: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
              cancelado: 'border-neutral-700 bg-neutral-900 text-neutral-500'
            };

            return (
              <div
                key={order.id}
                className={`rounded-2xl border bg-neutral-950 p-4 space-y-3 shadow-lg flex flex-col justify-between ${statusColors[order.status] || 'border-neutral-800'}`}
              >
                <div>
                  {/* Order Card Top Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-white font-mono">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300">
                        {order.orderType === 'delivery' ? '🛵 Delivery' : order.orderType === 'pickup' ? '🛍️ Recojo' : '🍽️ Salón'}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-neutral-800 text-amber-300">
                        {order.paymentMethod}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Customer info & Delivery location */}
                  <div className="pt-2 flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{order.customerName}</span>
                      </p>
                      {order.deliveryAddress && (
                        <p className="text-[11px] text-neutral-400 line-clamp-2">
                          📍 {order.deliveryAddress}
                          {order.deliveryReference && ` (${order.deliveryReference})`}
                        </p>
                      )}
                      {order.tableNumber && (
                        <p className="text-[11px] text-amber-400 font-bold">
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
                        className="p-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-all"
                        title="Contactar por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all"
                        title="Llamar al cliente"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Dish breakdown list */}
                  <div className="mt-3 bg-neutral-900/90 rounded-xl p-2.5 border border-neutral-800/80 space-y-2">
                    {order.items.map((cartItem, cIdx) => (
                      <div key={cIdx} className="text-xs border-b border-neutral-800/60 pb-1.5 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>
                            <span className="text-red-500 font-mono">{cartItem.quantity}x</span> {cartItem.item.name}
                          </span>
                          <span className="font-mono text-neutral-300">
                            S/ {(cartItem.item.price * cartItem.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Removed Sides */}
                        {cartItem.removedAccompaniments && cartItem.removedAccompaniments.length > 0 && (
                          <p className="text-[11px] text-red-400 font-bold mt-0.5">
                            ⚠️ SIN: {cartItem.removedAccompaniments.join(', ')}
                          </p>
                        )}

                        {/* Included Sides */}
                        {cartItem.selectedAccompaniments && cartItem.selectedAccompaniments.length > 0 && (
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            ✓ Con: {cartItem.selectedAccompaniments.join(', ')}
                          </p>
                        )}

                        {/* Sauces */}
                        {cartItem.selectedSauces && cartItem.selectedSauces.length > 0 && (
                          <p className="text-[10px] text-amber-300/90 mt-0.5">
                            Salsas: {cartItem.selectedSauces.join(', ')}
                          </p>
                        )}

                        {/* Kitchen Notes */}
                        {cartItem.notes && (
                          <p className="text-[11px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded mt-1 font-bold">
                            Nota de cocina: "{cartItem.notes}"
                          </p>
                        )}
                      </div>
                    ))}

                    {order.notes && (
                      <div className="text-[11px] text-amber-300 bg-amber-950/30 p-1.5 rounded-lg">
                        <strong>Nota de Entrega:</strong> {order.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Total and Action Buttons */}
                <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-neutral-400 block">Total a Cobrar:</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      S/ {order.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onPrintTicket(order)}
                      className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl transition-all cursor-pointer"
                      title="Imprimir Comanda Térmica"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    {/* Status Advance Flow Buttons */}
                    {order.status === 'recibido' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparando')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        🟡 Pasar a Cocina
                      </button>
                    )}

                    {order.status === 'preparando' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'en_camino')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        🔵 Despachar (En Camino)
                      </button>
                    )}

                    {order.status === 'en_camino' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'entregado')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
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
                        className="p-2 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
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
            className="text-xs text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            Limpiar historial de comandas
          </button>
        </div>
      )}

      {/* MODAL: NUEVO PEDIDO MANUAL */}
      {isManualOrderOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 text-white rounded-2xl max-w-lg w-full p-5 border border-neutral-700 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h3 className="font-bold text-sm uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-500" />
                <span>Registrar Pedido Manual (Salón / Teléfono)</span>
              </h3>
              <button onClick={() => setIsManualOrderOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrderSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Nombre Cliente</label>
                  <input
                    type="text"
                    value={manualOrderData.customerName}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, customerName: e.target.value })}
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={manualOrderData.customerPhone}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, customerPhone: e.target.value })}
                    placeholder="999888777"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Tipo de Pedido</label>
                  <select
                    value={manualOrderData.orderType}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, orderType: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2 text-white"
                  >
                    <option value="delivery">Delivery</option>
                    <option value="pickup">Para Llevar / Recojo</option>
                    <option value="dinein">En Salón (Mesa)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Medio de Pago</label>
                  <select
                    value={manualOrderData.paymentMethod}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, paymentMethod: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2 text-white"
                  >
                    <option value="yape">Yape</option>
                    <option value="plin">Plin</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </div>
              </div>

              {manualOrderData.orderType === 'delivery' && (
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Dirección de Entrega</label>
                  <input
                    type="text"
                    value={manualOrderData.deliveryAddress}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, deliveryAddress: e.target.value })}
                    placeholder="Av. Principal 123, Ate"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2 text-white"
                  />
                </div>
              )}

              {manualOrderData.orderType === 'dinein' && (
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Número de Mesa</label>
                  <input
                    type="text"
                    value={manualOrderData.tableNumber}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, tableNumber: e.target.value })}
                    placeholder="Mesa 4"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2 text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-neutral-300 block mb-1">Seleccionar Plato</label>
                  <select
                    value={manualOrderData.selectedDishId}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, selectedDishId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2 text-white"
                  >
                    {menuItems.map(m => (
                      <option key={m.id} value={m.id}>{m.name} - S/ {m.price.toFixed(2)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={manualOrderData.quantity}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, quantity: Math.max(1, Number(e.target.value)) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Indicaciones de cocina</label>
                <input
                  type="text"
                  value={manualOrderData.notes}
                  onChange={(e) => setManualOrderData({ ...manualOrderData, notes: e.target.value })}
                  placeholder="Ej: Papas bien doraditas, cremas aparte..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer"
                >
                  Crear Comanda
                </button>
                <button
                  type="button"
                  onClick={() => setIsManualOrderOpen(false)}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-xl transition-all cursor-pointer"
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
