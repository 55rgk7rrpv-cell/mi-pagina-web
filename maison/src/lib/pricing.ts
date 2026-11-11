export const FREE_SHIPPING_THRESHOLD = 80;
export const STANDARD_SHIPPING = 5;

export interface Promo {
  code: string;
  label: string;
  kind: "percent" | "shipping";
  value: number;
  /** Minimum subtotal required, if any */
  min?: number;
}

export const PROMOS: Record<string, Promo> = {
  BIENVENIDA: { code: "BIENVENIDA", label: "El Círculo: 10% de descuento", kind: "percent", value: 10 },
  OTRAPINTA: { code: "OTRAPINTA", label: "15% de descuento en compras desde $100", kind: "percent", value: 15, min: 100 },
  ENVIOGRATIS: { code: "ENVIOGRATIS", label: "Delivery gratis", kind: "shipping", value: 0 },
};

export function computeTotals(subtotal: number, promo: Promo | null, shippingOverride?: number) {
  const promoValid = promo && (!promo.min || subtotal >= promo.min) ? promo : null;
  const discount = promoValid?.kind === "percent" ? Math.round(subtotal * promoValid.value) / 100 : 0;
  const qualifiesFree = subtotal >= FREE_SHIPPING_THRESHOLD || promoValid?.kind === "shipping";
  const baseShipping = shippingOverride ?? STANDARD_SHIPPING;
  const shipping = subtotal === 0 ? 0 : qualifiesFree && baseShipping <= STANDARD_SHIPPING ? 0 : baseShipping;
  // Prices are final ("Ref" in USD); no tax line.
  const tax = 0;
  return {
    subtotal,
    discount,
    shipping,
    tax,
    total: Math.max(0, subtotal - discount + shipping + tax),
    promoValid,
    remainingForFree: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    progress: Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD),
  };
}
