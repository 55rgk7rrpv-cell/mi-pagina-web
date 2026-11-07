"use client";

import { CheckoutFlow } from "./CheckoutFlow";
import { LockIcon } from "@/components/ui/Icons";

export function CheckoutScreen() {
  return (
    <div className="min-h-svh bg-champagne text-wine">
      <header className="border-b border-wine/10">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between gap-4 px-5 py-5 md:px-10">
          <a href="#top" className="whitespace-nowrap font-serif text-xl tracking-[0.26em] sm:text-2xl" aria-label="Otra Pinta, volver a la tienda">
            OTRA PINTA
          </a>
          <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-maroon/75">
            <LockIcon width={14} height={14} /> Pago <span className="hidden sm:inline">seguro</span>
          </span>
        </div>
      </header>
      <main id="main">
        <CheckoutFlow />
      </main>
    </div>
  );
}
