"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/format";
import { CheckIcon } from "@/components/ui/Icons";

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  id: string;
  label: string;
  error?: string;
  valid?: boolean;
  adornment?: ReactNode;
  className?: string;
}

/** Floating-label input with inline validation states. */
export function Field({ id, label, error, valid, adornment, className, ...props }: FieldProps) {
  return (
    <div className={className}>
      <div
        className={cn(
          "group relative rounded-2xl border bg-champagne/60 transition-colors duration-300",
          error ? "border-burgundy bg-burgundy/[0.04]" : "border-wine/15 focus-within:border-wine hover:border-wine/35",
        )}
      >
        <input
          id={id}
          placeholder=" "
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className="peer h-[3.75rem] w-full rounded-2xl bg-transparent px-4 pb-2 pt-6 text-[15px] text-wine outline-none placeholder:text-transparent"
          {...props}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-maroon/65 transition-all duration-300 ease-lux peer-focus:top-4 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.18em] peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.18em]"
        >
          {label}
        </label>
        <span className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {adornment}
          <AnimatePresence>
            {valid && !error && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex h-5 w-5 items-center justify-center rounded-full bg-burgundy text-champagne">
                <CheckIcon width={12} height={12} strokeWidth={2.2} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-err`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-2 pt-1.5 text-xs text-burgundy"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
