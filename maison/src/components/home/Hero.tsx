"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { GarmentArt } from "@/components/shop/GarmentArt";
import { Magnetic } from "@/components/ui/Magnetic";
import { SplitHeading } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Icons";
import { useShop } from "@/context/ShopContext";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { openQuickView } = useShop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yArt = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Subtle pointer parallax on the framed piece
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 20 });

  return (
    <section
      ref={ref}
      aria-label="Colección Nº 07"
      className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-wine pb-24 pt-32 md:pt-28"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      {/* Atmosphere */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -left-[20%] top-[-10%] h-[70vmax] w-[70vmax] animate-drift rounded-full bg-[radial-gradient(circle,#75162D_0%,transparent_65%)] opacity-80" />
        <div className="absolute -right-[15%] bottom-[-25%] h-[65vmax] w-[65vmax] animate-drift rounded-full bg-[radial-gradient(circle,#560B18_0%,transparent_60%)] [animation-delay:-6s]" />
        <div className="absolute right-[18%] top-[18%] h-[28vmax] w-[28vmax] animate-drift rounded-full bg-[radial-gradient(circle,rgba(242,217,160,0.22)_0%,transparent_65%)] [animation-delay:-11s]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-wine to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-14 px-5 md:px-10 lg:grid-cols-[1.25fr_1fr]">
        <motion.div style={reduce ? undefined : { y: yText, opacity: fade }} className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
            className="mb-8 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.32em] text-sand"
          >
            <span className="h-px w-10 bg-sand" />
            Colección Nº 07 · Edición limitada
          </motion.p>

          <SplitHeading
            as="h1"
            immediate
            delay={0.03}
            className="font-serif text-[clamp(3.4rem,9vw,8.75rem)] font-normal leading-[0.88] tracking-[-0.02em] text-champagne"
            lines={[
              "No es para",
              <span key="e">
                <em className="text-gold-gradient animate-shimmer pr-[0.04em] font-normal">cualquiera</em>
                <span className="text-sand">.</span>
              </span>,
            ]}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.7 }}
            className="mt-10 flex max-w-xl flex-col gap-10"
          >
            <p className="text-base leading-relaxed text-champagne/70 md:text-lg">
              Doce piezas. Ediciones numeradas, hechas en una sola tanda y nunca repuestas. Cuando una pieza se agota, se agota.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  href="#collection"
                  data-cursor="Comprar"
                  className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-sand px-8 text-xs font-semibold uppercase tracking-[0.24em] text-wine"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-champagne transition-transform duration-500 ease-lux group-hover:scale-y-100" />
                  <span className="relative">Ver la colección</span>
                  <ArrowIcon className="relative transition-transform duration-500 ease-lux group-hover:translate-x-1" width={16} height={16} />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="#lookbook"
                  className="inline-flex h-14 items-center rounded-full border border-champagne/30 px-8 text-xs font-medium uppercase tracking-[0.24em] text-champagne transition-colors duration-500 hover:border-sand hover:text-sand"
                >
                  Ver lookbook
                </Link>
              </Magnetic>
            </div>
          </motion.div>
        </motion.div>

        {/* Framed hero piece */}
        <motion.div
          style={reduce ? undefined : { y: yArt }}
          className="relative mx-auto w-full max-w-[440px] [perspective:1200px] lg:max-w-none"
        >
          <motion.button
            type="button"
            onClick={() => openQuickView("vesper-slip")}
            data-cursor="Ver"
            aria-label="Vista rápida del Vestido Vesper"
            initial={{ clipPath: "inset(100% 0 0 0 round 999px 999px 0 0)", scale: 1.08 }}
            animate={{ clipPath: "inset(0% 0 0 0 round 999px 999px 0 0)", scale: 1 }}
            transition={{ duration: 1.6, ease, delay: 0.35 }}
            style={reduce ? undefined : { rotateX: rx, rotateY: ry }}
            className="relative block aspect-[4/5] w-full overflow-hidden rounded-t-full border border-sand/25 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)]"
          >
            <GarmentArt silhouette="slip" tone="noir" className="h-full w-full" label="Vestido Vesper en seda dorada" />
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(242,217,160,0.12)_50%,transparent_60%)]" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease, delay: 1.3 }}
            className="absolute -left-4 bottom-10 rounded-2xl border border-sand/20 bg-wine/70 px-5 py-4 backdrop-blur-md md:-left-10"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-sand/80">Vestido Vesper</p>
            <p className="mt-1 font-serif text-2xl text-champagne">Nº 113 de 120</p>
          </motion.div>

          <motion.div
            aria-hidden
            initial={{ opacity: 0, rotate: -40 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1.4, ease, delay: 1.1 }}
            className="absolute -right-3 -top-6 h-28 w-28 md:-right-8"
          >
            <svg viewBox="0 0 100 100" className="h-full w-full animate-[spin_22s_linear_infinite]">
              <defs>
                <path id="circ" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
              </defs>
              <text fill="#F2D9A0" fontSize="9.4" letterSpacing="3.2">
                <textPath href="#circ">NUMERADAS · NUNCA REPUESTAS ·</textPath>
              </text>
            </svg>
            <span className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-sand" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-champagne/50 md:flex"
      >
        Desliza
        <span className="relative h-12 w-px overflow-hidden bg-champagne/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-sand"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
