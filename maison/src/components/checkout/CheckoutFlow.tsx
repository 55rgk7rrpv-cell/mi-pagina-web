"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, type FormEvent } from "react";
import { useShop } from "@/context/ShopContext";
import { computeTotals, FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { mensajePedido, nuevoId, whatsappUrl, instagramUrl, type EfectivoDatos, type PagoMovilDatos, type PayMethod, type Pedido } from "@/lib/pedido";
import { enBolivares, formatBs } from "@/lib/tienda";
import { useTasaBcv } from "@/lib/useTasaBcv";
import { cn, formatPrice } from "@/lib/format";
import { ArrowIcon, CheckIcon, LockIcon } from "@/components/ui/Icons";
import { ProductVisual } from "@/components/shop/ProductVisual";
import { PromoField, Summary } from "@/components/cart/CartDrawer";
import { ShippingProgress } from "@/components/cart/ShippingProgress";
import { Field } from "./Field";
import { EfectivoPanel, PagoMovilPanel, validatePagoMovil } from "./PaymentPanels";
import { play } from "@/lib/sounds";

const ease = [0.22, 1, 0.36, 1] as const;
const STEPS = ["Datos", "Envío", "Pago"] as const;

// Otra Pinta only sells in Puerto Ordaz.
const METHODS = [
  { id: "express", label: "Delivery", note: "A tu dirección en Puerto Ordaz, de 1 a 2 días hábiles", cost: 5 },
  { id: "pickup", label: "Retiro en persona", note: "En Puerto Ordaz, coordinamos el punto por mensaje", cost: 0 },
] as const;

// The only two ways to pay.
const PAY: { id: PayMethod; label: string }[] = [
  { id: "pagomovil", label: "Pago Móvil" },
  { id: "efectivo", label: "Efectivo" },
];

interface Contact {
  email: string;
  first: string;
  last: string;
  address: string;
  phone: string;
}

function validateContact(c: Contact) {
  const e: Partial<Record<keyof Contact, string>> = {};
  if (c.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email)) e.email = "Escribe un correo válido, por ejemplo nombre@ejemplo.com.";
  if (!c.first.trim()) e.first = "Escribe tu nombre.";
  if (!c.last.trim()) e.last = "Escribe tu apellido.";
  if (c.address.trim().length < 5) e.address = "Escribe tu dirección.";
  if (c.phone.replace(/\D/g, "").length < 7) e.phone = "Escribe un teléfono para que el mensajero pueda llamarte.";
  return e;
}

