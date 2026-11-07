/* eslint-disable @next/next/no-img-element */
import type { Product } from "@/lib/products";
import { GarmentArt } from "./GarmentArt";

/** Uses photography when supplied, otherwise the generative studio art. */
export function ProductVisual({ product, variant, className }: { product: Product; variant: "still" | "look"; className?: string }) {
  if (product.images) {
    return (
      <img
        src={product.images[variant === "still" ? 0 : 1]}
        alt={variant === "still" ? product.name : ""}
        className={`${className ?? ""} object-cover`}
        loading="lazy"
      />
    );
  }
  return (
    <GarmentArt
      silhouette={product.silhouette}
      tone={product.tone}
      variant={variant}
      label={variant === "still" ? `${product.name}, ${product.tagline}` : undefined}
      className={className}
    />
  );
}
