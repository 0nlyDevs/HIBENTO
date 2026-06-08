"use client";

import { useEffect, useState } from "react";
import { heroContent } from "@/data/hero";
import CTAButton from "../ui/CTAButton";

export const Hero = () => {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    setTime(new Date());
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col justify-end overflow-hidden pt-24 pb-12"
    >
      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute top-[24%] right-[7%] text-right label-mono text-foreground/40 hidden md:block">
          {time ? time.toLocaleTimeString("en-GB") : ""}
          <br />
          <span className="text-foreground/25">04 ROOMS · LIVE</span>
        </div>
      </div>

      <div className="container mx-auto relative z-10 mt-16">
        <div className="mmx-auto">
          <h1 className="text-display text-[clamp(2rem,10vw,9rem)] text-foreground">
             {heroContent.heading}
             <br />
             <span className="text-accent">{heroContent.subheading}</span>
           </h1>

          <div className="mt-8 grid md:grid-cols-3 gap-8 items-end">
            <p className="md:col-span-2 text-lg md:text-xl text-foreground/75 max-w-xl leading-relaxed">
              {heroContent.description}
            </p>
            <div className="flex md:justify-end gap-3">
              <CTAButton
                as="a"
                href="/events"
                label={heroContent.cta.secondary}
                color="var(--color-accent)"         
                textColor="var(--color-background)"
                textClassName=""
                className="label-mono border font-semibold border-border lift squish"
              />
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-border flex rotate-2 flex-wrap items-center justify-between label-mono text-foreground/55 gap-4">
          <span>{heroContent.bottomStrip.categories}</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent blink-dot" />
            {heroContent.bottomStrip.liveSessions}
          </span>
        </div>
      </div>
    </section>
  );
};
