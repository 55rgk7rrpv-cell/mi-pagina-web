"use client";

import { motion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts content in when it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

const lineVariants: Variants = {
  hidden: { y: "110%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 1.1, ease, delay: i * 0.09 } }),
};

/** Masked line-by-line headline reveal. Each item in `lines` is one masked row. */
export function SplitHeading({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
  immediate = false,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  immediate?: boolean;
}) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            custom={i + delay * 10}
            variants={lineVariants}
            initial="hidden"
            {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } })}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
