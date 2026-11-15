"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useShop } from "@/context/ShopContext";

let lenis: Lenis | null = null;

/**
 * Smooth scrolling, built so the page never feels heavier than the device can carry:
 *  - Lenis only on devices with a real mouse wheel (fine pointer). Phones and tablets scroll natively.
 *  - Skipped for reduced motion, and when the address has ?scroll=native (to compare).
 *  - If the device cannot keep up (the median frame while scrolling is slower than ~28 ms), Lenis switches itself off
 *    and the browser's own scrolling takes over, which runs off the main thread and stays smooth.
 *  - <html data-scrolling> is set while the page moves fast: the stylesheet uses it to stop hover effects on the cards
 *    that pass under a resting mouse.
 *  - Paused while the bag or the quick view is open.
 */
export function SmoothScroll() {
  const { cartOpen, quickViewId } = useShop();

  // data-scrolling on <html> while the page moves FAST (> 350 px/s). The slow tail of the smoothing does not count,
  // so hover effects come back as soon as the movement eases off instead of ~1 s later.
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const speed = (Math.abs(y - lastY) / Math.max(1, now - lastT)) * 1000;
      lastY = y;
      lastT = now;
      if (speed < 350) return; // slow: the pending timer (armed by the last fast event) clears the flag
      if (!root.hasAttribute("data-scrolling")) root.setAttribute("data-scrolling", "");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => root.removeAttribute("data-scrolling"), 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
      root.removeAttribute("data-scrolling");
    };
  }, []);

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const forcedNative = new URLSearchParams(window.location.search).get("scroll") === "native";
    if (noMotion || !finePointer || forcedNative) return;

    const instance = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true, autoRaf: true });
    lenis = instance;

    // frame-time monitor, only while the page is moving
    let raf = 0;
    let last = 0;
    const frames: number[] = [];
    const tick = (now: number) => {
      if (last) frames.push(now - last);
      last = now;
      if (frames.length >= 30) {
        const sorted = [...frames].sort((a, b) => a - b);
        if (sorted[sorted.length >> 1] > 28) {
          instance.destroy(); // too heavy for this device: native scrolling from now on
          if (lenis === instance) lenis = null;
          return;
        }
        frames.length = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    const stopMonitor = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      frames.length = 0;
    };
    let idle = 0;
    const off = instance.on("scroll", () => {
      window.clearTimeout(idle);
      if (!raf) raf = requestAnimationFrame(tick);
      idle = window.setTimeout(stopMonitor, 250);
    });

    return () => {
      off();
      window.clearTimeout(idle);
      stopMonitor();
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (cartOpen || quickViewId) lenis.stop();
    else lenis.start();
  }, [cartOpen, quickViewId]);

  return null;
}
