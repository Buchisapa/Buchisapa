/**
 * RESTAURANTE BUCHISAPA - Cliente Supabase JS
 * Conecta con el proyecto viciehedjjpyykjbmzwe
 */

const SUPABASE_CONFIG = {
  url: 'https://viciehedjjpyykjbmzwe.supabase.co',
  anonKey: 'sb_publishable_5_y04282Zyz4lmXEvm9ASw_Cw22k6RF'
};

const BuchisapaAPI = {
  /**
   * Petición REST a Supabase
   */
  async request(endpoint, options = {}) {
    const url = `${SUPABASE_CONFIG.url}/rest/v1/${endpoint.replace(/^\//, '')}`;
    const headers = {
      'apikey': SUPABASE_CONFIG.anonKey,
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(options.headers || {})
    };

    try {
      const res = await fetch(url, { ...options, headers });
      if (!res.ok) {
        throw new Error(`Error Supabase [${res.status}]: ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      console.warn('Fallo Supabase, intentando vía backend PHP...', err);
      // Fallback a PHP local si falla la conexión directa
      return await this.fallbackPhp(endpoint, options);
    }
  },

  /**
   * Fallback a PHP
   */
  async fallbackPhp(endpoint, options) {
    try {
      let phpUrl = '/php/products.php';
      if (endpoint.startsWith('orders')) phpUrl = '/php/orders.php';
      if (endpoint.startsWith('claims')) phpUrl = '/php/claims.php';

      const res = await fetch(phpUrl, options);
      return await res.json();
    } catch (e) {
      console.error('Error total en API:', e);
      return null;
    }
  },

  /**
   * Obtener productos
   */
  async getProducts() {
    return await this.request('products?select=*&order=popular.desc');
  },

  /**
   * Obtener categorías
   */
  async getCategories() {
    return await this.request('categories?select=*');
  },

  /**
   * Guardar nuevo pedido
   */
  async createOrder(orderData) {
    return await this.request('orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  /**
   * Registrar reclamo
   */
  async createClaim(claimData) {
    return await this.request('claims', {
      method: 'POST',
      body: JSON.stringify(claimData)
    });
  }
};

window.BuchisapaAPI = BuchisapaAPI;
