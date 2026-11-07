export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);

export const cn = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");
