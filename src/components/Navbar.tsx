import React, { useState } from 'react';
import { ShoppingBag, Phone, MapPin, Menu, X, ChefHat } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/menuData';

interface NavbarProps {
  onOpenKitchen: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenKitchen, activeSection, setActiveSection }) => {
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'menu', label: 'Carta Digital' },
    { id: 'promos', label: 'Combos & Promos' },
    { id: 'selva', label: 'Especialidades Amazónicas' },
    { id: 'info', label: 'Horarios & Ubicación' },
    { id: 'faq', label: 'Preguntas Frecuentes' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      {/* Top micro bar with 24-hour status & direct phone */}
      <div className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-amber-950 text-xs text-neutral-300 py-1.5 px-4 border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400 tracking-wide">¡ABIERTO AHORA 24 HORAS!</span>
            <span className="hidden sm:inline text-neutral-500">•</span>
            <span className="hidden sm:inline text-neutral-300">Caldos, Broaster, Hamburguesas &amp; Comida Selvática</span>
          </div>
          <div className="flex items-center gap-4 ml-auto text-xs">
            <a
              href={`https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=${encodeURIComponent('¡Hola Buchisapa! Deseo realizar una consulta o pedido.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp: {RESTAURANT_INFO.phone}</span>
            </a>
            <span className="hidden md:flex items-center gap-1 text-neutral-400">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Ate, Lima</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo and branding */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('hero')}>
          <div className="relative group">
            <img
              src="/logo.svg"
              alt="Buchisapa Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-full bg-neutral-900 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
                Buchi<span className="text-amber-400">Sapa</span>
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                24H
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block font-medium">
              Sabor que te llena • Ate, Lima
            </p>
          </div>
        </div>

        {/* Desktop and Tablet navigation links */}
        <nav className="hidden md:flex items-center gap-3.5 lg:gap-6 text-xs lg:text-sm font-medium">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`transition-colors relative py-1 hover:text-amber-400 cursor-pointer whitespace-nowrap ${
                activeSection === link.id ? 'text-amber-400 font-semibold' : 'text-neutral-300'
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Actions (Kitchen button + Cart trigger) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Kitchen Orders View trigger */}
          <button
            id="kitchen-orders-btn"
            onClick={onOpenKitchen}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 transition-all shadow-sm cursor-pointer whitespace-nowrap"
            title="Ver panel de pedidos y cocina"
          >
            <ChefHat className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">Mis Pedidos</span>
            <span className="lg:hidden">Cocina</span>
          </button>

          {/* Floating Cart Button */}
          <button
            id="open-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            aria-label="Abrir carrito de compras"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-950" />
            <span className="hidden sm:inline font-bold text-xs sm:text-sm">Carrito</span>
            {cartCount > 0 && (
              <span className="bg-neutral-950 text-amber-400 text-xs font-black rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle (Only on mobile < md) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 md:hidden cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-900 border-b border-neutral-800 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-neutral-200 hover:bg-neutral-800 hover:text-amber-400"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-neutral-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenKitchen();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-lg"
            >
              <ChefHat className="w-4 h-4 text-emerald-400" />
              <span>Ver Panel de Pedidos y Cocina</span>
            </button>
            <a
              href={`https://wa.me/${RESTAURANT_INFO.phoneRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Pedir directo al WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
