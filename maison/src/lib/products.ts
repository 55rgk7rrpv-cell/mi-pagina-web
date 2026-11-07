export type Silhouette =
  | "slip"
  | "gown"
  | "blazer"
  | "cropped"
  | "coat"
  | "trench"
  | "knit"
  | "ribbed"
  | "corset"
  | "trouser"
  | "bag"
  | "pendant";

export type Category =
  | "Vestidos"
  | "Sastrería"
  | "Tops y tejidos"
  | "Abrigos"
  | "Accesorios";

export type Tone = "noir" | "ivory" | "garnet";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  details: string[];
  price: number;
  category: Category;
  silhouette: Silhouette;
  tone: Tone;
  colors: { name: string; hex: string }[];
  sizes: string[];
  badge?: "Edición limitada" | "Últimas piezas" | "Nuevo" | "Exclusivo";
  /** Pieces left in this numbered edition */
  stock: number;
  edition: number;
  /** Higher = newer, used by the "Newest" sort */
  arrival: number;
  /** Lower = earlier in "Featured" */
  featured: number;
  /** Optional photography. When present, these replace the generative art. */
  images?: [primary: string, hover: string];
}

export const CATEGORIES: ("Todo" | Category)[] = [
  "Todo",
  "Vestidos",
  "Sastrería",
  "Tops y tejidos",
  "Abrigos",
  "Accesorios",
];

const APPAREL = ["XS", "S", "M", "L", "XL"];

