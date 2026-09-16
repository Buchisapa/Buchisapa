import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { BentoCategories } from './components/BentoCategories';
import { PromotionsSection } from './components/PromotionsSection';
import { SelvaHighlight } from './components/SelvaHighlight';
import { MenuSection } from './components/MenuSection';
import { InfoSection } from './components/InfoSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { KitchenOrdersModal } from './components/KitchenOrdersModal';
import { LocationModal } from './components/LocationModal';
import { AuthModal } from './components/AuthModal';
import { MenuItem } from './data/menuData';

export function App() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isKitchenOpen, setIsKitchenOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [currentZone, setCurrentZone] = useState<string>('Entregar a Ate');
  const [activeSection, setActiveSection] = useState('hero');

  const scrollToMenuWithCategory = (category: string) => {
    setSelectedCategory(category);
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPromos = () => {
    const promoEl = document.getElementById('promos');
    if (promoEl) {
      promoEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSelva = () => {
    setSelectedCategory('selvaticos');
    const selvaEl = document.getElementById('selva');
    if (selvaEl) {
      selvaEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-red-600 selection:text-white">
        {/* Pardos-Style White Navigation Bar */}
        <Navbar
          onOpenKitchen={() => setIsKitchenOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenLocation={() => setIsLocationOpen(true)}
          currentZone={currentZone}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* 1. Panoramic Hero Promo Banner Carousel (Exact Pardos format) */}
          <div id="hero">
            <HeroCarousel
              onOrderNow={() => scrollToMenuWithCategory('todos')}
              onExplorePromo={scrollToPromos}
              onExploreSelva={scrollToSelva}
            />
          </div>

          {/* 2. Visual Bento Grid of Categories (Screenshots 1, 2, 3) */}
          <BentoCategories
            onSelectCategory={(catId) => scrollToMenuWithCategory(catId)}
            onOpenPromotions={scrollToPromos}
          />

          {/* 3. Combos & Promotions */}
          <PromotionsSection />

          {/* 4. Full Interactive Digital Menu (Carta Salón & Delivery) */}
          <MenuSection
            onSelectItem={(item) => setSelectedItem(item)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            externalSearchTerm={searchQuery}
          />

          {/* 5. Amazonian Flavors Highlight */}
          <SelvaHighlight
            onSelectItem={(item) => setSelectedItem(item)}
            onViewAllSelva={() => scrollToMenuWithCategory('selvaticos')}
          />

          {/* 6. Full Information: Horarios 24h, Ubicación en Ate, Yape/Plin, FAQ */}
          <InfoSection />
        </main>

        {/* 7. Footer (Exact 5-column layout with Libro de Reclamaciones, phone & payment badges) */}
        <Footer />

        {/* Modals & Drawers */}
        <ProductDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />

        <CartDrawer />

        <KitchenOrdersModal
          isOpen={isKitchenOpen}
          onClose={() => setIsKitchenOpen(false)}
        />

        <LocationModal
          isOpen={isLocationOpen}
          onClose={() => setIsLocationOpen(false)}
          currentZone={currentZone}
          onSelectZone={(zone) => setCurrentZone(zone.startsWith('Entregar a') ? zone : `Entregar a ${zone}`)}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onOpenKitchen={() => setIsKitchenOpen(true)}
        />

        {/* Floating WhatsApp Quick Contact Button */}
        <a
          href="https://wa.me/51943312024?text=%C2%A1Hola%20Buchisapa!%20Deseo%20hacer%20un%20pedido%20o%20consulta."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 left-5 z-40 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-emerald-300/40 group cursor-pointer"
          title="Escribir al WhatsApp oficial 24 Horas"
        >
          <Phone className="w-5 h-5 text-neutral-950 fill-neutral-950 shrink-0" />
          <span className="hidden sm:inline text-xs font-black tracking-wide">
            WhatsApp 24h
          </span>
        </a>
      </div>
    </CartProvider>
  );
}

export default App;
