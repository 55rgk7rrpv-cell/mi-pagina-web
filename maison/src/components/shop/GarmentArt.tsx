"use client";

import { useId } from "react";
import type { Silhouette, Tone } from "@/lib/products";

/**
 * Generative editorial artwork for each piece.
 * "still" is the studio shot; "look" is a cropped, moodier lookbook frame
 * used for the hover swap. Swap for photography via `product.images`.
 */

const TONES: Record<Tone, { bg: [string, string]; fabric: [string, string, string]; line: string; arch: string; ink: string }> = {
  noir: {
    bg: ["#3B010B", "#560B18"],
    fabric: ["#c9a35c", "#F2D9A0", "#fff3d6"],
    line: "rgba(59,1,11,.35)",
    arch: "rgba(242,217,160,.08)",
    ink: "rgba(242,217,160,.12)",
  },
  ivory: {
    bg: ["#F2E5C6", "#ead6ab"],
    fabric: ["#3B010B", "#75162D", "#a33a52"],
    line: "rgba(242,229,198,.25)",
    arch: "rgba(117,22,45,.07)",
    ink: "rgba(117,22,45,.09)",
  },
  garnet: {
    bg: ["#75162D", "#560B18"],
    fabric: ["#e6d3a8", "#F2E5C6", "#ffffff"],
    line: "rgba(117,22,45,.3)",
    arch: "rgba(242,229,198,.08)",
    ink: "rgba(242,229,198,.1)",
  },
};

interface Shape {
  body: string;
  strokes?: string[];
  dots?: [number, number, number][];
  /** focus point for the lookbook crop */
  focus: [number, number];
}

const SHAPES: Record<Silhouette, Shape> = {
  slip: {
    body: "M160 150 Q200 166 240 150 L236 205 Q262 320 305 455 Q200 480 95 455 Q138 320 164 205 Z",
    strokes: ["M168 152 L180 70", "M232 152 L220 70", "M190 232 Q178 340 156 458", "M214 232 Q228 340 252 462", "M200 240 Q202 350 204 470"],
    focus: [200, 190],
  },
  gown: {
    body: "M150 120 Q175 108 200 122 Q225 108 250 120 L246 230 Q252 300 270 380 Q300 440 340 470 L60 470 Q100 440 130 380 Q148 300 154 230 Z",
    strokes: ["M160 225 Q200 238 240 225", "M185 240 Q175 360 120 468", "M218 240 Q232 360 300 470"],
    focus: [200, 160],
  },
  blazer: {
    body: "M200 95 L150 100 Q118 108 110 130 L95 330 L120 335 L128 200 L132 410 Q200 425 268 410 L272 200 L280 335 L305 330 L290 130 Q282 108 250 100 Z",
    strokes: ["M160 102 L186 182 L200 262", "M240 102 L214 182 L200 262", "M186 182 L172 176", "M214 182 L228 176", "M200 262 L200 415", "M150 300 L178 300"],
    dots: [[200, 300, 5], [200, 340, 5]],
    focus: [200, 180],
  },
  cropped: {
    body: "M200 120 L152 124 Q118 132 112 156 L92 330 L118 334 L130 220 L132 330 Q200 344 268 330 L270 220 L282 334 L308 330 L288 156 Q282 132 248 124 Z",
    strokes: ["M168 124 Q200 168 232 124", "M200 160 L200 336", "M132 318 Q200 332 268 318"],
    dots: [[188, 200, 4], [212, 200, 4], [188, 250, 4], [212, 250, 4]],
    focus: [200, 170],
  },
  coat: {
    body: "M200 80 L148 86 Q112 96 104 122 L84 360 L110 366 L124 200 L118 465 Q200 480 282 465 L276 200 L290 366 L316 360 L296 122 Q288 96 252 86 Z",
    strokes: ["M158 88 L190 200 L228 465", "M242 88 L212 180", "M122 250 L278 250", "M122 262 L278 262", "M230 256 L250 300"],
    focus: [200, 140],
  },
  trench: {
    body: "M200 80 L150 86 Q114 96 106 122 L88 360 L112 366 L126 200 L114 468 Q200 482 286 468 L274 200 L288 366 L312 360 L294 122 Q286 96 250 86 Z",
    strokes: ["M160 88 L186 160 L176 200", "M240 88 L214 160 L224 200", "M124 230 L276 230", "M124 242 L276 242", "M200 160 L200 470", "M106 150 Q150 170 160 130"],
    dots: [[182, 200, 4], [218, 200, 4], [182, 290, 4], [218, 290, 4], [182, 380, 4], [218, 380, 4]],
    focus: [200, 150],
  },
  knit: {
    body: "M200 120 Q170 120 150 110 Q115 120 100 150 L70 330 Q80 340 98 336 L128 210 L130 400 Q200 412 270 400 L272 210 L302 336 Q320 340 330 330 L300 150 Q285 120 250 110 Q230 120 200 120 Z",
    strokes: ["M150 110 Q200 140 250 110", "M132 384 Q200 396 268 384", "M132 372 Q200 384 268 372", "M76 316 L98 322", "M324 316 L302 322"],
    focus: [200, 150],
  },
  ribbed: {
    body: "M178 92 L222 92 L224 118 Q258 126 268 150 L290 340 L270 344 L258 210 L262 410 Q200 420 138 410 L142 210 L130 344 L110 340 L132 150 Q142 126 176 118 Z",
    strokes: ["M160 160 L158 405", "M180 160 L178 412", "M200 160 L200 414", "M220 160 L222 412", "M240 160 L242 405", "M178 104 L222 104"],
    focus: [200, 140],
  },
  corset: {
    body: "M135 150 Q165 126 200 150 Q235 126 265 150 L262 300 Q230 318 200 332 Q170 318 138 300 Z",
    strokes: ["M158 142 L156 310", "M178 148 L178 322", "M200 152 L200 330", "M222 148 L222 322", "M242 142 L244 310"],
    focus: [200, 220],
  },
  trouser: {
    body: "M140 90 L260 90 L262 120 Q290 280 312 460 L215 465 L200 190 L185 465 L88 460 Q110 280 138 120 Z",
    strokes: ["M139 118 L261 118", "M165 130 Q150 300 136 460", "M235 130 Q250 300 264 460", "M200 118 L200 190"],
    focus: [200, 150],
  },
  bag: {
    body: "M110 200 L290 200 Q300 200 300 212 L310 400 Q310 420 290 420 L110 420 Q90 420 90 400 L100 212 Q100 200 110 200 Z",
    strokes: ["M100 214 L300 214 L282 292 Q200 322 118 292 Z", "M146 200 Q146 104 200 104 Q254 104 254 200"],
    dots: [[200, 300, 11]],
    focus: [200, 280],
  },
  pendant: {
    body: "M200 250 Q236 306 200 352 Q164 306 200 250 Z",
    strokes: ["M110 40 Q140 200 196 246", "M290 40 Q260 200 204 246"],
    dots: [[200, 246, 6]],
    focus: [200, 300],
  },
};

