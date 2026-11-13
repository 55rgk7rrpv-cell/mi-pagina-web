
const COLS = [
  { title: "Otra Pinta", items: ["La colección", "Lookbook", "El Círculo"] },
  { title: "Atención", items: ["Delivery y envíos", "Guía de tallas", "Pago Móvil y efectivo", "Contacto por Instagram"] },
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
              Prendas elegidas una a una, con pocas unidades por talla. Escríbenos por Instagram para cualquier duda.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.24em] text-sand">{c.title}</h3>
              <ul className="mt-5 space-y-3">
                {c.items.map((i) => (
                  <li key={i}>
                    <span className="text-sm text-champagne/70">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.24em] text-sand">Síguenos</h3>
            <a
              href="https://www.instagram.com/otrapintapzo/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-3 text-sm text-champagne/80 transition-colors hover:text-sand"
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
          <span>Privacidad · Términos · Accesibilidad</span>
        </div>
      </div>
    </footer>
  );
}
