export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  includes?: string[];
  badge?: string;
  popular?: boolean;
  image: string;
  options?: {
    name: string;
    choices: string[];
  }[];
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export const RESTAURANT_INFO = {
  name: "Restaurante Buchisapa",
  shortName: "Buchisapa",
  tagline: "Sabor que te llena",
  subtagline: "Sánguches, Broaster, Salchipapas, Alitas, Platos Amazónicos & Bebidas",
  phone: "+51 943 312 024",
  phoneRaw: "51943312024",
  email: "buchisapaweb@gmail.com",
  facebookUrl: "https://www.facebook.com/share/19c81Hf215/",
  tiktokUrl: "https://www.tiktok.com/@buchisapa.web?_r=1&_t=ZS-99pRyaOKeZQ",
  instagramUrl: "https://www.instagram.com/buchisapa.web",
  address: "Av. Principal s/n, Ate - Lima (Cerca a Real Plaza Puruchuco)",
  city: "Lima, Perú",
  schedule: "Atención las 24 horas • De Lunes a Domingo",
  is24Hours: true,
  deliveryTime: "25 - 40 min",
  minOrder: 10,
  deliveryFee: 4.00,
  paymentMethods: ["Yape", "Plin", "Efectivo", "Transferencia BCP/BBVA"],
  yapeNumber: "943 312 024",
  features: [
    "Sabor 100% casero y porciones contundentes",
    "Ingredientes frescos traídos del oriente peruano",
    "Atención continua las 24 horas del día",
    "Delivery rápido y pedidos para recoger en salón"
  ]
};

export const CATEGORIES: Category[] = [
  {
    id: "todos",
    name: "Todo el Menú",
    iconName: "Utensils",
    description: "Explora todas nuestras preparaciones en una sola lista",
  },
  {
    id: "hamburguesas",
    name: "HAMBURGUESAS",
    iconName: "Sandwich",
    description: "Hamburguesas artesanales, royals, clásicas y especiales en pan suave",
  },
  {
    id: "broaster",
    name: "BROASTER",
    iconName: "Flame",
    description: "Pollo broaster crocante y doradito servido con papas fritas y ensalada",
  },
  {
    id: "salchipapas",
    name: "SALCHIPAPAS Y SALCHIBROASTERS",
    iconName: "Sparkles",
    description: "Salchipapas abundantes con huevo, plátano o presas broaster crocantes",
  },
  {
    id: "alitas",
    name: "ALITAS",
    iconName: "Flame",
    description: "Alitas crocantes bañadas en salsa BBQ o acevichada especial con papas",
  },
  {
    id: "amazonicos",
    name: "PLATOS DE LA SELVA / AMAZÓNICOS",
    iconName: "Utensils",
    description: "Tacacho con cecina, juanes, chilcano de carachama, chaufa amazónico y más",
  },
  {
    id: "bebidas",
    name: "BEBIDAS",
    iconName: "CupSoda",
    description: "Gaseosas heladas personalizadas e hidratantes",
  },
  {
    id: "refrescos",
    name: "REFRESCOS E INFUSIONES",
    iconName: "GlassWater",
    description: "Refrescos naturales de frutos amazónicos, chicha morada e infusiones calientes",
  },
];

export const SAUCES_LIST = [
  "Mayonesa",
  "Mostaza",
  "Ketchup",
  "Ají de Rocoto",
  "Tártara",
  "Ají Charapita",
  "Acevichada",
  "Salsa BBQ",
  "Salsa Golf",
  "Ocopa",
  "Aceituna",
  "Vinagreta"
];

