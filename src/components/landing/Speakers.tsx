"use client";

import { useReveal } from "@/hooks/useReveal";
import { Speaker, speakers } from "@/data/speakers";

interface SpeakersProps {
  speakers?: Speaker[];
}

export const Speakers = ({ speakers: propSpeakers }: SpeakersProps) => {
  const ref = useReveal<HTMLDivElement>();
  const displaySpeakers = propSpeakers || speakers;
  return (
    <section id="speakers" className="relative py-28 md:py-40 overflow-hidden">
      <div className="container mx-auto relative">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <p className="label-mono text-accent mb-6">§ 04 — Speakers</p>
            <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] text-foreground">
              Faces of the room.
            </h2>
          </div>
          <p className="max-w-sm text-foreground/70 leading-relaxed">
            Every speaker gets a page. Bio, sessions, the questions the crowd asked them. Nothing
            to set up — it generates itself.
          </p>
        </div>

        <div ref={ref} className="reveal-up grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {displaySpeakers.map((s, i) => (
            <article
              key={i}
              className="group squircle bg-glass border border-border p-6 md:p-7 hover:border-accent cursor-pointer lift"
            >
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center font-display font-bold text-2xl md:text-3xl mb-5 transition-transform group-hover:scale-110 group-hover:rotate-3 ${s.tone}`}
              >
                {s.initials}
              </div>
              <p className="label-mono text-foreground/45 mb-1">SPEAKER · 0{i + 1}</p>
              <h3 className="font-display font-bold text-xl md:text-2xl text-foreground">{s.name}</h3>
              <p className="text-foreground/65 mt-1 text-sm">{s.role}</p>
              <p className="label-mono text-accent mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
                View page →
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
