import React from 'react';
import { Order } from '../../context/CartContext';
import { RESTAURANT_INFO } from '../../data/menuData';

interface AdminReceiptPrintProps {
  order: Order;
}

export const AdminReceiptPrint: React.FC<AdminReceiptPrintProps> = ({ order }) => {
  return (
    <div className="hidden print:block fixed inset-0 bg-white p-6 font-mono text-black z-[9999]">
      <div className="text-center border-b pb-3 mb-3">
        <h2 className="text-xl font-black uppercase">{RESTAURANT_INFO.name}</h2>
        <p className="text-xs">RUC: 20601234567 • ATE, LIMA</p>
        <p className="text-xs font-bold mt-1">COMANDA #{order.orderNumber}</p>
        <p className="text-xs">{new Date(order.createdAt).toLocaleString('es-PE')}</p>
      </div>
      <div className="text-xs space-y-1 border-b pb-2 mb-2">
        <p><strong>Cliente:</strong> {order.customerName}</p>
        <p><strong>Teléfono:</strong> {order.customerPhone}</p>
        <p><strong>Tipo:</strong> {order.orderType.toUpperCase()}</p>
        {order.deliveryAddress && (
          <p><strong>Dirección:</strong> {order.deliveryAddress}</p>
        )}
        <p><strong>Pago:</strong> {order.paymentMethod.toUpperCase()}</p>
      </div>
      <div className="text-xs space-y-2 border-b pb-2 mb-2">
        <p className="font-bold border-b pb-1">DETALLE DEL PEDIDO:</p>
        {order.items.map((it, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="flex justify-between font-bold">
              <span>{it.quantity}x {it.item.name}</span>
              <span>S/ {(it.item.price * it.quantity).toFixed(2)}</span>
            </div>
            {it.removedAccompaniments && it.removedAccompaniments.length > 0 && (
              <p className="text-[10px] pl-2 text-neutral-600 font-semibold">
                [SIN: {it.removedAccompaniments.join(', ')}]
              </p>
            )}
            {it.selectedSauces && it.selectedSauces.length > 0 && (
              <p className="text-[10px] pl-2 text-neutral-600">
                Cremas: {it.selectedSauces.join(', ')}
              </p>
            )}
            {it.notes && (
              <p className="text-[10px] pl-2 text-red-600 font-bold">
                Nota: {it.notes}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="text-xs space-y-1 text-right font-bold">
        <p>Subtotal: S/ {order.subtotal.toFixed(2)}</p>
        <p>Delivery: S/ {order.deliveryFee.toFixed(2)}</p>
        <p className="text-sm">TOTAL: S/ {order.total.toFixed(2)}</p>
      </div>
      <div className="text-center text-[10px] mt-4 border-t pt-2">
        <p>¡Gracias por su preferencia!</p>
        <p>WhatsApp: {RESTAURANT_INFO.phone}</p>
      </div>
    </div>
  );
};
