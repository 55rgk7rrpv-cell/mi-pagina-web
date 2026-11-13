"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Aurora = dynamic(() => import("@/components/bits/Aurora"), { ssr: false });

/**
 * Soft aurora in the brand's wine and gold behind the hero, from React Bits.
 * Loaded after first paint, skipped for reduced motion and on narrow screens.
 */
export function HeroAurora() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    if (!reduce && wide) {
      const id = window.requestIdleCallback ? window.requestIdleCallback(() => setShow(true)) : window.setTimeout(() => setShow(true), 400);
      return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id as number) : window.clearTimeout(id as number));
    }
  }, []);
  if (!show) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-70 mix-blend-screen">
      <Aurora colorStops={["#75162D", "#F2D9A0", "#560B18"]} amplitude={0.9} blend={0.6} speed={0.35} glow={0.35} brightness={0.75} dpr={1} />
    </div>
  );
}
