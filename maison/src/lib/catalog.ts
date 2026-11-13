// Catalogue queries used by the collection grid. Pure functions, no React,
// so the grid, the quick view and any future page share one source of truth.
import { CATEGORIES, PRODUCTS, type Product } from "./products";

export type CategoryFilter = (typeof CATEGORIES)[number];

export const SORTS = {
  featured: "Destacados",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
} as const;
export type SortKey = keyof typeof SORTS;

const COMPARE: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => a.featured - b.featured,
  "price-asc": (a, b) => a.price - b.price || a.featured - b.featured,
  "price-desc": (a, b) => b.price - a.price || a.featured - b.featured,
};

/** Products of one category (or all), in the chosen order. Never mutates PRODUCTS. */
export function queryProducts(category: CategoryFilter, sort: SortKey, list: Product[] = PRODUCTS): Product[] {
  return list.filter((p) => category === "Todo" || p.category === category).sort(COMPARE[sort]);
}

/** How many products each filter tab shows. */
export const CATEGORY_COUNTS: Record<CategoryFilter, number> = Object.fromEntries(
  CATEGORIES.map((c) => [c, queryProducts(c, "featured").length]),
) as Record<CategoryFilter, number>;

/** "S (ajusta XS)" -> "S": the short label used on cards and quick-add buttons. */
export const shortSize = (size: string) => size.replace(/\s*\(.*\)/, "");

/** Every size a product comes in, across all its colours, without repeats. */
export const allSizes = (p: Product) => [...new Set(p.colors.flatMap((c) => c.sizes.map(shortSize)))];
