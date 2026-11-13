"use client";

import { LayoutGroup, motion } from "framer-motion";
import { CATEGORIES } from "@/lib/products";
import { CATEGORY_COUNTS, SORTS, type CategoryFilter, type SortKey } from "@/lib/catalog";
import { cn } from "@/lib/format";

/** Category tabs. Hover tints the pill, the active one is solid burgundy, press shrinks it. */
export function CategoryTabs({ value, onChange }: { value: CategoryFilter; onChange: (c: CategoryFilter) => void }) {
  return (
    <LayoutGroup id="filters">
      <div role="tablist" aria-label="Filtrar por categoría" className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 py-1">
        {CATEGORIES.map((c) => {
          const active = value === c;
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(c)}
              className={cn("filter-pill relative shrink-0 rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em]", active ? "is-active text-champagne" : "text-maroon/75")}
            >
              {active && (
                <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-burgundy" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              )}
              <span className="relative">
                {c} <sup className="ml-0.5 text-[9px] opacity-70">{CATEGORY_COUNTS[c]}</sup>
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

export function SortSelect({ value, onChange }: { value: SortKey; onChange: (s: SortKey) => void }) {
  return (
    <label className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-maroon/70">
      Ordenar
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortKey)}
          className="sort-select cursor-pointer appearance-none rounded-full border border-wine/25 bg-transparent py-2.5 pl-4 pr-10 text-[11px] font-semibold uppercase tracking-[0.14em] text-wine focus:outline-none"
        >
          {Object.entries(SORTS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <svg aria-hidden viewBox="0 0 10 6" className="pointer-events-none absolute right-4 top-1/2 h-1.5 w-2.5 -translate-y-1/2"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
      </span>
    </label>
  );
}
