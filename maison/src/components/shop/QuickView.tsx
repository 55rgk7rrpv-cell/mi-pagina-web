"use client";

/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { useShop } from "@/context/ShopContext";
import { getProduct, productImages } from "@/lib/products";
import { cn, formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { CloseIcon } from "@/components/ui/Icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { useDialog } from "@/components/ui/useDialog";

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
  const [colorName, setColorName] = useState(product.colors[0].name);
  const color = product.colors.find((c) => c.name === colorName) ?? product.colors[0];
  const [size, setSize] = useState<string | null>(color.sizes.length === 1 ? color.sizes[0] : null);
  const [image, setImage] = useState(color.image);
  const [error, setError] = useState(false);
  const images = productImages(product);
  useDialog(panelRef, onClose);

  const pickColor = (name: string) => {
    const c = product.colors.find((x) => x.name === name)!;
    setColorName(name);
    setImage(c.image);
    setSize(c.sizes.length === 1 ? c.sizes[0] : null);
    setError(false);
  };

  const addToBag = () => {
    if (!size) {
      setError(true);
      return;
    }
    add(product.id, size, color.name);
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
        transition={{ type: "spring", bounce: 0, duration: 0.45 }}
        data-lenis-prevent
        className="relative grid max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-t-3xl bg-champagne text-wine shadow-2xl md:grid-cols-2 md:overflow-hidden md:rounded-3xl"
      >
        <div className="relative flex flex-col bg-white">
          <div className="relative aspect-square w-full bg-white md:aspect-auto md:flex-1">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img
                key={image}
                src={image}
                alt={`${product.name}, color ${color.name}`}
                className="absolute inset-[6%] h-[88%] w-[88%] object-contain object-center"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              />
            </AnimatePresence>
          </div>
          {images.length > 1 && (
            <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-wine/10 p-3" aria-label="Fotos del producto">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImage(src)}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-pressed={image === src}
                  className={cn("aspect-square w-14 shrink-0 overflow-hidden rounded-md bg-white ring-offset-1 transition", image === src ? "ring-2 ring-burgundy" : "ring-1 ring-wine/15 hover:ring-wine/40")}
                >
                  <img src={src} alt="" className="h-full w-full object-contain p-1" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col p-6 md:max-h-[86svh] md:overflow-y-auto md:p-10">
          <div className="flex items-start justify-between gap-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-burgundy">{product.category}</p>
            <button type="button" onClick={onClose} aria-label="Cerrar vista rápida" className="-mr-2 -mt-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-wine/10">
              <CloseIcon />
            </button>
          </div>
          <h2 id="qv-title" className="mt-4 text-balance font-serif text-4xl leading-none md:text-5xl">{product.name}</h2>
          <p className="mt-6 text-2xl tabular-nums">{formatPrice(product.price)}</p>
          <p className="mt-6 text-sm leading-relaxed text-maroon/85">{product.description}</p>

          <fieldset className="mt-8">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              Color <span className="ml-2 font-normal normal-case tracking-normal text-maroon/70">{color.name}</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => pickColor(c.name)}
                  aria-label={c.name}
                  aria-pressed={color.name === c.name}
                  title={c.name}
                  className={cn("h-9 w-9 rounded-full ring-offset-2 ring-offset-champagne transition", color.name === c.name ? "ring-2 ring-burgundy" : "ring-1 ring-wine/25 hover:ring-wine/60")}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="text-[11px] font-semibold uppercase tracking-[0.2em]">Talla</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {color.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSize(s);
                    setError(false);
                  }}
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
            {product.colors.length > 1 && <p className="mt-3 text-xs text-maroon/65">Las tallas cambian según el color.</p>}
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-sm text-burgundy" role="alert">
                  Elige una talla para añadir esta pieza a tu bolsa.
                </motion.p>
              )}
            </AnimatePresence>
          </fieldset>

          <div className="mt-8">
            <Magnetic className="block" strength={0.15}>
              <button
                type="button"
                onClick={addToBag}
                className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full bg-burgundy text-xs font-semibold uppercase tracking-[0.24em] text-champagne transition-transform duration-100 active:scale-[0.98]"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-wine transition-transform duration-500 ease-lux group-hover:scale-x-100" />
                <span className="relative">Añadir a la bolsa · {formatPrice(product.price)}</span>
              </button>
            </Magnetic>
            <p className="mt-3 text-center text-xs text-maroon/70">
              {product.badge === "Última pieza" ? "Es la última pieza disponible." : `Envío gratis desde ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
