import React, { useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  Clock
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
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Ventas Totales</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-black text-emerald-400 font-mono">
            S/ {metrics.totalSales.toFixed(2)}
          </p>
          <span className="text-[10px] text-neutral-500">Caja acumulada en vivo</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Total Comandas</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-black text-white font-mono">
            {metrics.totalOrders}
          </p>
          <span className="text-[10px] text-neutral-500">Pedidos registrados hoy</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Ticket Promedio</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-black text-blue-400 font-mono">
            S/ {metrics.avgTicket.toFixed(2)}
          </p>
          <span className="text-[10px] text-neutral-500">Gasto medio por cliente</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Entregados / En Curso</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-black text-purple-400 font-mono">
            {metrics.completedOrders} / {metrics.pendingOrders}
          </p>
          <span className="text-[10px] text-neutral-500">Finalizados vs Pendientes</span>
        </div>
      </div>

      {/* Payment methods breakdown */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
          Distribución de Ingresos por Medio de Pago
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-1">
            <span className="text-[11px] font-bold text-purple-400 block">🟣 Yape</span>
            <p className="text-lg font-bold font-mono text-white">S/ {metrics.yapeTotal.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-1">
            <span className="text-[11px] font-bold text-cyan-400 block">🔵 Plin</span>
            <p className="text-lg font-bold font-mono text-white">S/ {metrics.plinTotal.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-1">
            <span className="text-[11px] font-bold text-emerald-400 block">💵 Efectivo (Contra Entrega)</span>
            <p className="text-lg font-bold font-mono text-white">S/ {metrics.cashTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
