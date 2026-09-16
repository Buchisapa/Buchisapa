import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PromotionsSection } from './components/PromotionsSection';
import { SelvaHighlight } from './components/SelvaHighlight';
import { MenuSection } from './components/MenuSection';
import { InfoSection } from './components/InfoSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { KitchenOrdersModal } from './components/KitchenOrdersModal';
import { MenuItem } from './data/menuData';

export function App() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [isKitchenOpen, setIsKitchenOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('menu');

  const handleExploreMenu = () => {
    setSelectedCategory('todos');
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreSelva = () => {
    setSelectedCategory('selvaticos');
    const selvaEl = document.getElementById('selva');
    if (selvaEl) {
      selvaEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950">
        {/* Navigation bar */}
        <Navbar
          onOpenKitchen={() => setIsKitchenOpen(true)}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* Hero Showcase */}
          <Hero
            onExploreMenu={handleExploreMenu}
            onExploreSelva={handleExploreSelva}
          />

          {/* Combos & Promotions */}
          <PromotionsSection />

          {/* Amazonian Flavors Highlight */}
          <SelvaHighlight
            onSelectItem={(item) => setSelectedItem(item)}
            onViewAllSelva={() => {
              setSelectedCategory('selvaticos');
              const menuEl = document.getElementById('menu');
              if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Full Digital Menu */}
          <MenuSection
            onSelectItem={(item) => setSelectedItem(item)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Full Information: Horarios 24h, Ubicación en Ate, Yape/Plin, FAQ */}
          <InfoSection />
        </main>

        {/* Footer */}
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
      </div>
    </CartProvider>
  );
}

export default App;
