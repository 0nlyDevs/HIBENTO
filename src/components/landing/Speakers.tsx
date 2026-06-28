"use client";

import Image from "next/image";
import { Users, Presentation, UserRound, ArrowRight, BadgeCheck } from "lucide-react";
import { Speaker, speakers } from "@/data/speakers";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface SpeakersProps {
  speakers?: Speaker[];
}

const row1Styles: React.CSSProperties[] = [
  { rotate: "-10deg", translate: "0px 50px" },
  { rotate: "-2deg",  translate: "0px -20px" },
  { rotate: "8deg",   translate: "0px 35px" },
];

const row2Styles: React.CSSProperties[] = [
  { rotate: "-12deg", translate: "0px 15px" },
  { rotate: "9deg",   translate: "0px -10px" },
];

function SpeakerCard({ s, i, style }: { s: Speaker; i: number; style: React.CSSProperties }) {
  return (
    <article
      className="group relative squircle-lg overflow-hidden cursor-pointer shadow-deep shrink-0 w-full aspect-280/380 sm:w-50 sm:h-72.5 md:w-60 md:h-85 lg:w-70 lg:h-95"
      style={style}
    >
      {s.image ? (
        <Image
          src={s.image}
          alt={s.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 200px, (max-width: 1024px) 240px, 280px"
          quality={85}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-5xl text-white/80"
          style={{ background: "linear-gradient(135deg, #2D2A32 0%, #3A3740 100%)" }}>
          {s.initials}
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 p-4">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display font-bold text-base text-white leading-tight">{s.name}</h3>
          <BadgeCheck size={14} className="text-accent shrink-0" />
        </div>
        <p className="text-white/70 mt-0.5 text-xs leading-snug">{s.role}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 label-mono text-white/60">
              <Users size={11} />
              {(i + 1) * 47 + 120}
            </span>
            <span className="flex items-center gap-1 label-mono text-white/60">
              <Presentation size={11} />
              {s.sessions ?? 1}
            </span>
          </div>
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white/20 hover:bg-accent hover:text-accent-foreground text-white transition-all duration-200 backdrop-blur-sm"
            aria-label="View profile"
          >
            <UserRound size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}

export const Speakers = ({ speakers: propSpeakers }: SpeakersProps) => {
  const all = propSpeakers || speakers;
  const row1 = all.slice(0, 3);
  const row2 = all.slice(3, 5);

  const { data: speakerData } = useQuery({
    queryKey: ["speakers-count"],
    queryFn: () => api.getSpeakers({ page: 1, limit: 1 }),
    enabled: !propSpeakers,
  });
  const total = propSpeakers ? all.length : (speakerData?.pagination.total ?? all.length);

  return (
    <section id="speakers" className="relative py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 lg:px-20 relative">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <p className="label-mono text-accent mb-6">§ 04 Speakers</p>
            <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] text-foreground">
              Faces of the room.
            </h2>
          </div>
          <p className="max-w-sm text-foreground/70 leading-relaxed">
            Every speaker gets a page. Bio, sessions, the questions the crowd asked them. Nothing
            to set up. It generates itself.
          </p>
        </div>

        <div className="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
          {all.slice(0, 5).map((s, i) => (
            <SpeakerCard key={s.name} s={s} i={i} style={{}} />
          ))}
          <Link
            href="/speakers"
            className="flex items-center justify-center gap-3 w-36 h-36 rounded-full bg-accent hover:brightness-110 transition-all duration-300 shadow-deep"
          >
            <ArrowRight size={26} className="text-charcoal" />
            <span className="label-mono text-charcoal font-bold text-[0.65rem] text-center leading-tight">
              {total} speakers
            </span>
          </Link>
        </div>

        <div className="hidden md:flex flex-col items-center gap-28">
          <div className="flex items-start justify-center gap-10 lg:gap-20">
            {row1.map((s, i) => (
              <SpeakerCard key={s.name} s={s} i={i} style={row1Styles[i]} />
            ))}
          </div>

          <div className="flex items-start justify-center gap-10 lg:gap-20">
            {row2.map((s, i) => (
              <SpeakerCard key={s.name} s={s} i={i + 3} style={row2Styles[i]} />
            ))}

            <div
              className="shrink-0 flex items-center justify-center w-60 h-85 lg:w-70 lg:h-95"
              style={{ rotate: "6deg", translate: "0px -25px" }}
            >
              <Link
                href="/speakers"
                className="group flex flex-col items-center justify-center gap-3 w-36 h-36 rounded-full bg-accent hover:brightness-110 transition-all duration-300 shadow-deep"
              >
                <ArrowRight size={26} className="text-charcoal" />
                <span className="label-mono text-charcoal font-bold text-[0.65rem] text-center leading-tight">
                  {total} speakers
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
