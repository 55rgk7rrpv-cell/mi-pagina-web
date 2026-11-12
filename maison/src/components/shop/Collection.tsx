"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { cn } from "@/lib/format";
import { SplitHeading } from "@/components/ui/Reveal";
import { ProductCard } from "./ProductCard";

const SORTS = {
  featured: "Destacados",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
} as const;
type SortKey = keyof typeof SORTS;

export function Collection() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Todo");
  const [sort, setSort] = useState<SortKey>("featured");

  const items = useMemo(() => {
    const list = PRODUCTS.filter((p) => category === "Todo" || p.category === category);
    const sorted = [...list];
    switch (sort) {
      case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
      case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
      default: sorted.sort((a, b) => a.featured - b.featured);
    }
    return sorted;
  }, [category, sort]);

  const counts = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c, c === "Todo" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c).length])),
    [],
  );

  return (
    <section id="collection" className="relative bg-champagne px-5 py-24 text-wine md:px-10 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-6 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-burgundy">
              <span className="h-px w-10 bg-burgundy" /> Otra Pinta
            </p>
            <SplitHeading
              className="font-serif text-[clamp(3rem,8vw,7.5rem)] leading-[0.9] tracking-[-0.02em]"
              lines={["La", <em key="n" className="text-burgundy">colección</em>]}
            />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-maroon/75">{PRODUCTS.length} piezas, con pocas unidades por talla. Precios en dólares.</p>
        </div>

        {/* Toolbar */}
        <div className="sticky top-[76px] z-30 -mx-5 mt-14 glass-light border-y border-wine/10 bg-champagne/85 px-5 py-4 backdrop-blur-xl md:top-[88px] md:-mx-10 md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <LayoutGroup id="filters">
              <div role="tablist" aria-label="Filtrar por categoría" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
                {CATEGORIES.map((c) => {
                  const active = category === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setCategory(c)}
                      className={cn(
                        "relative shrink-0 rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300",
                        active ? "text-champagne" : "text-maroon/70 hover:text-wine",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="filter-pill"
                          className="absolute inset-0 rounded-full bg-burgundy"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">
                        {c} <sup className="ml-0.5 text-[9px] opacity-70">{counts[c]}</sup>
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>

            <label className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-maroon/70">
              Ordenar
              <span className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="appearance-none rounded-full border border-wine/20 bg-transparent py-2.5 pl-4 pr-10 text-[11px] font-semibold uppercase tracking-[0.14em] text-wine focus:border-burgundy focus:outline-none"
                >
                  {Object.entries(SORTS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <svg aria-hidden viewBox="0 0 10 6" className="pointer-events-none absolute right-4 top-1/2 h-1.5 w-2.5 -translate-y-1/2"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
              </span>
            </label>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">{items.length} piezas</p>

        <motion.div layout className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20">
          <AnimatePresence mode="popLayout">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
