"use client";

import { useState } from "react";
import { Magnetic } from "@/components/ui/Magnetic";
import { ArrowIcon, CheckIcon } from "@/components/ui/Icons";
import { whatsappChat } from "@/lib/tienda";

/* The shop has no mailing list (no server), so this section only promises what is real:
   the welcome code, and WhatsApp to hear about new pieces. */
export function InnerCircle() {
  const [copied, setCopied] = useState(false);
  const copy = () =>
    navigator.clipboard?.writeText("BIENVENIDA").then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  const wa = whatsappChat("Hola Otra Pinta, quiero enterarme cuando lleguen piezas nuevas.");

  return (
    <section id="inner-circle" className="relative overflow-hidden bg-champagne px-5 py-28 text-wine md:px-10 md:py-40">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(242,217,160,0.9),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-burgundy">El Círculo</p>
        <h2 className="mt-6 font-serif text-[clamp(2.6rem,7vw,6rem)] leading-[0.95]">
          Primero tú. <em className="text-burgundy">Siempre.</em>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-maroon/80">
          En tu primera compra llévate 10% de descuento con este código. Y si quieres enterarte primero cuando lleguen piezas nuevas, escríbenos por WhatsApp.
        </p>

        <div className="mx-auto mt-12 flex max-w-xl flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={copy}
            aria-label="Copiar el código BIENVENIDA"
            className="inline-flex h-14 items-center gap-4 rounded-full border border-dashed border-burgundy/50 bg-white/50 px-7 transition-colors hover:border-burgundy"
          >
            <span className="font-sans text-base font-semibold tracking-[0.3em] text-burgundy">BIENVENIDA</span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-maroon/70" role="status">
              {copied ? (
                <>
                  <CheckIcon width={12} height={12} /> Copiado
                </>
              ) : (
                "Copiar"
              )}
            </span>
          </button>
          {wa && (
            <Magnetic>
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex h-14 items-center gap-2 rounded-full bg-burgundy px-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne transition-colors hover:bg-wine"
              >
                Avísame por WhatsApp <ArrowIcon width={14} height={14} className="transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>
          )}
        </div>
      </div>
    </section>
  );
}
