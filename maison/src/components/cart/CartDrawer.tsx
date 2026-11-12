"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type FormEvent } from "react";
import { maxFor, useShop } from "@/context/ShopContext";
import { formatPrice, cn } from "@/lib/format";
import { CloseIcon, MinusIcon, PlusIcon, TagIcon, ArrowIcon, LockIcon } from "@/components/ui/Icons";
import { ProductVisual } from "@/components/shop/ProductVisual";
import { useDialog } from "@/components/ui/useDialog";
import { ShippingProgress } from "./ShippingProgress";

export function CartDrawer() {
  const { cartOpen, closeCart } = useShop();
  return <AnimatePresence>{cartOpen && <Drawer onClose={closeCart} />}</AnimatePresence>;
}

function Drawer({ onClose }: { onClose: () => void }) {
  const { lines, count, totals, setQty, remove, openCheckout } = useShop();
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, onClose);

  return (
    <div className="fixed inset-0 z-[100]">
      <motion.div
        className="absolute inset-0 bg-wine/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Bolsa de compras"
        tabIndex={-1}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.45 }}
        className="absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col bg-champagne text-wine shadow-[-40px_0_80px_-20px_rgba(0,0,0,0.5)]"
      >
        <header className="flex items-center justify-between border-b border-wine/10 px-6 py-5">
          <h2 className="font-serif text-3xl">
            Tu bolsa <span className="align-top font-sans text-xs tabular-nums text-maroon/70">({count})</span>
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar bolsa" className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-wine/10">
            <CloseIcon />
          </button>
        </header>

        {lines.length > 0 && (
          <div className="border-b border-wine/10 px-6 py-4">
            <ShippingProgress progress={totals.progress} remaining={totals.remainingForFree} />
          </div>
        )}

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-serif text-4xl italic text-burgundy">Todavía no hay nada aquí.</p>
            <p className="mt-4 max-w-xs text-sm text-maroon/75">Hay pocas unidades por talla. Si algo te gusta, no lo pienses mucho.</p>
            <a
              href="#collection"
              onClick={onClose}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-burgundy px-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne transition-colors hover:bg-wine"
            >
              Ver la colección <ArrowIcon width={14} height={14} />
            </a>
          </div>
        ) : (
          <>
            <ul data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6" aria-label="Artículos en tu bolsa">
              <AnimatePresence initial={false}>
                {lines.map((l) => (
                  <motion.li
                    key={l.key}
                    layout
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 60, height: 0, paddingTop: 0, paddingBottom: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-4 overflow-hidden border-b border-wine/10 py-5"
                  >
                    <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-white p-1.5 ring-1 ring-wine/10">
                      <ProductVisual product={l.product} color={l.color} variant="still" className="h-full w-full" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <h3 className="font-serif text-xl leading-tight">{l.product.name}</h3>
                        <motion.p key={l.lineTotal} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm tabular-nums">
                          {formatPrice(l.lineTotal)}
                        </motion.p>
                      </div>
                      <p className="mt-1 text-xs text-maroon/70">{l.color} · {l.size}</p>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex items-center rounded-full border border-wine/20" role="group" aria-label={`Cantidad de ${l.product.name}`}>
                          <button
                            type="button"
                            onClick={() => setQty(l.key, l.qty - 1)}
                            aria-label={l.qty === 1 ? `Quitar ${l.product.name}` : "Restar uno"}
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-wine/10"
                          >
                            <MinusIcon width={14} height={14} />
                          </button>
                          <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">{l.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(l.key, l.qty + 1)}
                            disabled={l.qty >= maxFor(l.productId)}
                            aria-label="Sumar uno"
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-wine/10 disabled:opacity-30"
                          >
                            <PlusIcon width={14} height={14} />
                          </button>
                        </div>
                        <button type="button" onClick={() => remove(l.key)} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-maroon/70 underline-offset-4 hover:text-burgundy hover:underline">
                          Quitar
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <footer className="border-t border-wine/10 bg-champagne px-6 pb-6 pt-5">
              <PromoField />
              <Summary className="mt-5" />
              <button
                type="button"
                onClick={openCheckout}
                className="group relative mt-5 flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-burgundy text-xs font-semibold uppercase tracking-[0.24em] text-champagne"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-wine transition-transform duration-500 ease-lux group-hover:scale-x-100" />
                <LockIcon width={14} height={14} className="relative" />
                <span className="relative">Pagar de forma segura</span>
              </button>
              <p className="mt-3 text-center text-[11px] text-maroon/60">Precios en dólares. Pagas con tarjeta, Pago Móvil, Zelle o PayPal.</p>
            </footer>
          </>
        )}
      </motion.aside>
    </div>
  );
}

