import React from 'react';

export interface CategoryCardData {
  id: string;
  name: string;
  categoryKey: string;
  image: string;
  isPromo?: boolean;
}

interface CategoryCardsViewProps {
  onSelectCategory: (categoryKey: string) => void;
  onOpenPromotions: () => void;
}

export const CATEGORY_ITEMS_MAP: Record<string, CategoryCardData> = {
  sanguches: {
    id: 'sanguches',
    name: 'SÁNGUCHES',
    categoryKey: 'hamburguesas',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
  },
  promociones: {
    id: 'promociones',
    name: 'PROMOCIONES',
    categoryKey: 'promociones',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    isPromo: true,
  },
  brasa: {
    id: 'brasa',
    name: 'BUCHISAPA BRASA',
    categoryKey: 'brasa',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1000&q=80',
  },
  parrillero: {
    id: 'parrillero',
    name: 'BUCHISAPA PARRILLERO',
    categoryKey: 'parrillero',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80',
  },
  ensaladas: {
    id: 'ensaladas',
    name: 'ENSALADAS',
    categoryKey: 'ensaladas',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
  },
  anticuchos: {
    id: 'anticuchos',
    name: 'ANTICUCHOS Y MOLLEJITAS',
    categoryKey: 'anticuchos',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
  },
  chicharrones: {
    id: 'chicharrones',
    name: 'CHICHARRONES',
    categoryKey: 'chicharrones',
    image: 'https://images.unsplash.com/photo-1527477378408-1bc0602f06b9?auto=format&fit=crop&w=1200&q=80',
  },
  guarniciones: {
    id: 'guarniciones',
    name: 'GUARNICIONES',
    categoryKey: 'guarniciones',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1200&q=80',
  },
  adicionales: {
    id: 'adicionales',
    name: 'ADICIONALES',
    categoryKey: 'adicionales',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1000&q=80',
  },
  bebidas: {
    id: 'bebidas',
    name: 'BEBIDAS',
    categoryKey: 'bebidas',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80',
  },
  postres: {
    id: 'postres',
    name: 'POSTRES',
    categoryKey: 'postres',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80',
  },
};

export const CategoryCardsView: React.FC<CategoryCardsViewProps> = ({
  onSelectCategory,
  onOpenPromotions,
}) => {
  const handleCardClick = (card: CategoryCardData) => {
    if (card.isPromo) {
      onOpenPromotions();
    } else {
      onSelectCategory(card.categoryKey);
    }
  };

  const renderCard = (card: CategoryCardData, customHeightClass?: string) => (
    <div
      key={card.id}
      id={`category-card-${card.id}`}
      onClick={() => handleCardClick(card)}
      className={`group relative w-full ${
        customHeightClass || 'h-48 sm:h-56 md:h-64 lg:h-72'
      } rounded-2xl overflow-hidden shadow-sm hover:shadow-xl active:scale-[0.99] transition-all duration-300 cursor-pointer bg-neutral-900`}
    >
      {/* Background High-Resolution Food Image */}
      <img
        src={card.image}
        alt={card.name}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
      />

      {/* Dark Vignette & Gradient for Crisp Typography Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 group-hover:from-black/90 transition-colors" />

      {/* Title on Bottom-Left matching Screenshots 1 to 4 */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4">
        <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-black text-white uppercase tracking-wider font-heading drop-shadow-md">
          {card.name}
        </h2>
      </div>
    </div>
  );

  return (
    <section className="bg-white py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">
        {/* ROW 1 (Screenshot 1): 2 COLUMNS (SÁNGUCHES & PROMOCIONES) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {renderCard(CATEGORY_ITEMS_MAP.sanguches, 'h-48 sm:h-60 md:h-72 lg:h-80')}
          {renderCard(CATEGORY_ITEMS_MAP.promociones, 'h-48 sm:h-60 md:h-72 lg:h-80')}
        </div>

        {/* ROW 2 & 3 (Screenshot 2): ASYMMETRIC BENTO GRID (DESKTOP & TABLET)
            - Left: BUCHISAPA BRASA (Tall card spanning full height)
            - Right top: BUCHISAPA PARRILLERO & ENSALADAS (2 side-by-side)
            - Right bottom: ANTICUCHOS Y MOLLEJITAS (Wide card spanning both)
        */}
        {/* Desktop / Tablet Bento Grid (>= md) */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 sm:gap-5">
          {/* Left Tall Card: BUCHISAPA BRASA */}
          <div className="md:col-span-1">
            {renderCard(
              CATEGORY_ITEMS_MAP.brasa,
              'h-full min-h-[520px] lg:min-h-[580px]'
            )}
          </div>

          {/* Right Sub-Grid: 2 top cards + 1 bottom wide card */}
          <div className="md:col-span-2 flex flex-col gap-4 sm:gap-5 justify-between">
            {/* Top row: PARRILLERO + ENSALADAS */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {renderCard(CATEGORY_ITEMS_MAP.parrillero, 'h-60 lg:h-68')}
              {renderCard(CATEGORY_ITEMS_MAP.ensaladas, 'h-60 lg:h-68')}
            </div>
            {/* Bottom wide card: ANTICUCHOS Y MOLLEJITAS */}
            <div>
              {renderCard(CATEGORY_ITEMS_MAP.anticuchos, 'h-64 lg:h-72')}
            </div>
          </div>
        </div>

        {/* Mobile View (< md) for Row 2 items */}
        <div className="md:hidden space-y-4">
          {renderCard(CATEGORY_ITEMS_MAP.brasa, 'h-52')}
          {renderCard(CATEGORY_ITEMS_MAP.parrillero, 'h-52')}
          {renderCard(CATEGORY_ITEMS_MAP.ensaladas, 'h-52')}
          {renderCard(CATEGORY_ITEMS_MAP.anticuchos, 'h-52')}
        </div>

        {/* ROW 4 (Screenshot 3): 2 COLUMNS (CHICHARRONES & GUARNICIONES) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {renderCard(CATEGORY_ITEMS_MAP.chicharrones, 'h-48 sm:h-60 md:h-72 lg:h-80')}
          {renderCard(CATEGORY_ITEMS_MAP.guarniciones, 'h-48 sm:h-60 md:h-72 lg:h-80')}
        </div>

        {/* ROW 5 (Screenshot 3 & 4): 3 COLUMNS (ADICIONALES, BEBIDAS, POSTRES) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {renderCard(CATEGORY_ITEMS_MAP.adicionales, 'h-48 sm:h-56 md:h-64 lg:h-72')}
          {renderCard(CATEGORY_ITEMS_MAP.bebidas, 'h-48 sm:h-56 md:h-64 lg:h-72')}
          {renderCard(CATEGORY_ITEMS_MAP.postres, 'h-48 sm:h-56 md:h-64 lg:h-72')}
        </div>
      </div>
    </section>
  );
};
