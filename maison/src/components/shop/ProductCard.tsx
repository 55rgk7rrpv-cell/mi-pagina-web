"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { garmentImages, type ColorVariant, type Product } from "@/lib/products";
import { allSizes, shortSize } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useShop } from "@/context/ShopContext";
import { EyeIcon, PlusIcon } from "@/components/ui/Icons";
import { ProductVisual } from "./ProductVisual";
import GlareHover from "@/components/bits/GlareHover";
import ClickSpark from "@/components/bits/ClickSpark";
import { play } from "@/lib/sounds";

/*
 * Product card. The hover / pressed / keyboard-focus look lives in globals.css
 * (".product-card"), only for devices with a real pointer:
 *   hover   → card lifts, burgundy outline, deeper shadow, photo zooms, the other cards dim
 *   pressed → card sinks back slightly
 *   focus   → same as hover, so keyboard users get the same signal
 * Touch screens keep a flat card with the buttons always visible under the photo.
 */
export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { openQuickView, add, openCart } = useShop();
  const [sizePicker, setSizePicker] = useState(false);
  // The hover photo is only requested once the pointer (or keyboard focus) reaches this card,
  // so the grid loads one photo per product instead of two.
  const [wantsLook, setWantsLook] = useState(false);
  const primeLook = () => setWantsLook(true);
  const cover = product.colors[0];
  // hover swap only between garment-only photos; model photos stay in the quick-view gallery
  const hasHover = garmentImages(product).some((s) => s !== cover.image);
  const open = () => openQuickView(product.id);

  const quickAdd = (size: string) => {
    add(product.id, size, cover.name);
    setSizePicker(false);
    play("add");
    openCart();
  };

  const actions = (
    <CardActions
      product={product}
      cover={cover}
      picking={sizePicker}
      onPick={() => (cover.sizes.length === 1 ? quickAdd(cover.sizes[0]) : setSizePicker(true))}
      onSize={quickAdd}
      onView={open}
    />
  );

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", bounce: 0, duration: 0.5, delay: (index % 3) * 0.05 }}
      className="product-card group relative"
      onMouseLeave={() => setSizePicker(false)}
      onPointerEnter={(e) => e.pointerType === "mouse" && primeLook()}
      onFocus={primeLook}
    >
      {/* framer-motion owns the article's opacity; the dimming of the other cards happens on this wrapper */}
      <div className="card-inner">
        <GlareHover
          className="product-frame relative aspect-square overflow-hidden rounded-2xl bg-white"
          width="100%"
          height="auto"
          background="#FFFFFF"
          borderRadius="1rem"
          borderColor="transparent"
          glareColor="#F2D9A0"
          glareOpacity={0.22}
          glareAngle={-35}
          glareSize={220}
          transitionDuration={900}
        >
          <button type="button" onClick={open} data-cursor="Ver" aria-label={`Vista rápida: ${product.name}`} className="absolute inset-[7%] block cursor-pointer">
            <span className="card-photo absolute inset-0 block">
              <ProductVisual
                product={product}
                variant="still"
                className={`absolute inset-0 transition-opacity duration-500 ease-lux ${hasHover ? "group-hover:opacity-0" : ""}`}
              />
              {hasHover && wantsLook && (
                <ProductVisual product={product} variant="look" className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-lux group-hover:opacity-100" />
              )}
            </span>
          </button>

          {product.badge && <Tag className="left-3">{product.badge}</Tag>}
          {product.colors.length > 1 && <Tag className="right-3">{product.colors.length} colores</Tag>}

          {/* Mouse: actions slide up over the photo on hover / keyboard focus */}
          <div className="card-actions absolute inset-x-3 bottom-3 hidden gap-2 [@media(hover:hover)]:flex">{actions}</div>
        </GlareHover>

        <div className="mt-3 flex gap-2 [@media(hover:hover)]:hidden">{actions}</div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="line-clamp-2 min-h-[2.5em] font-serif text-xl leading-tight text-wine md:text-2xl">
              <button type="button" onClick={open} tabIndex={-1} className="card-title cursor-pointer text-left">
                {product.name}
              </button>
            </h3>
            <p className="mt-1 truncate text-xs text-maroon/65">
              {product.category} · Tallas {allSizes(product).join(", ")}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="card-price inline-block rounded-full px-2.5 py-1 text-sm font-medium tabular-nums text-wine">{formatPrice(product.price)}</p>
            <ColorDots colors={product.colors} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Tag({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`pointer-events-none absolute top-3 rounded-full bg-wine/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-sand ${className}`}>
      {children}
    </span>
  );
}

function ColorDots({ colors }: { colors: ColorVariant[] }) {
  return (
    <div className="mt-2 flex justify-end gap-1.5" aria-label={`Disponible en ${colors.map((c) => c.name).join(", ")}`}>
      {colors.map((c) => (
        <span key={c.name} title={c.name} className="card-dot h-3 w-3 rounded-full ring-1 ring-wine/25" style={{ background: c.hex }} />
      ))}
    </div>
  );
}

function CardActions({
  product,
  cover,
  picking,
  onPick,
  onSize,
  onView,
}: {
  product: Product;
  cover: ColorVariant;
  picking: boolean;
  onPick: () => void;
  onSize: (size: string) => void;
  onView: () => void;
}) {
  if (picking)
    return (
      <div role="group" aria-label={`Elige la talla de ${product.name}`} className="flex flex-1 items-center gap-1 rounded-full bg-wine p-1 shadow-lg">
        {cover.sizes.map((s) => (
          <button key={s} type="button" onClick={() => onSize(s)} className="card-btn size-btn h-9 flex-1 whitespace-nowrap rounded-full px-2 text-[11px] font-semibold text-champagne">
            {shortSize(s)}
          </button>
        ))}
      </div>
    );
  return (
    <>
      <ClickSpark sparkColor="#F2D9A0" sparkCount={10} sparkRadius={22} sparkSize={8} duration={450} className="flex flex-1">
        <button type="button" onClick={onPick} className="card-btn add-btn flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-wine text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne shadow-lg">
          <PlusIcon width={14} height={14} /> Añadir rápido
        </button>
      </ClickSpark>
      <button
        type="button"
        onClick={onView}
        aria-label={`Vista rápida: ${product.name}`}
        className="card-btn view-btn flex h-11 w-11 items-center justify-center rounded-full border border-wine/30 bg-white text-wine shadow-lg"
      >
        <EyeIcon width={16} height={16} />
      </button>
    </>
  );
}
