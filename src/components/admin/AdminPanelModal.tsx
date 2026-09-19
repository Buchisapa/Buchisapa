import React, { useState, useMemo } from 'react';
import {
  X,
  Lock,
  Unlock,
  ChefHat,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Phone,
  MessageCircle,
  Printer,
  Plus,
  Edit2,
  Trash2,
  Search,
  DollarSign,
  TrendingUp,
  Settings,
  BookOpen,
  Power,
  RotateCcw,
  Check,
  Filter,
  Save,
  ShieldCheck,
  Eye,
  EyeOff,
  Store,
  Layers,
  Sparkles,
  Mail,
  KeyRound,
  Database
} from 'lucide-react';
import { useCart, Order, StoreSettings } from '../../context/CartContext';
import { useAuth, isEmailAdmin, isUidAdmin } from '../../context/AuthContext';
import { CATEGORIES, MenuItem, RESTAURANT_INFO } from '../../data/menuData';
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

  // Active Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'reports' | 'settings' | 'complaints'>('orders');
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

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      
      {/* Print-only receipt element */}
      {selectedOrderForPrint && (
        <AdminReceiptPrint order={selectedOrderForPrint} />
      )}

      {/* Main Container */}
      <div className="relative w-full max-w-6xl bg-neutral-900 text-white rounded-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-neutral-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-neutral-950 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-md shadow-red-600/30">
              <ChefHat className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                  Panel de Administración Buchisapa
                </h2>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  storeSettings.isStoreOpen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {storeSettings.isStoreOpen ? '● Local Abierto 24H' : '○ Local Cerrado'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Control de Comandas, Menú en Vivo, Reportes y Caja
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full text-xs text-neutral-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-neutral-400">Admin:</span>
                  <span className="font-bold text-white">buchisapaweb@gmail.com</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-400 bg-neutral-800 hover:bg-neutral-800/80 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                  title="Cerrar sesión de administrador"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>Salir</span>
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Cerrar panel"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Content body based on Authentication */}
        {!isAuthenticated ? (
          <AdminAuthLogin onAuthenticated={() => setIsAuthenticated(true)} />
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 px-3 sm:px-6 py-2 bg-neutral-950/90 border-b border-neutral-800 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Comandas en Vivo</span>
                <span className="bg-neutral-900/60 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('menu')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'menu'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Carta & Platos</span>
                <span className="bg-neutral-900/60 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  {menuItems.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'reports'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Reportes & Caja</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Ajustes Restaurante</span>
              </button>

              <button
                onClick={() => setActiveTab('complaints')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'complaints'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Reclamaciones</span>
                {complaints.filter(c => c.status === 'pendiente').length > 0 && (
                  <span className="bg-amber-500 text-neutral-950 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                    {complaints.filter(c => c.status === 'pendiente').length}
                  </span>
                )}
              </button>
            </div>

            {/* Scrollable Main Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
              {activeTab === 'orders' && <AdminOrdersTab onPrintTicket={triggerPrintTicket} />}
              {activeTab === 'menu' && <AdminMenuTab />}
              {activeTab === 'reports' && <AdminReportsTab />}
              {activeTab === 'settings' && <AdminSettingsTab />}
              {activeTab === 'complaints' && <AdminComplaintsTab />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
