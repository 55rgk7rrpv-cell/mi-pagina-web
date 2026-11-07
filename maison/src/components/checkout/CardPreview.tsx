"use client";

import { motion } from "framer-motion";
import type { CardBrand } from "@/lib/payment";

const BRAND_LABEL: Record<CardBrand, string> = {
  visa: "VISA",
  mastercard: "Mastercard",
  amex: "AMEX",
  discover: "Discover",
  unknown: "",
};

export function CardPreview({ number, name, expiry, cvc, brand, flipped }: { number: string; name: string; expiry: string; cvc: string; brand: CardBrand; flipped: boolean }) {
  const len = brand === "amex" ? 15 : 16;
  const digits = number.replace(/\D/g, "").padEnd(len, "•");
  const masked = brand === "amex" ? `${digits.slice(0, 4)} ${digits.slice(4, 10)} ${digits.slice(10)}` : digits.replace(/(.{4})/g, "$1 ").trim();

  return (
    <div className="[perspective:1400px]" aria-hidden>
      <motion.div
        className="relative mx-auto aspect-[1.586] w-full max-w-[360px] [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#560B18,#3B010B_55%,#75162D)] p-6 text-champagne shadow-[0_30px_60px_-20px_rgba(59,1,11,0.7)] [backface-visibility:hidden]">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(242,217,160,0.35),transparent_65%)]" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <span className="font-serif text-base tracking-[0.24em]">OTRA PINTA</span>
              <motion.span key={brand} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-semibold italic tracking-wider text-sand">
                {BRAND_LABEL[brand]}
              </motion.span>
            </div>
            <div className="mt-5 h-8 w-11 rounded-md bg-[linear-gradient(135deg,#f2d9a0,#c9a35c)] opacity-90" />
            <p className="mt-auto font-mono text-[clamp(1rem,4.6vw,1.3rem)] tracking-[0.12em] tabular-nums">{masked}</p>
            <div className="mt-4 flex items-end justify-between text-[10px] uppercase tracking-[0.18em]">
              <div className="min-w-0">
                <p className="text-champagne/50">Card holder</p>
                <p className="mt-1 truncate text-xs text-champagne">{name || "Your name"}</p>
              </div>
              <div className="text-right">
                <p className="text-champagne/50">Expires</p>
                <p className="mt-1 text-xs tabular-nums text-champagne">{expiry || "MM / YY"}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#3B010B,#560B18)] text-champagne [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="mt-7 h-11 bg-black/70" />
          <div className="mx-6 mt-6 flex items-center justify-end rounded bg-champagne/90 px-3 py-2 font-mono text-sm tracking-widest text-wine">
            {cvc || "•••"}
          </div>
          <p className="mx-6 mt-4 text-[9px] uppercase tracking-[0.2em] text-champagne/50">Security code</p>
        </div>
      </motion.div>
    </div>
  );
}
