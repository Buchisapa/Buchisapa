import React from 'react';

interface BentoCategoriesProps {
  onSelectCategory: (categoryId: string) => void;
  onOpenPromotions: () => void;
}

interface BentoItem {
  id: string;
  name: string;
  categoryKey: string;
  image: string;
  layoutClass: string;
  isPromo?: boolean;
}

export const BentoCategories: React.FC<BentoCategoriesProps> = ({
  onSelectCategory,
  onOpenPromotions,
}) => {
  const handleClick = (item: BentoItem) => {
    if (item.isPromo) {
      onOpenPromotions();
    } else {
      onSelectCategory(item.categoryKey);
    }
  };

  return (
    <section id="categorias-grid" className="bg-white py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* ROW 1: Sanguches (Wide) + Promociones (Standard) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {/* Sánguches & Hamburguesas */}
          <div
            onClick={() => handleClick({
              id: 'sanguches',
              name: 'SÁNGUCHES',
              categoryKey: 'hamburguesas',
              image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
              layoutClass: '',
            })}
            className="md:col-span-8 group relative h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-neutral-900"
          >
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80"
              alt="Sánguches y Hamburguesas"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wider font-heading drop-shadow-md">
                SÁNGUCHES
              </h2>
            </div>
          </div>

          {/* Promociones */}
          <div
            onClick={() => onOpenPromotions()}
            className="md:col-span-4 group relative h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-neutral-900"
          >
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
              alt="Promociones y Combos"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wider font-heading drop-shadow-md">
                PROMOCIONES
              </h2>
            </div>
          </div>
        </div>

        {/* ROW 2: Tall Left Card (Platos de la Selva) + 2 Medium Top Cards + 1 Wide Bottom Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {/* Platos de la Selva (Tall card spanning vertical height) */}
          <div
            onClick={() => handleClick({
              id: 'selva',
              name: 'PLATOS DE LA SELVA',
              categoryKey: 'selvaticos',
              image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=1000&q=80',
              layoutClass: '',
            })}
            className="md:col-span-5 group relative h-80 sm:h-96 md:h-[500px] lg:h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-neutral-900"
          >
            <img
              src="https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=1000&q=80"
              alt="Platos de la Selva"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wider font-heading drop-shadow-md">
                PLATOS DE LA SELVA
              </h2>
            </div>
          </div>

          {/* Right Subgrid (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between gap-4 sm:gap-6">
            {/* Top row of the right side: 2 equal cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Pollo Broaster / Parrillero */}
              <div
                onClick={() => handleClick({
                  id: 'broaster',
                  name: 'POLLO BROASTER',
                  categoryKey: 'broaster',
                  image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
                  layoutClass: '',
                })}
                className="group relative h-56 sm:h-60 md:h-[240px] lg:h-[255px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-neutral-900"
              >
                <img
                  src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80"
                  alt="Pollo Broaster"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6">
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider font-heading drop-shadow-md">
                    POLLO BROASTER
                  </h2>
                </div>
              </div>

              {/* Caldos Amazónicos & Ensaladas */}
              <div
                onClick={() => handleClick({
                  id: 'caldos',
                  name: 'CALDOS & ENSALADAS',
                  categoryKey: 'selvaticos',
                  image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
                  layoutClass: '',
                })}
                className="group relative h-56 sm:h-60 md:h-[240px] lg:h-[255px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-neutral-900"
              >
                <img
                  src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"
                  alt="Caldos y Ensaladas"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6">
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider font-heading drop-shadow-md">
                    CALDOS &amp; ENSALADAS
                  </h2>
                </div>
              </div>
            </div>

            {/* Bottom wide card on right: Salchipapas & Mixtos */}
            <div
              onClick={() => handleClick({
                id: 'salchipapas',
                name: 'SALCHIPAPAS & MIXTOS',
                categoryKey: 'salchipapas',
                image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1200&q=80',
                layoutClass: '',
              })}
              className="group relative h-56 sm:h-60 md:h-[240px] lg:h-[255px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-neutral-900"
            >
              <img
                src="https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1200&q=80"
                alt="Salchipapas y Mixtos"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6">
                <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider font-heading drop-shadow-md">
                  SALCHIPAPAS &amp; MIXTOS
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Chicharrones & Alitas (Left) + Guarniciones (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Chicharrones & Alitas */}
          <div
            onClick={() => handleClick({
              id: 'chicharrones',
              name: 'CHICHARRONES',
              categoryKey: 'alitas',
              image: 'https://images.unsplash.com/photo-1527477378408-1bc0602f06b9?auto=format&fit=crop&w=1000&q=80',
              layoutClass: '',
            })}
            className="group relative h-64 sm:h-72 md:h-80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-neutral-900"
          >
            <img
              src="https://images.unsplash.com/photo-1527477378408-1bc0602f06b9?auto=format&fit=crop&w=1000&q=80"
              alt="Chicharrones"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider font-heading drop-shadow-md">
                CHICHARRONES
              </h2>
            </div>
          </div>

          {/* Guarniciones */}
          <div
            onClick={() => handleClick({
              id: 'guarniciones',
              name: 'GUARNICIONES',
              categoryKey: 'todos',
              image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=80',
              layoutClass: '',
            })}
            className="group relative h-64 sm:h-72 md:h-80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-neutral-900"
          >
            <img
              src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=80"
              alt="Guarniciones"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider font-heading drop-shadow-md">
                GUARNICIONES
              </h2>
            </div>
          </div>
        </div>

        {/* ROW 4: Adicionales + Bebidas + Postres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Adicionales */}
          <div
            onClick={() => handleClick({
              id: 'adicionales',
              name: 'ADICIONALES',
              categoryKey: 'todos',
              image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
              layoutClass: '',
            })}
            className="group relative h-60 sm:h-64 md:h-72 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-neutral-900"
          >
            <img
              src="https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80"
              alt="Adicionales"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider font-heading drop-shadow-md">
                ADICIONALES
              </h2>
            </div>
          </div>

          {/* Bebidas */}
          <div
            onClick={() => handleClick({
              id: 'bebidas',
              name: 'BEBIDAS',
              categoryKey: 'bebidas',
              image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
              layoutClass: '',
            })}
            className="group relative h-60 sm:h-64 md:h-72 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-neutral-900"
          >
            <img
              src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"
              alt="Bebidas"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider font-heading drop-shadow-md">
                BEBIDAS
              </h2>
            </div>
          </div>

          {/* Postres */}
          <div
            onClick={() => handleClick({
              id: 'postres',
              name: 'POSTRES',
              categoryKey: 'todos',
              image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
              layoutClass: '',
            })}
            className="group relative h-60 sm:h-64 md:h-72 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-neutral-900"
          >
            <img
              src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"
              alt="Postres"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider font-heading drop-shadow-md">
                POSTRES
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