export function PromoField() {
  const { applyPromo, promo, clearPromo, totals } = useShop();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = applyPromo(code);
    setMsg({ ok: r.ok, text: r.message });
    if (r.ok) setCode("");
  };

  if (promo) {
    return (
      <div className="flex items-center justify-between rounded-full border border-burgundy/30 bg-sand/40 px-4 py-2.5 text-xs">
        <span className="flex items-center gap-2 font-semibold uppercase tracking-[0.16em] text-burgundy">
          <TagIcon width={14} height={14} /> {promo.code}
          {!totals.promoValid && <span className="font-normal normal-case tracking-normal text-maroon/70">(aún no aplica)</span>}
        </span>
        <button type="button" onClick={() => { clearPromo(); setMsg(null); }} className="text-[11px] uppercase tracking-[0.16em] text-maroon/70 hover:text-burgundy">
          Quitar
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-maroon/80 hover:text-burgundy"
      >
        <TagIcon width={14} height={14} /> {open ? "Ocultar código" : "Tengo un código de descuento"}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            onSubmit={submit}
            noValidate
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 pt-3">
              <label htmlFor="promo" className="sr-only">Código de descuento</label>
              <input
                id="promo"
                value={code}
                onChange={(e) => { setCode(e.target.value); setMsg(null); }}
                placeholder="Prueba BIENVENIDA"
                autoComplete="off"
                aria-invalid={msg ? !msg.ok : undefined}
                aria-describedby="promo-msg"
                className={cn(
                  "h-11 min-w-0 flex-1 rounded-full border bg-transparent px-4 text-sm uppercase tracking-[0.12em] placeholder:normal-case placeholder:tracking-normal placeholder:text-maroon/45 focus:outline-none",
                  msg && !msg.ok ? "border-burgundy" : "border-wine/20 focus:border-wine",
                )}
              />
              <button type="submit" className="h-11 rounded-full border border-wine px-5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-wine hover:text-champagne">
                Aplicar
              </button>
            </div>
            <p id="promo-msg" role="status" className={cn("min-h-5 pt-2 text-xs", msg?.ok ? "text-burgundy" : "text-burgundy/90")}>
              {msg?.text}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Summary({ className, shipping, shippingLabel }: { className?: string; shipping?: number; shippingLabel?: string }) {
  const { totals } = useShop();
  const ship = shipping ?? totals.shipping;
  const total = totals.subtotal - totals.discount + ship;
  const rows: [string, string, boolean?][] = [
    ["Subtotal", formatPrice(totals.subtotal)],
    ...(totals.discount ? ([["Descuento", `− ${formatPrice(totals.discount)}`, true]] as [string, string, boolean][]) : []),
    [shippingLabel ?? "Envío", ship === 0 ? "Gratis" : formatPrice(ship)],
  ];
  return (
    <dl className={cn("space-y-2 text-sm", className)}>
      {rows.map(([k, v, accent]) => (
        <div key={k} className="flex justify-between">
          <dt className="text-maroon/75">{k}</dt>
          <dd className={cn("tabular-nums", accent && "text-burgundy")}>{v}</dd>
        </div>
      ))}
      <div className="flex items-baseline justify-between border-t border-wine/10 pt-3">
        <dt className="text-[11px] font-semibold uppercase tracking-[0.2em]">Total</dt>
        <dd className="font-serif text-3xl tabular-nums">
          <motion.span key={total} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }}>{formatPrice(total)}</motion.span>
        </dd>
      </div>
    </dl>
  );
}
