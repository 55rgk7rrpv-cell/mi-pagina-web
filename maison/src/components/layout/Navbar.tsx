"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { BagIcon, CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/format";
import { useSoundSetting } from "@/lib/sounds";

const LINKS = [
  { href: "#collection", label: "Colección" },
  { href: "#lookbook", label: "Lookbook" },
  { href: "#manifesto", label: "Nosotras" },
  { href: "#inner-circle", label: "El Círculo" },
];

export function Navbar() {
  const { count, openCart, hydrated } = useShop();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const sound = useSoundSetting();

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
            scrolled ? "mt-3 max-w-6xl glass-dark rounded-full border border-sand/15 bg-wine/70 py-3 backdrop-blur-xl md:mt-4" : "max-w-[1600px] py-6",
          )}
        >
          <nav aria-label="Principal" className="hidden flex-1 items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative text-[11px] font-medium uppercase tracking-[0.24em] text-champagne/80 transition-colors hover:text-sand"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-sand transition-transform duration-500 ease-lux group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menu}
            onClick={() => setMenu(true)}
            className="-ml-2 flex h-10 w-10 items-center justify-center text-champagne md:hidden"
          >
            <MenuIcon />
          </button>

          <a href="#top" aria-label="Otra Pinta, inicio" className="whitespace-nowrap font-serif text-xl tracking-[0.26em] text-champagne sm:text-2xl md:text-[1.7rem]">
            OTRA PINTA
          </a>

          <div className="flex flex-1 items-center justify-end gap-6">
            <span className="hidden text-[11px] uppercase tracking-[0.24em] text-champagne/60 lg:inline">Puerto Ordaz</span>
            <button
              type="button"
              onClick={sound.toggle}
              aria-pressed={sound.on}
              aria-label={sound.on ? "Silenciar sonidos" : "Activar sonidos"}
              title={sound.on ? "Sonido activado" : "Sonido silenciado"}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-sand/20 text-champagne/70 transition-colors hover:border-sand hover:text-sand md:flex"
            >
              <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10v4h4l5 4V6L8 10H4Z" />
                {sound.on ? <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /> : <path d="M17 9l4 6M21 9l-4 6" />}
              </svg>
            </button>
            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={openCart}
                data-cursor="Bolsa"
                aria-label={`Abrir bolsa, ${count} ${count === 1 ? "artículo" : "artículos"}`}
                className="relative flex h-11 items-center gap-2 rounded-full border border-sand/30 px-4 text-[11px] font-medium uppercase tracking-[0.22em] text-champagne transition-colors hover:border-sand hover:bg-sand hover:text-wine"
              >
                <BagIcon width={16} height={16} />
                <span className="hidden sm:inline">Bolsa</span>
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
            aria-label="Menú"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl tracking-[0.26em]">OTRA PINTA</span>
              <button type="button" aria-label="Cerrar menú" onClick={() => setMenu(false)} className="flex h-10 w-10 items-center justify-center">
                <CloseIcon />
              </button>
            </div>
            <nav aria-label="Menú móvil" className="mt-16 flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.div key={l.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.07, duration: 0.6 }}>
                  <a href={l.href} onClick={() => setMenu(false)} className="block py-2 font-serif text-5xl italic text-champagne">
                    {l.label}
                  </a>
                </motion.div>
              ))}
            </nav>
            <p className="mt-auto text-xs uppercase tracking-[0.24em] text-sand/70">Puerto Ordaz · @otrapintapzo</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
