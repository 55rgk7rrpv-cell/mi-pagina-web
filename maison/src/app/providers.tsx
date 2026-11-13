"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ShopProvider } from "@/context/ShopContext";
import { LazyOverlays } from "@/components/LazyOverlays";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ShopProvider>
        {children}
        <LazyOverlays />
        <CustomCursor />
        <SmoothScroll />
      </ShopProvider>
    </MotionConfig>
  );
}
