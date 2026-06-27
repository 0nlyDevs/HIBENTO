"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    title: "Live Q&A",
    img: "/images/cards/card-1.webp",
    desc: "Ask questions in real time during sessions. Speakers see them instantly and can respond on the spot.",
  },
  {
    title: "Smart Schedule",
    img: "/images/cards/card-2.webp",
    desc: "Build your perfect day. Pick sessions, get reminders, and never miss a talk that matters to you.",
  },
  {
    title: "One-Tap Register",
    img: "/images/cards/card-3.webp",
    desc: "Skip the forms. Register for any event with a single tap — your profile travels with you.",
  },
];

const WhatsNewSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    if (isMobile()) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;

    let ctx: gsap.Context | null = null;

    const init = () => {
      if (isMobile()) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=3000",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const spreads = [
          { x: -160, y: 15, rotate: -10 },
          { x: -70, y: -10, rotate: -2 },
          { x: 20, y: -45, rotate: 7 },
        ];

        cards.forEach((card, i) => {
          const pos = spreads[i];
          const t = i * 2.0;

          tl.fromTo(
            card,
            {
              x: "-50%",
              y: window.innerHeight + 500,
              rotate: 0,
              scale: 0.96,
            },
            {
              x: pos.x,
              y: pos.y,
              rotate: pos.rotate,
              scale: 1,
              z: i * 40,
              duration: 2.0,
              ease: "power2.out",
              force3D: true,
            },
            t,
          );
        });

        tl.to({}, { duration: 0.5 });
      }, sectionRef);
    };

    const handleResize = () => {
      if (isMobile()) {
        if (ctx) {
          ScrollTrigger.getAll().forEach((st) => {
            if (st.vars.trigger === sectionRef.current) st.kill();
          });
          ctx.revert();
          ctx = null;
        }
      } else if (!ctx) {
        init();
      }
    };

    init();

    window.addEventListener("resize", handleResize);

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (sectionRef.current && st.vars.trigger === sectionRef.current) {
          st.kill();
        }
      });
      if (ctx) {
        ctx.revert();
        ctx = null;
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      id="whatsnew"
      ref={sectionRef}
      className="relative bottom-50 sm:bottom-20 overflow-hidden"
    >
      <div className="absolute inset-0" />

      <div className="relative z-10 w-full h-full max-w-420 mx-auto px-4 sm:px-16 lg:px-28 py-16 md:py-20 lg:py-24 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-20 items-start lg:items-center w-full">
          <div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-bold">
              What&apos;s New
            </h2>
            <div className="w-16 h-px bg-primary mt-6 mb-6" />
            <p className="text-white/75 text-base sm:text-lg md:text-xl leading-relaxed max-w-lg">
              Every release brings something fresh. Here&apos;s what landed
              recently — new ways to connect, plan, and make the most of every
              event.
            </p>
          </div>

          <div
            className="relative hidden md:block"
            style={{
              minHeight: 800,
              perspective: "2200px",
              overflow: "visible",
            }}
          >
            {CARDS.map((card, i) => (
              <div
                key={card.title}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="rounded-2xl bg-dark-gray border border-white/15"
                style={{
                  position: "absolute",
                  top: "12%",
                  left: "35%",
                  width: "29rem",
                  height: "34rem",
                  willChange: "transform",
                  zIndex: i + 1,
                  backfaceVisibility: "hidden",
                  transformOrigin: "bottom center",
                  transformStyle: "preserve-3d",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <span className="text-primary text-sm font-bold tracking-widest">
                  0{i + 1}
                </span>
                <h3 className="text-white text-xl sm:text-2xl font-bold">
                  {card.title}
                </h3>
                <div className="relative flex-1 overflow-hidden rounded-xl">
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 29rem"
                  />
                </div>
                <p className="text-white/75 text-sm">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 md:hidden w-full">
            {CARDS.map((card, i) => (
              <div
                key={card.title}
                className="rounded-2xl bg-white/10 border border-white/15"
                style={{
                  padding: "24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <span className="text-primary text-sm font-bold tracking-widest">
                  0{i + 1}
                </span>
                <h3 className="text-white text-xl font-bold">{card.title}</h3>
                <div className="relative w-full aspect-video overflow-hidden rounded-xl">
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <p className="text-white/75 text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsNewSection;
