"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useShop } from "@/context/ShopContext";

// The bag and the quick view are only needed after a click, so their code is split out of
// the first download. It is fetched when the browser is idle (so the first click is instant)
// or immediately if the visitor opens one before that.
const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer").then((m) => m.CartDrawer), { ssr: false });
const QuickView = dynamic(() => import("@/components/shop/QuickView").then((m) => m.QuickView), { ssr: false });

export function LazyOverlays() {
  const { cartOpen, quickViewId } = useShop();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (ready) return;
    if (cartOpen || quickViewId) return setReady(true);
    const id = window.requestIdleCallback ? window.requestIdleCallback(() => setReady(true), { timeout: 4000 }) : window.setTimeout(() => setReady(true), 2000);
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id) : window.clearTimeout(id));
  }, [ready, cartOpen, quickViewId]);
  if (!ready) return null;
  return (
    <>
      <CartDrawer />
      <QuickView />
    </>
  );
}
