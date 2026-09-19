import React, { useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const AdminReportsTab: React.FC = () => {
  const { orders } = useCart();

  const metrics = useMemo(() => {
    const totalSales = orders
      .filter(o => o.status !== 'cancelado')
      .reduce((sum, o) => sum + o.total, 0);
    const completedOrders = orders.filter(o => o.status === 'entregado').length;
    const pendingOrders = orders.filter(o => o.status === 'recibido' || o.status === 'preparando' || o.status === 'en_camino').length;
    const validOrdersCount = orders.filter(o => o.status !== 'cancelado').length || 1;
    const avgTicket = orders.length > 0 ? totalSales / validOrdersCount : 0;

    const yapeTotal = orders.filter(o => o.paymentMethod === 'yape' && o.status !== 'cancelado').reduce((s, o) => s + o.total, 0);
    const plinTotal = orders.filter(o => o.paymentMethod === 'plin' && o.status !== 'cancelado').reduce((s, o) => s + o.total, 0);
    const cashTotal = orders.filter(o => o.paymentMethod === 'efectivo' && o.status !== 'cancelado').reduce((s, o) => s + o.total, 0);

    return {
      totalSales,
      completedOrders,
      pendingOrders,
      avgTicket,
      yapeTotal,
      plinTotal,
      cashTotal,
      totalOrders: orders.length
    };
  }, [orders]);

  return (
    <div className="space-y-4">
      {/* Metric Cards Grid (Clean White Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Ventas Totales</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700 font-mono tracking-tight">
            S/ {metrics.totalSales.toFixed(2)}
          </p>
          <span className="text-[11px] text-neutral-500 block">Caja acumulada del turno</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Total Comandas</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 font-mono tracking-tight">
            {metrics.totalOrders}
          </p>
          <span className="text-[11px] text-neutral-500 block">Pedidos registrados hoy</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Ticket Promedio</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-700 font-mono tracking-tight">
            S/ {metrics.avgTicket.toFixed(2)}
          </p>
          <span className="text-[11px] text-neutral-500 block">Consumo medio por cliente</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Entregados / Pendientes</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-700 font-mono tracking-tight">
            {metrics.completedOrders} / {metrics.pendingOrders}
          </p>
          <span className="text-[11px] text-neutral-500 block">Finalizados vs En preparación</span>
        </div>
      </div>

      {/* Payment methods breakdown */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
        <h4 className="text-xs font-black uppercase tracking-wider text-neutral-700">
          Distribución de Ingresos por Medio de Pago
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-900">🟣 Yape</span>
              <Smartphone className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xl font-black font-mono text-purple-950">S/ {metrics.yapeTotal.toFixed(2)}</p>
            <span className="text-[11px] text-purple-700">Transferencias Yape directas</span>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-cyan-900">🔵 Plin</span>
              <Smartphone className="w-4 h-4 text-cyan-600" />
            </div>
            <p className="text-xl font-black font-mono text-cyan-950">S/ {metrics.plinTotal.toFixed(2)}</p>
            <span className="text-[11px] text-cyan-700">Transferencias Plin</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900">💵 Efectivo (Contra Entrega)</span>
              <Banknote className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-black font-mono text-emerald-950">S/ {metrics.cashTotal.toFixed(2)}</p>
            <span className="text-[11px] text-emerald-700">Cobros en mostrador y delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
