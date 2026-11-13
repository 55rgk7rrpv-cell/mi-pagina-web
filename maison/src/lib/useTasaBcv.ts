"use client";

import { useEffect, useState } from "react";
import { TASA_MAX_DIAS, type TasaBcv } from "./tienda";

/**
 * Reads the BCV rate published next to the page (tasa.json, refreshed every morning by a scheduled task).
 * Returns null while loading, if the file is missing or malformed, or if the rate is older than TASA_MAX_DIAS:
 * in all those cases the checkout shows dollars only and the Bs amount is confirmed by message.
 */
export function useTasaBcv(): TasaBcv | null {
  const [tasa, setTasa] = useState<TasaBcv | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("tasa.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const valor = Number(d?.bsPorDolar);
        const fecha = String(d?.fecha ?? "");
        if (!alive || !(valor > 0) || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return;
        const dias = (Date.now() - Date.parse(fecha + "T12:00:00-04:00")) / 864e5;
        if (dias <= TASA_MAX_DIAS) setTasa({ bsPorDolar: valor, fecha });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return tasa;
}
