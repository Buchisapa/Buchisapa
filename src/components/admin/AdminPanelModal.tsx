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
  ShieldCheck
} from 'lucide-react';
import { useCart, Order } from '../../context/CartContext';
import { useAuth, isEmailAdmin, isUidAdmin } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AdminAuthLogin } from './AdminAuthLogin';
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

  // Window Navigation State (Tab / View Window)
  const [activeWindow, setActiveWindow] = useState<'orders' | 'menu' | 'reports' | 'settings' | 'complaints'>('orders');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);

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

  const pendingComplaintsCount = complaints.filter(c => c.status === 'pendiente').length;
  const newOrdersCount = orders.filter(o => o.status === 'recibido' || o.status === 'preparando').length;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-1 sm:p-4 overflow-hidden">
      
      {/* Print-only receipt element */}
      {selectedOrderForPrint && (
        <AdminReceiptPrint order={selectedOrderForPrint} />
      )}

      {/* Main Clean White Window Container */}
      <div className={`relative w-full bg-white text-neutral-900 flex flex-col shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:hidden transition-all ${
        isFullscreen
          ? 'h-full max-h-screen rounded-none'
          : 'max-w-6xl h-[92vh] max-h-[92vh] rounded-3xl'
      }`}>
        
        {/* Top Window Titlebar (Clean Header) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-neutral-200 shrink-0 select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/20">
              <ChefHat className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-neutral-950 tracking-tight font-heading">
                  Panel de Administración Buchisapa
                </h2>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  storeSettings.isStoreOpen
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {storeSettings.isStoreOpen ? '● Local Abierto 24H' : '○ Local Cerrado'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Gestión integral de comandas, menú, reportes de caja y reclamos
              </p>
            </div>
          </div>

          {/* Top Actions & Window Controls */}
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 px-3 py-1 rounded-xl text-xs text-neutral-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-neutral-900">buchisapaweb@gmail.com</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-red-600 bg-neutral-100 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-neutral-200 transition-all cursor-pointer"
                  title="Cerrar sesión de administrador"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-all cursor-pointer border border-neutral-200"
              title={isFullscreen ? "Restaurar tamaño" : "Pantalla completa"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer border border-neutral-200"
              aria-label="Cerrar panel"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Content body based on Authentication */}
        {!isAuthenticated ? (
          <AdminAuthLogin onAuthenticated={() => setIsAuthenticated(true)} />
        ) : (
          <div className="flex-1 flex flex-col min-h-0 bg-neutral-50/50">
            {/* Windows Navigation Bar */}
            <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-white border-b border-neutral-200 overflow-x-auto scrollbar-none shrink-0 shadow-xs">
              <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400 mr-1 hidden sm:inline">
                Módulos:
              </span>

              {/* Window 1: Comandas en Vivo */}
              <button
                onClick={() => setActiveWindow('orders')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  activeWindow === 'orders'
                    ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/20'
                    : 'bg-white text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 border-neutral-200'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>1. Comandas en Vivo</span>
                {newOrdersCount > 0 ? (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    activeWindow === 'orders' ? 'bg-white text-red-600' : 'bg-red-600 text-white'
                  }`}>
                    {newOrdersCount}
                  </span>
                ) : (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeWindow === 'orders' ? 'bg-red-700 text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {orders.length}
                  </span>
                )}
              </button>

              {/* Window 2: Carta & Platos */}
              <button
                onClick={() => setActiveWindow('menu')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  activeWindow === 'menu'
                    ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/20'
                    : 'bg-white text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 border-neutral-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>2. Carta & Platos</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeWindow === 'menu' ? 'bg-red-700 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {menuItems.length}
                </span>
              </button>

              {/* Window 3: Reportes & Caja */}
              <button
                onClick={() => setActiveWindow('reports')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  activeWindow === 'reports'
                    ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/20'
                    : 'bg-white text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 border-neutral-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>3. Reportes & Caja</span>
              </button>

              {/* Window 4: Ajustes de Tienda */}
              <button
                onClick={() => setActiveWindow('settings')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  activeWindow === 'settings'
                    ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/20'
                    : 'bg-white text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 border-neutral-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>4. Ajustes del Local</span>
              </button>

              {/* Window 5: Reclamaciones */}
              <button
                onClick={() => setActiveWindow('complaints')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  activeWindow === 'complaints'
                    ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/20'
                    : 'bg-white text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 border-neutral-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>5. Reclamaciones</span>
                {pendingComplaintsCount > 0 && (
                  <span className="bg-amber-500 text-neutral-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {pendingComplaintsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Scrollable Window Workspace (Clean White Background) */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
              {activeWindow === 'orders' && <AdminOrdersTab onPrintTicket={triggerPrintTicket} />}
              {activeWindow === 'menu' && <AdminMenuTab />}
              {activeWindow === 'reports' && <AdminReportsTab />}
              {activeWindow === 'settings' && <AdminSettingsTab />}
              {activeWindow === 'complaints' && <AdminComplaintsTab />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
