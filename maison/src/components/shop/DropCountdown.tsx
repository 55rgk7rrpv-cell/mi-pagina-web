"use client";

import { useEffect, useState } from "react";

function nextDrop(now: Date) {
  // Drops land every Thursday at 18:00 UTC.
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 18));
  const add = (4 - d.getUTCDay() + 7) % 7;
  d.setUTCDate(d.getUTCDate() + add);
  if (d <= now) d.setUTCDate(d.getUTCDate() + 7);
  return d;
}

export function DropCountdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(nextDrop(new Date()).getTime() - Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts =
    left === null
      ? ["--", "--", "--", "--"]
      : [86400000, 3600000, 60000, 1000].map((unit, i, arr) => {
          const v = i === 0 ? Math.floor(left / unit) : Math.floor((left % arr[i - 1]) / unit);
          return String(v).padStart(2, "0");
        });

  return (
    <div className="flex items-center gap-4" aria-label="Time until the next drop">
      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-burgundy">Next drop in</span>
      <div className="flex gap-3 font-serif text-2xl tabular-nums text-wine md:text-3xl" aria-live="off">
        {parts.map((p, i) => (
          <span key={i} className="flex items-baseline gap-1">
            {p}
            <span className="font-sans text-[10px] uppercase tracking-widest text-maroon/60">{"dhms"[i]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
