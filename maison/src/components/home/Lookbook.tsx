"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GarmentArt } from "@/components/shop/GarmentArt";
import { useShop } from "@/context/ShopContext";
import { PRODUCTS } from "@/lib/products";

const LOOKS = [
  { id: "maison-coat", title: "After Hours", note: "Wrap Coat over Vesper Slip" },
  { id: "noir-blazer", title: "The Negotiator", note: "Sculpted Blazer, Sable Trouser" },
  { id: "aurore-corset", title: "Velvet Rope", note: "Aurore Corset, Goutte d'Or" },
  { id: "reverie-gown", title: "Entrance", note: "Rêverie Gown" },
  { id: "minuit-bag", title: "Minuit", note: "Minuit Bag in burgundy" },
];

export function Lookbook() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { openQuickView } = useShop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);

  return (
    <section id="lookbook" ref={ref} className={reduce ? "bg-wine py-24" : "relative h-[300vh] bg-wine"}>
      <div className={reduce ? "" : "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden"}>
        <div className="mx-auto mb-10 flex w-full max-w-[1600px] items-end justify-between px-5 md:px-10">
          <h2 className="font-serif text-[clamp(2.6rem,7vw,6rem)] leading-[0.9] text-champagne">
            The <em className="text-sand">Lookbook</em>
          </h2>
          <p className="hidden max-w-xs text-sm text-champagne/60 md:block">Five looks, shot after dark. Select a look to shop the piece.</p>
        </div>
        <motion.ul
          style={reduce ? undefined : { x }}
          className={`flex gap-6 px-5 md:gap-10 md:px-10 ${reduce ? "no-scrollbar overflow-x-auto" : ""}`}
        >
          {LOOKS.map((look, i) => {
            const p = PRODUCTS.find((pr) => pr.id === look.id)!;
            return (
              <li key={look.id} className={`shrink-0 ${i % 2 ? "md:mt-16" : ""}`}>
                <button
                  type="button"
                  onClick={() => openQuickView(p.id)}
                  data-cursor="Shop"
                  className="group block w-[72vw] text-left sm:w-[44vw] lg:w-[30vw]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                    <GarmentArt
                      silhouette={p.silhouette}
                      tone={p.tone}
                      variant="look"
                      label={`${look.title}: ${look.note}`}
                      className="h-full w-full transition-transform duration-[1.4s] ease-lux group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 font-serif text-sm text-champagne/80">0{i + 1}</span>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-3xl italic text-champagne">{look.title}</h3>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-sand/70">{look.note}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
