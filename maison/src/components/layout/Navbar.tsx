"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { BagIcon, CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/format";

const LINKS = [
  { href: "/#collection", label: "Collection" },
  { href: "/#lookbook", label: "Lookbook" },
  { href: "/#manifesto", label: "Maison" },
  { href: "/#inner-circle", label: "Inner Circle" },
];

export function Navbar() {
  const { count, openCart, hydrated } = useShop();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(v > 40);
    setHidden(v > 400 && v > prev && !menu);
  });

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={cn(
            "mx-auto flex items-center justify-between px-5 transition-all duration-700 ease-lux md:px-10",
            scrolled ? "mt-3 max-w-6xl rounded-full border border-sand/15 bg-wine/70 py-3 backdrop-blur-xl md:mt-4" : "max-w-[1600px] py-6",
          )}
        >
          <nav aria-label="Primary" className="hidden flex-1 items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative text-[11px] font-medium uppercase tracking-[0.24em] text-champagne/80 transition-colors hover:text-sand"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-sand transition-transform duration-500 ease-lux group-hover:origin-left group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menu}
            onClick={() => setMenu(true)}
            className="-ml-2 flex h-10 w-10 items-center justify-center text-champagne md:hidden"
          >
            <MenuIcon />
          </button>

          <Link href="/" aria-label="Aurèle, home" className="font-serif text-2xl tracking-[0.32em] text-champagne md:text-[1.7rem]">
            AURÈLE
          </Link>

          <div className="flex flex-1 items-center justify-end gap-6">
            <span className="hidden text-[11px] uppercase tracking-[0.24em] text-champagne/60 lg:inline">Collection Nº 07</span>
            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={openCart}
                data-cursor="Bag"
                aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
                className="relative flex h-11 items-center gap-2 rounded-full border border-sand/30 px-4 text-[11px] font-medium uppercase tracking-[0.22em] text-champagne transition-colors hover:border-sand hover:bg-sand hover:text-wine"
              >
                <BagIcon width={16} height={16} />
                <span className="hidden sm:inline">Bag</span>
                <span className="tabular-nums">({hydrated ? count : 0})</span>
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 2.2, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="pointer-events-none absolute inset-0 rounded-full border border-sand"
                    />
                  )}
                </AnimatePresence>
              </button>
            </Magnetic>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-wine px-6 py-6 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl tracking-[0.32em]">AURÈLE</span>
              <button type="button" aria-label="Close menu" onClick={() => setMenu(false)} className="flex h-10 w-10 items-center justify-center">
                <CloseIcon />
              </button>
            </div>
            <nav aria-label="Mobile" className="mt-16 flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.div key={l.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.07, duration: 0.6 }}>
                  <Link href={l.href} onClick={() => setMenu(false)} className="block py-2 font-serif text-5xl italic text-champagne">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p className="mt-auto text-xs uppercase tracking-[0.24em] text-sand/70">Collection Nº 07 · Numbered pieces</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