export const MENU_ITEMS: MenuItem[] = [
  // 1. HAMBURGUESAS
  {
    id: "hamb-clasica",
    name: "Hamburguesa Clásica",
    category: "hamburguesas",
    price: 10.00,
    popular: true,
    description: "Jugosa hamburguesa artesanal en pan brioche suave, acompañada de papas fritas doraditas, ensalada fresca y cremas de la casa.",
    includes: ["Hamburguesa artesanal", "Papas fritas crocantes", "Ensalada fresca", "Pan brioche"],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "hamb-pollo-deshilachado",
    name: "Pollo Deshilachado",
    category: "hamburguesas",
    price: 9.00,
    description: "Generoso sándwich de pechuga de pollo deshilachada y sazonada, servida en pan brioche con papas fritas y ensalada.",
    includes: ["Pollo deshilachado", "Papas fritas crocantes", "Ensalada fresca", "Pan brioche"],
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "hamb-la-suprema",
    name: "Hamburguesa La Suprema",
    category: "hamburguesas",
    price: 15.00,
    badge: "Especial",
    description: "La reina de la casa: hamburguesa artesanal con tocino crocante, queso derretido, huevo frito, jamón, papas fritas y ensalada fresca.",
    includes: ["Hamburguesa artesanal", "Tocino crocante", "Queso derretido", "Huevo frito", "Jamón inglés", "Papas fritas", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "hamb-choripan",
    name: "Choripán Parrillero",
    category: "hamburguesas",
    price: 10.00,
    description: "Chorizo parrillero ahumado a la plancha en pan tostado crocante, acompañado de papas fritas doradas y ensalada fresca.",
    includes: ["Chorizo parrillero", "Papas fritas crocantes", "Ensalada fresca", "Pan artesanal"],
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "hamb-filete-pollo",
    name: "Filete de Pollo",
    category: "hamburguesas",
    price: 11.00,
    description: "Tierno filete de pechuga de pollo dorada a la plancha en pan brioche, servido con papas fritas y ensalada fresca.",
    includes: ["Filete de pechuga de pollo", "Papas fritas crocantes", "Ensalada fresca", "Pan brioche"],
    image: "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "hamb-a-lo-pobre",
    name: "Hamburguesa A Lo Pobre",
    category: "hamburguesas",
    price: 14.00,
    popular: true,
    description: "Tradicional y contundente: carne artesanal, huevo frito a punto, plátano maduro frito, queso derretido, jamón y papas fritas.",
    includes: ["Hamburguesa artesanal", "Huevo frito", "Plátano maduro frito", "Queso derretido", "Jamón", "Papas fritas", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "hamb-hawaiana-carne",
    name: "Hawaiana Carne",
    category: "hamburguesas",
    price: 14.00,
    popular: true,
    description: "Carne artesanal jugosa, rodaja de piña glaseada a la plancha, queso derretido, jamón, huevo frito, papas fritas y ensalada.",
    includes: ["Carne artesanal", "Piña a la plancha", "Queso derretido", "Jamón", "Huevo frito", "Papas fritas", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "hamb-cheese-burguer",
    name: "Cheese Burger",
    category: "hamburguesas",
    price: 11.00,
    description: "Clásica carne artesanal bañada con abundante queso cheddar derretido, acompañada de papas fritas y ensalada fresca.",
    includes: ["Hamburguesa artesanal", "Doble queso cheddar", "Papas fritas crocantes", "Ensalada fresca", "Pan brioche"],
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "hamb-royal",
    name: "Hamburguesa Royal",
    category: "hamburguesas",
    price: 13.00,
    description: "Carne de res artesanal seleccionada con huevo frito montado, queso derretido, papas fritas doradas y ensalada fresca.",
    includes: ["Carne artesanal", "Huevo frito", "Queso derretido", "Papas fritas crocantes", "Ensalada fresca", "Pan brioche"],
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "hamb-hawaiana-pollo",
    name: "Hawaiana Pollo",
    category: "hamburguesas",
    price: 13.00,
    description: "Crocante pollo crispy dorado con piña a la parrilla, queso derretido, jamón, huevo frito, papas fritas y ensalada.",
    includes: ["Pollo crispy dorado", "Piña a la parrilla", "Queso derretido", "Jamón", "Huevo frito", "Papas fritas", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "hamb-bacon-burguer",
    name: "Bacon Burger",
    category: "hamburguesas",
    price: 12.00,
    description: "Carne artesanal sellada con crujientes tiras de tocino ahumado, queso fundido, papas fritas y ensalada fresca.",
    includes: ["Hamburguesa artesanal", "Tocino ahumado crocante", "Queso fundido", "Papas fritas", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "hamb-royal-a-lo-pobre",
    name: "Royal A Lo Pobre",
    category: "hamburguesas",
    price: 14.00,
    badge: "Contundente",
    description: "Combinación suprema de carne artesanal, huevo frito, plátano maduro frito, queso fundido, jamón y papas fritas.",
    includes: ["Carne artesanal", "Huevo frito", "Plátano maduro frito", "Queso derretido", "Jamón", "Papas fritas", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=80",
  },

  // 2. BROASTER
  {
    id: "broaster-pecho",
    name: "Pecho Broaster",
    category: "broaster",
    price: 18.00,
    popular: true,
    badge: "Más Pedido",
    description: "Generosa y jugosa presa de Pecho Broaster ultra crocante, servida con papas fritas doraditas, arroz blanco granado, ensalada y cremas.",
    includes: ["Presa de Pecho Broaster", "Papas fritas crocantes", "Arroz blanco", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "broaster-pierna",
    name: "Pierna Broaster",
    category: "broaster",
    price: 12.00,
    description: "Crujiente y dorada Pierna Broaster sazonada con especias secretas, acompañada de papas fritas, arroz, ensalada y cremas.",
    includes: ["Presa de Pierna Broaster", "Papas fritas crocantes", "Arroz blanco", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "broaster-encuentro",
    name: "Encuentro Broaster",
    category: "broaster",
    price: 13.00,
    description: "Sabroso y jugoso Encuentro Broaster dorado al momento, servido con papas fritas crocantes, arroz, ensalada y cremas.",
    includes: ["Presa de Encuentro Broaster", "Papas fritas crocantes", "Arroz blanco", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "broaster-ala",
    name: "Ala Broaster",
    category: "broaster",
    price: 10.00,
    description: "Crocante Ala Broaster con piel extra crujiente, servida con abundante porción de papas fritas, arroz y ensalada.",
    includes: ["Presa de Ala Broaster", "Papas fritas crocantes", "Arroz blanco", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1527477378408-1bc0602f06b9?auto=format&fit=crop&w=1000&q=80",
  },

  // 3. SALCHIPAPAS Y SALCHIBROASTERS
  {
    id: "salchi-clasica",
    name: "Salchipapa Clásica",
    category: "salchipapas",
    price: 10.00,
    description: "Cortes de salchicha frankfurter doradas sobre una montaña de papas fritas crocantes, con ensalada fresca y cremas al gusto.",
    includes: ["Papas fritas crocantes", "Salchichas frankfurter", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "salchi-a-lo-pobre",
    name: "Salchipapa A Lo Pobre",
    category: "salchipapas",
    price: 13.00,
    popular: true,
    description: "Abundantes papas fritas con salchichas, huevo frito a la plancha, plátano maduro frito caramelizado y ensalada fresca.",
    includes: ["Papas fritas", "Salchichas frankfurter", "Huevo frito", "Plátano maduro frito", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "salchi-broaster-pecho",
    name: "Salchibroaster Pecho",
    category: "salchipapas",
    price: 20.00,
    badge: "Contundente",
    description: "Papas fritas con salchichas frankfurter coronadas con una jugosa y crocante presa de Pecho Broaster, ensalada y cremas.",
    includes: ["Papas fritas", "Salchichas frankfurter", "Presa de Pecho Broaster", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "salchi-broaster-pierna",
    name: "Salchibroaster Pierna",
    category: "salchipapas",
    price: 14.00,
    description: "Clásica salchipapa acompañada de una dorada y crujiente Pierna Broaster, ensalada fresca y todas las salsas.",
    includes: ["Papas fritas", "Salchichas frankfurter", "Presa de Pierna Broaster", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "salchi-broaster-encuentro",
    name: "Salchibroaster Encuentro",
    category: "salchipapas",
    price: 16.00,
    description: "Montaña de papas fritas con salchichas y un exquisito Encuentro Broaster jugoso por dentro y crocante por fuera.",
    includes: ["Papas fritas", "Salchichas frankfurter", "Presa de Encuentro Broaster", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "salchi-broaster-ala",
    name: "Salchibroaster Ala",
    category: "salchipapas",
    price: 13.00,
    description: "Papas fritas con salchichas y una crujiente Ala Broaster dorada, servida con ensalada y cremas de la casa.",
    includes: ["Papas fritas", "Salchichas frankfurter", "Presa de Ala Broaster", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1527477378408-1bc0602f06b9?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "salchi-chorizo",
    name: "Salchichorizo",
    category: "salchipapas",
    price: 13.00,
    description: "Doble sabor parrillero: abundantes papas fritas combinadas con salchicha frankfurter y chorizo regional ahumado a la plancha.",
    includes: ["Papas fritas crocantes", "Salchichas frankfurter", "Chorizo parrillero", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=80",
  },

  // 4. ALITAS
  {
    id: "alitas-acevichadas",
    name: "Alitas Acevichadas",
    category: "alitas",
    price: 15.00,
    popular: true,
    description: "5 alitas súper crocantes bañadas en nuestra cremosa y adictiva salsa acevichada artesanal, servidas con papas fritas y ensalada.",
    includes: ["5 Alitas crocantes", "Salsa Acevichada artesanal", "Papas fritas", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "alitas-bbq",
    name: "Alitas BBQ",
    category: "alitas",
    price: 15.00,
    description: "5 alitas doradas glaseadas con abundante salsa barbacoa agridulce y ahumada, acompañadas de papas fritas y ensalada fresca.",
    includes: ["5 Alitas crocantes", "Salsa BBQ agridulce", "Papas fritas", "Ensalada fresca"],
    image: "https://images.unsplash.com/photo-1527477378408-1bc0602f06b9?auto=format&fit=crop&w=1000&q=80",
  },

  // 5. PLATOS DE LA SELVA / AMAZÓNICOS
  {
    id: "amaz-tacacho-cecina",
    name: "Tacacho con Cecina",
    category: "amazonicos",
    price: 12.00,
    popular: true,
    badge: "Tradición",
    description: "Auténticas bolas de plátano asado al carbón con manteca y jugosa cecina de cerdo traída de la selva.",
    includes: ["Bolas de Tacacho asado", "Cecina de cerdo ahumada", "Salsa de Cocona con Ají Charapita"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "amaz-juanes",
    name: "Juanes",
    category: "amazonicos",
    price: 15.00,
    description: "Arroz sazonado con palillo y especias amazónicas, presa de gallina de chacra y huevo envuelto en hoja de bijao.",
    includes: ["Juane tradicional", "Presa de gallina de chacra", "Huevo duro y aceituna", "Salsa de Cocona"],
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "amaz-chilcano",
    name: "Chilcano de Carachama o Pescado del Día",
    category: "amazonicos",
    price: 15.00,
    description: "Reconfortante y sustancioso caldo de pescado amazónico con sachaculantro y ají charapita.",
    includes: ["Caldo de pescado amazónico", "Sachaculantro", "Yuca sancochada", "Ají Charapita"],
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "amaz-palometa-frita",
    name: "Palometa Frita con Maduro o Plátano",
    category: "amazonicos",
    price: 15.00,
    description: "Fresco corte de palometa de río frita crocante servida con patacones o plátano maduro.",
    includes: ["Palometa frita crocante", "Plátano maduro frito o patacones", "Ensalada fresca", "Ají Charapita"],
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "amaz-patacones-chorizo",
    name: "Patacones con Chorizo",
    category: "amazonicos",
    price: 12.00,
    description: "Crujientes patacones de plátano verde acompañado de jugoso chorizo ahumado de la selva.",
    includes: ["Patacones crocantes", "Chorizo regional ahumado", "Salsa de Cocona"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "amaz-caldo-amazonico",
    name: "Caldo Amazónico",
    category: "amazonicos",
    price: 12.00,
    description: "Concentrado y reconfortante caldo con sachaculantro, especias regionales y carnes seleccionadas.",
    includes: ["Caldo concentrado regional", "Presa seleccionada", "Yuca sancochada", "Sachaculantro"],
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "amaz-chaufa-amazonico",
    name: "Arroz Chaufa Amazónico",
    category: "amazonicos",
    price: 15.00,
    popular: true,
    description: "Granado arroz chaufa salteado al wok con trozos de cecina ahumada, chorizo regional y plátano maduro.",
    includes: ["Arroz chaufa al wok", "Cecina en cubos", "Chorizo regional", "Plátano maduro frito"],
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80",
  },

  // 6. BEBIDAS
  {
    id: "beb-inca-kola",
    name: "Inca Kola",
    category: "bebidas",
    price: 5.00,
    description: "Gaseosa helada personal.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "beb-coca-cola",
    name: "Coca Cola",
    category: "bebidas",
    price: 5.00,
    description: "Gaseosa helada personal.",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "beb-fanta",
    name: "Fanta",
    category: "bebidas",
    price: 3.50,
    description: "Gaseosa helada sabor naranja.",
    image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "beb-pepsi",
    name: "Pepsi",
    category: "bebidas",
    price: 2.00,
    description: "Gaseosa helada personal.",
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "beb-agua-cielo",
    name: "Agua Cielo",
    category: "bebidas",
    price: 2.50,
    description: "Agua de mesa personal sin gas.",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1000&q=80",
  },

  // 7. REFRESCOS E INFUSIONES
  {
    id: "refr-maracuya",
    name: "Maracuyá",
    category: "refrescos",
    price: 3.00,
    popular: true,
    description: "Refresco natural helado de maracuyá fresca.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "refr-chicha",
    name: "Chicha",
    category: "refrescos",
    price: 3.00,
    popular: true,
    description: "Chicha morada natural helada preparada con maíz morado y frutas.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "refr-cocona",
    name: "Cocona",
    category: "refrescos",
    price: 3.00,
    description: "Auténtico refresco de cocona amazónica bien helado.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "refr-aguajina",
    name: "Aguajina",
    category: "refrescos",
    price: 3.00,
    description: "Delicioso y cremoso refresco tradicional de aguaje selvático.",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "refr-camu-camu",
    name: "Camu Camu",
    category: "refrescos",
    price: 3.00,
    description: "Refresco super nutritivo y natural de camu camu selvático.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "refr-anis",
    name: "Anís",
    category: "refrescos",
    price: 2.50,
    description: "Infusión caliente digestiva de anís.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "refr-te",
    name: "Té",
    category: "refrescos",
    price: 2.50,
    description: "Infusión caliente de té puro.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "refr-cafe",
    name: "Café",
    category: "refrescos",
    price: 3.00,
    description: "Café pasado caliente peruano de intenso aroma.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80",
  },
];

export interface PromotionItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  tag: string;
  description: string;
  items: string[];
  image: string;
}

export const PROMOTIONS: PromotionItem[] = [
  {
    id: "promo-1",
    title: "Promoción Broaster Para Mí",
    price: 18.90,
    originalPrice: 24.00,
    tag: "MÁS PEDIDO",
    description: "1/4 Pollo Broaster crocante + papas fritas doradas + ensalada fresca + chicha morada personal.",
    items: ["1/4 Pollo Broaster (Pecho o Pierna)", "Papas Fritas artesanales", "Ensalada del día", "Refresco Chicha Morada 500ml"],
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "promo-2",
    title: "Combo Salchibroaster Familiar",
    price: 32.00,
    originalPrice: 38.00,
    tag: "PROMO 24H",
    description: "1 Salchibroaster Pecho + 1 Salchipapa Clásica + 2 Refrescos de Maracuyá o Chicha.",
    items: ["1 Salchibroaster Pecho", "1 Salchipapa Clásica", "2 Refrescos 1/2L", "Salsas de la casa"],
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "promo-3",
    title: "Banquete Selva & Broaster",
    price: 35.00,
    originalPrice: 42.00,
    tag: "ESPECIALIDAD",
    description: "1 Tacacho con Cecina ahumada + 1 Pecho Broaster crocante + papas, ensalada y 1 Refresco Cocona.",
    items: ["1 Tacacho con Cecina", "1 Pecho Broaster", "Papas y ensalada", "1 Refresco Cocona"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "promo-4",
    title: "Dúo Hamburguesas Royal & Bebida",
    price: 24.50,
    originalPrice: 29.00,
    tag: "OFERTA",
    description: "2 Hamburguesas Royal con queso, huevo y papas al hilo + 2 Bebidas personales.",
    items: ["2 Hamburguesas Royal", "2 Bebidas 500ml", "Papas al hilo", "Cremas ilimitadas"],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "promo-5",
    title: "Combo Alitas BBQ & Papas x10",
    price: 28.00,
    originalPrice: 34.00,
    tag: "PARA COMPARTIR",
    description: "10 Alitas crocantes bañadas en BBQ artesanal o Acevichada + papas fritas familiares.",
    items: ["10 Alitas crocantes", "Papas familiares", "Salsas de la casa"],
    image: "https://images.unsplash.com/photo-1527477378408-1bc0602f06b9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "promo-6",
    title: "Combo Hamburguesa Clásica + Alitas",
    price: 26.90,
    originalPrice: 32.00,
    tag: "SUPER COMBO",
    description: "1 Hamburguesa Clásica con papas + 4 Alitas Acevichadas + 1 Bebida personal helada.",
    items: ["1 Hamburguesa Clásica", "4 Alitas Acevichadas", "1 Bebida personal", "Papas fritas"],
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
  },
];
