"use client";

import Image from "next/image";
import { ManifestoCard, manifestoCards } from "@/data/manifesto";

interface ManifestoProps {
  cards?: ManifestoCard[];
}

export const Manifesto = ({ cards: propCards }: ManifestoProps) => {
  const displayCards = propCards || manifestoCards;
  return (
    <section id="product" className="relative py-28 md:py-40 overflow-hidden">
      <div className="container mx-auto flex flex-col gap-8">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <p className="label-mono text-accent mb-6">§ 01 Why HiBento</p>
            <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] text-foreground max-w-3xl">
              Events should feel
              <br />
              <span className="text-accent">alive.</span> Not like a PDF.
            </h2>
          </div>
          <p className="max-w-sm text-foreground/70 leading-relaxed">
            HiBento turns any gathering into a live screen everyone shares. Speakers, organisers,
            and the crowd, on the same page. Literally.
          </p>
        </div>
        <div className="mx-auto">
          <div className="grid md:grid-cols-3 gap-20">
            {displayCards.map((c, i) => (
              <div
                key={c.tag}
                className={`${c.bg} lift overflow-hidden flex flex-col${
                  i === 0 ? " md:-rotate-5 md:translate-y-30" :
                  i === 1 ? " md:rotate-1 md:-translate-y-4" :
                  " md:rotate-6 md:translate-y-16"
                }`}
                style={{ borderRadius: "1.75rem" }}
              >
                <div className="p-6 pb-4">
                  <span className="label-mono text-charcoal/50 block mb-3">{c.tag}</span>
                  <h3 className="font-display text-2xl text-charcoal font-bold leading-tight">{c.title}</h3>
                  <p className="mt-2 text-charcoal/70 text-sm leading-relaxed">{c.body}</p>
                </div>
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
