export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export function detectBrand(num: string): CardBrand {
  const n = num.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^(6011|65|64[4-9])/.test(n)) return "discover";
  return "unknown";
}

export function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const brand = detectBrand(digits);
  if (brand === "amex") {
    const d = digits.slice(0, 15);
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(" ");
  }
  return digits.slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function luhn(num: string) {
  const digits = num.replace(/\D/g, "");
  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return digits.length > 0 && sum % 10 === 0;
}

export function formatExpiry(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  if (d.length === 1 && Number(d) > 1) return `0${d} / `;
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
}

export interface CardFields {
  name: string;
  number: string;
  expiry: string;
  cvc: string;
}

export function validateCard(f: CardFields, now = new Date()) {
  const errors: Partial<Record<keyof CardFields, string>> = {};
  const digits = f.number.replace(/\D/g, "");
  const brand = detectBrand(digits);
  const len = brand === "amex" ? 15 : 16;

  if (f.name.trim().length < 2) errors.name = "Escribe el nombre tal como aparece en la tarjeta.";
  if (digits.length !== len) errors.number = "Al número de tarjeta le faltan dígitos.";
  else if (!luhn(digits)) errors.number = "Ese número de tarjeta no es válido. Revisa los dígitos.";

  const m = f.expiry.replace(/\D/g, "");
  const month = Number(m.slice(0, 2));
  const year = 2000 + Number(m.slice(2, 4));
  if (m.length !== 4 || month < 1 || month > 12) errors.expiry = "Usa el formato MM / AA.";
  else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
    // Cards are valid through the last day of their expiry month.
    errors.expiry = "Esta tarjeta está vencida.";
  }

  const cvcLen = brand === "amex" ? 4 : 3;
  if (f.cvc.replace(/\D/g, "").length !== cvcLen) errors.cvc = `Escribe el código de seguridad de ${cvcLen} dígitos.`;

  return errors;
}
