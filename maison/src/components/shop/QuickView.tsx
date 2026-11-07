"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useShop } from "@/context/ShopContext";
import { getProduct } from "@/lib/products";
import { cn, formatPrice } from "@/lib/format";
import { CloseIcon } from "@/components/ui/Icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { useDialog } from "@/components/ui/useDialog";
import { ProductVisual } from "./ProductVisual";

export function QuickView() {
  const { quickViewId, closeQuickView } = useShop();
  const product = quickViewId ? getProduct(quickViewId) : undefined;

  return (
    <AnimatePresence>
      {product && <QuickViewPanel key={product.id} id={product.id} onClose={closeQuickView} />}
    </AnimatePresence>
  );
}

function QuickViewPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const product = getProduct(id)!;
  const { add, openCart } = useShop();
  const panelRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [color, setColor] = useState(product.colors[0].name);
  const [view, setView] = useState<"still" | "look">("still");
  const [error, setError] = useState(false);
  useDialog(panelRef, onClose);

  useEffect(() => setError(false), [size]);

  const addToBag = () => {
    if (!size) {
      setError(true);
      return;
    }
    add(product.id, size, color);
    onClose();
    openCart();
  };

  return (
    <motion.div className="fixed inset-0 z-[90] flex items-end justify-center md:items-center md:p-8" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
      <motion.div
        className="absolute inset-0 bg-wine/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qv-title"
        tabIndex={-1}
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-t-3xl bg-champagne text-wine shadow-2xl md:grid-cols-2 md:overflow-hidden md:rounded-3xl"
      >
        <div className="relative aspect-[4/5] md:aspect-auto md:h-full">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={view}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductVisual product={product} variant={view} className="h-full w-full" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-4 left-4 flex gap-2">
            {(["still", "look"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={cn(
                  "rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur transition-colors",
                  view === v ? "bg-champagne text-wine" : "bg-wine/40 text-champagne hover:bg-wine/70",
                )}
              >
                {v === "still" ? "Studio" : "Lookbook"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col p-6 md:max-h-[86svh] md:overflow-y-auto md:p-10">
          <div className="flex items-start justify-between gap-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-burgundy">
              {product.category} · Edition of {product.edition}
            </p>
            <button type="button" onClick={onClose} aria-label="Close quick view" className="-mr-2 -mt-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-wine/10">
              <CloseIcon />
            </button>
          </div>
          <h2 id="qv-title" className="mt-4 font-serif text-4xl leading-none md:text-5xl">{product.name}</h2>
          <p className="mt-3 text-sm text-maroon/70">{product.tagline}</p>
          <p className="mt-6 text-2xl tabular-nums">{formatPrice(product.price)}</p>
          <p className="mt-6 text-sm leading-relaxed text-maroon/85">{product.description}</p>

          <fieldset className="mt-8">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              Colour <span className="ml-2 font-normal normal-case tracking-normal text-maroon/70">{color}</span>
            </legend>
            <div className="mt-3 flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  className={cn("h-9 w-9 rounded-full ring-offset-2 ring-offset-champagne transition", color === c.name ? "ring-2 ring-burgundy" : "ring-1 ring-wine/25 hover:ring-wine/60")}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em]">
              Size
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={cn(
                    "h-11 min-w-12 rounded-full border px-4 text-xs font-semibold transition-colors",
                    size === s ? "border-burgundy bg-burgundy text-champagne" : "border-wine/20 hover:border-wine",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-sm text-burgundy" role="alert">
                  Choose a size to add this piece to your bag.
                </motion.p>
              )}
            </AnimatePresence>
          </fieldset>

          <div className="mt-8">
            <Magnetic className="block" strength={0.15}>
              <button
                type="button"
                onClick={addToBag}
                className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full bg-burgundy text-xs font-semibold uppercase tracking-[0.24em] text-champagne"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-wine transition-transform duration-500 ease-lux group-hover:scale-x-100" />
                <span className="relative">Add to bag · {formatPrice(product.price)}</span>
              </button>
            </Magnetic>
            <p className="mt-3 text-center text-xs text-maroon/70">
              {product.stock <= 5 ? `Only ${product.stock} numbered pieces remain.` : "Complimentary shipping over $1,000 · Free returns within 30 days"}
            </p>
          </div>

          <ul className="mt-8 space-y-2 border-t border-wine/10 pt-6 text-sm text-maroon/80">
            {product.details.map((d) => (
              <li key={d} className="flex gap-3"><span className="text-burgundy">—</span>{d}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}
