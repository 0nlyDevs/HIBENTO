"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useCardReveal(cardSelector: string, sectionRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
    if (isMobile()) return;

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    let ctx: gsap.Context | null = null;

    const init = () => {
      if (isMobile()) return;
      ctx = gsap.context(() => {
        const cards = sectionEl.querySelectorAll(cardSelector);
        if (!cards.length) return;

        const st = ScrollTrigger.create({
          trigger: sectionEl,
          start: "top 85%",
          end: "bottom 15%",
          scrub: 1,
          invalidateOnRefresh: true,
        });

        const tl = gsap.timeline({ scrollTrigger: st });

        cards.forEach((card, i) => {
          tl.fromTo(
            card,
            {
              y: 80,
              opacity: 0,
              scale: 0.95,
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1.0,
              ease: "power2.out",
            },
            i * 0.15,
          );
        });

        tl.to({}, { duration: 0.3 });
      }, sectionEl);
    };

    init();

    return () => {
      if (ctx) {
        ctx.revert();
        ctx = null;
      }
    };
  }, [sectionRef, cardSelector]);
}
