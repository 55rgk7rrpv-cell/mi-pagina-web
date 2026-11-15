"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Aurora = dynamic(() => import("@/components/bits/Aurora"), { ssr: false });

/**
 * Soft aurora in the brand's wine and gold behind the hero, from React Bits.
 * It is a full-screen WebGL shader, so it runs on a strict budget:
 *  - only on wide screens, without reduced motion and without data saver
 *  - its code is fetched only after the page has fully loaded and the browser is idle
 *  - drawn at half resolution and capped at 30 fps; Aurora stops by itself when off-screen or the tab is hidden
 *  - frozen while the page is scrolling (<html data-scrolling>), so scrolling gets all the frame budget
 *  - switched off for good if the device cannot hold ~40 fps with it running
 */
export function HeroAurora() {
  const [show, setShow] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || !wide || saveData) return;
    let idle = 0;
    const start = () => {
      idle = window.requestIdleCallback ? window.requestIdleCallback(() => setShow(true), { timeout: 2500 }) : window.setTimeout(() => setShow(true), 600);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  // follow <html data-scrolling>
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setScrolling(root.hasAttribute("data-scrolling"));
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ["data-scrolling"] });
    return () => mo.disconnect();
  }, []);

  // health check: sample the frame rate for a few seconds once the aurora is running
  useEffect(() => {
    if (!show) return;
    let raf = 0;
    let last = 0;
    const frames: number[] = [];
    const t0 = performance.now();
    const tick = (now: number) => {
      const root = document.documentElement;
      if (last && !root.hasAttribute("data-scrolling") && !document.hidden && now - t0 > 1200) frames.push(now - last);
      last = now;
      if (frames.length >= 60) {
        const sorted = [...frames].sort((a, b) => a - b);
        if (sorted[sorted.length >> 1] > 26) setShow(false); // too heavy here: static background from now on
        return;
      }
      if (now - t0 < 9000) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [show]);

  if (!show) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-70 mix-blend-screen">
      <Aurora colorStops={["#75162D", "#F2D9A0", "#560B18"]} amplitude={0.9} blend={0.6} speed={0.35} glow={0.35} brightness={0.75} dpr={0.5} maxFps={30} paused={scrolling} />
    </div>
  );
}
