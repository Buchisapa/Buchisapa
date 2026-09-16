import React, { useState } from 'react';
import {
  ShoppingBag,
  MapPin,
  Search,
  User,
  ChevronDown,
  Menu,
  X,
  Phone,
  ChefHat,
  Percent,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/menuData';

interface NavbarProps {
  onOpenKitchen: () => void;
  onOpenAuth: () => void;
  onOpenLocation: () => void;
  currentZone: string;
  activeSection: string;
  setActiveSection: (section: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenKitchen,
  onOpenAuth,
  onOpenLocation,
  currentZone,
  activeSection,
  setActiveSection,
  searchQuery,
  setSearchQuery,
}) => {
  const { cartCount, cartSubtotal, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [cartaOpen, setCartaOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setCartaOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
      {/* 24-Hour Notice Banner (Subtle Top Bar) */}
      <div className="bg-neutral-900 text-neutral-300 text-[11px] py-1 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-emerald-400">Atención 24 Horas en Ate</span>
            <span className="text-neutral-500 hidden sm:inline">•</span>
            <span className="text-neutral-300 hidden sm:inline">Delivery &amp; Salón continuo</span>
          </div>
          <a
            href={`https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=${encodeURIComponent('¡Hola Buchisapa! Deseo hacer un pedido.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>WhatsApp 24H: {RESTAURANT_INFO.phone}</span>
          </a>
        </div>
      </div>

      {/* Main Pardos-Style White Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 lg:gap-6">
        {/* Left: Logo + Location Selector + Primary Links */}
        <div className="flex items-center gap-3 lg:gap-6">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
          >
            <img
              src="/logo.svg"
              alt="Buchisapa Logo"
              className="h-11 w-11 sm:h-13 sm:w-13 object-contain rounded-full bg-neutral-950 ring-2 ring-neutral-900 group-hover:scale-105 transition-transform"
            />
            <div className="hidden xl:block">
              <span className="text-xl font-black tracking-tight text-neutral-900 font-heading">
                Buchi<span className="text-red-600">Sapa</span>
              </span>
            </div>
          </div>

          {/* Location Delivery Selector (e.g. Entregar a Ate ▾) */}
          <button
            onClick={onOpenLocation}
            className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors text-xs sm:text-sm font-semibold cursor-pointer border border-transparent hover:border-neutral-200"
            title="Cambiar dirección o zona de entrega"
          >
            <MapPin className="w-4 h-4 text-red-600 shrink-0" />
            <span className="max-w-[110px] sm:max-w-[150px] truncate text-neutral-900">
              {currentZone}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-bold tracking-wider text-neutral-800 uppercase">
            <button
              onClick={() => handleNavClick('promos')}
              className="hover:text-red-600 transition-colors cursor-pointer py-1"
            >
              PROMOCIONES
            </button>

            {/* Categorías Dropdown / Scroll */}
            <div className="relative">
              <button
                onClick={() => {
                  setCategoriesOpen(!categoriesOpen);
                  setCartaOpen(false);
                }}
                className="flex items-center gap-1 hover:text-red-600 transition-colors cursor-pointer py-1"
              >
                <span>CATEGORÍAS</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      handleNavClick('categorias-grid');
                      setCategoriesOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-red-600"
                  >
                    Ver Cuadrícula de Categorías
                  </button>
                  <div className="h-px bg-neutral-100 my-1" />
                  <button
                    onClick={() => {
                      handleNavClick('menu');
                      setCategoriesOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50 hover:text-red-600"
                  >
                    Sánguches &amp; Hamburguesas
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick('menu');
                      setCategoriesOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50 hover:text-red-600"
                  >
                    Pollo Broaster
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick('selva');
                      setCategoriesOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50 hover:text-red-600"
                  >
                    Platos de la Selva
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick('menu');
                      setCategoriesOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50 hover:text-red-600"
                  >
                    Caldos &amp; Ensaladas
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick('menu');
                      setCategoriesOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50 hover:text-red-600"
                  >
                    Salchipapas &amp; Mixtos
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick('menu');
                      setCategoriesOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50 hover:text-red-600"
                  >
                    Bebidas Amazónicas
                  </button>
                </div>
              )}
            </div>

            {/* Carta Salón / Digital */}
            <button
              onClick={() => handleNavClick('menu')}
              className="hover:text-red-600 transition-colors cursor-pointer py-1"
            >
              CARTA SALÓN
            </button>
          </nav>
        </div>

        {/* Center/Right: Search Pill + Mi Pedido + Ingresar */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto">
          {/* Search Pill Input (Exact Pardos format) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative w-48 lg:w-64"
          >
            <Search className="w-4 h-4 text-red-600 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué se te antoja?"
              className="w-full pl-9 pr-3 py-2 text-xs lg:text-sm bg-neutral-50 hover:bg-white focus:bg-white text-neutral-900 placeholder-neutral-500 rounded-full border border-neutral-300 focus:outline-none focus:border-red-600 transition-all shadow-inner"
            />
          </form>

          {/* MI PEDIDO Button (Shopping Cart) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 py-2 px-3 sm:px-4 rounded-full text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer font-bold text-xs sm:text-sm border border-neutral-200 shadow-sm shrink-0"
            aria-label="Abrir mi pedido"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[10px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline uppercase text-xs tracking-wider">
              MI PEDIDO
            </span>
            {cartSubtotal > 0 && (
              <span className="hidden md:inline text-xs text-neutral-500 font-semibold">
                • S/ {cartSubtotal.toFixed(2)}
              </span>
            )}
          </button>

          {/* INGRESAR Red Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
          >
            <User className="w-4 h-4 text-white" />
            <span>INGRESAR</span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 lg:hidden cursor-pointer"
            aria-label="Menú móvil"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search input (< md) */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-red-600 absolute left-3.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Qué se te antoja?"
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100 text-neutral-900 placeholder-neutral-500 rounded-full border border-neutral-200 focus:outline-none focus:border-red-600"
          />
        </form>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-200 px-4 py-4 space-y-2 text-sm font-bold text-neutral-800 uppercase animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNavClick('promos')}
            className="block w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 text-red-600"
          >
            PROMOCIONES
          </button>
          <button
            onClick={() => handleNavClick('categorias-grid')}
            className="block w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100"
          >
            CATEGORÍAS
          </button>
          <button
            onClick={() => handleNavClick('menu')}
            className="block w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100"
          >
            CARTA SALÓN / DELIVERY
          </button>
          <button
            onClick={() => handleNavClick('selva')}
            className="block w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100"
          >
            ESPECIALIDADES AMAZÓNICAS
          </button>
          <button
            onClick={() => handleNavClick('info')}
            className="block w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100"
          >
            HORARIOS &amp; ATENCIÓN 24 HORAS
          </button>

          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenKitchen();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 rounded-lg"
            >
              <ChefHat className="w-4 h-4 text-emerald-600" />
              <span>Ver Panel de Cocina / KDS</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
