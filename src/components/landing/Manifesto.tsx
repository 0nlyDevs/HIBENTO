"use client";

import Image from "next/image";
import { useReveal } from "@/hooks/useReveal";
import { ManifestoCard, manifestoCards } from "@/data/manifesto";

interface ManifestoProps {
  cards?: ManifestoCard[];
}

export const Manifesto = ({ cards: propCards }: ManifestoProps) => {
  const displayCards = propCards || manifestoCards;
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="product" className="relative py-28 md:py-40 overflow-hidden">
      <div className="container mx-auto">
        <p className="label-mono text-accent mb-6">§ 01 — Why HiBento</p>
        <div ref={ref} className="reveal-up max-w-5xl mx-auto">
          <h2 className="text-display text-[clamp(2.5rem,7vw,6rem)] text-foreground">
            Events should feel
            <br />
            <span className="text-accent">alive.</span> Not like a PDF.
          </h2>
          <p className="mt-8 max-w-xl text-foreground/70 text-lg leading-relaxed">
            HiBento turns any gathering into a live screen everyone shares — speakers, organisers,
            and the crowd, on the same page. Literally.
          </p>

          <div className="mt-16 grid md:grid-cols-3 gap-5 items-end">
            {displayCards.map((c, i) => (
              <div
                key={c.tag}
                className={`${c.bg} lift overflow-hidden flex flex-col${
                  i === 0 ? " md:-rotate-3" :
                  i === 1 ? " md:-translate-y-8" :
                  " md:rotate-3"
                }`}
                style={{ borderRadius: "1.75rem" }}
              >
                {/* Text area */}
                <div className="p-6 pb-4">
                  <span className="label-mono text-charcoal/50 block mb-3">{c.tag}</span>
                  <h3 className="font-display text-2xl text-charcoal font-bold leading-tight">{c.title}</h3>
                  <p className="mt-2 text-charcoal/70 text-sm leading-relaxed">{c.body}</p>
                </div>
                {/* Image */}
                <div className="mx-4 mb-4 relative overflow-hidden" style={{ borderRadius: "1rem", minHeight: "180px" }}>
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
