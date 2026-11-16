// Catálogo de Otra Pinta. Generado a partir de catalogo/catalogo.json.
// Cada color tiene su propia foto (prenda sobre fondo blanco) y sus tallas.

export type Category = "Vestidos" | "Conjuntos" | "Tops" | "Faldas" | "Chaquetas" | "Accesorios";

export interface ColorVariant {
  name: string;
  hex: string;
  sizes: string[];
  image: string;
  /** true when the photo shows a person (model, or a hand holding the garment) */
  withModel: boolean;
  /** true when the photo is an AI rendering made from the real photo (shown as illustrative) */
  aiGenerated: boolean;
  /** explanation shown over the photo in the quick view, when it needs one */
  note: string | null;
}

export interface GalleryImage {
  src: string;
  withModel: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  /** Precio en USD (el "Ref" del catálogo) */
  price: number;
  description: string;
  /** El primer color es la portada: el más llamativo */
  colors: ColorVariant[];
  /** Fotos extra del mismo producto (solo para la galería de la vista rápida) */
  gallery: GalleryImage[];
  /** true while the product still has no garment-only photo */
  coverHasModel: boolean;
  badge: "Última pieza" | null;
  featured: number;
}

export const CATEGORIES: ("Todo" | Category)[] = ["Todo", "Vestidos", "Conjuntos", "Tops", "Faldas", "Chaquetas", "Accesorios"];

