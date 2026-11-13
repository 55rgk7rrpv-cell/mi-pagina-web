"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

const ITEMS = [
  "Nueva colección",
  "Pocas unidades por talla",
  "Delivery gratis desde $80",
  "Pago Móvil, Zelle y tarjeta",
  "@otrapintapzo",
];

/** One full loop (half the track) takes this long at rest. */
const LOOP_SECONDS = 38;

/**
 * Endless band. It drifts on its own; scrolling speeds it up (up to 4×) and flips its direction
 * to follow the scroll, then it eases back to its resting speed.
 * Only runs while it is on screen, and stays still for reduced motion.
 */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root);
  const reduce = useReducedMotion();
  const row = [...ITEMS, ...ITEMS];

  const pos = useMotionValue(0); // 0 → -50 (%), then wraps
  const x = useTransform(pos, (v) => `${v}%`);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    const v = velocity.get();
    if (v < -5) direction.current = -1;
    else if (v > 5) direction.current = 1;
    const boost = Math.min(4, 1 + Math.abs(v) / 800);
    let next = pos.get() - direction.current * boost * (50 / LOOP_SECONDS) * (delta / 1000);
    if (next <= -50) next += 50;
    else if (next > 0) next -= 50;
    pos.set(next);
  });

  return (
    <div ref={root} className="relative overflow-hidden border-y border-sand/20 bg-burgundy py-5" aria-label="Lo esencial de Otra Pinta">
      <motion.ul style={{ x }} className="flex w-max gap-12 whitespace-nowrap will-change-transform">
        {[...row, ...row].map((item, i) => (
          <li key={i} aria-hidden={i >= ITEMS.length} className="flex items-center gap-12 font-serif text-2xl italic text-champagne md:text-3xl">
            {item}
            <span className="text-base not-italic text-sand">✦</span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