export const PRODUCTS: Product[] = [
  {
    id: "vesper-slip",
    name: "Vestido Vesper",
    tagline: "Seda charmeuse cortada al bies",
    description:
      "Cortado al bies en seda charmeuse gruesa, Vesper se mueve como luz derramada. Tirantes finos, espalda baja y un ruedo que cae justo sobre el tobillo.",
    details: ["100% seda de morera, 22 momme", "Tirantes ajustables enrollados a mano", "Hecho en pequeñas tandas", "Solo lavado en seco"],
    price: 1280,
    category: "Vestidos",
    silhouette: "slip",
    tone: "noir",
    colors: [
      { name: "Dorado arena", hex: "#F2D9A0" },
      { name: "Vinotinto", hex: "#75162D" },
    ],
    sizes: APPAREL,
    badge: "Edición limitada",
    stock: 7,
    edition: 120,
    arrival: 12,
    featured: 1,
  },
  {
    id: "noir-blazer",
    name: "Blazer Escultural",
    tagline: "Lana grain de poudre entretelada a mano",
    description:
      "Hombros marcados, cintura entallada y solapas en punta que no piden permiso. Armado a mano en nuestro taller durante 40 horas.",
    details: ["Lana virgen grain de poudre", "Entretela completa de crin", "Forro de cupro", "Botones de cuerno"],
    price: 1650,
    category: "Sastrería",
    silhouette: "blazer",
    tone: "garnet",
    colors: [
      { name: "Champaña", hex: "#F2E5C6" },
      { name: "Vino profundo", hex: "#3B010B" },
    ],
    sizes: APPAREL,
    badge: "Exclusivo",
    stock: 12,
    edition: 80,
    arrival: 10,
    featured: 2,
  },
  {
    id: "aurore-corset",
    name: "Corsé Aurore",
    tagline: "Satén duquesa, doce ballenas",
    description:
      "Satén duquesa estructurado con doce ballenas de acero y escote corazón. Úsalo con sastrería de día y sin nada más de noche.",
    details: ["Exterior de satén duquesa", "Ballenas de acero en espiral", "Cierre invisible en la espalda", "Hecho en pequeñas tandas"],
    price: 890,
    category: "Tops y tejidos",
    silhouette: "corset",
    tone: "ivory",
    colors: [
      { name: "Vinotinto", hex: "#75162D" },
      { name: "Champaña", hex: "#F2E5C6" },
    ],
    sizes: ["XS", "S", "M", "L"],
    badge: "Últimas piezas",
    stock: 3,
    edition: 60,
    arrival: 9,
    featured: 3,
  },
  {
    id: "maison-coat",
    name: "Abrigo Cruzado",
    tagline: "Cachemira doble faz",
    description:
      "Un abrigo cruzado que envuelve, en cachemira doble faz, con costuras terminadas a mano y un lazo que se ata justo donde tú quieras.",
    details: ["100% cachemira doble faz", "Bordes cosidos a mano", "Lazo desmontable", "Sin forro, para mejor caída"],
    price: 2400,
    category: "Abrigos",
    silhouette: "coat",
    tone: "noir",
    colors: [
      { name: "Champaña", hex: "#F2E5C6" },
      { name: "Granate", hex: "#560B18" },
    ],
    sizes: APPAREL,
    badge: "Nuevo",
    stock: 18,
    edition: 90,
    arrival: 11,
    featured: 4,
  },
  {
    id: "celeste-knit",
    name: "Suéter Céleste",
    tagline: "Cachemira mongol ultraligera",
    description:
      "Un suéter de cuello redondo, holgado y ligerísimo, tejido en cachemira mongol de dos cabos. El que vas a querer ponerte siempre.",
    details: ["Cachemira mongol de dos cabos", "Tejido a forma", "Puños y ruedo acanalados", "Lavar a mano en agua fría"],
    price: 760,
    category: "Tops y tejidos",
    silhouette: "knit",
    tone: "ivory",
    colors: [
      { name: "Vinotinto", hex: "#75162D" },
      { name: "Dorado arena", hex: "#F2D9A0" },
    ],
    sizes: APPAREL,
    stock: 24,
    edition: 150,
    arrival: 5,
    featured: 6,
  },
  {
    id: "sable-trouser",
    name: "Pantalón Sable",
    tagline: "Tiro alto, pierna ancha",
    description:
      "De talle alto, largo hasta el piso y con raya bien marcada. Sable estiliza la figura y combina con todo lo que hacemos.",
    details: ["Crepé de lana y seda", "Raya delantera planchada", "Cintura con ajustadores laterales", "Hecho en pequeñas tandas"],
    price: 720,
    category: "Sastrería",
    silhouette: "trouser",
    tone: "garnet",
    colors: [
      { name: "Dorado arena", hex: "#F2D9A0" },
      { name: "Champaña", hex: "#F2E5C6" },
    ],
    sizes: APPAREL,
    stock: 20,
    edition: 140,
    arrival: 6,
    featured: 7,
  },
  {
    id: "minuit-bag",
    name: "Bolso Minuit",
    tagline: "Piel box calf, broche dorado",
    description:
      "Un bolso estructurado de asa superior en piel box calf pulida, con broche dorado esculpido. Cabe lo esencial y la actitud.",
    details: ["Piel box calf", "Broche de latón bañado en oro", "Interior de gamuza", "Incluye funda protectora"],
    price: 1950,
    category: "Accesorios",
    silhouette: "bag",
    tone: "noir",
    colors: [
      { name: "Vinotinto", hex: "#75162D" },
      { name: "Dorado arena", hex: "#F2D9A0" },
    ],
    sizes: ["Única"],
    badge: "Edición limitada",
    stock: 5,
    edition: 50,
    arrival: 8,
    featured: 5,
  },
  {
    id: "goutte-pendant",
    name: "Dije Goutte d'Or",
    tagline: "Vermeil de oro de 18k",
    description:
      "Una sola gota de oro en una cadena fina. Vermeil pulido a mano sobre plata de ley, para usar todos los días.",
    details: ["Vermeil de oro de 18k", "Base de plata de ley reciclada", "Cadena de 45 cm", "Viene en caja lacada"],
    price: 540,
    category: "Accesorios",
    silhouette: "pendant",
    tone: "garnet",
    colors: [{ name: "Dorado", hex: "#F2D9A0" }],
    sizes: ["Única"],
    stock: 30,
    edition: 200,
    arrival: 4,
    featured: 9,
  },
  {
    id: "reverie-gown",
    name: "Vestido Rêverie",
    tagline: "Vestido columna en satén crepé",
    description:
      "Un vestido columna strapless en satén crepé, con corsetería interna y cola corta. Solo para entradas triunfales.",
    details: ["Satén crepé", "Corsé interno", "Cola corta", "Hecho por encargo en 4 semanas"],
    price: 2150,
    category: "Vestidos",
    silhouette: "gown",
    tone: "ivory",
    colors: [
      { name: "Vino profundo", hex: "#3B010B" },
      { name: "Vinotinto", hex: "#75162D" },
    ],
    sizes: ["XS", "S", "M", "L"],
    badge: "Exclusivo",
    stock: 4,
    edition: 30,
    arrival: 7,
    featured: 8,
  },
  {
    id: "ombre-cropped",
    name: "Chaqueta Corta Ombre",
    tagline: "Recta, sin cuello, en bouclé",
    description:
      "Una chaqueta corta y sin cuello en bouclé tejido a mano con hilos de lúrex. Pensada para llegar justo a lo más estrecho de la cintura.",
    details: ["Bouclé tejido a mano", "Hilo de lúrex", "Ruedo con cadenilla", "Forro de seda"],
    price: 1390,
    category: "Sastrería",
    silhouette: "cropped",
    tone: "noir",
    colors: [
      { name: "Champaña", hex: "#F2E5C6" },
      { name: "Vinotinto", hex: "#75162D" },
    ],
    sizes: APPAREL,
    badge: "Nuevo",
    stock: 15,
    edition: 75,
    arrival: 13,
    featured: 10,
  },
  {
    id: "velours-ribbed",
    name: "Tejido Velours",
    tagline: "Merino acanalado, como segunda piel",
    description:
      "Un cuello alto ajustado en merino extrafino acanalado. Pegado como segunda piel, para que todo lo que pongas encima caiga perfecto.",
    details: ["Merino extrafino", "Cuello alto", "Cuerpo sin costuras", "Lavadora en ciclo de lana"],
    price: 620,
    category: "Tops y tejidos",
    silhouette: "ribbed",
    tone: "garnet",
    colors: [
      { name: "Champaña", hex: "#F2E5C6" },
      { name: "Vino profundo", hex: "#3B010B" },
    ],
    sizes: APPAREL,
    stock: 26,
    edition: 160,
    arrival: 3,
    featured: 11,
  },
  {
    id: "libre-trench",
    name: "Gabardina Libre",
    tagline: "Gabardina de algodón repelente al agua",
    description:
      "Nuestra versión de la gabardina: más larga, más esbelta y con cinturón alto. Tela repelente al agua con hombreras de tormenta y herrajes dorados.",
    details: ["Gabardina de algodón", "Acabado repelente al agua", "Cinturón removible", "Herrajes dorados"],
    price: 1980,
    category: "Abrigos",
    silhouette: "trench",
    tone: "ivory",
    colors: [
      { name: "Vinotinto", hex: "#75162D" },
      { name: "Granate", hex: "#560B18" },
    ],
    sizes: APPAREL,
    stock: 9,
    edition: 70,
    arrival: 2,
    featured: 12,
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
