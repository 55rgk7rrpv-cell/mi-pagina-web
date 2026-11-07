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
  | "Dresses"
  | "Tailoring"
  | "Tops & Knits"
  | "Outerwear"
  | "Accessories";

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
  badge?: "Limited Drop" | "Last Pieces" | "New" | "Atelier Exclusive";
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

export const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Dresses",
  "Tailoring",
  "Tops & Knits",
  "Outerwear",
  "Accessories",
];

const APPAREL = ["XS", "S", "M", "L", "XL"];

export const PRODUCTS: Product[] = [
  {
    id: "vesper-slip",
    name: "Vesper Slip Dress",
    tagline: "Bias-cut silk charmeuse",
    description:
      "Cut on the bias from heavy silk charmeuse, Vesper moves like poured light. Fine straps, a low back and a hem that pools just above the ankle.",
    details: ["100% mulberry silk, 22 momme", "Adjustable hand-rolled straps", "Made in Como, Italy", "Dry clean only"],
    price: 1280,
    category: "Dresses",
    silhouette: "slip",
    tone: "noir",
    colors: [
      { name: "Sand Gold", hex: "#F2D9A0" },
      { name: "Burgundy", hex: "#75162D" },
    ],
    sizes: APPAREL,
    badge: "Limited Drop",
    stock: 7,
    edition: 120,
    arrival: 12,
    featured: 1,
  },
  {
    id: "noir-blazer",
    name: "Sculpted Blazer",
    tagline: "Hand-padded wool grain de poudre",
    description:
      "A strong shoulder, a cinched waist and peak lapels that mean business. Canvassed by hand in our atelier over 40 hours.",
    details: ["Virgin wool grain de poudre", "Full horsehair canvas", "Silk cupro lining", "Horn buttons"],
    price: 1650,
    category: "Tailoring",
    silhouette: "blazer",
    tone: "garnet",
    colors: [
      { name: "Champagne", hex: "#F2E5C6" },
      { name: "Deep Wine", hex: "#3B010B" },
    ],
    sizes: APPAREL,
    badge: "Atelier Exclusive",
    stock: 12,
    edition: 80,
    arrival: 10,
    featured: 2,
  },
  {
    id: "aurore-corset",
    name: "Aurore Corset",
    tagline: "Duchess satin, twelve bones",
    description:
      "Structured duchess satin with twelve spiral steel bones and a sweetheart neckline. Wear it with tailoring by day and nothing else by night.",
    details: ["Duchess satin shell", "Spiral steel boning", "Concealed back zip", "Made in Paris"],
    price: 890,
    category: "Tops & Knits",
    silhouette: "corset",
    tone: "ivory",
    colors: [
      { name: "Burgundy", hex: "#75162D" },
      { name: "Champagne", hex: "#F2E5C6" },
    ],
    sizes: ["XS", "S", "M", "L"],
    badge: "Last Pieces",
    stock: 3,
    edition: 60,
    arrival: 9,
    featured: 3,
  },
  {
    id: "maison-coat",
    name: "Wrap Coat",
    tagline: "Double-faced cashmere",
    description:
      "An enveloping wrap coat in double-faced cashmere, hand-finished seams and a sash that ties exactly where you want it to.",
    details: ["100% double-faced cashmere", "Hand-sewn edges", "Detachable sash", "Unlined for drape"],
    price: 2400,
    category: "Outerwear",
    silhouette: "coat",
    tone: "noir",
    colors: [
      { name: "Champagne", hex: "#F2E5C6" },
      { name: "Dark Maroon", hex: "#560B18" },
    ],
    sizes: APPAREL,
    badge: "New",
    stock: 18,
    edition: 90,
    arrival: 11,
    featured: 4,
  },
  {
    id: "celeste-knit",
    name: "Céleste Knit",
    tagline: "Featherweight Mongolian cashmere",
    description:
      "A relaxed, featherweight crewneck knitted from 2-ply Mongolian cashmere. The sweater you will reach for every single time.",
    details: ["2-ply Mongolian cashmere", "Fully fashioned", "Ribbed cuffs and hem", "Hand wash cold"],
    price: 760,
    category: "Tops & Knits",
    silhouette: "knit",
    tone: "ivory",
    colors: [
      { name: "Burgundy", hex: "#75162D" },
      { name: "Sand Gold", hex: "#F2D9A0" },
    ],
    sizes: APPAREL,
    stock: 24,
    edition: 150,
    arrival: 5,
    featured: 6,
  },
  {
    id: "sable-trouser",
    name: "Sable Trouser",
    tagline: "High-rise wide leg",
    description:
      "High-waisted, floor-grazing and pressed with a razor crease. Sable lengthens every line and pairs with everything we make.",
    details: ["Wool-silk crepe", "Pressed front crease", "Side-adjuster waist", "Made in Portugal"],
    price: 720,
    category: "Tailoring",
    silhouette: "trouser",
    tone: "garnet",
    colors: [
      { name: "Sand Gold", hex: "#F2D9A0" },
      { name: "Champagne", hex: "#F2E5C6" },
    ],
    sizes: APPAREL,
    stock: 20,
    edition: 140,
    arrival: 6,
    featured: 7,
  },
  {
    id: "minuit-bag",
    name: "Minuit Bag",
    tagline: "Box calf, palladium clasp",
    description:
      "A structured top-handle bag in polished box calf with a sculpted gold clasp. Fits the essentials and the attitude.",
    details: ["Box calf leather", "Gold-plated brass clasp", "Suede interior", "Dust bag included"],
    price: 1950,
    category: "Accessories",
    silhouette: "bag",
    tone: "noir",
    colors: [
      { name: "Burgundy", hex: "#75162D" },
      { name: "Sand Gold", hex: "#F2D9A0" },
    ],
    sizes: ["One Size"],
    badge: "Limited Drop",
    stock: 5,
    edition: 50,
    arrival: 8,
    featured: 5,
  },
  {
    id: "goutte-pendant",
    name: "Goutte d'Or Pendant",
    tagline: "18k gold vermeil",
    description:
      "A single drop of gold on a fine cable chain. Hand-polished vermeil over sterling silver, made to be worn every day.",
    details: ["18k gold vermeil", "Recycled sterling silver core", "45 cm chain", "Presented in a lacquered box"],
    price: 540,
    category: "Accessories",
    silhouette: "pendant",
    tone: "garnet",
    colors: [{ name: "Gold", hex: "#F2D9A0" }],
    sizes: ["One Size"],
    stock: 30,
    edition: 200,
    arrival: 4,
    featured: 9,
  },
  {
    id: "reverie-gown",
    name: "Rêverie Gown",
    tagline: "Column gown, crêpe back satin",
    description:
      "A strapless column in crêpe back satin with a built-in corsetry foundation and a sweep train. For entrances only.",
    details: ["Crêpe back satin", "Internal corset", "Sweep train", "Made to order in 4 weeks"],
    price: 2150,
    category: "Dresses",
    silhouette: "gown",
    tone: "ivory",
    colors: [
      { name: "Deep Wine", hex: "#3B010B" },
      { name: "Burgundy", hex: "#75162D" },
    ],
    sizes: ["XS", "S", "M", "L"],
    badge: "Atelier Exclusive",
    stock: 4,
    edition: 30,
    arrival: 7,
    featured: 8,
  },
  {
    id: "ombre-cropped",
    name: "Ombre Cropped Jacket",
    tagline: "Boxy, collarless, bouclé",
    description:
      "A cropped, collarless jacket in hand-woven bouclé threaded with lurex. Designed to sit at the narrowest point of the waist.",
    details: ["Hand-woven bouclé", "Lurex thread", "Chain-weighted hem", "Silk lining"],
    price: 1390,
    category: "Tailoring",
    silhouette: "cropped",
    tone: "noir",
    colors: [
      { name: "Champagne", hex: "#F2E5C6" },
      { name: "Burgundy", hex: "#75162D" },
    ],
    sizes: APPAREL,
    badge: "New",
    stock: 15,
    edition: 75,
    arrival: 13,
    featured: 10,
  },
  {
    id: "velours-ribbed",
    name: "Velours Ribbed Knit",
    tagline: "Second-skin merino rib",
    description:
      "A fitted mock-neck in extra-fine merino rib. Second-skin close, so everything you layer over it falls just right.",
    details: ["Extra-fine merino", "Mock neck", "Seamless body", "Machine wash wool cycle"],
    price: 620,
    category: "Tops & Knits",
    silhouette: "ribbed",
    tone: "garnet",
    colors: [
      { name: "Champagne", hex: "#F2E5C6" },
      { name: "Deep Wine", hex: "#3B010B" },
    ],
    sizes: APPAREL,
    stock: 26,
    edition: 160,
    arrival: 3,
    featured: 11,
  },
  {
    id: "libre-trench",
    name: "Libre Trench",
    tagline: "Water-repellent cotton gabardine",
    description:
      "Our take on the trench: longer, leaner and belted high. Water-repellent gabardine with storm flaps and gold hardware.",
    details: ["Cotton gabardine", "Water-repellent finish", "Removable belt", "Gold-tone hardware"],
    price: 1980,
    category: "Outerwear",
    silhouette: "trench",
    tone: "ivory",
    colors: [
      { name: "Burgundy", hex: "#75162D" },
      { name: "Dark Maroon", hex: "#560B18" },
    ],
    sizes: APPAREL,
    stock: 9,
    edition: 70,
    arrival: 2,
    featured: 12,
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
