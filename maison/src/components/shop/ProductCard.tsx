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

  const actions = (
    <>
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
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-wine/95 text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne backdrop-blur transition-[background-color,transform] duration-100 hover:bg-burgundy active:scale-[0.97]"
          >
            <PlusIcon width={14} height={14} /> Añadir rápido
          </button>
          <button
            type="button"
            onClick={() => openQuickView(product.id)}
            aria-label={`Vista rápida: ${product.name}`}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-wine/30 bg-white/90 text-wine backdrop-blur transition-[background-color,color,transform] duration-100 hover:bg-wine hover:text-champagne active:scale-[0.94]"
          >
            <EyeIcon width={16} height={16} />
          </button>
        </>
      )}
    </>
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", bounce: 0, duration: 0.5, delay: (index % 3) * 0.05 }}
      className="group relative"
      onMouseLeave={() => setSizePicker(false)}
    >
      <div className="product-frame relative aspect-square overflow-hidden rounded-2xl bg-white transition-transform duration-100 ease-out group-active:scale-[0.985]">
        <button
          type="button"
          onClick={() => openQuickView(product.id)}
          data-cursor="Ver"
          aria-label={`Vista rápida: ${product.name}`}
          className="absolute inset-[7%] block"
        >
          <ProductVisual
            product={product}
            variant="still"
            className={`absolute inset-0 transition-[transform,opacity] duration-500 ease-lux group-hover:scale-[1.02] ${hasHover ? "group-hover:opacity-0" : ""}`}
          />
          {hasHover && (
            <ProductVisual
              product={product}
              variant="look"
              className="absolute inset-0 scale-[1.02] opacity-0 transition-[transform,opacity] duration-500 ease-lux group-hover:scale-100 group-hover:opacity-100"
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

        {/* Mouse: actions float over the photo on hover / keyboard focus */}
        <div className="absolute inset-x-3 bottom-3 hidden gap-2 transition-all duration-300 ease-out [@media(hover:hover)]:flex [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
          {actions}
        </div>
      </div>

      <div className="mt-3 flex gap-2 [@media(hover:hover)]:hidden">{actions}</div>

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
