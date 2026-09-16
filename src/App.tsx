import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryCardsView } from './components/CategoryCardsView';
import { CategoryProductsView } from './components/CategoryProductsView';
import { PromotionsView } from './components/PromotionsView';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { KitchenOrdersModal } from './components/KitchenOrdersModal';
import { LocationModal } from './components/LocationModal';
import { AuthModal } from './components/AuthModal';
import { MenuItem, RESTAURANT_INFO } from './data/menuData';

type ViewMode = 'categories' | 'category-detail' | 'promotions';

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>('hamburguesas');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [isKitchenOpen, setIsKitchenOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [currentZone, setCurrentZone] = useState<string>('Entregar a Lima');

  const handleSelectCategory = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setCurrentView('category-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPromotions = () => {
    setCurrentView('promotions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSearchQuery('');
    setIsSearching(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-red-600 selection:text-white">
        {/* Navigation Header matching Screenshot 1 */}
        <Navbar
          onOpenKitchen={() => setIsKitchenOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenLocation={() => setIsLocationOpen(true)}
          currentZone={currentZone}
          onGoHome={handleBackToCategories}
          onOpenPromotions={handleOpenPromotions}
          onSelectCategory={handleSelectCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          {searchQuery.trim() !== '' ? (
            /* Search results view */
            <CategoryProductsView
              categoryKey="todos"
              searchQuery={searchQuery}
              onBackToCategories={handleBackToCategories}
              onSelectItem={(item) => setSelectedItem(item)}
            />
          ) : currentView === 'categories' ? (
            /* Desktop & Mobile Category Home */
            <>
              {/* Desktop & Tablet Hero Carousel from Screenshot 1 */}
              <HeroCarousel
                onPideAqui={(actionKey) => {
                  if (actionKey === 'promociones') {
                    handleOpenPromotions();
                  } else {
                    handleSelectCategory(actionKey);
                  }
                }}
              />

              {/* Exact Bento Grid from Screenshots 1 to 4 */}
              <CategoryCardsView
                onSelectCategory={handleSelectCategory}
                onOpenPromotions={handleOpenPromotions}
              />
            </>
          ) : currentView === 'promotions' ? (
            /* Promotions detail view */
            <PromotionsView
              onBackToCategories={handleBackToCategories}
              onSelectItem={(item) => setSelectedItem(item)}
            />
          ) : (
            /* Category Products detail view */
            <CategoryProductsView
              categoryKey={selectedCategory}
              onBackToCategories={handleBackToCategories}
              onSelectItem={(item) => setSelectedItem(item)}
            />
          )}
        </main>

        {/* Footer matching Screenshots 3 & 4 (Desktop multi-column + Mobile accordion) */}
        <Footer />

        {/* Floating WhatsApp Action Button */}
        <aside aria-label="Contacto por WhatsApp" className="fixed bottom-6 right-6 z-40">
          <a
            href={`https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=${encodeURIComponent('¡Hola Buchisapa! Deseo realizar un pedido.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all group"
            title="Pedir por WhatsApp 24 Horas"
            aria-label="Abrir WhatsApp"
          >
            <MessageCircle className="w-7 h-7 fill-white" />
            <span className="sr-only">Pedir por WhatsApp</span>
          </a>
        </aside>

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
          onSelectZone={(zone) => setCurrentZone(zone)}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onOpenKitchen={() => setIsKitchenOpen(true)}
        />
      </div>
    </CartProvider>
  );
}
