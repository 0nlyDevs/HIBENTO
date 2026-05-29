"use client";

import { useState } from "react";
import { CTAConfig, ctaConfig } from "@/data/cta";
import { TypingAnimation } from "@/components/ui/typing-animation";

interface CTAProps {
  config?: CTAConfig;
}

export const CTA = ({ config: propConfig }: CTAProps) => {
  const displayConfig = propConfig || ctaConfig;
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section
      id="cta"
      className="relative py-28 md:py-40 overflow-hidden"
    >

      <div className="container mx-auto relative">
        <p className="label-mono text-accent mb-6">{displayConfig.tagline}</p>
        <h2 className="text-display text-[clamp(3rem,9vw,8rem)] text-foreground leading-[0.95]">
          {displayConfig.heading}
          <br />
          <span className="text-accent">{displayConfig.subheading}</span>
        </h2>
        <p className="mt-8 max-w-xl text-foreground/75 text-lg leading-relaxed">
          {displayConfig.description}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email) return;
            setDone(true);
          }}
          className="mt-10 flex flex-col sm:flex-row gap-3 max-w-2xl"
        >
          <div className="relative flex-1">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full card-glass px-5 py-4 text-foreground focus:outline-none focus:border-accent pill relative z-10 bg-transparent"
            />
            {!email && (
              <div className="absolute inset-0 flex items-center px-5 pointer-events-none">
                <TypingAnimation
                  words={["you@event.com", "organiser@summit.io", "hello@conference.co"]}
                  cursorStyle="underscore"
                  loop
                  duration={70}
                  pauseDelay={2200}
                  className="text-sm font-normal tracking-normal text-foreground/40"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="label-mono pill px-8 py-4 bg-accent text-accent-foreground hover:opacity-90 transition lift squish"
            disabled={!email.trim()}
          >
            {done ? displayConfig.doneText : displayConfig.buttonText}
          </button>
        </form>

        <div className="mt-16 grid sm:grid-cols-3 gap-6">
          {displayConfig.items.map((s) => (
            <div key={s.l} className="squircle card-glass p-6">
              <p className="font-display font-bold text-5xl text-accent mb-1">{s.n}</p>
              <p className="label-mono text-foreground/60">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
