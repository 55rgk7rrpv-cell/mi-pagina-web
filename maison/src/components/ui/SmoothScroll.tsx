"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useShop } from "@/context/ShopContext";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis share one clock.
 * Skipped entirely when the viewer prefers reduced motion. Paused while a modal surface is open.
 */
export function SmoothScroll() {
  const { cartOpen, quickViewId } = useShop();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
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
