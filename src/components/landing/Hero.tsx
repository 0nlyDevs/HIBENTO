"use client";

import { useEffect, useRef } from "react";
import { heroContent } from "@/data/hero";
import { useLiveSessionCount } from "@/lib/hooks/useLiveSessions";
import CTAButton from "../ui/CTAButton";
import CircleVideo from "../circle-style/CircleVideo";
import CircleDot from "../circle-style/CircleDot";
import DoubleCircle from "../circle-style/DoubleCircle";
import DoubleCircle2 from "../circle-style/DoubleCircle2";

function LiveClock() {
  const timeRef = useRef<HTMLSpanElement>(null);
  const { data: liveSessionCount = 0 } = useLiveSessionCount();

  useEffect(() => {
    const i = setInterval(() => {
      if (timeRef.current) {
        timeRef.current.textContent = new Date().toLocaleTimeString("en-GB");
      }
    }, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="absolute top-[10%] right-[7%] text-right label-mono text-foreground/40 hidden md:block z-10">
      <span ref={timeRef}>{new Date().toLocaleTimeString("en-GB")}</span>
      <br />
      <span className="text-foreground/25">
        {String(liveSessionCount).padStart(2, "0")} sessions · LIVE
      </span>
    </div>
  );
}

export const Hero = () => {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-end pb-12"
    >
      <div className="absolute inset-0 pointer-events-none">
        <CircleVideo />
        <CircleDot />
        <DoubleCircle />
        <DoubleCircle2 />
        <LiveClock />
      </div>

      <div className="px-6 md:px-16 lg:px-20 relative z-10 mt-16">
        <div>
          <h1 className="text-display text-[clamp(1.5rem,6vw,5rem)] text-foreground">
             {heroContent.heading}
             <br />
             <span className="text-accent">{heroContent.subheading}</span>
           </h1>

          <div className="mt-6 md:flex md:items-end md:gap-6">
            <p className="text-base md:text-lg text-foreground/75 max-w-xl leading-relaxed">
              {heroContent.description}
            </p>
            <div className="mt-4 md:mt-0 md:ml-auto shrink-0">
              <CTAButton
                as="a"
                href="#product"
                label={heroContent.cta.secondary}
                color="var(--color-accent)"         
                textColor="var(--color-background)"
                textClassName=""
                className="label-mono border font-semibold border-border lift squish"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