export function GarmentArt({
  silhouette,
  tone,
  variant = "still",
  label,
  className,
}: {
  silhouette: Silhouette;
  tone: Tone;
  variant?: "still" | "look";
  label?: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const t = TONES[tone];
  const s = SHAPES[silhouette];
  const look = variant === "look";
  const [fx, fy] = s.focus;
  // Lookbook frame: zoom into the focus point for an editorial crop.
  const transform = look ? `translate(${200 - fx * 1.9} ${250 - fy * 1.9}) scale(1.9)` : undefined;
  const strokeW = silhouette === "pendant" ? 2 : 2.2;

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor={look ? t.bg[1] : t.bg[0]} />
          <stop offset="1" stopColor={look ? t.bg[0] : t.bg[1]} />
        </linearGradient>
        <linearGradient id={`fab-${uid}`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor={t.fabric[0]} />
          <stop offset="0.42" stopColor={t.fabric[1]} />
          <stop offset="0.52" stopColor={t.fabric[2]} />
          <stop offset="0.62" stopColor={t.fabric[1]} />
          <stop offset="1" stopColor={t.fabric[0]} />
        </linearGradient>
        <radialGradient id={`light-${uid}`} cx={look ? "0.75" : "0.5"} cy={look ? "0.15" : "0.3"} r="0.8">
          <stop offset="0" stopColor="#F2D9A0" stopOpacity={look ? 0.32 : 0.18} />
          <stop offset="1" stopColor="#F2D9A0" stopOpacity="0" />
        </radialGradient>
        <filter id={`shadow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#1a0005" floodOpacity="0.45" />
        </filter>
      </defs>

      <rect width="400" height="500" fill={`url(#bg-${uid})`} />
      <rect width="400" height="500" fill={`url(#light-${uid})`} />

      {look ? (
        <>
          <line x1="0" y1="380" x2="400" y2="340" stroke={t.ink} strokeWidth="1" />
          <circle cx="320" cy="110" r="120" fill="none" stroke={t.ink} strokeWidth="1" />
        </>
      ) : (
        <>
          <path d="M70 500 L70 190 A130 130 0 0 1 330 190 L330 500 Z" fill={t.arch} />
          <ellipse cx="200" cy="476" rx="140" ry="12" fill="#000" opacity="0.18" />
        </>
      )}

      <g transform={transform} filter={`url(#shadow-${uid})`}>
        <path d={s.body} fill={`url(#fab-${uid})`} />
        {s.strokes?.map((d) => (
          <path key={d} d={d} fill="none" stroke={silhouette === "pendant" ? t.fabric[1] : t.line} strokeWidth={strokeW} strokeLinecap="round" />
        ))}
        {s.dots?.map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={t.fabric[2]} stroke={t.line} strokeWidth="1.5" />
        ))}
      </g>

      {look && (
        <text x="24" y="476" fill={t.fabric[1]} opacity="0.75" fontSize="13" letterSpacing="4" fontFamily="var(--font-manrope), sans-serif">
          LOOKBOOK · Nº07
        </text>
      )}
    </svg>
  );
}
