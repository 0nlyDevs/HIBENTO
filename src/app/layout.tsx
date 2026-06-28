import type { Metadata } from "next";
import { Manrope, Sora, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { NavSelector, MainWrapper } from "@/components/layouts/NavSelector";
import DotGrid from "@/components/circle-style/DotGrid";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from '@vercel/speed-insights/next';


const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HiBento",
  description: "Events should feel alive.",
  icons: [{ rel: "icon", url: "/images/brand/logo.svg", type: "image/svg+xml" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", manrope.variable, sora.variable, "font-sans", geist.variable)} data-scroll-behavior="smooth">
      <body className="min-h-screen overflow-x-hidden">
        <Script
          id="scroll-reset"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration = "manual"; window.scrollTo(0, 0);`,
          }}
        />
        <SpeedInsights />
        <Analytics />
        <ProgressBar />
        <DotGrid />
        <NavSelector />
        <Providers>
          <MainWrapper>{children}</MainWrapper>
        </Providers>
      </body>
    </html>
  );
}
