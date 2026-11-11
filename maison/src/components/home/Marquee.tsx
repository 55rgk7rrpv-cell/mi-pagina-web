const ITEMS = [
  "Nueva colección",
  "Pocas unidades por talla",
  "Delivery gratis desde $80",
  "Pago Móvil, Zelle y tarjeta",
  "@otrapintapzo",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-sand/20 bg-burgundy py-5" aria-label="Lo esencial de Otra Pinta">
      <ul className="flex w-max animate-marquee gap-12 whitespace-nowrap hover:[animation-play-state:paused]">
        {[...row, ...row].map((item, i) => (
          <li key={i} aria-hidden={i >= ITEMS.length} className="flex items-center gap-12 font-serif text-2xl italic text-champagne md:text-3xl">
            {item}
            <span className="text-base not-italic text-sand">✦</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
