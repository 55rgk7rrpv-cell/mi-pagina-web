/* eslint-disable @next/next/no-img-element */
import { garmentImages, getColor, type Product } from "@/lib/products";
import { imgSize } from "@/lib/image-sizes";

/**
 * Product photo on a white background.
 * "still" shows the chosen colour (or the cover); "look" shows the next garment-only photo
 * (never a model), used for the hover swap on cards.
 */
export function ProductVisual({
  product,
  color,
  variant = "still",
  className,
  priority = false,
}: {
  product: Product;
  color?: string;
  variant?: "still" | "look";
  className?: string;
  /** true only for photos visible on first paint: loads eagerly and first */
  priority?: boolean;
}) {
  const cover = getColor(product, color).image;
  const alt = garmentImages(product).filter((s) => s !== cover);
  const src = variant === "look" ? alt[0] ?? cover : cover;
  const shown = variant === "look" ? undefined : getColor(product, color).name;
  return (
    <img
      src={src}
      {...imgSize(src)}
      alt={variant === "look" ? "" : `${product.name}, color ${shown}`}
      className={`${className ?? ""} h-full w-full object-contain object-center`}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
