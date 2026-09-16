import React, { useState } from 'react';
import {
  X,
  ChefHat,
  Clock,
  CheckCircle,
  Truck,
  ShoppingBag,
  Plus,
  RefreshCw,
  Phone,
  Printer,
  Copy,
  Check
} from 'lucide-react';
import { useCart, Order } from '../context/CartContext';
import { MENU_ITEMS, RESTAURANT_INFO } from '../data/menuData';

interface KitchenOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KitchenOrdersModal: React.FC<KitchenOrdersModalProps> = ({ isOpen, onClose }) => {
  const { orders, updateOrderStatus, createOrder } = useCart();
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateDemoOrder = () => {
    // Generate a sample order for demonstration
    const sampleItems = [
      {
        cartId: 'demo-1',
        item: MENU_ITEMS[0], // Tacacho con Cecina
        quantity: 1,
        selectedSauces: ['Ají de Cocona con Charapita', 'Mayonesa Casera'],
        notes: 'Bien caliente por favor'
      },
      {
        cartId: 'demo-2',
        item: MENU_ITEMS[7], // Hamburguesa La Suprema
        quantity: 1,
        selectedSauces: ['Mayonesa Casera', 'Tártara Especial', 'Ají de Pollería']
      },
      {
        cartId: 'demo-3',
        item: MENU_ITEMS[18], // Refresco de Cocona
        quantity: 2,
        selectedSauces: []
      }
    ];

    createOrder({
      customerName: 'Cliente Ejemplo Buchisapa',
      customerPhone: '987654321',
      orderType: 'delivery',
      deliveryAddress: 'Av. Nicolás Ayllón 1234, Ate',
      deliveryReference: 'A 2 cuadras de Puruchuco',
      paymentMethod: 'yape',
      items: sampleItems,
      subtotal: 33.00,
      deliveryFee: 4.00,
      total: 37.00,
      notes: 'Llamar al llegar a la reja'
    });
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'todos') return true;
    return o.status === filterStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'recibido':
        return (
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Recibido</span>
          </span>
        );
      case 'preparando':
        return (
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <ChefHat className="w-3.5 h-3.5 text-blue-400" />
            <span>En Cocina</span>
          </span>
        );
      case 'en_camino':
        return (
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-purple-400" />
            <span>En Reparto</span>
          </span>
        );
      case 'entregado':
        return (
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Entregado</span>
          </span>
        );
    }
  };

  const copyOrderText = (order: Order) => {
    const summary = `Pedido #${order.orderNumber} - ${order.customerName} - Total: S/ ${order.total.toFixed(2)}`;
    navigator.clipboard.writeText(summary);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-neutral-950 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/15 text-amber-400 rounded-xl">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-heading">
                Panel de Pedidos &amp; Cocina
              </h3>
              <p className="text-xs text-neutral-400">
                Monitoreo en tiempo real de comandas para salón y delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateDemoOrder}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-amber-400 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simular Pedido de Prueba</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="px-5 py-3 bg-neutral-900 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-neutral-400 mr-2">Filtrar:</span>
          {['todos', 'recibido', 'preparando', 'en_camino', 'entregado'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                filterStatus === status
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {status === 'todos' ? 'Todos' : status.replace('_', ' ')}
            </button>
          ))}
          <span className="ml-auto text-xs text-neutral-500 hidden sm:inline">
            Total órdenes registradas: {orders.length}
          </span>
        </div>

        {/* Body (Orders Grid) */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 space-y-3">
              <ChefHat className="w-12 h-12 mx-auto text-neutral-600" />
              <p className="text-sm font-bold text-neutral-300">
                No hay pedidos en este estado en este momento.
              </p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Realiza un pedido desde el menú o pulsa en "Simular Pedido de Prueba" para visualizar el flujo completo de cocina.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg"
                >
                  {/* Top info */}
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                      <div>
                        <span className="text-xs font-mono text-neutral-500 font-semibold">
                          Orden #{order.orderNumber}
                        </span>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {order.customerName}
                        </h4>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="py-2.5 text-xs text-neutral-400 space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-amber-500" />
                        <span>{order.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="capitalize font-semibold text-neutral-300">
                          {order.orderType === 'delivery'
                            ? `Delivery: ${order.deliveryAddress}`
                            : order.orderType === 'pickup'
                            ? 'Para Llevar / Recojo'
                            : `Consumo en Salón ${order.tableNumber ? `(${order.tableNumber})` : ''}`}
                        </span>
                      </div>
                      {order.deliveryReference && (
                        <p className="text-[11px] text-neutral-500 ml-5">
                          Ref: {order.deliveryReference}
                        </p>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="bg-neutral-900/70 rounded-xl p-3 space-y-2 border border-neutral-800/60 my-2">
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        Comanda / Platos:
                      </p>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="text-xs text-neutral-200 flex justify-between border-b border-neutral-800/40 pb-1.5 last:border-none last:pb-0">
                          <div>
                            <span className="font-bold text-white mr-1.5">{it.quantity}x</span>
                            <span>{it.item.name}</span>
                            {it.selectedOption && (
                              <span className="text-[11px] text-amber-300 block ml-4">
                                • {it.selectedOption}
                              </span>
                            )}
                            {it.selectedSauces && it.selectedSauces.length > 0 && (
                              <span className="text-[10px] text-neutral-400 block ml-4">
                                Salsas: {it.selectedSauces.join(', ')}
                              </span>
                            )}
                            {it.notes && (
                              <span className="text-[10px] text-rose-300 block ml-4 font-semibold">
                                Nota: {it.notes}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-neutral-400 shrink-0">
                            S/ {(it.item.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="text-xs bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg text-amber-200 mt-2">
                        <span className="font-bold">Observación: </span>
                        {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Bottom: Status Changer Buttons */}
                  <div className="pt-3 border-t border-neutral-800/80 mt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-300 mb-2">
                      <span>Total: <strong className="text-amber-400 font-mono text-sm">S/ {order.total.toFixed(2)}</strong></span>
                      <span className="text-[11px] text-neutral-400 uppercase">
                        Pago: {order.paymentMethod}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'recibido')}
                        className={`flex-1 py-1.5 text-[11px] rounded-lg font-bold border transition-colors cursor-pointer ${
                          order.status === 'recibido'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Recibido
                      </button>

                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparando')}
                        className={`flex-1 py-1.5 text-[11px] rounded-lg font-bold border transition-colors cursor-pointer ${
                          order.status === 'preparando'
                            ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        En Cocina
                      </button>

                      <button
                        onClick={() => updateOrderStatus(order.id, 'en_camino')}
                        className={`flex-1 py-1.5 text-[11px] rounded-lg font-bold border transition-colors cursor-pointer ${
                          order.status === 'en_camino'
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        En Camino
                      </button>

                      <button
                        onClick={() => updateOrderStatus(order.id, 'entregado')}
                        className={`flex-1 py-1.5 text-[11px] rounded-lg font-bold border transition-colors cursor-pointer ${
                          order.status === 'entregado'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Entregado
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>Los estados se guardan localmente para seguimiento continuo.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};
