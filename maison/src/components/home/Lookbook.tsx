"use client";

/* eslint-disable @next/next/no-img-element */
import { imgSize, thumbOf } from "@/lib/image-sizes";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  // slide exactly as far as the row is wider than the screen, so the last look always ends fully in view
  const row = useRef<HTMLUListElement>(null);
  const [travel, setTravel] = useState(0);
  useEffect(() => {
    const measure = () => row.current && setTravel(Math.max(0, row.current.scrollWidth - window.innerWidth));
    measure();
    // re-measure when fonts or photos change the row's width
    const ro = new ResizeObserver(measure);
    if (row.current) ro.observe(row.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  return (
    <section
      id="lookbook"
      ref={ref}
      className={reduce ? "bg-wine py-24" : "relative bg-wine"}
      // pinned only as long as the row needs to slide (on a wide screen every look already fits)
      style={reduce ? undefined : { height: `calc(100svh + ${Math.round(travel * 1.6)}px)` }}
    >
      <div className={reduce ? "" : "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden"}>
        <div className="mx-auto mb-10 flex w-full max-w-[1600px] items-end justify-between px-5 md:px-10">
          <h2 className="font-serif text-[clamp(2.6rem,7vw,6rem)] leading-[0.9] text-champagne">
            El <em className="text-sand">Lookbook</em>
          </h2>
          <p className="hidden max-w-xs text-sm text-champagne/60 md:block">Cinco looks de la colección. Elige uno para ver la pieza.</p>
        </div>
        <motion.ul
          ref={row}
          style={reduce ? undefined : { x }}
          className={`flex gap-6 px-5 md:gap-10 md:px-10 ${reduce ? "no-scrollbar overflow-x-auto" : "w-max"}`}
        >
          {LOOKS.map((look, i) => (
            <li key={look.id} className={`shrink-0 ${i % 2 ? "md:mt-10" : ""}`}>
              <button type="button" onClick={() => openQuickView(look.id)} data-cursor="Ver" className="group block w-min text-left">
                {/* each look keeps its own proportions: same height for all, no bars, nothing cropped */}
                <div
                  className="relative h-[min(58svh,120vw)] overflow-hidden rounded-md ring-1 ring-sand/25 lg:h-[min(640px,calc(100svh-20rem))]"
                  style={{ aspectRatio: `${imgSize(thumbOf(look.image)).width} / ${imgSize(thumbOf(look.image)).height}` }}
                >
                  <img
                    src={thumbOf(look.image)}
                    {...imgSize(thumbOf(look.image))}
                    decoding="async"
                    alt={`${look.title}: ${look.note}`}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-700 ease-lux group-hover:scale-[1.03]"
                  />
                  <span className="absolute left-3 top-3 rounded-sm bg-wine/80 px-2 py-0.5 font-serif text-xs text-champagne">0{i + 1}</span>
                </div>
                <h3 className="mt-4 font-serif text-2xl italic text-champagne md:text-3xl">{look.title}</h3>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-sand/70">{look.note}</p>
              </button>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
