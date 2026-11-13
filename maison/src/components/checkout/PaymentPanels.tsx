"use client";

import { useState } from "react";
import { formatPrice, cn } from "@/lib/format";
import { BANCOS, enBolivares, formatBs, PAGO_MOVIL, pagoMovilListo, TASA_BCV } from "@/lib/tienda";
import type { EfectivoDatos, PagoMovilDatos } from "@/lib/pedido";
import { Field } from "./Field";

export type PagoMovilErrors = Partial<Record<keyof PagoMovilDatos, string>>;

/** Without the shop's Pago Móvil data the customer cannot pay yet, so nothing is asked (the shop sends the data by message). */
export function validatePagoMovil(d: PagoMovilDatos): PagoMovilErrors {
  const e: PagoMovilErrors = {};
  if (!pagoMovilListo()) return e;
  if (!d.banco) e.banco = "Elige el banco desde el que pagaste.";
  if (!/^0?4(12|14|16|24|26|22)\d{7}$/.test(d.telefono.replace(/\D/g, "").replace(/^58/, ""))) e.telefono = "Escribe el teléfono con el que pagaste, por ejemplo 0414-1234567.";
  if (!/^\d{4,20}$/.test(d.referencia.replace(/\s/g, ""))) e.referencia = "Escribe el número de referencia que te dio tu banco (solo números).";
  return e;
}

/** Copy-to-clipboard row for one piece of the shop's Pago Móvil data. */
function CopyRow({ label, value }: { label: string; value: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4 border-b border-wine/10 py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-maroon/65">{label}</p>
        <p className="truncate font-medium tabular-nums text-wine">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(value.replace(/^Bs\.\s*/, "")).then(() => {
            setDone(true);
            window.setTimeout(() => setDone(false), 1500);
          });
        }}
        className="shrink-0 rounded-full border border-wine/25 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-wine transition-colors hover:border-wine hover:bg-wine hover:text-champagne"
      >
        {done ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}

