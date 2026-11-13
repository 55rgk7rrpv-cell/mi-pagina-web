"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useShop } from "@/context/ShopContext";

let lenis: Lenis | null = null;

/**
 * Lenis smooth scrolling on its own animation-frame loop (autoRaf).
 * The page scrolls the real window, so Framer Motion's useScroll keeps reading it as usual.
 * Skipped entirely when the viewer prefers reduced motion. Paused while a modal surface is open.
 */
export function SmoothScroll() {
  const { cartOpen, quickViewId } = useShop();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true, autoRaf: true });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (cartOpen || quickViewId) lenis.stop();
    else lenis.start();
  }, [cartOpen, quickViewId]);

  return null;
}
