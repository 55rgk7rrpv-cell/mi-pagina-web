"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ITEMS = [
  "Nueva colección",
  "Pocas unidades por talla",
  "Delivery gratis desde $80",
  "Pago Móvil, Zelle y tarjeta",
  "@otrapintapzo",
];

/** Endless band. GSAP loops it; scrolling speeds it up and flips its direction. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const row = [...ITEMS, ...ITEMS];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loop = gsap.to(".marquee-track", { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
        let direction = 1;
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            if (self.direction !== direction) direction = self.direction;
            const boost = gsap.utils.clamp(1, 4, 1 + Math.abs(self.getVelocity()) / 800);
            gsap.to(loop, { timeScale: direction * boost, duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.2, ease: "power2.out", overwrite: false });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative overflow-hidden border-y border-sand/20 bg-burgundy py-5" aria-label="Lo esencial de Otra Pinta">
      <ul className="marquee-track flex w-max gap-12 whitespace-nowrap will-change-transform">
        {[...row, ...row].map((item, i) => (
          <li key={i} aria-hidden={i >= ITEMS.length} className="flex items-center gap-12 font-serif text-2xl italic text-champagne md:text-3xl">
            {item}
            <span className="text-base not-italic text-sand">✦</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
