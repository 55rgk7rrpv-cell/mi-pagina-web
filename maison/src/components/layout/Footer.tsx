import { whatsappChat, WHATSAPP_VISIBLE } from "@/lib/tienda";

// Only real places on the page and real shop rules (no pages that do not exist)
const COLS: { title: string; items: { label: string; href?: string }[] }[] = [
  { title: "Otra Pinta", items: [{ label: "La colección", href: "#collection" }, { label: "Lookbook", href: "#lookbook" }, { label: "El Círculo", href: "#inner-circle" }] },
  {
    title: "Atención",
    items: [{ label: "Solo Puerto Ordaz" }, { label: "Delivery $5 · gratis desde $80" }, { label: "Retiro en persona gratis" }, { label: "Pago Móvil o efectivo" }],
  },
];

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-wine px-5 pb-10 pt-24 text-champagne md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="font-serif text-3xl leading-tight md:text-4xl">
              Pocas piezas,
              <br />
              <em className="text-sand">para pocas.</em>
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-champagne/60">
              Prendas elegidas una a una, con pocas unidades por talla. Escríbenos por WhatsApp o Instagram para cualquier duda.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.24em] text-sand">{c.title}</h3>
              <ul className="mt-5 space-y-3">
                {c.items.map((i) => (
                  <li key={i.label}>
                    {i.href ? (
                      <a href={i.href} className="text-sm text-champagne/80 transition-colors hover:text-champagne">
                        {i.label}
                      </a>
                    ) : (
                      <span className="text-sm text-champagne/60">{i.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.24em] text-sand">Escríbenos</h3>
            <a
              href={whatsappChat("Hola Otra Pinta, quiero hacer una consulta.") ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 flex items-center gap-3 text-sm text-champagne/80 transition-colors hover:text-sand"
            >
              <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.6L3 21Z" /><path d="M9 9.5c.3 2 2.6 4.6 5.5 5.5l1.2-1.4-1.9-1-.8.7a5 5 0 0 1-1.9-1.9l.7-.8-1-1.9L9 9.5Z" /></svg>
              {WHATSAPP_VISIBLE}
            </a>
            <a
              href="https://www.instagram.com/otrapintapzo/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-3 text-sm text-champagne/80 transition-colors hover:text-sand"
            >
              <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></svg>
              @otrapintapzo
            </a>
          </div>
        </div>

        <p
          aria-hidden
          className="mt-24 select-none whitespace-nowrap text-center font-serif text-[13vw] leading-[0.85] tracking-[0.02em] text-transparent [-webkit-text-stroke:1px_rgba(242,217,160,0.35)]"
        >
          OTRA PINTA
        </p>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-sand/15 pt-6 text-[11px] uppercase tracking-[0.2em] text-champagne/50 md:flex-row">
          <span>© {new Date().getFullYear()} Otra Pinta</span>
          <span>Puerto Ordaz · Venezuela</span>
          <span>Precios en dólares · Pago Móvil o efectivo</span>
        </div>
      </div>
    </footer>
  );
}
