"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, type FormEvent } from "react";
import { useShop } from "@/context/ShopContext";
import { computeTotals, FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { detectBrand, formatCardNumber, formatExpiry, validateCard, type CardFields } from "@/lib/payment";
import { cn, formatPrice } from "@/lib/format";
import { AppleIcon, ArrowIcon, CheckIcon, LockIcon } from "@/components/ui/Icons";
import { ProductVisual } from "@/components/shop/ProductVisual";
import { PromoField, Summary } from "@/components/cart/CartDrawer";
import { ShippingProgress } from "@/components/cart/ShippingProgress";
import { Field } from "./Field";
import { CardPreview } from "./CardPreview";

const ease = [0.22, 1, 0.36, 1] as const;
const STEPS = ["Datos", "Envío", "Pago"] as const;

const METHODS = [
  { id: "express", label: "Delivery", note: "En Puerto Ordaz y San Félix, de 1 a 2 días hábiles", cost: 5 },
  { id: "white-glove", label: "Envío nacional", note: "A cualquier ciudad de Venezuela por agencia de encomiendas", cost: 10 },
  { id: "pickup", label: "Retiro en persona", note: "En Puerto Ordaz, coordinamos por Instagram", cost: 0 },
] as const;

const PAY = [
  { id: "card", label: "Tarjeta" },
  { id: "apple", label: "Apple Pay" },
  { id: "paypal", label: "PayPal" },
  { id: "local", label: "Transferencia" },
] as const;
type PayId = (typeof PAY)[number]["id"];

const COUNTRIES = ["Venezuela", "Colombia", "Panamá", "México", "Chile", "Argentina", "Perú", "España", "Estados Unidos"];

interface Contact {
  email: string;
  first: string;
  last: string;
  address: string;
  city: string;
  postal: string;
  country: string;
  phone: string;
}

function validateContact(c: Contact) {
  const e: Partial<Record<keyof Contact, string>> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email)) e.email = "Escribe un correo válido, por ejemplo nombre@ejemplo.com.";
  if (!c.first.trim()) e.first = "Escribe tu nombre.";
  if (!c.last.trim()) e.last = "Escribe tu apellido.";
  if (c.address.trim().length < 5) e.address = "Escribe tu dirección.";
  if (!c.city.trim()) e.city = "Escribe tu ciudad.";
  if (c.postal.trim().length < 3) e.postal = "Escribe tu código postal.";
  if (c.phone.replace(/\D/g, "").length < 7) e.phone = "Escribe un teléfono para que el mensajero pueda llamarte.";
  return e;
}

