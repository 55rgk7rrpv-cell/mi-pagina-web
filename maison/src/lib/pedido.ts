// The order summary that the customer sends to the shop (WhatsApp / Instagram).
// The site has no server: this message IS the order, so it carries everything needed to verify and deliver.
import { formatPrice } from "./format";
import { enBolivares, fechaCorta, formatBs, formatTasa, INSTAGRAM, WHATSAPP, type TasaBcv } from "./tienda";

export type PayMethod = "pagomovil" | "efectivo";

export interface PagoMovilDatos {
  banco: string; // "0134 Banesco"
  telefono: string;
  referencia: string;
}

export interface EfectivoDatos {
  /** amount in USD the customer will pay with, to bring change; empty if exact */
  pagaCon: string;
}

export interface Pedido {
  id: string;
  lineas: { nombre: string; color: string; talla: string; cantidad: number; total: number }[];
  subtotal: number;
  descuento: number;
  envio: number;
  envioLabel: string;
  total: number;
  /** BCV rate used for the Bs amount, or null if none was current */
  tasa: TasaBcv | null;
  cliente: { nombre: string; telefono: string; correo: string; direccion: string };
  pago: { metodo: "pagomovil"; datos: PagoMovilDatos } | { metodo: "efectivo"; datos: EfectivoDatos };
}

export const nuevoId = () => `OP-${Math.floor(100000 + Math.random() * 900000)}`;

export function mensajePedido(p: Pedido): string {
  const bs = enBolivares(p.total, p.tasa);
  const out = [
    `Hola Otra Pinta, quiero confirmar mi pedido ${p.id}`,
    "",
    ...p.lineas.map((l) => `• ${l.nombre}, ${l.color}, talla ${l.talla} × ${l.cantidad}: ${formatPrice(l.total)}`),
    "",
    `Subtotal: ${formatPrice(p.subtotal)}`,
    ...(p.descuento ? [`Descuento: -${formatPrice(p.descuento)}`] : []),
    `${p.envioLabel}: ${p.envio ? formatPrice(p.envio) : "gratis"}`,
    `Total: ${formatPrice(p.total)}${bs ? ` (${formatBs(bs)} a tasa BCV ${formatTasa(p.tasa!)} del ${fechaCorta(p.tasa!.fecha)})` : ""}`,
    "",
  ];
  if (p.pago.metodo === "pagomovil") {
    const d = p.pago.datos;
    if (d.referencia) out.push("Pago: Pago Móvil", `Desde: ${d.banco}`, `Teléfono que pagó: ${d.telefono}`, `Referencia: ${d.referencia}`);
    else out.push("Pago: Pago Móvil. Por favor envíenme los datos para pagar.");
  } else {
    out.push(`Pago: efectivo (dólares) al ${p.envioLabel === "Retiro en persona" ? "retirar" : "recibir"}`, p.pago.datos.pagaCon ? `Pago con: $${p.pago.datos.pagaCon} (traer cambio)` : "Pago con el monto exacto");
  }
  out.push("", `Nombre: ${p.cliente.nombre}`, `Teléfono: ${p.cliente.telefono}`);
  if (p.cliente.correo) out.push(`Correo: ${p.cliente.correo}`);
  out.push(`Dirección: ${p.cliente.direccion}, Puerto Ordaz`);
  return out.join("\n");
}

export const whatsappUrl = (texto: string) => (WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}` : null);
/** Instagram cannot prefill a message: the page copies the text first, then opens the chat. */
export const instagramUrl = `https://ig.me/m/${INSTAGRAM}`;