export const PRODUCTS: Product[] = [
  {
    "id": "vestido-halter-volantes",
    "name": "Vestido halter con volantes",
    "category": "Vestidos",
    "price": 35,
    "description": "Cuello halter, cintura fruncida que estiliza y una falda de volantes en capas que se mueve contigo.",
    "colors": [
      {
        "name": "Rojo",
        "hex": "#B11212",
        "sizes": [
          "XS"
        ],
        "image": "catalogo/vestido-halter-volantes__rojo-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Azul marino con lunares",
        "hex": "#1E2435",
        "sizes": [
          "L (ajusta M)"
        ],
        "image": "catalogo/vestido-halter-volantes__azul-marino-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Blanco con lunares pequeños",
        "hex": "#E4E1DA",
        "sizes": [
          "S"
        ],
        "image": "catalogo/vestido-halter-volantes__blanco-lunares-pequenos-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Blanco con lunares grandes",
        "hex": "#E0DFE0",
        "sizes": [
          "M (ajusta S)"
        ],
        "image": "catalogo/vestido-halter-volantes__blanco-lunares-grandes-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-halter-volantes__rojo.webp",
        "withModel": true
      },
      {
        "src": "catalogo/vestido-halter-volantes__azul-marino.webp",
        "withModel": true
      },
      {
        "src": "catalogo/vestido-halter-volantes__blanco-lunares-pequenos.webp",
        "withModel": true
      },
      {
        "src": "catalogo/vestido-halter-volantes__blanco-lunares-grandes.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": null,
    "featured": 1
  },
  {
    "id": "conjunto-top-falda-sirena",
    "name": "Conjunto top corto y falda sirena con lunares",
    "category": "Conjuntos",
    "price": 45,
    "description": "Top corto drapeado y falda larga tipo sirena con fruncido en la cadera. Dos piezas que juntas son un look completo.",
    "colors": [
      {
        "name": "Azul marino con lunares",
        "hex": "#052339",
        "sizes": [
          "S",
          "M"
        ],
        "image": "catalogo/conjunto-top-falda-sirena__azul-marino-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/conjunto-top-falda-sirena__azul-marino.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": null,
    "featured": 2
  },
  {
    "id": "vestido-largo-strapless-rosa",
    "name": "Vestido largo strapless con rosa",
    "category": "Vestidos",
    "price": 45,
    "description": "Strapless ajustado con rosa aplicada, abertura lateral y volantes en el ruedo. Incluye gargantilla de rosa.",
    "colors": [
      {
        "name": "Vinotinto",
        "hex": "#58122B",
        "sizes": [
          "XS",
          "S"
        ],
        "image": "catalogo/vestido-largo-strapless-rosa__vinotinto-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-largo-strapless-rosa__vinotinto.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": null,
    "featured": 3
  },
  {
    "id": "vestido-largo-un-hombro",
    "name": "Vestido largo de un hombro fruncido",
    "category": "Vestidos",
    "price": 45,
    "description": "Un solo hombro, cuerpo fruncido hasta la cadera y falda larga y vaporosa. Elegante sin esfuerzo.",
    "colors": [
      {
        "name": "Amarillo claro",
        "hex": "#E0DFC5",
        "sizes": [
          "S"
        ],
        "image": "catalogo/vestido-largo-un-hombro__amarillo-claro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Negro",
        "hex": "#1A1A1A",
        "sizes": [
          "S"
        ],
        "image": "catalogo/vestido-largo-un-hombro__negro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-largo-un-hombro__amarillo-claro.webp",
        "withModel": true
      },
      {
        "src": "catalogo/vestido-largo-un-hombro__negro.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": null,
    "featured": 4
  },
  {
    "id": "vestido-halter-lunares-escote",
    "name": "Vestido halter con lunares y escote profundo",
    "category": "Vestidos",
    "price": 28,
    "description": "Corto, con escote en V profundo, espalda descubierta y falda con vuelo. Lunares que nunca pasan de moda.",
    "colors": [
      {
        "name": "Vinotinto con lunares",
        "hex": "#710B19",
        "sizes": [
          "S"
        ],
        "image": "catalogo/vestido-halter-lunares-escote__vinotinto-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Negro con lunares",
        "hex": "#091214",
        "sizes": [
          "XS",
          "M"
        ],
        "image": "catalogo/vestido-halter-lunares-escote__negro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Crema con lunares",
        "hex": "#DFD4BE",
        "sizes": [
          "M"
        ],
        "image": "catalogo/vestido-halter-lunares-escote__crema-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-halter-lunares-escote__vinotinto.webp",
        "withModel": true
      },
      {
        "src": "catalogo/vestido-halter-lunares-escote__negro.webp",
        "withModel": true
      },
      {
        "src": "catalogo/vestido-halter-lunares-escote__crema.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": null,
    "featured": 5
  },
  {
    "id": "vestido-floral-manga-globo",
    "name": "Vestido floral manga globo",
    "category": "Vestidos",
    "price": 40,
    "description": "Estampado floral, mangas globo, escote en V y falda con vuelo. Romántico y fresco.",
    "colors": [
      {
        "name": "Blanco con flores amarillas",
        "hex": "#EBE6D2",
        "sizes": [
          "S"
        ],
        "image": "catalogo/vestido-floral-manga-globo__blanco-floral-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-floral-manga-globo__blanco-floral.webp",
        "withModel": true
      },
      {
        "src": "catalogo/vestido-floral-manga-globo__blanco-floral-2.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 6
  },
  {
    "id": "top-tul-volantes",
    "name": "Top de tul con volantes",
    "category": "Tops",
    "price": 20,
    "description": "Top de tirantes con tul semitransparente, lazo al frente y volantes que caen a los lados.",
    "colors": [
      {
        "name": "Negro",
        "hex": "#4B4B48",
        "sizes": [
          "XXS"
        ],
        "image": "catalogo/top-tul-volantes__negro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/top-tul-volantes__negro.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 7
  },
  {
    "id": "vestido-otra-pinta-lenceria",
    "name": "Vestido Otra Pinta estilo lencería",
    "category": "Vestidos",
    "price": 28,
    "description": "Nuestro vestido insignia: franela marrón con encaje negro encima, en tendencia lingerie look. Tela: poliamida.",
    "colors": [
      {
        "name": "Marrón y negro",
        "hex": "#201A19",
        "sizes": [
          "S"
        ],
        "image": "catalogo/vestido-otra-pinta-lenceria__marron-negro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-otra-pinta-lenceria__marron-negro.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 8
  },
  {
    "id": "vestido-midi-asimetrico",
    "name": "Vestido midi asimétrico con abertura",
    "category": "Vestidos",
    "price": 38,
    "description": "Midi ajustado, con hombro asimétrico, drapeado lateral y abertura en la pierna.",
    "colors": [
      {
        "name": "Negro",
        "hex": "#1D232A",
        "sizes": [
          "XXS"
        ],
        "image": "catalogo/vestido-midi-asimetrico__negro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-midi-asimetrico__negro.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 9
  },
  {
    "id": "top-halter-aberturas",
    "name": "Top halter fruncido con aberturas",
    "category": "Tops",
    "price": 16,
    "description": "Top halter fruncido con aberturas al frente y ruedo con volante.",
    "colors": [
      {
        "name": "Negro",
        "hex": "#1B1B1B",
        "sizes": [
          "XS"
        ],
        "image": "catalogo/top-halter-aberturas__negro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/top-halter-aberturas__negro.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 10
  },
  {
    "id": "vestido-strapless-encaje-rosa",
    "name": "Vestido corto strapless de encaje con rosa",
    "category": "Vestidos",
    "price": 35,
    "description": "Strapless de encaje con cintura fruncida, falda de volantes en capas y una rosa con cinta caída.",
    "colors": [
      {
        "name": "Vinotinto",
        "hex": "#57151E",
        "sizes": [
          "XS",
          "S"
        ],
        "image": "catalogo/vestido-strapless-encaje-rosa__vinotinto-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [],
    "coverHasModel": false,
    "badge": null,
    "featured": 11
  },
  {
    "id": "falda-volantes-bicolor",
    "name": "Falda corta con volantes",
    "category": "Faldas",
    "price": 28,
    "description": "Falda corta negra con volantes blancos en capas. Contraste puro.",
    "colors": [
      {
        "name": "Negro y blanco",
        "hex": "#040605",
        "sizes": [
          "S",
          "M"
        ],
        "image": "catalogo/falda-volantes-bicolor__negro-blanco-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [],
    "coverHasModel": false,
    "badge": null,
    "featured": 12
  },
  {
    "id": "chaqueta-capucha-lunares",
    "name": "Chaqueta con capucha y lunares",
    "category": "Chaquetas",
    "price": 38,
    "description": "Chaqueta ligera con capucha, cierre y puños elásticos, en lunares.",
    "colors": [
      {
        "name": "Amarillo con lunares",
        "hex": "#E2D6A1",
        "sizes": [
          "L"
        ],
        "image": "catalogo/chaqueta-capucha-lunares__amarillo-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Rosa con lunares",
        "hex": "#E4C4CC",
        "sizes": [
          "M"
        ],
        "image": "catalogo/chaqueta-capucha-lunares__rosa-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/chaqueta-capucha-lunares__amarillo.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": null,
    "featured": 13
  },
  {
    "id": "top-encaje-corse",
    "name": "Top de encaje tipo corsé",
    "category": "Tops",
    "price": 20,
    "description": "Top tipo corsé de encaje con copas, tirantes finos y abertura al centro.",
    "colors": [
      {
        "name": "Negro",
        "hex": "#413B38",
        "sizes": [
          "XS",
          "M"
        ],
        "image": "catalogo/top-encaje-corse__negro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/top-encaje-corse__negro.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": null,
    "featured": 14
  },
  {
    "id": "falda-saten-encaje",
    "name": "Conjunto de satén con encaje",
    "category": "Conjuntos",
    "price": 30,
    "description": "Conjunto de top de encaje tipo corsé y falda midi de satén con ruedo en picos de encaje. Se vende junto, como en la foto.",
    "colors": [
      {
        "name": "Negro",
        "hex": "#292929",
        "sizes": [
          "XS",
          "S"
        ],
        "image": "catalogo/falda-saten-encaje__negro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/falda-saten-encaje__negro.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": null,
    "featured": 15
  },
  {
    "id": "top-saten-cruzado",
    "name": "Top de satén halter cruzado con encaje",
    "category": "Tops",
    "price": 18,
    "description": "Top de satén con cuello halter cruzado y ruedo asimétrico de encaje.",
    "colors": [
      {
        "name": "Marrón",
        "hex": "#3C261B",
        "sizes": [
          "S"
        ],
        "image": "catalogo/top-saten-cruzado__marron-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Champaña",
        "hex": "#E0DAD1",
        "sizes": [
          "XXS"
        ],
        "image": "catalogo/top-saten-cruzado__champana-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Negro",
        "hex": "#1D1D1B",
        "sizes": [
          "XS"
        ],
        "image": "catalogo/top-saten-cruzado__negro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [],
    "coverHasModel": false,
    "badge": null,
    "featured": 16
  },
  {
    "id": "top-saten-cuello-alto",
    "name": "Top de satén cuello alto con encaje",
    "category": "Tops",
    "price": 18,
    "description": "Top de satén con cuello alto, sin mangas y ruedo asimétrico de encaje.",
    "colors": [
      {
        "name": "Vinotinto",
        "hex": "#451313",
        "sizes": [
          "M"
        ],
        "image": "catalogo/top-saten-cuello-alto__vinotinto-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Marrón",
        "hex": "#50392C",
        "sizes": [
          "S"
        ],
        "image": "catalogo/top-saten-cuello-alto__marron-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [],
    "coverHasModel": false,
    "badge": null,
    "featured": 17
  },
  {
    "id": "top-saten-lazo",
    "name": "Top de satén con lazo al cuello y encaje",
    "category": "Tops",
    "price": 18,
    "description": "Top de satén que se amarra al cuello con lazo, con ruedo de encaje. Cinco colores para elegir.",
    "colors": [
      {
        "name": "Rojo",
        "hex": "#A6161D",
        "sizes": [
          "S"
        ],
        "image": "catalogo/top-saten-lazo__rojo-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Amarillo",
        "hex": "#E9D381",
        "sizes": [
          "XXS"
        ],
        "image": "catalogo/top-saten-lazo__amarillo-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Verde",
        "hex": "#082F1F",
        "sizes": [
          "M"
        ],
        "image": "catalogo/top-saten-lazo__verde-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Marrón",
        "hex": "#3A271C",
        "sizes": [
          "M"
        ],
        "image": "catalogo/top-saten-lazo__marron-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Champaña",
        "hex": "#EADED0",
        "sizes": [
          "XS"
        ],
        "image": "catalogo/top-saten-lazo__champana-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [],
    "coverHasModel": false,
    "badge": null,
    "featured": 18
  },
  {
    "id": "vestido-blazer-manga-larga",
    "name": "Vestido blazer manga larga con falda plisada",
    "category": "Vestidos",
    "price": 70,
    "description": "Vestido blazer de manga larga, cuello solapa y falda con pliegues. Poder y feminidad.",
    "colors": [
      {
        "name": "Rojo",
        "hex": "#750C1A",
        "sizes": [
          "M"
        ],
        "image": "catalogo/vestido-blazer-manga-larga__rojo-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-blazer-manga-larga__rojo.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 19
  },
  {
    "id": "vestido-encaje-hombros-descubiertos",
    "name": "Vestido corto de encaje con hombros descubiertos",
    "category": "Vestidos",
    "price": 35,
    "description": "Encaje con hombros descubiertos, mangas largas transparentes y falda de volantes.",
    "colors": [
      {
        "name": "Amarillo",
        "hex": "#E5D283",
        "sizes": [
          "S"
        ],
        "image": "catalogo/vestido-encaje-hombros-descubiertos__amarillo-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-encaje-hombros-descubiertos__amarillo.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 20
  },
  {
    "id": "vestido-blazer-halter",
    "name": "Vestido blazer halter con botones",
    "category": "Vestidos",
    "price": 60,
    "description": "Vestido blazer halter con solapas, botones al frente y falda con pliegues.",
    "colors": [
      {
        "name": "Vinotinto",
        "hex": "#48101A",
        "sizes": [
          "S"
        ],
        "image": "catalogo/vestido-blazer-halter__vinotinto-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-blazer-halter__vinotinto.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 21
  },
  {
    "id": "vestido-largo-espalda-descubierta",
    "name": "Vestido largo con espalda descubierta",
    "category": "Vestidos",
    "price": 43,
    "description": "Largo, con escote y abertura al frente, espalda descubierta y fruncido que marca la figura.",
    "colors": [
      {
        "name": "Amarillo claro",
        "hex": "#E0DDBA",
        "sizes": [
          "S"
        ],
        "image": "catalogo/vestido-largo-espalda-descubierta__amarillo-claro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-largo-espalda-descubierta__amarillo-claro.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 22
  },
  {
    "id": "enterizo-tul-manga-larga",
    "name": "Enterizo corto de tul manga larga",
    "category": "Conjuntos",
    "price": 30,
    "description": "Enterizo corto de tul fruncido, cuello alto y manga larga.",
    "colors": [
      {
        "name": "Negro",
        "hex": "#181818",
        "sizes": [
          "S"
        ],
        "image": "catalogo/enterizo-tul-manga-larga__negro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/enterizo-tul-manga-larga__negro.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 23
  },
  {
    "id": "vestido-largo-lunares-panuelo",
    "name": "Vestido largo con lunares y pañuelo",
    "category": "Vestidos",
    "price": 40,
    "description": "Largo y ajustado, de tirantes, con lunares y un pañuelo a juego para el cuello.",
    "colors": [
      {
        "name": "Amarillo con lunares marrones",
        "hex": "#E9D59E",
        "sizes": [
          "S"
        ],
        "image": "catalogo/vestido-largo-lunares-panuelo__amarillo-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-largo-lunares-panuelo__amarillo.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 24
  },
  {
    "id": "vestido-halter-suelto",
    "name": "Vestido halter suelto con volantes",
    "category": "Vestidos",
    "price": 35,
    "description": "Halter suelto con lazo en la espalda y falda corta de volantes. Ligero y coqueto.",
    "colors": [
      {
        "name": "Rojo",
        "hex": "#690A1B",
        "sizes": [
          "S"
        ],
        "image": "catalogo/vestido-halter-suelto__rojo-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-halter-suelto__rojo.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 25
  },
  {
    "id": "vestido-largo-halter-plisado",
    "name": "Vestido largo halter plisado con lazo",
    "category": "Vestidos",
    "price": 45,
    "description": "Largo, cuello halter con lazo, cuerpo texturizado y falda plisada en capas.",
    "colors": [
      {
        "name": "Vinotinto",
        "hex": "#2D0C0F",
        "sizes": [
          "S"
        ],
        "image": "catalogo/vestido-largo-halter-plisado__vinotinto-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-largo-halter-plisado__vinotinto-modelo.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 26
  },
  {
    "id": "vestido-asimetrico-volantes",
    "name": "Vestido asimétrico de un hombro con volantes",
    "category": "Vestidos",
    "price": 38,
    "description": "Un solo hombro, cuerpo fruncido y ruedo asimétrico de volantes.",
    "colors": [
      {
        "name": "Vinotinto",
        "hex": "#4B0C18",
        "sizes": [
          "S"
        ],
        "image": "catalogo/vestido-asimetrico-volantes__vinotinto-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-asimetrico-volantes__vinotinto.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 27
  },
  {
    "id": "vestido-halter-suelto-tul",
    "name": "Vestido halter suelto con lunares y tul",
    "category": "Vestidos",
    "price": 40,
    "description": "Halter suelto con lunares, lazo en la espalda y falda de volantes con borde de tul.",
    "colors": [
      {
        "name": "Blanco con lunares negros",
        "hex": "#DAD9DC",
        "sizes": [
          "XS"
        ],
        "image": "catalogo/vestido-halter-suelto-tul__blanco-lunares-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-halter-suelto-tul__blanco-lunares.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 28
  },
  {
    "id": "vestido-corto-lunares-panuelo",
    "name": "Vestido corto con lunares y pañuelo",
    "category": "Vestidos",
    "price": 30,
    "description": "Corto, de escote pronunciado, con lunares y pañuelo largo a juego. Cuatro colores.",
    "colors": [
      {
        "name": "Amarillo con lunares",
        "hex": "#E4CF93",
        "sizes": [
          "L"
        ],
        "image": "catalogo/vestido-corto-lunares-panuelo__amarillo-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Marrón con lunares",
        "hex": "#38271F",
        "sizes": [
          "S"
        ],
        "image": "catalogo/vestido-corto-lunares-panuelo__marron-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Crema con lunares",
        "hex": "#DFD7C5",
        "sizes": [
          "XS"
        ],
        "image": "catalogo/vestido-corto-lunares-panuelo__crema-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Negro con lunares",
        "hex": "#151515",
        "sizes": [
          "XXS"
        ],
        "image": "catalogo/vestido-corto-lunares-panuelo__negro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-corto-lunares-panuelo__amarillo.webp",
        "withModel": true
      },
      {
        "src": "catalogo/vestido-corto-lunares-panuelo__marron.webp",
        "withModel": true
      },
      {
        "src": "catalogo/vestido-corto-lunares-panuelo__crema.webp",
        "withModel": true
      },
      {
        "src": "catalogo/vestido-corto-lunares-panuelo__negro.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": null,
    "featured": 29
  },
  {
    "id": "top-encaje-hombro-descubierto",
    "name": "Top de encaje con hombro descubierto",
    "category": "Tops",
    "price": 16,
    "description": "Top de encaje con un hombro descubierto, manga larga y ruedo asimétrico.",
    "colors": [
      {
        "name": "Negro",
        "hex": "#181B16",
        "sizes": [
          "XS"
        ],
        "image": "catalogo/top-encaje-hombro-descubierto__negro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/top-encaje-hombro-descubierto__negro.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 30
  },
  {
    "id": "vestido-mangas-acampanadas",
    "name": "Vestido corto con mangas acampanadas y volantes",
    "category": "Vestidos",
    "price": 38,
    "description": "Corto, con hombros descubiertos, mangas acampanadas y falda de volantes en capas.",
    "colors": [
      {
        "name": "Rojo",
        "hex": "#5B0F1A",
        "sizes": [
          "M"
        ],
        "image": "catalogo/vestido-mangas-acampanadas__rojo-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/vestido-mangas-acampanadas__rojo.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 31
  },
  {
    "id": "conjunto-chaleco-short",
    "name": "Conjunto chaleco y short",
    "category": "Conjuntos",
    "price": 30,
    "description": "Chaleco con botones dorados y short a juego. Fresco y elegante a la vez.",
    "colors": [
      {
        "name": "Amarillo",
        "hex": "#EAE1A0",
        "sizes": [
          "XS",
          "M"
        ],
        "image": "catalogo/conjunto-chaleco-short__amarillo-plano-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Crema con lunares",
        "hex": "#E7E1D4",
        "sizes": [
          "S",
          "M"
        ],
        "image": "catalogo/conjunto-chaleco-short__crema-lunares-plano-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/conjunto-chaleco-short__amarillo.webp",
        "withModel": true
      },
      {
        "src": "catalogo/conjunto-chaleco-short__crema-lunares.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": null,
    "featured": 32
  },
  {
    "id": "falda-larga-encaje",
    "name": "Falda larga asimétrica de encaje con volantes",
    "category": "Faldas",
    "price": 30,
    "description": "Falda de encaje con volantes, corta al frente y larga atrás.",
    "colors": [
      {
        "name": "Negro",
        "hex": "#5D5E5F",
        "sizes": [
          "XXS",
          "S"
        ],
        "image": "catalogo/falda-larga-encaje__negro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/falda-larga-encaje__negro.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": null,
    "featured": 33
  },
  {
    "id": "falda-plisada-short",
    "name": "Falda plisada con short interno",
    "category": "Faldas",
    "price": 28,
    "description": "Falda corta plisada con short por dentro, para moverte con tranquilidad.",
    "colors": [
      {
        "name": "Gris carbón",
        "hex": "#3E3E3D",
        "sizes": [
          "S"
        ],
        "image": "catalogo/falda-plisada-short__gris-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/falda-plisada-short__gris.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 34
  },
  {
    "id": "cinturon-cadena-corazones",
    "name": "Cinturón de cadena con corazones",
    "category": "Accesorios",
    "price": 15,
    "description": "Cinturón de cadena dorada con medallones y corazones.",
    "colors": [
      {
        "name": "Dorado",
        "hex": "#FFFFFF",
        "sizes": [
          "Única"
        ],
        "image": "catalogo/cinturon-cadena-corazones__dorado-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [
      {
        "src": "catalogo/cinturon-cadena-corazones__dorado-modelo.webp",
        "withModel": true
      }
    ],
    "coverHasModel": false,
    "badge": "Última pieza",
    "featured": 35
  },
  {
    "id": "cinturon-elegante",
    "name": "Cinturón elegante con hebilla dorada",
    "category": "Accesorios",
    "price": 13,
    "description": "Cinturón de cuero sintético con hebilla y puntera doradas. Precio por unidad.",
    "colors": [
      {
        "name": "Marrón",
        "hex": "#422F22",
        "sizes": [
          "Única"
        ],
        "image": "catalogo/cinturon-elegante__marron-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      },
      {
        "name": "Negro",
        "hex": "#22211B",
        "sizes": [
          "Única"
        ],
        "image": "catalogo/cinturon-elegante__negro-sola.webp",
        "withModel": false,
        "aiGenerated": false,
        "note": null
      }
    ],
    "gallery": [],
    "coverHasModel": false,
    "badge": null,
    "featured": 36
  }
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

/** Note to show over a photo in the quick view: AI renderings are labelled as illustrative */
export const imageNote = (p: Product, src: string) => {
  const c = p.colors.find((c) => c.image === src);
  return c?.aiGenerated ? "Imagen ilustrativa · la foto real está en la galería" : c?.note ?? null;
};

export const getColor = (p: Product, color?: string) => p.colors.find((c) => c.name === color) ?? p.colors[0];

/** All photos of a product (quick-view gallery): one per colour, then the extra shots */
export const productImages = (p: Product) => [...p.colors.map((c) => c.image), ...p.gallery.map((g) => g.src)];

/** Garment-only photos (no person): the only ones the catalogue grid may show */
export const garmentImages = (p: Product) =>
  [...p.colors.filter((c) => !c.withModel).map((c) => c.image), ...p.gallery.filter((g) => !g.withModel).map((g) => g.src)];