export function CheckoutFlow() {
  const shop = useShop();
  const { lines, totals, promo, hydrated, clear } = shop;

  const [step, setStep] = useState(0);
  const [contact, setContact] = useState<Contact>({ email: "", first: "", last: "", address: "", city: "", postal: "", country: "Venezuela", phone: "" });
  const [touched, setTouched] = useState<Partial<Record<string, boolean>>>({});
  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("express");
  const [pay, setPay] = useState<PayId>("card");
  const [card, setCard] = useState<CardFields>({ name: "", number: "", expiry: "", cvc: "" });
  const [cvcFocus, setCvcFocus] = useState(false);
  const [localBank, setLocalBank] = useState("Pago Móvil");
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<{ id: string; total: number; email: string } | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const contactErrors = useMemo(() => validateContact(contact), [contact]);
  const cardErrors = useMemo(() => validateCard(card), [card]);
  const brand = detectBrand(card.number);
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
    if (pay === "card" && Object.keys(cardErrors).length) {
      setTouched((t) => ({ ...t, "card-name": true, "card-number": true, "card-expiry": true, "card-cvc": true }));
      const first = Object.keys(cardErrors)[0];
      document.getElementById(`card-${first}`)?.focus();
      return;
    }
    setProcessing(true);
    const total = checkoutTotals.total;
    window.setTimeout(() => {
      setOrder({ id: `OP-${Math.floor(100000 + Math.random() * 900000)}`, total, email: contact.email });
      clear();
      setProcessing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2000);
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
                  {/* Express wallets, shown first as is standard */}
                  <div className="grid grid-cols-2 gap-3 pb-2">
                    <button type="button" onClick={() => { setPay("apple"); setStep(2); }} className="flex h-12 items-center justify-center gap-1.5 rounded-full bg-black text-[15px] font-medium text-white transition-opacity hover:opacity-85">
                      <AppleIcon /> Pay
                    </button>
                    <button type="button" onClick={() => { setPay("paypal"); setStep(2); }} className="flex h-12 items-center justify-center rounded-full bg-[#ffc439] text-[15px] font-bold italic text-[#003087] transition-opacity hover:opacity-85">
                      Pay<span className="text-[#009cde]">Pal</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-4 py-2 text-[10px] uppercase tracking-[0.24em] text-maroon/60">
                    <span className="h-px flex-1 bg-wine/15" /> o continúa abajo <span className="h-px flex-1 bg-wine/15" />
                  </div>
                  <Field id="email" label="Correo electrónico" type="email" autoComplete="email" inputMode="email" value={contact.email} onChange={setC("email")} onBlur={() => touch("email")} error={show("email", contactErrors)} valid={!contactErrors.email} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="first" label="Nombre" autoComplete="given-name" value={contact.first} onChange={setC("first")} onBlur={() => touch("first")} error={show("first", contactErrors)} valid={!contactErrors.first} />
                    <Field id="last" label="Apellido" autoComplete="family-name" value={contact.last} onChange={setC("last")} onBlur={() => touch("last")} error={show("last", contactErrors)} valid={!contactErrors.last} />
                  </div>
                  <Field id="address" label="Dirección" autoComplete="street-address" value={contact.address} onChange={setC("address")} onBlur={() => touch("address")} error={show("address", contactErrors)} valid={!contactErrors.address} />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field id="city" label="Ciudad" autoComplete="address-level2" value={contact.city} onChange={setC("city")} onBlur={() => touch("city")} error={show("city", contactErrors)} valid={!contactErrors.city} />
                    <Field id="postal" label="Código postal" autoComplete="postal-code" value={contact.postal} onChange={setC("postal")} onBlur={() => touch("postal")} error={show("postal", contactErrors)} valid={!contactErrors.postal} />
                    <div className="relative rounded-2xl border border-wine/15 bg-champagne/60 hover:border-wine/35 focus-within:border-wine">
                      <label htmlFor="country" className="pointer-events-none absolute left-4 top-3 text-[10px] uppercase tracking-[0.18em] text-maroon/65">País</label>
                      <select id="country" autoComplete="country-name" value={contact.country} onChange={setC("country")} className="h-[3.75rem] w-full appearance-none rounded-2xl bg-transparent px-4 pt-5 text-[15px] text-wine outline-none">
                        {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
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
                    <p className="mt-2">{contact.first} {contact.last}, {contact.address}, {contact.city} {contact.postal}, {contact.country}</p>
                    <button type="button" onClick={() => setStep(0)} className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-burgundy underline-offset-4 hover:underline">Editar</button>
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <fieldset>
                  <legend className="mb-6 font-serif text-4xl">Pago</legend>
                  <div role="tablist" aria-label="Método de pago" className="grid grid-cols-2 gap-2 rounded-full border border-wine/15 p-1 sm:grid-cols-4">
                    {PAY.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        role="tab"
                        aria-selected={pay === p.id}
                        onClick={() => setPay(p.id)}
                        className={cn("relative h-11 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors", pay === p.id ? "text-champagne" : "text-maroon/75 hover:text-wine")}
                      >
                        {pay === p.id && <motion.span layoutId="pay-pill" className="absolute inset-0 rounded-full bg-burgundy" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                        <span className="relative">{p.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8">
                    <AnimatePresence mode="wait">
                      <motion.div key={pay} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                        {pay === "card" && (
                          <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-start">
                            <div className="space-y-4">
                              <Field
                                id="card-number" label="Número de tarjeta" inputMode="numeric" autoComplete="cc-number"
                                value={card.number}
                                onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
                                onBlur={() => touch("card-number")}
                                error={touched["card-number"] ? cardErrors.number : undefined}
                                valid={!cardErrors.number}
                                adornment={brand !== "unknown" ? <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy">{brand}</span> : null}
                              />
                              <Field id="card-name" label="Nombre en la tarjeta" autoComplete="cc-name" value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} onBlur={() => touch("card-name")} error={touched["card-name"] ? cardErrors.name : undefined} valid={!cardErrors.name} />
                              <div className="grid grid-cols-2 gap-4">
                                <Field
                                  id="card-expiry" label="Vencimiento (MM / AA)" inputMode="numeric" autoComplete="cc-exp"
                                  value={card.expiry}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    // Let backspace remove the " / " separator naturally
                                    setCard((c) => ({ ...c, expiry: v.length < c.expiry.length ? v.replace(/\s\/\s?$/, "") : formatExpiry(v) }));
                                  }}
                                  onBlur={() => touch("card-expiry")}
                                  error={touched["card-expiry"] ? cardErrors.expiry : undefined}
                                  valid={!cardErrors.expiry}
                                />
                                <Field
                                  id="card-cvc" label="Código de seguridad" inputMode="numeric" autoComplete="cc-csc"
                                  value={card.cvc}
                                  onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, "").slice(0, brand === "amex" ? 4 : 3) }))}
                                  onFocus={() => setCvcFocus(true)}
                                  onBlur={() => { setCvcFocus(false); touch("card-cvc"); }}
                                  error={touched["card-cvc"] ? cardErrors.cvc : undefined}
                                  valid={!cardErrors.cvc}
                                />
                              </div>
                              <p className="text-xs text-maroon/60">Modo de prueba: usa 4242 4242 4242 4242, cualquier fecha futura y 3 dígitos cualquiera.</p>
                            </div>
                            <div className="order-first md:order-none">
                              <CardPreview number={card.number} name={card.name} expiry={card.expiry} cvc={card.cvc} brand={brand} flipped={cvcFocus} />
                            </div>
                          </div>
                        )}
                        {pay === "apple" && (
                          <WalletPanel title="Apple Pay" body="Confirma con Face ID o Touch ID en tu teléfono. Nunca recibimos los datos de tu tarjeta.">
                            <button type="button" onClick={placeOrder} disabled={processing} className="flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-black text-lg font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-60">
                              {processing ? <Spinner /> : <><AppleIcon width={20} height={20} /> Pagar {formatPrice(checkoutTotals.total)}</>}
                            </button>
                          </WalletPanel>
                        )}
                        {pay === "paypal" && (
                          <WalletPanel title="PayPal" body="Confirmarás el pago en una ventana segura de PayPal y luego volverás aquí para terminar tu pedido.">
                            <button type="button" onClick={placeOrder} disabled={processing} className="flex h-14 w-full items-center justify-center rounded-full bg-[#ffc439] text-lg font-bold italic text-[#003087] transition-opacity hover:opacity-85 disabled:opacity-60">
                              {processing ? <Spinner dark /> : <>Pay<span className="text-[#009cde]">Pal</span></>}
                            </button>
                          </WalletPanel>
                        )}
                        {pay === "local" && (
                          <WalletPanel title="Transferencia segura" body="Te apartamos tus prendas por 24 horas mientras se confirma el pago. Te enviamos al correo los datos y una referencia al instante.">
                            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Tipo de transferencia">
                              {["Pago Móvil", "Zelle", "Transferencia"].map((b) => (
                                <button key={b} type="button" role="radio" aria-checked={localBank === b} onClick={() => setLocalBank(b)} className={cn("h-12 rounded-xl border text-sm font-medium transition-colors", localBank === b ? "border-burgundy bg-burgundy text-champagne" : "border-wine/20 hover:border-wine")}>
                                  {b}
                                </button>
                              ))}
                            </div>
                          </WalletPanel>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </fieldset>
              )}
            </motion.div>
          </AnimatePresence>

          {!(step === 2 && (pay === "apple" || pay === "paypal")) && (
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
                disabled={processing}
                className="group relative flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-burgundy px-10 text-xs font-semibold uppercase tracking-[0.24em] text-champagne disabled:cursor-wait"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-wine transition-transform duration-500 ease-lux group-hover:scale-x-100" />
                <span className="relative flex items-center gap-3">
                  {processing ? (
                    <><Spinner /> Autorizando…</>
                  ) : step === 2 ? (
                    <><LockIcon width={14} height={14} /> {pay === "local" ? "Apartar y recibir datos" : `Pagar ${formatPrice(checkoutTotals.total)}`}</>
                  ) : (
                    <>Continuar a {STEPS[step + 1].toLowerCase()} <ArrowIcon width={14} height={14} /></>
                  )}
                </span>
              </button>
            </div>
          )}

          <p className="mt-8 flex items-center justify-center gap-2 text-[11px] text-maroon/60 sm:justify-end">
            <LockIcon width={12} height={12} /> Cifrado TLS de 256 bits · Pasarela con certificación PCI DSS (demo)
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

function WalletPanel({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-wine/10 bg-sand/20 p-6 md:p-8">
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-maroon/75">{body}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Spinner({ dark }: { dark?: boolean }) {
  return <span aria-label="Procesando" className={cn("h-4 w-4 animate-spin rounded-full border-2 border-t-transparent", dark ? "border-[#003087]" : "border-current")} />;
}

function Confirmation({ order }: { order: { id: string; total: number; email: string } }) {
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
        <h1 className="mt-4 font-serif text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.95]">
          Ya es <em className="text-burgundy">tuya.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-maroon/80">
          Enviamos la confirmación a <span className="font-medium text-wine">{order.email || "el correo de tu billetera"}</span>. Ya estamos preparando tu pedido.
        </p>
        <p className="mt-6 font-serif text-3xl tabular-nums">{formatPrice(order.total)}</p>
        <a href="#top" className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-burgundy px-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne hover:bg-wine">
          Volver a la tienda <ArrowIcon width={14} height={14} />
        </a>
      </motion.div>
    </div>
  );
}
