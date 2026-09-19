import React, { useState } from 'react';
import {
  X,
  ChefHat,
  ShoppingBag,
  Power,
  Layers,
  TrendingUp,
  Settings,
  BookOpen,
  Maximize2,
  Minimize2,
  ExternalLink,
  ShieldCheck,
  LayoutDashboard,
  Search,
  Plus,
  Home,
  ChevronRight,
  Flame,
  Store,
  User,
  SlidersHorizontal,
  Bell
} from 'lucide-react';
import { useCart, Order } from '../../context/CartContext';
import { useAuth, isEmailAdmin, isUidAdmin } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AdminAuthLogin } from './AdminAuthLogin';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminMenuTab } from './AdminMenuTab';
import { AdminReportsTab } from './AdminReportsTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminComplaintsTab } from './AdminComplaintsTab';
import { AdminReceiptPrint } from './AdminReceiptPrint';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin, adminLogin } = useAuth();
  const {
    orders,
    menuItems,
    complaints,
    storeSettings,
    createOrder
  } = useCart();

  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      isAdmin ||
      localStorage.getItem('buchisapa_admin_auth') === 'true' ||
      (user ? isEmailAdmin(user.email) || isUidAdmin(user.id) : false)
    );
  });

  // Sync if user is buchisapaweb@gmail.com or isAdmin or saved in localStorage
  React.useEffect(() => {
    if (isOpen) {
      if (
        isAdmin ||
        (user && (isEmailAdmin(user.email) || isUidAdmin(user.id))) ||
        localStorage.getItem('buchisapa_admin_auth') === 'true'
      ) {
        setIsAuthenticated(true);
      }
    }
  }, [isOpen, isAdmin, user]);

  // Window Navigation State (Sidebar Active Tab)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'menu' | 'reports' | 'settings' | 'complaints'>('dashboard');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);

  // Manual order form state
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

  if (!isOpen) return null;

  const handleLogout = async () => {
    setIsAuthenticated(false);
    localStorage.removeItem('buchisapa_admin_auth');
    localStorage.removeItem('buchisapa_admin_email');
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
  };

  const triggerPrintTicket = (order: Order) => {
    setSelectedOrderForPrint(order);
    setTimeout(() => {
      window.print();
    }, 150);
  };

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

  const pendingComplaintsCount = complaints.filter(c => c.status === 'pendiente').length;
  const newOrdersCount = orders.filter(o => o.status === 'recibido' || o.status === 'preparando').length;

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard / Panel de Control';
      case 'orders': return 'Comandas & Pedidos en Vivo';
      case 'menu': return 'Carta & Administración de Platos';
      case 'reports': return 'Reportes Financieros & Cuadre de Caja';
      case 'settings': return 'Ajustes del Local & Tarifas Delivery';
      case 'complaints': return 'Libro de Reclamaciones';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/70 backdrop-blur-sm flex items-center justify-center p-0 sm:p-3 overflow-hidden">
      
      {/* Print-only thermal receipt */}
      {selectedOrderForPrint && (
        <AdminReceiptPrint order={selectedOrderForPrint} />
      )}

      {/* Main SaaS Frame Container (Clean White/Slate Theme from Reference Images) */}
      <div className={`relative w-full bg-slate-50 text-slate-900 flex shadow-2xl border border-slate-200 overflow-hidden print:hidden transition-all duration-200 ${
        isFullscreen
          ? 'h-full max-h-screen rounded-none'
          : 'max-w-7xl h-[94vh] max-h-[94vh] rounded-3xl'
      }`}>

        {!isAuthenticated ? (
          <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <AdminAuthLogin onAuthenticated={() => setIsAuthenticated(true)} />
          </div>
        ) : (
          <div className="flex-1 flex flex-row min-h-0 overflow-hidden">
            
            {/* ================= LEFT SIDEBAR (Inspired by MediaCP Reference 1) ================= */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none z-10">
              
              <div className="flex flex-col flex-1 min-h-0">
                {/* Brand Logo Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/25 shrink-0">
                    <Flame className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-black text-base text-slate-900 tracking-tight font-heading">
                        BUCHI<span className="text-sky-500">SAPA</span>
                      </span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-sky-50 text-sky-600 border border-sky-200">
                        CP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">Control Panel 24H</p>
                  </div>
                </div>

                {/* Sidebar Navigation Items */}
                <nav className="p-3 space-y-1 overflow-y-auto flex-1 scrollbar-none">
                  
                  {/* Tab 1: Dashboard (Blue Active Button Style like Reference) */}
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'dashboard'
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="w-4 h-4 shrink-0" />
                      <span>Dashboard</span>
                    </div>
                    {newOrdersCount > 0 && activeTab !== 'dashboard' && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                  </button>

                  {/* Tab 2: Comandas & Pedidos */}
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'orders'
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span>Comandas & Pedidos</span>
                    </div>
                    {newOrdersCount > 0 ? (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                        activeTab === 'orders' ? 'bg-white text-sky-600' : 'bg-red-500 text-white'
                      }`}>
                        {newOrdersCount}
                      </span>
                    ) : (
                      <span className={`text-[10px] font-semibold ${activeTab === 'orders' ? 'text-sky-100' : 'text-slate-400'}`}>
                        {orders.length}
                      </span>
                    )}
                  </button>

                  {/* Tab 3: Carta & Menú */}
                  <button
                    onClick={() => setActiveTab('menu')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'menu'
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Layers className="w-4 h-4 shrink-0" />
                      <span>Carta & Platos</span>
                    </div>
                    <span className={`text-[10px] font-semibold ${activeTab === 'menu' ? 'text-sky-100' : 'text-slate-400'}`}>
                      {menuItems.length}
                    </span>
                  </button>

                  {/* Tab 4: Reportes & Caja */}
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'reports'
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 shrink-0" />
                      <span>Reportes & Caja</span>
                    </div>
                  </button>

                  {/* Tab 5: Ajustes del Local */}
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4 shrink-0" />
                      <span>Ajustes del Local</span>
                    </div>
                  </button>

                  {/* Tab 6: Libro de Reclamaciones */}
                  <button
                    onClick={() => setActiveTab('complaints')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'complaints'
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span>Reclamaciones</span>
                    </div>
                    {pendingComplaintsCount > 0 && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                        {pendingComplaintsCount}
                      </span>
                    )}
                  </button>

                </nav>
              </div>

              {/* Sidebar Footer (Store Live Status) */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">Atención 24 Horas:</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    storeSettings.isStoreOpen
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {storeSettings.isStoreOpen ? 'Abierto' : 'Cerrado'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Buchisapa v2.6 • Supabase Live DB
                </div>
              </div>

            </aside>

            {/* ================= MAIN CONTENT AREA ================= */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
              
              {/* TOP HEADER (Inspired by MediaCP / SaaS Reference) */}
              <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 select-none z-10">
                
                {/* Left: Breadcrumbs & Current Page Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Home className="w-3.5 h-3.5 text-sky-500" />
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span className="font-bold text-slate-800 capitalize truncate">
                      {getBreadcrumbTitle()}
                    </span>
                  </div>
                </div>

                {/* Right: Search + Quick Order + Admin Status + Fullscreen/Close */}
                <div className="flex items-center gap-3">
                  
                  {/* Search bar */}
                  <div className="relative hidden md:block w-48 lg:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                      placeholder="Buscar pedido, plato..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Manual Order Action */}
                  <button
                    onClick={() => setIsManualOrderOpen(true)}
                    className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shadow-emerald-600/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Pedido</span>
                  </button>

                  {/* Administrator Profile Pill */}
                  <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="hidden lg:block text-left">
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        ADMINISTRATOR
                      </span>
                      <span className="text-[10px] text-slate-400 block leading-tight">
                        buchisapaweb@gmail.com
                      </span>
                    </div>
                  </div>

                  {/* Window Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer border border-slate-200"
                      title="Cerrar sesión"
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer border border-slate-200"
                      title={isFullscreen ? "Restaurar" : "Pantalla completa"}
                    >
                      {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer border border-slate-200"
                      title="Cerrar panel"
                    >
                      <X className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                </div>

              </header>

              {/* BODY CONTAINER (Scrollable workspace with white card modules) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {activeTab === 'dashboard' && (
                  <AdminOverviewTab
                    onNavigateTab={(tab) => setActiveTab(tab)}
                    onOpenManualOrder={() => setIsManualOrderOpen(true)}
                    onPrintTicket={triggerPrintTicket}
                  />
                )}
                {activeTab === 'orders' && (
                  <AdminOrdersTab onPrintTicket={triggerPrintTicket} />
                )}
                {activeTab === 'menu' && <AdminMenuTab />}
                {activeTab === 'reports' && <AdminReportsTab />}
                {activeTab === 'settings' && <AdminSettingsTab />}
                {activeTab === 'complaints' && <AdminComplaintsTab />}
              </div>

            </main>

          </div>
        )}

      </div>

      {/* ================= MODAL: NUEVA COMANDA MANUAL ================= */}
      {isManualOrderOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm uppercase text-slate-950 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Registrar Comanda Manual (Salón / Teléfono)</span>
              </h3>
              <button onClick={() => setIsManualOrderOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrderSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre Cliente</label>
                  <input
                    type="text"
                    value={manualOrderData.customerName}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, customerName: e.target.value })}
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={manualOrderData.customerPhone}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, customerPhone: e.target.value })}
                    placeholder="999888777"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Pedido</label>
                  <select
                    value={manualOrderData.orderType}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, orderType: e.target.value as any })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-sky-500"
                  >
                    <option value="delivery">🛵 Delivery</option>
                    <option value="pickup">🛍️ Para Llevar / Recojo</option>
                    <option value="dinein">🍽️ En Salón (Mesa)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Medio de Pago</label>
                  <select
                    value={manualOrderData.paymentMethod}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, paymentMethod: e.target.value as any })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-sky-500"
                  >
                    <option value="yape">🟣 Yape</option>
                    <option value="plin">🔵 Plin</option>
                    <option value="efectivo">💵 Efectivo (Contra Entrega)</option>
                  </select>
                </div>
              </div>

              {manualOrderData.orderType === 'delivery' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dirección de Entrega</label>
                  <input
                    type="text"
                    value={manualOrderData.deliveryAddress}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, deliveryAddress: e.target.value })}
                    placeholder="Av. Principal 123, Ate"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              )}

              {manualOrderData.orderType === 'dinein' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Número de Mesa</label>
                  <input
                    type="text"
                    value={manualOrderData.tableNumber}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, tableNumber: e.target.value })}
                    placeholder="Mesa 4"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Seleccionar Plato</label>
                  <select
                    value={manualOrderData.selectedDishId}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, selectedDishId: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-sky-500"
                  >
                    {menuItems.map(m => (
                      <option key={m.id} value={m.id}>{m.name} - S/ {m.price.toFixed(2)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={manualOrderData.quantity}
                    onChange={(e) => setManualOrderData({ ...manualOrderData, quantity: Math.max(1, Number(e.target.value)) })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Indicaciones de cocina</label>
                <input
                  type="text"
                  value={manualOrderData.notes}
                  onChange={(e) => setManualOrderData({ ...manualOrderData, notes: e.target.value })}
                  placeholder="Ej: Papas bien doraditas, cremas aparte..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  Crear Comanda
                </button>
                <button
                  type="button"
                  onClick={() => setIsManualOrderOpen(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
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
