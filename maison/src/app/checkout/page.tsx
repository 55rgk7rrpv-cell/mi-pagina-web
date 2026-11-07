import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { LockIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Secure checkout | Aurèle",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-svh bg-champagne text-wine">
      <header className="border-b border-wine/10">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-5 py-5 md:px-10">
          <Link href="/" className="font-serif text-2xl tracking-[0.32em]" aria-label="Aurèle, back to the shop">
            AURÈLE
          </Link>
          <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-maroon/75">
            <LockIcon width={14} height={14} /> Secure checkout
          </span>
        </div>
      </header>
      <main id="main">
        <CheckoutFlow />
      </main>
    </div>
  );
}
