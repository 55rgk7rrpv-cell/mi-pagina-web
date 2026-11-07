"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

const TEXT =
  "Hacemos muy pocas cosas, y las hacemos bien. Sin temporadas de exceso, sin reposiciones, sin atajos. Cada pieza va numerada a mano, porque lo exclusivo tiene que significar algo.";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = TEXT.split(" ");

  return (
    <section id="manifesto" className="grain relative overflow-hidden bg-maroon px-5 py-32 md:px-10 md:py-48">
      <div aria-hidden className="absolute -right-40 top-1/2 h-[60vmax] w-[60vmax] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(242,217,160,0.12),transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl">
        <p className="mb-12 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.32em] text-sand">
          <span className="h-px w-10 bg-sand" /> Otra Pinta
        </p>
        <div ref={ref}>
          <p className="sr-only">{TEXT}</p>
          <p aria-hidden className="font-serif text-[clamp(2rem,5.2vw,4.6rem)] leading-[1.08] text-champagne">
            {words.map((w, i) => (
              <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
            ))}
          </p>
        </div>
        <div className="mt-20 grid gap-10 border-t border-sand/20 pt-10 sm:grid-cols-3">
          {[
            ["40 h", "de terminación a mano en cada pieza de sastrería"],
            ["≤ 200", "piezas por modelo, numeradas a mano"],
            ["0", "reposiciones. Nunca."],
          ].map(([n, l]) => (
            <div key={n}>
              <p className="font-serif text-5xl text-sand md:text-6xl">{n}</p>
              <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-champagne/65">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
