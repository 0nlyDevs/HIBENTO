"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { CTAConfig, ctaConfig } from "@/data/cta";

interface CTAProps {
  config?: CTAConfig;
}

export const CTA = ({ config: propConfig }: CTAProps) => {
  const displayConfig = propConfig || ctaConfig;
  const ref = useReveal<HTMLDivElement>();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section
      id="cta"
      className="relative py-28 md:py-40 overflow-hidden"
    >

      <div ref={ref} className="reveal-up container mx-auto relative">
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
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@event.com"
            className="flex-1 bg-glass border border-border px-5 py-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent pill"
          />
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
            <div key={s.l} className="squircle bg-glass border border-border p-6">
              <p className="font-display font-bold text-5xl text-accent mb-1">{s.n}</p>
              <p className="label-mono text-foreground/60">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
