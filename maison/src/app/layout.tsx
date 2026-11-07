import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
  variable: "--font-bodoni",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aurèle | Collection Nº 07, numbered luxury womenswear",
  description:
    "Aurèle makes numbered, never-restocked womenswear. Silk slip dresses, sculpted tailoring and cashmere in editions of 200 or fewer.",
  openGraph: {
    title: "Aurèle | Not for everyone.",
    description: "Collection Nº 07. Numbered pieces, never restocked.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#3B010B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${manrope.variable}`}>
      <body>
        <a href="#main" className="sr-only z-[300] rounded-full bg-sand px-5 py-3 text-wine focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
