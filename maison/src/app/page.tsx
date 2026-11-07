import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Manifesto } from "@/components/home/Manifesto";
import { Lookbook } from "@/components/home/Lookbook";
import { InnerCircle } from "@/components/home/InnerCircle";
import { Collection } from "@/components/shop/Collection";

export default function Home() {
  return (
    <>
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
    </>
  );
}
