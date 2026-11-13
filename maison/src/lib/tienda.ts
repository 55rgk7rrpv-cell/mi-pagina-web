// Datos de cobro de Otra Pinta. ESTE es el único archivo que hay que tocar para cambiarlos.
//
// Mientras un dato esté en null, la tienda NO muestra datos inventados: le dice a la clienta
// que se los enviamos por WhatsApp / Instagram. Nunca pongas aquí datos de prueba.

/** Datos para recibir Pago Móvil. */
export const PAGO_MOVIL: {
  /** Nombre del banco, por ejemplo "Banesco" */
  banco: string | null;
  /** Código del banco, por ejemplo "0134" */
  codigoBanco: string | null;
  /** Teléfono afiliado, por ejemplo "0414-1234567" */
  telefono: string | null;
  /** Cédula o RIF del titular, por ejemplo "V-12345678" o "J-12345678-9" */
  documento: string | null;
} = {
  banco: "Banco del Tesoro",
  codigoBanco: "0163",
  telefono: "0412-1909480",
  documento: "V-33846154",
};

/**
 * Tasa oficial BCV (bolívares por dólar). NO se escribe aquí: una tarea programada la busca cada mañana
 * (scripts/tasa-bcv.mjs) y la publica como "tasa.json" junto a la página; la tienda la lee con useTasaBcv().
 */
export interface TasaBcv {
  bsPorDolar: number;
  /** fecha valor, "AAAA-MM-DD" */
  fecha: string;
}

/** A rate older than this is not shown: the Bs amount is confirmed by message instead. */
export const TASA_MAX_DIAS = 4;

/** WhatsApp de la tienda en formato internacional sin "+" ni espacios, por ejemplo "584141234567". */
export const WHATSAPP: string | null = null;

/** Usuario de Instagram (sin @). */
export const INSTAGRAM = "otrapintapzo";

export const pagoMovilListo = () => Boolean(PAGO_MOVIL.banco && PAGO_MOVIL.codigoBanco && PAGO_MOVIL.telefono && PAGO_MOVIL.documento);

/** Bancos venezolanos que operan Pago Móvil (código y nombre), para que la clienta diga desde cuál pagó. */
export const BANCOS: { codigo: string; nombre: string }[] = [
  { codigo: "0102", nombre: "Banco de Venezuela" },
  { codigo: "0104", nombre: "Venezolano de Crédito" },
  { codigo: "0105", nombre: "Mercantil" },
  { codigo: "0108", nombre: "Provincial" },
  { codigo: "0114", nombre: "Bancaribe" },
  { codigo: "0115", nombre: "Exterior" },
  { codigo: "0128", nombre: "Banco Caroní" },
  { codigo: "0134", nombre: "Banesco" },
  { codigo: "0137", nombre: "Sofitasa" },
  { codigo: "0138", nombre: "Banco Plaza" },
  { codigo: "0151", nombre: "BFC Banco Fondo Común" },
  { codigo: "0156", nombre: "100% Banco" },
  { codigo: "0163", nombre: "Banco del Tesoro" },
  { codigo: "0166", nombre: "Banco Agrícola de Venezuela" },
  { codigo: "0168", nombre: "Bancrecer" },
  { codigo: "0169", nombre: "R4 Banco Microfinanciero" },
  { codigo: "0171", nombre: "Banco Activo" },
  { codigo: "0172", nombre: "Bancamiga" },
  { codigo: "0174", nombre: "Banplus" },
  { codigo: "0175", nombre: "Banco Digital de los Trabajadores" },
  { codigo: "0177", nombre: "Banfanb" },
  { codigo: "0191", nombre: "BNC Banco Nacional de Crédito" },
];

/** Monto en bolívares, redondeado al céntimo hacia arriba, o null si no hay tasa vigente. */
export const enBolivares = (usd: number, tasa: TasaBcv | null) => (tasa ? Math.ceil(usd * tasa.bsPorDolar * 100) / 100 : null);

/** "2026-11-13" -> "13/11/2026" */
export const fechaCorta = (iso: string) => iso.split("-").reverse().join("/");

export const formatTasa = (t: TasaBcv) => new Intl.NumberFormat("es-VE", { maximumFractionDigits: 4 }).format(t.bsPorDolar);

export const formatBs = (bs: number) =>
  "Bs. " + new Intl.NumberFormat("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(bs);
