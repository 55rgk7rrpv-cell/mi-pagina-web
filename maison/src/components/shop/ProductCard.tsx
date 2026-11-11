"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { productImages, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useShop } from "@/context/ShopContext";
import { EyeIcon, PlusIcon } from "@/components/ui/Icons";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { openQuickView, add, openCart } = useShop();
  const [sizePicker, setSizePicker] = useState(false);
  const cover = product.colors[0];
  const oneSize = cover.sizes.length === 1;
  const hasHover = productImages(product).length > 1;

  const quickAdd = (size: string) => {
    add(product.id, size, cover.name);
    setSizePicker(false);
    openCart();
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.06 }}
      className="group relative"
      onMouseLeave={() => setSizePicker(false)}
    >
      <div className="relative aspect-square overflow-hidden rounded-[2px] bg-white p-[4%]">
        <button
          type="button"
          onClick={() => openQuickView(product.id)}
          data-cursor="Ver"
          aria-label={`Vista rápida: ${product.name}`}
          className="absolute inset-[4%] block"
        >
          <ProductVisual
            product={product}
            variant="still"
            className={`absolute inset-0 h-full w-full transition-[transform,opacity] duration-[1.1s] ease-lux group-hover:scale-[1.04] ${hasHover ? "group-hover:opacity-0" : ""}`}
          />
          {hasHover && (
            <ProductVisual
              product={product}
              variant="look"
              className="absolute inset-0 h-full w-full scale-[1.06] opacity-0 transition-[transform,opacity] duration-[1.1s] ease-lux group-hover:scale-100 group-hover:opacity-100"
            />
          )}
        </button>

        {product.badge && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-wine/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-sand">
            {product.badge}
          </span>
        )}
        {product.colors.length > 1 && (
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-wine/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-sand">
            {product.colors.length} colores
          </span>
        )}

        {/* Hover / focus actions */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-100 transition-all duration-500 ease-lux md:translate-y-4 md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          {sizePicker ? (
            <div role="group" aria-label={`Elige la talla de ${product.name}`} className="flex flex-1 items-center gap-1 rounded-full bg-wine/95 p-1 backdrop-blur">
              {cover.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => quickAdd(s)}
                  className="h-9 flex-1 whitespace-nowrap rounded-full px-2 text-[11px] font-semibold text-champagne transition-colors hover:bg-sand hover:text-wine"
                >
                  {s.replace(/\s*\(.*\)/, "")}
                </button>
              ))}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => (oneSize ? quickAdd(cover.sizes[0]) : setSizePicker(true))}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-wine/95 text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne backdrop-blur transition-colors hover:bg-burgundy"
              >
                <PlusIcon width={14} height={14} /> Añadir rápido
              </button>
              <button
                type="button"
                onClick={() => openQuickView(product.id)}
                aria-label={`Vista rápida: ${product.name}`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-wine/30 bg-white/90 text-wine backdrop-blur transition-colors hover:bg-wine hover:text-champagne"
              >
                <EyeIcon width={16} height={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="line-clamp-2 min-h-[2.5em] font-serif text-xl leading-tight text-wine md:text-2xl">{product.name}</h3>
          <p className="mt-1 truncate text-xs text-maroon/65">
            {product.category} · Tallas {[...new Set(product.colors.flatMap((c) => c.sizes.map((s) => s.replace(/\s*\(.*\)/, ""))))].join(", ")}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-medium tabular-nums text-wine">{formatPrice(product.price)}</p>
          <div className="mt-2 flex justify-end gap-1.5" aria-label={`Disponible en ${product.colors.map((c) => c.name).join(", ")}`}>
            {product.colors.map((c) => (
              <span key={c.name} title={c.name} className="h-3 w-3 rounded-full ring-1 ring-wine/25" style={{ background: c.hex }} />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
