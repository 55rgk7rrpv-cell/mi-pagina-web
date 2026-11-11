/* eslint-disable @next/next/no-img-element */
import { getColor, productImages, type Product } from "@/lib/products";

/**
 * Product photo on a white background.
 * "still" shows the chosen colour (or the cover); "look" shows the next photo,
 * used for the hover swap on cards.
 */
export function ProductVisual({
  product,
  color,
  variant = "still",
  className,
}: {
  product: Product;
  color?: string;
  variant?: "still" | "look";
  className?: string;
}) {
  const images = productImages(product);
  const src = variant === "look" ? images[1] ?? images[0] : getColor(product, color).image;
  const shown = variant === "look" ? undefined : getColor(product, color).name;
  return (
    <img
      src={src}
      alt={variant === "look" ? "" : `${product.name}, color ${shown}`}
      className={`${className ?? ""} bg-white object-contain`}
      loading="lazy"
      decoding="async"
    />
  );
}
