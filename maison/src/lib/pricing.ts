export const FREE_SHIPPING_THRESHOLD = 1000;
export const STANDARD_SHIPPING = 35;

export interface Promo {
  code: string;
  label: string;
  kind: "percent" | "shipping";
  value: number;
  /** Minimum subtotal required, if any */
  min?: number;
}

export const PROMOS: Record<string, Promo> = {
  INNERCIRCLE: { code: "INNERCIRCLE", label: "Inner Circle, 10% off", kind: "percent", value: 10 },
  NOTFOREVERYONE: { code: "NOTFOREVERYONE", label: "15% off orders over $1,500", kind: "percent", value: 15, min: 1500 },
  FREESHIP: { code: "FREESHIP", label: "Complimentary express shipping", kind: "shipping", value: 0 },
};

export function computeTotals(subtotal: number, promo: Promo | null, shippingOverride?: number) {
  const promoValid = promo && (!promo.min || subtotal >= promo.min) ? promo : null;
  const discount = promoValid?.kind === "percent" ? Math.round(subtotal * promoValid.value) / 100 : 0;
  const qualifiesFree = subtotal >= FREE_SHIPPING_THRESHOLD || promoValid?.kind === "shipping";
  const baseShipping = shippingOverride ?? STANDARD_SHIPPING;
  const shipping = subtotal === 0 ? 0 : qualifiesFree && baseShipping <= STANDARD_SHIPPING ? 0 : baseShipping;
  const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
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
