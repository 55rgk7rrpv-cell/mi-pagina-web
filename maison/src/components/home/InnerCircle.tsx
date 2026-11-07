"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Magnetic } from "@/components/ui/Magnetic";
import { ArrowIcon, CheckIcon } from "@/components/ui/Icons";

export function InnerCircle() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setState(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "done" : "error");
  };

  return (
    <section id="inner-circle" className="relative overflow-hidden bg-champagne px-5 py-28 text-wine md:px-10 md:py-40">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(242,217,160,0.9),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-burgundy">The Inner Circle</p>
        <h2 className="mt-6 font-serif text-[clamp(2.6rem,7vw,6rem)] leading-[0.95]">
          First access. <em className="text-burgundy">Always.</em>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-maroon/80">
          Members see each drop 48 hours early and receive private styling invitations. Join and take 10% off your first piece.
        </p>

        <form onSubmit={submit} noValidate className="mx-auto mt-12 max-w-xl">
          <AnimatePresence mode="wait">
            {state === "done" ? (
              <motion.p
                key="done"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-3 font-serif text-2xl italic text-burgundy"
                role="status"
              >
                <CheckIcon /> Welcome in. Your code is <span className="not-italic font-sans text-base font-semibold tracking-[0.2em]">INNERCIRCLE</span>
              </motion.p>
            ) : (
              <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
                <div className={`flex items-center gap-3 border-b pb-3 transition-colors ${state === "error" ? "border-burgundy" : "border-wine/30 focus-within:border-wine"}`}>
                  <label htmlFor="ic-email" className="sr-only">Email address</label>
                  <input
                    id="ic-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state === "error") setState("idle");
                    }}
                    aria-invalid={state === "error"}
                    aria-describedby={state === "error" ? "ic-err" : undefined}
                    className="min-w-0 flex-1 bg-transparent py-3 text-lg text-wine placeholder:text-maroon/45 focus:outline-none"
                  />
                  <Magnetic>
                    <button type="submit" className="group inline-flex h-12 items-center gap-2 rounded-full bg-burgundy px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne transition-colors hover:bg-wine">
                      Join <ArrowIcon width={14} height={14} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </Magnetic>
                </div>
                {state === "error" && (
                  <p id="ic-err" className="mt-3 text-left text-sm text-burgundy">Enter a valid email, like name@example.com.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}
