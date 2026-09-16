import React from 'react';

export interface CategoryCardData {
  id: string;
  name: string;
  categoryKey: string;
  image: string;
}

interface CategoryCardsViewProps {
  onSelectCategory: (categoryKey: string) => void;
  onOpenPromotions?: () => void;
}

export const CATEGORY_ITEMS_MAP: Record<string, CategoryCardData> = {
  hamburguesas: {
    id: 'hamburguesas',
    name: 'HAMBURGUESAS',
    categoryKey: 'hamburguesas',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
  },
  broaster: {
    id: 'broaster',
    name: 'BROASTER',
    categoryKey: 'broaster',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1200&q=80',
  },
  salchipapas: {
    id: 'salchipapas',
    name: 'SALCHIPAPAS Y SALCHIBROASTERS',
    categoryKey: 'salchipapas',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1200&q=80',
  },
  alitas: {
    id: 'alitas',
    name: 'ALITAS',
    categoryKey: 'alitas',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1200&q=80',
  },
  amazonicos: {
    id: 'amazonicos',
    name: 'PLATOS DE LA SELVA / AMAZÓNICOS',
    categoryKey: 'amazonicos',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
  },
  bebidas: {
    id: 'bebidas',
    name: 'BEBIDAS',
    categoryKey: 'bebidas',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80',
  },
  refrescos: {
    id: 'refrescos',
    name: 'REFRESCOS E INFUSIONES',
    categoryKey: 'refrescos',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80',
  },
};

export const CategoryCardsView: React.FC<CategoryCardsViewProps> = ({
  onSelectCategory,
}) => {
  const handleCardClick = (card: CategoryCardData) => {
    onSelectCategory(card.categoryKey);
  };

  const renderCard = (card: CategoryCardData, customHeightClass?: string) => (
    <div
      key={card.id}
      id={`category-card-${card.id}`}
      onClick={() => handleCardClick(card)}
      className={`group relative w-full ${
        customHeightClass || 'aspect-square sm:aspect-auto h-auto sm:h-64 lg:h-72'
      } rounded-2xl overflow-hidden shadow-sm hover:shadow-xl active:scale-[0.99] transition-all duration-300 cursor-pointer bg-neutral-900`}
    >
      {/* Background Food Image */}
      <img
        src={card.image}
        alt={card.name}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent group-hover:from-black/90 transition-colors" />

      {/* Title on Bottom-Left */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4">
        <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-black text-white uppercase tracking-wider font-heading drop-shadow-md leading-tight">
          {card.name}
        </h2>
      </div>
    </div>
  );

  return (
    <section className="bg-white py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">
        {/* ROW 1: HAMBURGUESAS & BROASTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {renderCard(CATEGORY_ITEMS_MAP.hamburguesas, 'aspect-square sm:aspect-auto h-auto sm:h-64 md:h-72 lg:h-80')}
          {renderCard(CATEGORY_ITEMS_MAP.broaster, 'aspect-square sm:aspect-auto h-auto sm:h-64 md:h-72 lg:h-80')}
        </div>

        {/* ROW 2: SALCHIPAPAS Y SALCHIBROASTERS */}
        <div>
          {renderCard(CATEGORY_ITEMS_MAP.salchipapas, 'aspect-square sm:aspect-auto h-auto sm:h-64 md:h-72 lg:h-80')}
        </div>

        {/* ROW 3: ALITAS & PLATOS DE LA SELVA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {renderCard(CATEGORY_ITEMS_MAP.alitas, 'aspect-square sm:aspect-auto h-auto sm:h-64 md:h-72 lg:h-80')}
          {renderCard(CATEGORY_ITEMS_MAP.amazonicos, 'aspect-square sm:aspect-auto h-auto sm:h-64 md:h-72 lg:h-80')}
        </div>

        {/* ROW 4: BEBIDAS & REFRESCOS E INFUSIONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {renderCard(CATEGORY_ITEMS_MAP.bebidas, 'aspect-square sm:aspect-auto h-auto sm:h-56 md:h-64 lg:h-72')}
          {renderCard(CATEGORY_ITEMS_MAP.refrescos, 'aspect-square sm:aspect-auto h-auto sm:h-56 md:h-64 lg:h-72')}
        </div>
      </div>
    </section>
  );
};
