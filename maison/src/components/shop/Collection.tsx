"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { PRODUCTS } from "@/lib/products";
import { queryProducts, type CategoryFilter, type SortKey } from "@/lib/catalog";
import BlurText from "@/components/bits/BlurText";
import { play } from "@/lib/sounds";
import { CategoryTabs, SortSelect } from "./CatalogToolbar";
import { ProductCard } from "./ProductCard";

export function Collection() {
  const [category, setCategory] = useState<CategoryFilter>("Todo");
  const [sort, setSort] = useState<SortKey>("featured");
  const items = useMemo(() => queryProducts(category, sort), [category, sort]);

  return (
    <section id="collection" className="relative bg-champagne px-5 py-24 text-wine md:px-10 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-6 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-burgundy">
              <span className="h-px w-10 bg-burgundy" /> Otra Pinta
            </p>
            <h2 className="font-serif text-[clamp(3rem,8vw,7.5rem)] leading-[0.9] tracking-[-0.02em]">
              <BlurText text="La" animateBy="words" direction="bottom" delay={60} stepDuration={0.5} className="block" />
              <BlurText text="colección" animateBy="letters" direction="bottom" delay={40} stepDuration={0.45} className="block italic text-burgundy" />
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-maroon/75">{PRODUCTS.length} piezas, con pocas unidades por talla. Precios en dólares.</p>
        </div>

        {/* Toolbar */}
        <div className="sticky top-[76px] z-30 -mx-5 mt-14 glass-light border-y border-wine/10 bg-champagne/85 px-5 py-4 backdrop-blur-xl md:top-[88px] md:-mx-10 md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CategoryTabs
              value={category}
              onChange={(c) => {
                setCategory(c);
                play("filter", -16);
              }}
            />
            <SortSelect value={sort} onChange={setSort} />
          </div>
        </div>

        <p className="sr-only" aria-live="polite">{items.length} piezas</p>

        <motion.div layout className="product-grid mt-12 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20">
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
