"use client";

import { useReveal } from "@/hooks/useReveal";
import { Track, Session, tracks, sessions, hours } from "@/data/tracks";

interface PlanningShowcaseProps {
  tracks?: Track[];
  sessions?: Session[];
  hours?: number[];
}

export const PlanningShowcase = ({ 
  tracks: propTracks, 
  sessions: propSessions, 
  hours: propHours 
}: PlanningShowcaseProps) => {
  const displayTracks = propTracks || tracks;
  const displaySessions = propSessions || sessions;
  const displayHours = propHours || hours;
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="planning" className="relative py-28 md:py-40 overflow-hidden">
      <div className="container mx-auto relative">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <p className="label-mono text-accent mb-6">§ 03 — Planning</p>
            <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] text-foreground max-w-3xl">
              Every room. Every minute.
              <br />
              <span className="text-accent">In one glance.</span>
            </h2>
          </div>
          <p className="max-w-sm text-foreground/70 leading-relaxed">
            Sessions sit on a temporal grid. Parallel tracks render side by side. Live ones glow.
            Tap any cell to dive in — or filter to a single room.
          </p>
        </div>

        <div ref={ref} className="reveal-up squircle-lg card-glass shadow-soft overflow-hidden">
          <div className="grid grid-cols-[100px_repeat(3,1fr)] border-b border-white/10 bg-white/5">
            <div className="label-mono text-foreground/50 px-4 py-3">TIME</div>
            {displayTracks.map((t) => (
              <div key={t.room} className="label-mono text-foreground px-4 py-3 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${t.color}`} />
                {t.room}
              </div>
            ))}
          </div>

          <div className="relative grid grid-cols-[100px_repeat(3,1fr)]" style={{ minHeight: "520px" }}>
            <div className="border-r border-white/10">
              {displayHours.map((h) => (
                <div key={h} className="h-32 px-4 pt-2 label-mono text-foreground/45 border-b border-white/10">
                  {String(h).padStart(2, "0")}:00
                </div>
              ))}
            </div>
            {displayTracks.map((t, ti) => (
              <div key={ti} className="relative border-r border-white/10 last:border-r-0">
                {displayHours.map((h) => (
                  <div key={h} className="h-32 border-b border-white/10" />
                ))}
                {displaySessions
                  .filter((s) => s.room === ti)
                  .map((s, i) => {
                    const top = (s.start - 9) * 128;
                    const height = (s.end - s.start) * 128 - 6;
                    return (
                      <div
                        key={i}
                        className={`absolute left-2 right-2 p-3 cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-deep squircle ${
                          s.live
                            ? "bg-accent text-accent-foreground"
                            : "bg-surface border border-border text-foreground"
                        }`}
                        style={{ top: `${top}px`, height: `${height}px` }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="label-mono opacity-70">
                            {String(Math.floor(s.start)).padStart(2, "0")}:{s.start % 1 ? "30" : "00"}
                          </span>
                          {s.live && (
                            <span className="label-mono pill flex items-center gap-1.5 px-2 py-0.5 bg-glass text-accent">
                              <span className="w-1 h-1 rounded-full bg-accent blink-dot" />
                              LIVE
                            </span>
                          )}
                        </div>
                        <p className="font-display font-bold text-base leading-tight mt-1">{s.title}</p>
                        <p className="label-mono opacity-60 mt-1">— {s.speaker}</p>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
