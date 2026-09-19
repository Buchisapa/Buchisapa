/**
 * RESTAURANTE BUCHISAPA - Lógica de Carrito de Compras
 */

const BuchisapaCart = {
  items: [],
  deliveryFee: 4.00,
  orderType: 'delivery', // 'delivery', 'pickup', 'table'

  init() {
    const saved = localStorage.getItem('buchisapa_cart_v1');
    if (saved) {
      try {
        this.items = JSON.parse(saved);
      } catch (e) {
        this.items = [];
      }
    }
    this.updateUI();
  },

  save() {
    localStorage.setItem('buchisapa_cart_v1', JSON.stringify(this.items));
    this.updateUI();
  },

  addItem(product, quantity = 1, sauces = [], notes = '') {
    const existingIndex = this.items.findIndex(
      item => item.id === product.id && JSON.stringify(item.selectedSauces || []) === JSON.stringify(sauces)
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        quantity: quantity,
        selectedSauces: sauces,
        notes: notes
      });
    }

    this.save();
    this.openDrawer();
  },

  removeItem(index) {
    this.items.splice(index, 1);
    this.save();
  },

  updateQuantity(index, delta) {
    if (this.items[index]) {
      this.items[index].quantity += delta;
      if (this.items[index].quantity <= 0) {
        this.removeItem(index);
      } else {
        this.save();
      }
    }
  },

  clear() {
    this.items = [];
    this.save();
  },

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getTotal() {
    const subtotal = this.getSubtotal();
    const fee = this.orderType === 'delivery' ? this.deliveryFee : 0;
    return subtotal + fee;
  },

  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  updateUI() {
    const countBadge = document.getElementById('cart-count-badge');
    if (countBadge) {
      countBadge.textContent = this.getCount();
    }

    const itemsContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (itemsContainer) {
      if (this.items.length === 0) {
        itemsContainer.innerHTML = '<div style="text-align:center; padding: 40px 10px; color: #94a3b8;">Tu carrito está vacío 🍗</div>';
      } else {
        itemsContainer.innerHTML = this.items.map((item, idx) => `
          <div class="cart-item-row">
            <div class="cart-item-info">
              <div style="font-weight: 700; font-size: 14px;">${item.name}</div>
              <div style="font-size: 13px; color: #ea580c; font-weight: 800;">S/ ${(item.price * item.quantity).toFixed(2)}</div>
              ${item.selectedSauces && item.selectedSauces.length ? `<div style="font-size: 11px; color: #64748b;">Cremas: ${item.selectedSauces.join(', ')}</div>` : ''}
              <div class="cart-item-qty-controls">
                <button class="cart-qty-btn" onclick="BuchisapaCart.updateQuantity(${idx}, -1)">-</button>
                <span style="font-size: 13px; font-weight: 700;">${item.quantity}</span>
                <button class="cart-qty-btn" onclick="BuchisapaCart.updateQuantity(${idx}, 1)">+</button>
                <button onclick="BuchisapaCart.removeItem(${idx})" style="background:none; border:none; color:#ef4444; font-size:12px; margin-left:10px; cursor:pointer;">Eliminar</button>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    if (subtotalEl) subtotalEl.textContent = `S/ ${this.getSubtotal().toFixed(2)}`;
    if (totalEl) totalEl.textContent = `S/ ${this.getTotal().toFixed(2)}`;
  },

  openDrawer() {
    const drawer = document.getElementById('cart-drawer-modal');
    if (drawer) drawer.classList.add('open');
  },

  closeDrawer() {
    const drawer = document.getElementById('cart-drawer-modal');
    if (drawer) drawer.classList.remove('open');
  }
};

window.BuchisapaCart = BuchisapaCart;
