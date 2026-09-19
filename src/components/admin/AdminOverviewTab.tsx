import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Utensils,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Banknote,
  Printer,
  Store,
  MessageCircle,
  Layers,
  FileText,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Flame,
  Activity
} from 'lucide-react';
import { useCart, Order } from '../../context/CartContext';

interface AdminOverviewTabProps {
  onNavigateTab: (tab: 'dashboard' | 'orders' | 'menu' | 'reports' | 'settings' | 'complaints') => void;
  onOpenManualOrder: () => void;
  onPrintTicket: (order: Order) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  onNavigateTab,
  onOpenManualOrder,
  onPrintTicket
}) => {
  const {
    orders,
    menuItems,
    complaints,
    storeSettings,
    toggleItemAvailability,
    updateStoreSettings
  } = useCart();

  // Metrics calculations
  const validOrders = orders.filter(o => o.status !== 'cancelado');
  const totalSales = validOrders.reduce((sum, o) => sum + o.total, 0);
  const activeOrders = orders.filter(o => o.status === 'recibido' || o.status === 'preparando' || o.status === 'en_camino');
  const completedOrders = orders.filter(o => o.status === 'entregado').length;
  const uniqueCustomersCount = new Set(orders.map(o => o.customerPhone || o.customerName)).size;
  const avgTicket = validOrders.length > 0 ? totalSales / validOrders.length : 0;

  // Payment breakdown
  const yapeTotal = validOrders.filter(o => o.paymentMethod === 'yape').reduce((s, o) => s + o.total, 0);
  const plinTotal = validOrders.filter(o => o.paymentMethod === 'plin').reduce((s, o) => s + o.total, 0);
  const cashTotal = validOrders.filter(o => o.paymentMethod === 'efectivo').reduce((s, o) => s + o.total, 0);

  // Top selling items tally
  const dishSalesMap: { [name: string]: { count: number; revenue: number; image?: string; category?: string } } = {};
  orders.forEach(order => {
    if (order.status === 'cancelado') return;
    order.items.forEach(cartItem => {
      const name = cartItem.item.name;
      if (!dishSalesMap[name]) {
        dishSalesMap[name] = {
          count: 0,
          revenue: 0,
          image: cartItem.item.image,
          category: cartItem.item.category
        };
      }
      dishSalesMap[name].count += cartItem.quantity;
      dishSalesMap[name].revenue += cartItem.item.price * cartItem.quantity;
    });
  });

  const topDishes = Object.entries(dishSalesMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const pendingComplaints = complaints.filter(c => c.status === 'pendiente');

  return (
    <div className="space-y-6">
      
      {/* 4 TOP STAT CARDS (MediaCP Style with Colorful Floating Icon Badges) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Ventas del Turno (Green) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-13 h-13 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 shrink-0">
              <DollarSign className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Caja Total
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                S/ {totalSales.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {validOrders.length} transacciones
            </span>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-slate-500 hover:text-sky-600 font-semibold flex items-center gap-0.5 cursor-pointer text-[11px]"
            >
              Ver reporte <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Comandas Activas (Amber / Orange) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-13 h-13 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/25 shrink-0">
              <ShoppingBag className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                En Cocina / Delivery
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {activeOrders.length} <span className="text-xs font-semibold text-slate-500">activas</span>
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className={`font-bold flex items-center gap-1 ${activeOrders.length > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
              <Clock className="w-3.5 h-3.5" />
              {activeOrders.length > 0 ? 'En atención inmediata' : 'Sin pedidos pendientes'}
            </span>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-slate-500 hover:text-sky-600 font-semibold flex items-center gap-0.5 cursor-pointer text-[11px]"
            >
              Ver comandas <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Clientes Atendidos (Orange / Cyan) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-13 h-13 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0">
              <Users className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Clientes
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {uniqueCustomersCount} <span className="text-xs font-semibold text-slate-500">registrados</span>
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              {completedOrders} entregados con éxito
            </span>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-slate-500 hover:text-sky-600 font-semibold flex items-center gap-0.5 cursor-pointer text-[11px]"
            >
              Historial <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Platos en Carta (Blue / Sky) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="w-13 h-13 rounded-2xl bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-500/25 shrink-0">
              <Utensils className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Carta Activa
              </span>
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {menuItems.filter(m => m.isAvailable !== false).length} / {menuItems.length}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-sky-600 font-bold">
              Ticket Prom: S/ {avgTicket.toFixed(2)}
            </span>
            <button
              onClick={() => onNavigateTab('menu')}
              className="text-slate-500 hover:text-sky-600 font-semibold flex items-center gap-0.5 cursor-pointer text-[11px]"
            >
              Editar carta <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* MAIN TWO-COLUMN WORKSPACE (Center Apps + Right Side Services) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT / CENTER COLUMN (8 cols): Quick Actions Grid + Live Comandas Snippet */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Quick Access Apps Grid (Inspired by Reference 1 Grid) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-500" />
                  <span>Acciones Rápidas & Control del Restaurante</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Accesos directos a las herramientas más usadas de Buchisapa</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
              
              {/* App 1: Nueva Comanda Manual */}
              <button
                onClick={onOpenManualOrder}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-sky-50/80 border border-slate-200/80 hover:border-sky-300 text-center transition-all cursor-pointer group hover:shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform mb-2">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900">Nueva Comanda</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Mesa / Delivery</span>
              </button>

              {/* App 2: Administrar Carta */}
              <button
                onClick={() => onNavigateTab('menu')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-sky-50/80 border border-slate-200/80 hover:border-sky-300 text-center transition-all cursor-pointer group hover:shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform mb-2">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900">Carta & Platos</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{menuItems.length} items</span>
              </button>

              {/* App 3: Reporte de Caja */}
              <button
                onClick={() => onNavigateTab('reports')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-sky-50/80 border border-slate-200/80 hover:border-sky-300 text-center transition-all cursor-pointer group hover:shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform mb-2">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900">Cuadre de Caja</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Yape / Plin / Efectivo</span>
              </button>

              {/* App 4: Estado del Local (Toggle 24H) */}
              <button
                onClick={() => updateStoreSettings({ isStoreOpen: !storeSettings.isStoreOpen })}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-sky-50/80 border border-slate-200/80 hover:border-sky-300 text-center transition-all cursor-pointer group hover:shadow-sm"
              >
                <div className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform mb-2 ${
                  storeSettings.isStoreOpen ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-red-600 shadow-red-600/20'
                }`}>
                  <Store className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900">
                  {storeSettings.isStoreOpen ? 'Local Abierto' : 'Local Pausado'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">Clic para cambiar</span>
              </button>

              {/* App 5: Reclamaciones */}
              <button
                onClick={() => onNavigateTab('complaints')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-sky-50/80 border border-slate-200/80 hover:border-sky-300 text-center transition-all cursor-pointer group hover:shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform mb-2 relative">
                  <FileText className="w-6 h-6" />
                  {pendingComplaints.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                      {pendingComplaints.length}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900">Libro Reclamos</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{complaints.length} registrados</span>
              </button>

              {/* App 6: Ajustes de Delivery */}
              <button
                onClick={() => onNavigateTab('settings')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-sky-50/80 border border-slate-200/80 hover:border-sky-300 text-center transition-all cursor-pointer group hover:shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-700 text-white flex items-center justify-center shadow-md shadow-slate-700/20 group-hover:scale-105 transition-transform mb-2">
                  <Store className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900">Ajustes Local</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Envío S/ {storeSettings.deliveryFee.toFixed(2)}</span>
              </button>

              {/* App 7: WhatsApp Central */}
              <a
                href={`https://wa.me/51${storeSettings.phone || '943312024'}?text=Hola%20Administracion%20Buchisapa`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-300 text-center transition-all cursor-pointer group hover:shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform mb-2">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">WhatsApp Central</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{storeSettings.phone || '943312024'}</span>
              </a>

              {/* App 8: Monitor de Cocina */}
              <button
                onClick={() => onNavigateTab('orders')}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-sky-50/80 border border-slate-200/80 hover:border-sky-300 text-center transition-all cursor-pointer group hover:shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/20 group-hover:scale-105 transition-transform mb-2">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900">Monitor Cocina</span>
                <span className="text-[10px] text-slate-400 mt-0.5">KDS en vivo</span>
              </button>

            </div>
          </div>

          {/* Live Recent Orders Feed (Clean White Card) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>Últimas Comandas en Tiempo Real</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Flujo directo de pedidos de clientes en mesa y delivery</p>
              </div>

              <button
                onClick={() => onNavigateTab('orders')}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todas ({orders.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No hay comandas registradas en este momento.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.slice(0, 4).map(order => (
                  <div key={order.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black font-mono px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
                        #{order.orderNumber}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{order.customerName}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                            {order.orderType}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {order.items.map(i => `${i.quantity}x ${i.item.name}`).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-xs font-black font-mono text-emerald-700">
                        S/ {order.total.toFixed(2)}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        order.status === 'recibido' ? 'bg-red-50 text-red-700 border-red-200' :
                        order.status === 'preparando' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        order.status === 'en_camino' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        order.status === 'entregado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {order.status === 'recibido' ? '🔴 Nuevo' :
                         order.status === 'preparando' ? '🟡 En Cocina' :
                         order.status === 'en_camino' ? '🔵 En Delivery' :
                         order.status === 'entregado' ? '🟢 Entregado' : 'Cancelado'}
                      </span>
                      <button
                        onClick={() => onPrintTicket(order)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                        title="Imprimir ticket"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN (4 cols): Top Selling Dishes + Payment Methods Summary (MediaCP Style) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Top Platos Más Vendidos (Top Media Services counterpart) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-sky-500" />
                <span>Platos Más Pedidos</span>
              </h4>
              <button
                onClick={() => onNavigateTab('menu')}
                className="text-[11px] font-bold text-sky-600 hover:underline cursor-pointer"
              >
                Ver carta
              </button>
            </div>

            {topDishes.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                No hay ventas registradas aún en el turno.
              </div>
            ) : (
              <div className="space-y-3">
                {topDishes.map((dish, idx) => (
                  <div key={dish.name} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200 font-bold text-slate-600 text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 truncate" title={dish.name}>
                        {dish.name}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-slate-900 block font-mono">{dish.count} unds</span>
                      <span className="text-[10px] text-slate-400 font-mono">S/ {dish.revenue.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Methods Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Flujo de Cobros</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Hoy</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
                <span className="font-bold text-purple-900 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                  Yape
                </span>
                <span className="font-black font-mono text-purple-950">S/ {yapeTotal.toFixed(2)}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-50/70 border border-cyan-100 flex items-center justify-between">
                <span className="font-bold text-cyan-900 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-600" />
                  Plin
                </span>
                <span className="font-black font-mono text-cyan-950">S/ {plinTotal.toFixed(2)}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                  Efectivo
                </span>
                <span className="font-black font-mono text-emerald-950">S/ {cashTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* System & Database Connection Status */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                Estado del Servidor
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                En Línea 24H
              </span>
            </div>
            <div className="text-[11px] text-slate-500 space-y-1">
              <p>• <strong>Base de datos:</strong> Supabase PostgreSQL (Sincronizado)</p>
              <p>• <strong>Cuenta:</strong> buchisapaweb@gmail.com</p>
              <p>• <strong>WhatsApp:</strong> Conectado (+51 {storeSettings.phone || '943312024'})</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
