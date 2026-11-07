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
  title: "Otra Pinta",
  description:
    "Otra Pinta: numbered, never-restocked womenswear. Follow @otrapintapzo on Instagram.",
  openGraph: {
    title: "Otra Pinta | Not for everyone.",
    description: "Numbered pieces, never restocked.",
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
