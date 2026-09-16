import React, { useState, useRef, useEffect } from 'react';
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
  Flame,
  Utensils,
  Star,
  LayoutList,
  BookOpen,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO, CATEGORIES } from '../data/menuData';

interface NavbarProps {
  onOpenKitchen: () => void;
  onOpenAuth: () => void;
  onOpenLocation: () => void;
  currentZone: string;
  onGoHome: () => void;
  onOpenPromotions: () => void;
  onSelectCategory: (categoryKey: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenKitchen,
  onOpenAuth,
  onOpenLocation,
  currentZone,
  onGoHome,
  onOpenPromotions,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  isSearching,
  setIsSearching,
}) => {
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [salonDropdownOpen, setSalonDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileSalonOpen, setMobileSalonOpen] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const salonRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
      if (salonRef.current && !salonRef.current.contains(event.target as Node)) {
        setSalonDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClick = () => {
    setIsSearching(!isSearching);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/90 shadow-xs">
      {/* Top Main Navigation Bar (Screenshot 1 Exact Layout) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left Elements: Hamburger (Mobile only) + Logo + Location Selector + Links */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          {/* Red Hamburger Menu Button (Mobile only) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-red-600 hover:bg-red-50 active:scale-95 transition-all cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Buchisapa Circular Badge Logo */}
          <div
            onClick={onGoHome}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
            title="Ir al inicio"
          >
            <img
              src="/buchisapa_oficial_hd.png"
              alt="Buchisapa Logo"
              width={40}
              height={40}
              style={{ width: '40px', height: '40px', maxWidth: '40px', maxHeight: '40px', objectFit: 'contain' }}
              className="logo-img h-9 w-9 sm:h-10 sm:w-10 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="hidden sm:inline text-lg font-black tracking-tight text-neutral-900 font-heading">
              Buchi<span className="text-red-600">Sapa</span>
            </span>
          </div>

          {/* Location Delivery Selector (Entregar a Lima ⌵) */}
          <button
            onClick={onOpenLocation}
            className="flex items-center gap-1 sm:gap-1.5 py-1 px-1.5 sm:px-2.5 rounded-full hover:bg-neutral-100 text-red-600 transition-colors text-xs sm:text-sm font-bold cursor-pointer"
            title="Cambiar dirección o zona de entrega"
          >
            <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="max-w-[110px] sm:max-w-[140px] truncate text-red-600">
              {currentZone}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-red-600 shrink-0" />
          </button>

          {/* Desktop Navigation Links (Screenshot 1: PROMOCIONES, CATEGORÍAS ⌵, CARTA SALÓN ⌵) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs font-bold tracking-wider text-neutral-800 uppercase">
            {/* Promociones Link */}
            <button
              onClick={onOpenPromotions}
              className="hover:text-red-600 transition-colors cursor-pointer py-1"
            >
              PROMOCIONES
            </button>

            {/* Categorías Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => {
                  setCategoriesDropdownOpen(!categoriesDropdownOpen);
                  setSalonDropdownOpen(false);
                }}
                className="flex items-center gap-1 hover:text-red-600 transition-colors cursor-pointer py-1"
              >
                <span>CATEGORÍAS</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriesDropdownOpen ? 'rotate-180 text-red-600' : ''}`} />
              </button>

              {/* Categorías Dropdown Menu */}
              {categoriesDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-3 py-1.5 border-b border-neutral-100">
                    Nuestra Carta
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100/60 py-1">
                    {CATEGORIES.filter((c) => c.id !== 'todos').map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.id);
                          setCategoriesDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-neutral-800 hover:text-red-600 hover:bg-neutral-50 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-neutral-400 font-medium lowercase">ver</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Carta Salón Dropdown */}
            <div className="relative" ref={salonRef}>
              <button
                onClick={() => {
                  setSalonDropdownOpen(!salonDropdownOpen);
                  setCategoriesDropdownOpen(false);
                }}
                className="flex items-center gap-1 hover:text-red-600 transition-colors cursor-pointer py-1"
              >
                <span>CARTA SALÓN</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${salonDropdownOpen ? 'rotate-180 text-red-600' : ''}`} />
              </button>

              {/* Carta Salón Dropdown Menu */}
              {salonDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      onGoHome();
                      setSalonDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-neutral-800 hover:text-red-600 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    Salón Principal Buchisapa
                  </button>
                  <button
                    onClick={() => {
                      onOpenLocation();
                      setSalonDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-neutral-800 hover:text-red-600 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    Horarios de Atención
                  </button>
                  <button
                    onClick={() => {
                      onOpenKitchen();
                      setSalonDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Pantalla de Cocina KDS</span>
                    <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Elements: Search input + MI PEDIDO + INGRESAR (Screenshot 1) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Search Input Field with Red Magnifier */}
          <div className="hidden md:flex items-center relative w-48 lg:w-64">
            <Search className="w-4 h-4 text-red-600 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué se te antoja?"
              className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 hover:bg-white focus:bg-white text-neutral-900 placeholder-neutral-500 rounded-full border border-neutral-300 focus:outline-none focus:border-red-600 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-neutral-400 hover:text-neutral-700 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Mobile Search Icon Toggle */}
          <button
            onClick={handleSearchClick}
            className="md:hidden p-1.5 rounded-full text-neutral-900 hover:text-red-600 transition-colors cursor-pointer"
            aria-label="Buscar platos"
          >
            <Search className="w-6 h-6 stroke-[1.8]" />
          </button>

          {/* Desktop & Mobile Cart / MI PEDIDO Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 py-1.5 px-2 md:px-3 rounded-full hover:bg-neutral-100 text-neutral-900 transition-colors cursor-pointer"
            aria-label="Abrir carrito de compras"
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6 md:w-4 md:h-4 text-neutral-900 md:text-red-600 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-xs font-extrabold uppercase tracking-wider text-neutral-900">
              MI PEDIDO
            </span>
          </button>

          {/* Desktop Ingresar Button (Screenshot 1: Solid Red Pill Button - Hidden on mobile) */}
          <button
            onClick={onOpenAuth}
            className="hidden md:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider py-2 px-5 rounded-full shadow-sm hover:shadow-red-600/20 transition-all cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-white" />
            <span>INGRESAR</span>
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search Input */}
      {isSearching && (
        <div className="md:hidden px-3.5 py-2 bg-neutral-50 border-t border-neutral-200 animate-in slide-in-from-top-1 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-red-600 absolute left-3.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca por plato (broaster, hamburguesa, cecina...)"
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-white text-neutral-900 placeholder-neutral-500 rounded-full border border-neutral-300 focus:outline-none focus:border-red-600 shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1.5 text-neutral-400 hover:text-neutral-700 text-sm font-bold"
                >
                  ×
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSearching(false);
                setSearchQuery('');
              }}
              className="text-xs font-bold text-neutral-600 hover:text-neutral-900 px-2 py-1"
            >
              Cerrar
            </button>
          </form>
        </div>
      )}

      {/* Mobile Sidebar Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex animate-in fade-in duration-200">
          <div className="w-[85%] max-w-sm bg-neutral-50 h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200 relative">
            
            <div>
              {/* Drawer Header with Logo and Close */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 flex items-center justify-center bg-transparent">
                    <img
                      src="/buchisapa_oficial_hd.png"
                      alt="Buchisapa Burger Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="text-[17px] font-black text-neutral-900 tracking-wide uppercase font-heading">
                    Buchisapa Burger
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-7 h-7 stroke-[2.5]" />
                </button>
              </div>

              {/* Menu Items (Cards) */}
              <div className="p-4 space-y-3">
                {/* Promociones */}
                <button
                  onClick={() => {
                    onOpenPromotions();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-neutral-100"
                >
                  <Star className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="text-[15px] font-black uppercase text-neutral-900 tracking-wide">Promociones</span>
                </button>

                {/* Categorías Accordion */}
                <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-neutral-100 overflow-hidden">
                  <button
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className="w-full flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <LayoutList className="w-5 h-5 text-red-600 shrink-0" />
                      <span className="text-[15px] font-black uppercase text-neutral-900 tracking-wide">Categorías</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform text-neutral-900 stroke-[2.5] ${mobileCategoriesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileCategoriesOpen && (
                    <div className="px-[52px] pb-4 space-y-4">
                      {CATEGORIES.filter((c) => c.id !== "todos").map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            onGoHome();
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-left text-neutral-800 text-[15px] font-medium block hover:text-red-600 transition-colors"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Mi Pedido Actual */}
                <button
                  onClick={() => {
                    setIsCartOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-neutral-100"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-red-600 shrink-0" />
                    <span className="text-[15px] font-black uppercase text-neutral-900 tracking-wide">Mi Pedido Actual</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="text-sm font-black text-white bg-red-600 rounded-full px-2.5 py-0.5">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Carta Salón Accordion */}
                <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-neutral-100 overflow-hidden">
                  <button
                    onClick={() => setMobileSalonOpen(!mobileSalonOpen)}
                    className="w-full flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-red-600 shrink-0" />
                      <span className="text-[15px] font-black uppercase text-neutral-900 tracking-wide">Carta Salón</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform text-neutral-900 stroke-[2.5] ${mobileSalonOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileSalonOpen && (
                    <div className="px-[52px] pb-4 space-y-4">
                      {["Lima", "Provincia", "Asia", "Aeropuerto"].map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-left text-neutral-800 text-[15px] font-medium block hover:text-red-600 transition-colors"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Footer Area */}
            <div className="p-4 bg-white border-t border-neutral-100 flex flex-col gap-5 pt-6 pb-8">
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3.5 bg-[#E6192B] hover:bg-red-700 text-white rounded-lg text-[15px] font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <User className="w-4 h-4" />
                <span>INGRESAR</span>
              </button>
              
              <a
                href={`https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=${encodeURIComponent('¡Hola Buchisapa! Deseo hacer un pedido.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-lg text-[15px] font-bold flex items-center justify-center gap-2 border border-[#25D366]/30 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Contactar por WhatsApp</span>
              </a>

              <div className="text-center mt-2">
                <span className="text-base text-neutral-700 font-bold tracking-wide uppercase">SABOR QUE TE </span>
                <span className="text-base text-black font-black tracking-wide uppercase">LLENA</span>
              </div>
            </div>
          </div>

          {/* Backdrop Click */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Navbar;
