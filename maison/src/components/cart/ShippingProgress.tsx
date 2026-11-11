"use client";

import { motion } from "framer-motion";
import { formatPrice } from "@/lib/format";

export function ShippingProgress({ progress, remaining }: { progress: number; remaining: number }) {
  const done = remaining <= 0;
  return (
    <div>
      <p className="text-xs text-maroon/85" aria-live="polite">
        {done ? (
          <span className="font-semibold text-burgundy">✦ Tu delivery es gratis.</span>
        ) : (
          <>Te faltan <span className="font-semibold text-burgundy tabular-nums">{formatPrice(remaining)}</span> para tener delivery gratis.</>
        )}
      </p>
      <div
        className="relative mt-3 h-1 overflow-hidden rounded-full bg-wine/10"
        role="progressbar"
        aria-label="Progreso hacia el envío gratis"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-burgundy via-[#b3475f] to-sand"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
        {done && <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)] bg-[length:200%_100%]" />}
      </div>
    </div>
  );
}