export function PagoMovilPanel({
  totalUsd,
  datos,
  onChange,
  errors,
  touched,
  onTouch,
}: {
  totalUsd: number;
  datos: PagoMovilDatos;
  onChange: (d: PagoMovilDatos) => void;
  errors: PagoMovilErrors;
  touched: Partial<Record<string, boolean>>;
  onTouch: (k: string) => void;
}) {
  const bs = enBolivares(totalUsd);
  const listo = pagoMovilListo();
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-wine/10 bg-sand/20 p-6 md:p-8">
        <h3 className="font-serif text-2xl">{listo ? "1. Haz el Pago Móvil" : "Pago Móvil"}</h3>
        <p className="mt-1 text-sm text-maroon/75">{listo ? "Desde la app de tu banco, con estos datos:" : "Confirma tu pedido y te enviamos por mensaje los datos para pagar."}</p>

        <div className="mt-5 rounded-2xl bg-champagne/70 px-5 py-2">
          {bs ? (
            <CopyRow label={`Monto · tasa BCV ${TASA_BCV.bsPorDolar} Bs/$ del ${TASA_BCV.fecha}`} value={formatBs(bs)} />
          ) : (
            <div className="border-b border-wine/10 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-maroon/65">Monto</p>
              <p className="font-medium text-wine">{formatPrice(totalUsd)} a tasa BCV del día</p>
              <p className="text-xs text-maroon/65">Te confirmamos el monto exacto en bolívares por mensaje antes de que pagues.</p>
            </div>
          )}
          {listo ? (
            <>
              <CopyRow label="Banco" value={`${PAGO_MOVIL.codigoBanco} ${PAGO_MOVIL.banco}`} />
              <CopyRow label="Teléfono" value={PAGO_MOVIL.telefono!} />
              <CopyRow label="Cédula / RIF" value={PAGO_MOVIL.documento!} />
            </>
          ) : (
            <p className="py-3 text-sm text-maroon/80">
              Los datos para el Pago Móvil (banco, teléfono y cédula) te los enviamos por mensaje al confirmar tu pedido.
            </p>
          )}
        </div>
      </div>

      {listo && (
      <div className="rounded-3xl border border-wine/10 p-6 md:p-8">
        <h3 className="font-serif text-2xl">2. Cuéntanos de dónde pagaste</h3>
        <p className="mt-1 text-sm text-maroon/75">Con esto verificamos tu pago en el banco.</p>
        <div className="mt-5 space-y-4">
          <div className={cn("relative rounded-2xl border bg-champagne/60 transition-colors", touched["pm-banco"] && errors.banco ? "border-burgundy" : "border-wine/15 hover:border-wine/35 focus-within:border-wine")}>
            <label htmlFor="pm-banco" className="pointer-events-none absolute left-4 top-3 text-[10px] uppercase tracking-[0.18em] text-maroon/65">Banco desde el que pagaste</label>
            <select
              id="pm-banco"
              value={datos.banco}
              onChange={(e) => onChange({ ...datos, banco: e.target.value })}
              onBlur={() => onTouch("pm-banco")}
              aria-invalid={!!(touched["pm-banco"] && errors.banco)}
              className="h-[3.75rem] w-full cursor-pointer appearance-none rounded-2xl bg-transparent px-4 pt-5 text-[15px] text-wine outline-none"
            >
              <option value="">Elige tu banco</option>
              {BANCOS.map((b) => (
                <option key={b.codigo} value={`${b.codigo} ${b.nombre}`}>{b.codigo} · {b.nombre}</option>
              ))}
            </select>
          </div>
          {touched["pm-banco"] && errors.banco && <p className="-mt-2 px-1 text-xs text-burgundy">{errors.banco}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="pm-telefono" label="Teléfono que hizo el pago" type="tel" inputMode="tel" autoComplete="tel"
              value={datos.telefono}
              onChange={(e) => onChange({ ...datos, telefono: e.target.value })}
              onBlur={() => onTouch("pm-telefono")}
              error={touched["pm-telefono"] ? errors.telefono : undefined}
              valid={!errors.telefono}
            />
            <Field
              id="pm-referencia" label="Número de referencia" inputMode="numeric"
              value={datos.referencia}
              onChange={(e) => onChange({ ...datos, referencia: e.target.value.replace(/[^\d]/g, "").slice(0, 20) })}
              onBlur={() => onTouch("pm-referencia")}
              error={touched["pm-referencia"] ? errors.referencia : undefined}
              valid={!errors.referencia}
            />
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export function EfectivoPanel({
  totalUsd,
  datos,
  onChange,
  pickup,
}: {
  totalUsd: number;
  datos: EfectivoDatos;
  onChange: (d: EfectivoDatos) => void;
  pickup: boolean;
}) {
  return (
    <div className="rounded-3xl border border-wine/10 bg-sand/20 p-6 md:p-8">
      <h3 className="font-serif text-2xl">Pagas en efectivo {pickup ? "al retirar" : "al recibir"}</h3>
      <p className="mt-2 max-w-md text-sm text-maroon/75">
        Pagas {formatPrice(totalUsd)} en dólares en efectivo {pickup ? "cuando retires tu pedido" : "cuando el mensajero te entregue tu pedido"}. Te apartamos las prendas apenas confirmemos el pedido por mensaje.
      </p>
      <div className="mt-6 max-w-xs">
        <Field
          id="cash-con" label="¿Con cuánto pagas? (opcional)" inputMode="numeric"
          value={datos.pagaCon}
          onChange={(e) => onChange({ pagaCon: e.target.value.replace(/[^\d]/g, "").slice(0, 5) })}
          adornment={<span className="text-sm text-maroon/60">$</span>}
        />
        <p className="mt-2 px-1 text-xs text-maroon/65">Así llevamos el cambio. Déjalo vacío si pagas exacto.</p>
      </div>
    </div>
  );
}
