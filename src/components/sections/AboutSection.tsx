"use client"

import Link from "next/link";
import { useEffect, useRef } from "react";

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("is-visible");
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .about-section.is-visible .about-anim-headline { opacity: 1; transform: translateY(0); }
        .about-section.is-visible .about-anim-cols { opacity: 1; transform: translateY(0); }
        .about-section.is-visible .about-anim-cta { opacity: 1; transform: translateY(0); }
      `}</style>

      <section
        id="about"
        ref={sectionRef}
        className="about-section relative min-h-screen flex items-start md:items-center overflow-hidden border-t border-white/5 snap-start"
      >
        <div className="relative z-10 w-full max-w-420 mx-auto px-12 sm:px-16 lg:px-28 py-16 md:py-20 lg:py-24 flex flex-col items-center gap-10 md:gap-14 lg:gap-16">
          <h2 style={{ transform: "scaleX(1.08) scaleY(0.9)" }} className="about-anim-headline font-sans font-black text-center text-white leading-[1.08] opacity-0 translate-y-7 transition-all duration-700 text-[clamp(1.5rem,4vw,3.5rem)] max-w-full">
            <span className="font-light">Hi</span>Bento is your event companion. Discover events, browse schedules, register in one tap, attend sessions online, ask questions live...all in one place
          </h2>

          <div className="about-anim-cols grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 w-full opacity-0 translate-y-5 transition-all duration-700 delay-200">
            <div>
              <p className="font-sans text-lg md:text-xl leading-relaxed text-white/75">
                <strong className="text-white font-medium">Discover &amp; Attend:</strong> Find events near you or anywhere in Madagascar. Browse full schedules, register in one tap, and join online sessions with zero friction — no repeated sign-ups, no hassle.
              </p>
            </div>
            <div>
              <p className="font-sans text-lg md:text-xl leading-relaxed text-white/75">
                <strong className="text-white font-medium">Engage &amp; Curate:</strong> Ask questions live during sessions, save your favourite events, and craft your perfecgt day — just like a Japanese bento, pick your favourite sessions and take them with you.
              </p>
            </div>
          </div>

          <div className="about-anim-cta opacity-0 translate-y-4 transition-all duration-700 delay-400">
            <Link
              href="/events"
              style={{ transform: "scaleX(1.08) scaleY(0.9)" }}
              className="group mt-5 text-lg sm:text-xl md:text-2xl inline-flex items-center gap-2 sm:gap-3.5 border-2 border-white rounded-2xl px-5 sm:px-8 md:px-10 py-2.5 sm:py-4 md:py-4.5 font-sans font-bold uppercase text-white bg-transparent cursor-pointer transition-all duration-300 hover:bg-primary hover:text-dark-gray hover:border-primary no-underline"
            >
              Browse Events
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;
