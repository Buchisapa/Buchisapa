/**
 * RESTAURANTE BUCHISAPA - Lógica KDS de Cocina en Tiempo Real
 */

let orders = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchOrders();
  // Polling automático cada 10 segundos
  setInterval(fetchOrders, 10000);
});

async function fetchOrders() {
  try {
    const res = await window.BuchisapaAPI.request('orders?select=*&order=created_at.desc&limit=30');
    if (Array.isArray(res)) {
      orders = res;
      renderKDS();
    }
  } catch (e) {
    console.error('Error obteniendo pedidos de cocina:', e);
  }
}

function renderKDS() {
  const colRecibidos = document.getElementById('kds-recibidos');
  const colPreparacion = document.getElementById('kds-preparacion');
  const colListos = document.getElementById('kds-listos');

  if (!colRecibidos || !colPreparacion || !colListos) return;

  const recibidos = orders.filter(o => o.status === 'recibido' || o.status === 'nuevo');
  const preparacion = orders.filter(o => o.status === 'en_preparacion' || o.status === 'preparando');
  const listos = orders.filter(o => o.status === 'listo' || o.status === 'completado');

  colRecibidos.innerHTML = recibidos.map(renderOrderCard).join('');
  colPreparacion.innerHTML = preparacion.map(renderOrderCard).join('');
  colListos.innerHTML = listos.map(renderOrderCard).join('');
}

function renderOrderCard(order) {
  const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
  const time = new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let nextStatus = 'en_preparacion';
  let nextLabel = '🧑‍🍳 Preparar';
  if (order.status === 'en_preparacion') {
    nextStatus = 'listo';
    nextLabel = '✅ Listo';
  } else if (order.status === 'listo') {
    nextStatus = 'entregado';
    nextLabel = '🚀 Despachar';
  }

  return `
    <div class="kds-order-card" id="card-${order.id}">
      <div class="kds-order-top">
        <span class="kds-order-num">#${order.order_number || order.id.slice(-4)}</span>
        <span class="kds-order-time">${time} (${order.order_type || 'delivery'})</span>
      </div>
      <div class="kds-order-client">👤 ${order.customer_name} - 📞 ${order.customer_phone}</div>
      <div style="margin-bottom: 8px;">
        ${items.map(it => `
          <div class="kds-item-row">
            <span><span class="kds-item-qty">${it.quantity}x</span> ${it.name}</span>
            ${it.selectedSauces && it.selectedSauces.length ? `<span style="font-size:10px; color:#9ca3af;">[${it.selectedSauces.join(',')}]</span>` : ''}
          </div>
        `).join('')}
      </div>
      ${order.notes ? `<div style="font-size:11px; color:#facc15; margin-bottom:8px;">⚠️ ${order.notes}</div>` : ''}
      <div class="kds-card-actions">
        <button class="kds-btn kds-btn-print" onclick="printTicket('${order.id}')">🖨️ Ticket</button>
        <button class="kds-btn kds-btn-next" onclick="updateOrderStatus('${order.id}', '${nextStatus}')">${nextLabel}</button>
      </div>
    </div>
  `;
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    await window.BuchisapaAPI.request(`orders?id=eq.${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
    fetchOrders();
  } catch (e) {
    console.error('Error actualizando estado:', e);
  }
}

function printTicket(orderId) {
  window.open(`/php/printer.php?order_id=${orderId}&format=html`, '_blank');
}
