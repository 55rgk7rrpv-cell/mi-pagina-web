"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ShopProvider } from "@/context/ShopContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { QuickView } from "@/components/shop/QuickView";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ShopProvider>
        {children}
        <CartDrawer />
        <QuickView />
        <CustomCursor />
        <SmoothScroll />
      </ShopProvider>
    </MotionConfig>
  );
}
