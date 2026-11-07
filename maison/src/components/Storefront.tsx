"use client";

import { useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Manifesto } from "@/components/home/Manifesto";
import { Lookbook } from "@/components/home/Lookbook";
import { InnerCircle } from "@/components/home/InnerCircle";
import { Collection } from "@/components/shop/Collection";
import { CheckoutScreen } from "@/components/checkout/CheckoutScreen";

export function Storefront() {
  const { checkoutOpen } = useShop();

  // Switching views: start checkout at the top, and when returning to the
  // shop, land on the section named in the hash (if any).
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const target = !checkoutOpen && id && id !== "top" ? document.getElementById(id) : null;
    requestAnimationFrame(() => {
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    });
  }, [checkoutOpen]);

  if (checkoutOpen) return <CheckoutScreen />;

  return (
    <div id="top">
      <Navbar />
      <main id="main">
        <Hero />
        <Marquee />
        <Collection />
        <Manifesto />
        <Lookbook />
        <InnerCircle />
      </main>
      <Footer />
    </div>
  );
}
