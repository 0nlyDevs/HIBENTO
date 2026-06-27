import { Hero } from "@/components/landing/Hero";
import { CTA } from "@/components/landing/CTA";
import { Manifesto } from "@/components/landing/Manifesto";
import { PlanningShowcase } from "@/components/landing/PlanningShowcase";
import { Speakers } from "@/components/landing/Speakers";
import { LiveQA } from "@/components/landing/LiveQA";
import { Footer } from "@/components/landing/Footer";
import { FAQ } from "@/components/landing/FAQ";
import { Marquee } from "@/components/landing/Marquee";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Manifesto />
      <LiveQA />
      <PlanningShowcase />
      <Speakers />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
