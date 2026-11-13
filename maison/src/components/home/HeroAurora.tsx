"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Aurora = dynamic(() => import("@/components/bits/Aurora"), { ssr: false });

/**
 * Soft aurora in the brand's wine and gold behind the hero, from React Bits.
 * Performance budget (it is a full-screen WebGL shader):
 *  - only on wide screens and without reduced motion / data saver
 *  - its code is fetched only after the page has fully loaded and the browser is idle,
 *    so it never competes with the hero photo or the first interaction
 *  - drawn at half resolution (it is a soft blur, upscaling is invisible) and capped at 30 fps
 *  - Aurora itself stops drawing when off-screen or when the tab is hidden
 */
export function HeroAurora() {
  const [show, setShow] = useState(false);
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
  if (!show) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-70 mix-blend-screen">
      <Aurora colorStops={["#75162D", "#F2D9A0", "#560B18"]} amplitude={0.9} blend={0.6} speed={0.35} glow={0.35} brightness={0.75} dpr={0.5} maxFps={30} />
    </div>
  );
}
