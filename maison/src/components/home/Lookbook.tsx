"use client";

/* eslint-disable @next/next/no-img-element */
import { imgSize } from "@/lib/image-sizes";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useShop } from "@/context/ShopContext";

const LOOKS = [
  { id: "vestido-halter-volantes", image: "catalogo/vestido-halter-volantes__rojo.webp", title: "Rojo pasión", note: "Vestido halter con volantes" },
  { id: "vestido-otra-pinta-lenceria", image: "catalogo/vestido-otra-pinta-lenceria__marron-negro.webp", title: "Lingerie look", note: "Vestido Otra Pinta" },
  { id: "vestido-largo-halter-plisado", image: "catalogo/vestido-largo-halter-plisado__vinotinto-modelo.webp", title: "Noche de gala", note: "Vestido largo halter plisado" },
  { id: "vestido-halter-suelto-tul", image: "catalogo/vestido-halter-suelto-tul__blanco-lunares.webp", title: "Lunares", note: "Vestido halter con tul" },
  { id: "conjunto-chaleco-short", image: "catalogo/conjunto-chaleco-short__amarillo.webp", title: "Verano", note: "Conjunto chaleco y short" },
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
            El <em className="text-sand">Lookbook</em>
          </h2>
          <p className="hidden max-w-xs text-sm text-champagne/60 md:block">Cinco looks de la colección. Elige uno para ver la pieza.</p>
        </div>
        <motion.ul
          style={reduce ? undefined : { x }}
          className={`flex gap-6 px-5 md:gap-10 md:px-10 ${reduce ? "no-scrollbar overflow-x-auto" : ""}`}
        >
          {LOOKS.map((look, i) => (
            <li key={look.id} className={`shrink-0 ${i % 2 ? "md:mt-16" : ""}`}>
              <button type="button" onClick={() => openQuickView(look.id)} data-cursor="Ver" className="group block w-[72vw] text-left sm:w-[44vw] lg:w-[30vw]">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-white p-[6%]">
                  <img
                    src={look.image}
                    {...imgSize(look.image)}
                    decoding="async"
                    alt={`${look.title}: ${look.note}`}
                    loading="lazy"
                    className="h-full w-full object-contain object-center transition-transform duration-700 ease-lux group-hover:scale-[1.02]"
                  />
                  <span className="absolute left-4 top-4 font-serif text-sm text-wine/70">0{i + 1}</span>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-3xl italic text-champagne">{look.title}</h3>
                  <span className="text-right text-[11px] uppercase tracking-[0.2em] text-sand/70">{look.note}</span>
                </div>
              </button>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
