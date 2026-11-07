import Link from "next/link";

const COLS = [
  { title: "Maison", items: ["Our Atelier", "Craftsmanship", "Sustainability", "Careers"] },
  { title: "Client Care", items: ["Shipping & Returns", "Size Guide", "Private Appointments", "Contact"] },
  { title: "Follow", items: ["Instagram", "Pinterest", "TikTok", "Journal"] },
];

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-wine px-5 pb-10 pt-24 text-champagne md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="font-serif text-3xl leading-tight md:text-4xl">
              Made in small numbers,
              <br />
              <em className="text-sand">for the few.</em>
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-champagne/60">
              Every Aurèle piece is numbered, made in a single run, and never restocked.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.24em] text-sand">{c.title}</h3>
              <ul className="mt-5 space-y-3">
                {c.items.map((i) => (
                  <li key={i}>
                    <Link href="/" className="text-sm text-champagne/70 transition-colors hover:text-sand">
                      {i}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p
          aria-hidden
          className="mt-24 select-none text-center font-serif text-[22vw] leading-[0.8] tracking-[0.04em] text-transparent [-webkit-text-stroke:1px_rgba(242,217,160,0.35)]"
        >
          AURÈLE
        </p>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-sand/15 pt-6 text-[11px] uppercase tracking-[0.2em] text-champagne/50 md:flex-row">
          <span>© {new Date().getFullYear()} Aurèle Maison</span>
          <span>Paris · Milan · Caracas</span>
          <span>Privacy · Terms · Accessibility</span>
        </div>
      </div>
    </footer>
  );
}