export function CheckoutFlow() {
  const shop = useShop();
  const { lines, totals, promo, hydrated, clear } = shop;

  const [step, setStep] = useState(0);
  const [contact, setContact] = useState<Contact>({ email: "", first: "", last: "", address: "", phone: "" });
  const [touched, setTouched] = useState<Partial<Record<string, boolean>>>({});
  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("express");
  const [pay, setPay] = useState<PayMethod>("pagomovil");
  const [pm, setPm] = useState<PagoMovilDatos>({ banco: "", telefono: "", referencia: "" });
  const [cash, setCash] = useState<EfectivoDatos>({ pagaCon: "" });
  const [order, setOrder] = useState<Pedido | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const contactErrors = useMemo(() => validateContact(contact), [contact]);
  const pmErrors = useMemo(() => validatePagoMovil(pm), [pm]);
  const payMethod = pay;
  const tasa = useTasaBcv();
  const chosen = METHODS.find((m) => m.id === method)!;
  const checkoutTotals = computeTotals(totals.subtotal, promo, chosen.cost);
  const shippingCost = checkoutTotals.shipping;

  const show = (k: string, errs: Record<string, string | undefined>) => (touched[k] ? errs[k] : undefined);
  const touch = (k: string) => setTouched((t) => ({ ...t, [k]: true }));
  const setC = (k: keyof Contact) => (e: { target: { value: string } }) => setContact((c) => ({ ...c, [k]: e.target.value }));

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (step === 0) {
      if (Object.keys(contactErrors).length) {
        setTouched((t) => ({ ...t, ...Object.fromEntries(Object.keys(contact).map((k) => [k, true])) }));
        document.getElementById(Object.keys(contactErrors)[0])?.focus();
        return;
      }
      setStep(1);
    } else if (step === 1) {
      setStep(2);
    } else {
      placeOrder();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const placeOrder = () => {
    if (payMethod === "pagomovil" && Object.keys(pmErrors).length) {
      setTouched((t) => ({ ...t, "pm-banco": true, "pm-telefono": true, "pm-referencia": true }));
      document.getElementById(`pm-${Object.keys(pmErrors)[0]}`)?.focus();
      return;
    }
    // No server: the order is the message the customer sends us on the next screen.
    setOrder({
      id: nuevoId(),
      lineas: lines.map((l) => ({ nombre: l.product.name, color: l.color, talla: l.size, cantidad: l.qty, total: l.lineTotal })),
      subtotal: checkoutTotals.subtotal,
      descuento: checkoutTotals.discount,
      envio: checkoutTotals.shipping,
      envioLabel: chosen.label,
      total: checkoutTotals.total,
      tasa,
      cliente: {
        nombre: `${contact.first} ${contact.last}`.trim(),
        telefono: contact.phone,
        correo: contact.email.trim(),
        direccion: contact.address,
      },
      pago: payMethod === "pagomovil" ? { metodo: "pagomovil", datos: pm } : { metodo: "efectivo", datos: cash },
    });
    play("done", -8);
    clear();
  };

  if (order) return <Confirmation order={order} />;

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70svh] max-w-lg flex-col items-center justify-center px-5 text-center">
        <p className="font-serif text-5xl italic text-burgundy">Tu bolsa está vacía.</p>
        <p className="mt-4 text-maroon/75">Añade una pieza de la colección para empezar a pagar.</p>
        <a href="#collection" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-burgundy px-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne hover:bg-wine">
          Volver a la colección <ArrowIcon width={14} height={14} />
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1300px] gap-10 px-5 pb-24 pt-8 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-14">
      {/* Mobile summary toggle */}
      <button
        type="button"
        onClick={() => setShowSummary((s) => !s)}
        aria-expanded={showSummary}
        className="flex items-center justify-between rounded-2xl border border-wine/15 bg-sand/30 px-5 py-4 text-sm lg:hidden"
      >
        <span className="font-semibold uppercase tracking-[0.16em] text-[11px]">{showSummary ? "Ocultar" : "Ver"} resumen del pedido</span>
        <span className="font-serif text-xl tabular-nums">{formatPrice(checkoutTotals.total)}</span>
      </button>

      <div className="order-2 lg:order-1">
        <Stepper step={step} onJump={(i) => i < step && setStep(i)} />

        <form onSubmit={next} noValidate className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.5, ease }}
            >
              {step === 0 && (
                <fieldset className="space-y-4">
                  <legend className="mb-6 font-serif text-4xl">¿Para quién es?</legend>
                  <Field id="email" label="Correo (opcional)" type="email" autoComplete="email" inputMode="email" value={contact.email} onChange={setC("email")} onBlur={() => touch("email")} error={show("email", contactErrors)} valid={!contactErrors.email} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="first" label="Nombre" autoComplete="given-name" value={contact.first} onChange={setC("first")} onBlur={() => touch("first")} error={show("first", contactErrors)} valid={!contactErrors.first} />
                    <Field id="last" label="Apellido" autoComplete="family-name" value={contact.last} onChange={setC("last")} onBlur={() => touch("last")} error={show("last", contactErrors)} valid={!contactErrors.last} />
                  </div>
                  <Field id="address" label="Dirección en Puerto Ordaz" autoComplete="street-address" value={contact.address} onChange={setC("address")} onBlur={() => touch("address")} error={show("address", contactErrors)} valid={!contactErrors.address} />
                  <Field id="phone" label="Teléfono" type="tel" autoComplete="tel" inputMode="tel" value={contact.phone} onChange={setC("phone")} onBlur={() => touch("phone")} error={show("phone", contactErrors)} valid={!contactErrors.phone} />
                </fieldset>
              )}

              {step === 1 && (
                <fieldset>
                  <legend className="mb-6 font-serif text-4xl">¿Cómo quieres recibirlo?</legend>
                  <div className="space-y-3" role="radiogroup" aria-label="Método de envío">
                    {METHODS.map((m) => {
                      const cost = computeTotals(totals.subtotal, promo, m.cost).shipping;
                      const active = method === m.id;
                      return (
                        <label
                          key={m.id}
                          className={cn(
                            "relative flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition-colors",
                            active ? "border-burgundy bg-sand/30" : "border-wine/15 hover:border-wine/40",
                          )}
                        >
                          <input type="radio" name="method" value={m.id} checked={active} onChange={() => setMethod(m.id)} className="peer sr-only" />
                          <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-burgundy peer-focus-visible:ring-offset-2", active ? "border-burgundy" : "border-wine/30")}>
                            {active && <motion.span layoutId="method-dot" className="h-2.5 w-2.5 rounded-full bg-burgundy" />}
                          </span>
                          <span className="flex-1">
                            <span className="block font-medium">{m.label}</span>
                            <span className="mt-0.5 block text-xs text-maroon/70">{m.note}</span>
                          </span>
                          <span className="text-sm tabular-nums">
                            {cost === 0 ? <span className="font-semibold text-burgundy">Gratis</span> : formatPrice(cost)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {totals.subtotal < FREE_SHIPPING_THRESHOLD && method === "express" && (
                    <div className="mt-6 rounded-2xl border border-wine/10 p-5">
                      <ShippingProgress progress={totals.progress} remaining={totals.remainingForFree} />
                    </div>
                  )}
                  <div className="mt-8 rounded-2xl border border-wine/10 bg-sand/20 p-5 text-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-maroon/70">Enviar a</p>
                    <p className="mt-2">{contact.first} {contact.last}, {contact.address}, Puerto Ordaz</p>
                    <button type="button" onClick={() => setStep(0)} className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-burgundy underline-offset-4 hover:underline">Editar</button>
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <fieldset>
                  <legend className="mb-6 font-serif text-4xl">Pago</legend>
                  <div role="tablist" aria-label="Método de pago" className="grid grid-cols-2 gap-2 rounded-full border border-wine/15 p-1">
                    {PAY.map((p) => {
                      return (
                        <button
                          key={p.id}
                          type="button"
                          role="tab"
                          aria-selected={payMethod === p.id}
                          onClick={() => setPay(p.id)}
                          className={cn("filter-pill relative h-11 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em]", payMethod === p.id ? "is-active text-champagne" : "text-maroon/75")}
                        >
                          {payMethod === p.id && <motion.span layoutId="pay-pill" className="absolute inset-0 rounded-full bg-burgundy" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                          <span className="relative">{p.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8">
                    <AnimatePresence mode="wait">
                      <motion.div key={payMethod} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                        {payMethod === "pagomovil" ? (
                          <PagoMovilPanel totalUsd={checkoutTotals.total} tasa={tasa} datos={pm} onChange={setPm} errors={pmErrors} touched={touched} onTouch={touch} />
                        ) : (
                          <EfectivoPanel totalUsd={checkoutTotals.total} datos={cash} onChange={setCash} pickup={method === "pickup"} />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </fieldset>
              )}
            </motion.div>
          </AnimatePresence>

            <div className="mt-10 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
              {step > 0 ? (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="text-[11px] font-semibold uppercase tracking-[0.2em] text-maroon/75 hover:text-burgundy">
                  ← Volver a {STEPS[step - 1].toLowerCase()}
                </button>
              ) : (
                <a href="#collection" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-maroon/75 hover:text-burgundy">← Seguir comprando</a>
              )}
              <button
                type="submit"
                className="group relative flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-burgundy px-10 text-xs font-semibold uppercase tracking-[0.24em] text-champagne disabled:cursor-wait"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-wine transition-transform duration-500 ease-lux group-hover:scale-x-100" />
                <span className="relative flex items-center gap-3">
                  {step === 2 ? (
                    <><LockIcon width={14} height={14} /> Confirmar pedido · {formatPrice(checkoutTotals.total)}</>
                  ) : (
                    <>Continuar a {STEPS[step + 1].toLowerCase()} <ArrowIcon width={14} height={14} /></>
                  )}
                </span>
              </button>
            </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-[11px] text-maroon/60 sm:justify-end">
            <LockIcon width={12} height={12} /> Verificamos cada pago a mano antes de despachar tu pedido
          </p>
        </form>
      </div>

      {/* Order summary */}
      <aside
        aria-label="Resumen del pedido"
        className={cn("order-1 lg:order-2 lg:block", showSummary ? "block" : "hidden")}
      >
        <div className="rounded-3xl border border-wine/10 bg-sand/25 p-6 lg:sticky lg:top-28 md:p-8">
          <h2 className="font-serif text-3xl">Resumen del pedido</h2>
          <ul className="mt-6 max-h-[40svh] space-y-5 overflow-y-auto pr-1">
            {lines.map((l) => (
              <li key={l.key} className="flex items-center gap-4">
                <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg bg-white p-1 ring-1 ring-wine/10">
                  <ProductVisual product={l.product} color={l.color} variant="still" className="h-full w-full" />
                  <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-md bg-burgundy px-1 text-[10px] font-semibold text-champagne">{l.qty}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-lg leading-tight">{l.product.name}</p>
                  <p className="text-xs text-maroon/70">{l.color} · {l.size}</p>
                </div>
                <p className="text-sm tabular-nums">{formatPrice(l.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-wine/10 pt-5">
            <PromoField />
          </div>
          <Summary className="mt-5" shipping={shippingCost} shippingLabel={chosen.label} />
        </div>
      </aside>
    </div>
  );
}

function Stepper({ step, onJump }: { step: number; onJump: (i: number) => void }) {
  return (
    <ol className="flex items-center gap-3" aria-label="Pasos del pago">
      {STEPS.map((s, i) => (
        <li key={s} className="flex flex-1 items-center gap-3 last:flex-none">
          <button
            type="button"
            onClick={() => onJump(i)}
            disabled={i >= step}
            aria-current={i === step ? "step" : undefined}
            className="flex items-center gap-2.5 disabled:cursor-default"
          >
            <span className={cn("flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors duration-500", i < step ? "border-burgundy bg-burgundy text-champagne" : i === step ? "border-burgundy text-burgundy" : "border-wine/20 text-maroon/50")}>
              {i < step ? <CheckIcon width={12} height={12} strokeWidth={2.2} /> : i + 1}
            </span>
            <span className={cn("hidden text-[11px] font-semibold uppercase tracking-[0.18em] sm:inline", i <= step ? "text-wine" : "text-maroon/50")}>{s}</span>
          </button>
          {i < STEPS.length - 1 && (
            <span className="relative h-px flex-1 bg-wine/15">
              <motion.span className="absolute inset-y-0 left-0 bg-burgundy" initial={false} animate={{ width: i < step ? "100%" : "0%" }} transition={{ duration: 0.7, ease }} />
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function Confirmation({ order }: { order: Pedido }) {
  const texto = mensajePedido(order);
  const wa = whatsappUrl(texto);
  const bs = enBolivares(order.total, order.tasa);
  const [copied, setCopied] = useState(false);
  const copyAndOpenInstagram = () => {
    navigator.clipboard?.writeText(texto).finally(() => {
      setCopied(true);
      window.open(instagramUrl, "_blank", "noopener");
    });
  };
  return (
    <div className="mx-auto flex min-h-[80svh] max-w-2xl flex-col items-center justify-center px-5 py-20 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-burgundy text-champagne"
      >
        <CheckIcon width={34} height={34} strokeWidth={1.8} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease }}>
        <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.3em] text-burgundy">Pedido {order.id}</p>
        <h1 className="mt-4 font-serif text-[clamp(2.6rem,7vw,4.8rem)] leading-[0.95]">
          Falta <em className="text-burgundy">un paso.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-maroon/80">
          Envíanos tu pedido por mensaje. {order.pago.metodo === "pagomovil" ? "Verificamos tu Pago Móvil y te confirmamos" : "Te confirmamos el pedido y coordinamos la entrega"} por la misma vía.
        </p>
        <p className="mt-6 font-serif text-3xl tabular-nums">
          {formatPrice(order.total)}
          {bs && <span className="ml-3 text-xl text-maroon/70">{formatBs(bs)}</span>}
        </p>
        <div className="mx-auto mt-10 flex max-w-sm flex-col gap-3">
          {wa && (
            <a href={wa} target="_blank" rel="noopener" className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-burgundy px-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne transition-colors hover:bg-wine">
              Enviar pedido por WhatsApp <ArrowIcon width={14} height={14} />
            </a>
          )}
          <button
            type="button"
            onClick={copyAndOpenInstagram}
            className={cn("inline-flex h-14 items-center justify-center gap-2 rounded-full px-7 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors", wa ? "border border-wine/25 text-wine hover:border-wine hover:bg-wine hover:text-champagne" : "bg-burgundy text-champagne hover:bg-wine")}
          >
            {copied ? "Copiado · pégalo en el chat" : "Copiar pedido y abrir Instagram"}
          </button>
          {copied && <p className="text-xs text-maroon/70">Tu pedido quedó copiado. En el chat de @otrapintapzo, mantén presionado y elige “Pegar”.</p>}
        </div>
        <details className="mx-auto mt-8 max-w-md text-left">
          <summary className="cursor-pointer text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-maroon/70 hover:text-burgundy">Ver el mensaje</summary>
          <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-sand/30 p-5 font-sans text-sm text-wine">{texto}</pre>
        </details>
        <a href="#top" className="mt-10 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-maroon/70 hover:text-burgundy">
          Volver a la tienda
        </a>
      </motion.div>
    </div>
  );
}
