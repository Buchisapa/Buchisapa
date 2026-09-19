/**
 * RESTAURANTE BUCHISAPA - Lógica Principal de la Aplicación Cliente
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Inicializar carrito
  if (window.BuchisapaCart) {
    window.BuchisapaCart.init();
  }

  // 2. Cargar catálogo de productos
  await loadCatalog();
});

let currentProducts = [];
let currentCategory = 'all';

async function loadCatalog() {
  const grid = document.getElementById('products-grid-container');
  if (!grid) return;

  try {
    let products = await window.BuchisapaAPI.getProducts();
    if (!products || products.length === 0) {
      // Fallback a menú local
      products = getDefaultMenu();
    }
    currentProducts = products;
    renderProducts(products);
  } catch (err) {
    console.error('Error cargando catálogo:', err);
    currentProducts = getDefaultMenu();
    renderProducts(currentProducts);
  }
}

function filterCategory(catId, element) {
  currentCategory = catId;
  
  // Actualizar UI tabs
  document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
  if (element) element.classList.add('active');

  if (catId === 'all') {
    renderProducts(currentProducts);
  } else {
    const filtered = currentProducts.filter(p => p.category === catId || p.category_id === catId);
    renderProducts(filtered);
  }
}

function renderProducts(items) {
  const grid = document.getElementById('products-grid-container');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #94a3b8;">No se encontraron platos en esta categoría.</div>';
    return;
  }

  grid.innerHTML = items.map(p => `
    <div class="product-card">
      <div class="product-img-wrapper">
        <img class="product-img" src="${p.image || '/images/pollo-brasas.jpg'}" alt="${p.name}" loading="lazy">
        ${p.popular ? '<span class="product-popular-badge">★ TOP VENTAS</span>' : ''}
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description || ''}</p>
        <div class="product-footer">
          <span class="product-price">S/ ${parseFloat(p.price).toFixed(2)}</span>
          <button class="btn btn-primary" onclick="quickAddToCart('${p.id}')">
            + Agregar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function quickAddToCart(productId) {
  const product = currentProducts.find(p => p.id === productId);
  if (product) {
    window.BuchisapaCart.addItem(product, 1, ['Mayonesa', 'Ají Buchisapa']);
  }
}

function getDefaultMenu() {
  return [
    {
      id: 'prod-1',
      name: '1 Pollo a la Brasa + Papas + Ensalada',
      description: 'Pollo entero marinado con 14 especias amazónicas, papas fritas crocantes y ensalada fresca.',
      price: 68.00,
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80',
      category: 'brasas',
      popular: true
    },
    {
      id: 'prod-2',
      name: '1/2 Pollo a la Brasa Familiar',
      description: 'Medio pollo dorado al carbón, porción generosa de papas y ensalada clásica.',
      price: 36.00,
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80',
      category: 'brasas',
      popular: true
    },
    {
      id: 'prod-3',
      name: '1/4 Pollo a la Brasa Personal',
      description: 'Pierna o pecho al carbón con papas nativas fritas, ensalada y salsas.',
      price: 21.00,
      image: 'https://images.unsplash.com/photo-1594221708779-94832f4320d1?w=600&auto=format&fit=crop&q=80',
      category: 'brasas',
      popular: false
    },
    {
      id: 'prod-4',
      name: 'Chaufa Amazónico con Cecina y Chorizo',
      description: 'Arroz al wok con cecina ahumada de Tarapoto, chorizo selvático, plátano maduro frito y huevo.',
      price: 32.00,
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
      category: 'chaufas',
      popular: true
    },
    {
      id: 'prod-5',
      name: 'Mostrito Buchisapa Especial',
      description: '1/4 de Pollo a la brasa + Porción generosa de Arroz Chaufa + Papas fritas + Ensalada.',
      price: 26.00,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      category: 'mostritos',
      popular: true
    },
    {
      id: 'prod-6',
      name: 'Inca Kola 1.5L',
      description: 'Bebida gaseosa helada tradicional.',
      price: 9.00,
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
      category: 'bebidas',
      popular: false
    }
  ];
}

// Abrir modal de Checkout
function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('open');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('open');
}

// Enviar pedido final
async function submitOrder(e) {
  e.preventDefault();
  const name = document.getElementById('cust-name').value;
  const phone = document.getElementById('cust-phone').value;
  const address = document.getElementById('cust-address').value;
  const payment = document.getElementById('cust-payment').value;
  const notes = document.getElementById('cust-notes').value;

  if (!name || !phone) {
    alert('Por favor complete su nombre y celular.');
    return;
  }

  const orderPayload = {
    customer_name: name,
    customer_phone: phone,
    customerName: name,
    customerPhone: phone,
    delivery_address: address,
    deliveryAddress: address,
    payment_method: payment,
    paymentMethod: payment,
    notes: notes,
    order_type: 'delivery',
    orderType: 'delivery',
    total: window.BuchisapaCart.getTotal(),
    items: window.BuchisapaCart.items
  };

  try {
    const res = await window.BuchisapaAPI.createOrder(orderPayload);
    alert('¡Pedido realizado con éxito! Tu orden ha sido enviada a cocina.');
    window.BuchisapaCart.clear();
    closeCheckoutModal();
    window.BuchisapaCart.closeDrawer();
  } catch (err) {
    alert('Hubo un problema registrando el pedido. Conectando con WhatsApp...');
    window.open(`https://wa.me/51927486448?text=${encodeURIComponent('Hola Buchisapa, quiero pedir: ' + name)}`, '_blank');
  }
}
