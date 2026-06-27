"use client";

import { useEffect, useState } from "react";
import { Track, Session, tracks, sessions, hours } from "@/data/tracks";

interface PlanningShowcaseProps {
  tracks?: Track[];
  sessions?: Session[];
  hours?: number[];
}

export const PlanningShowcase = ({
  tracks: propTracks,
  sessions: propSessions,
  hours: propHours,
}: PlanningShowcaseProps) => {
  const displayTracks = propTracks || tracks;
  const displaySessions = propSessions || sessions;
  const displayHours = propHours || hours;

  const [nowOffset, setNowOffset] = useState<number | null>(null);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const decimal = now.getHours() + now.getMinutes() / 60;
      const startHour = displayHours[0];
      const endHour = displayHours[displayHours.length - 1] + 1;
      if (decimal >= startHour && decimal <= endHour) {
        setNowOffset((decimal - startHour) * 128);
      } else {
        setNowOffset(null);
      }
    };
    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, [displayHours]);

  return (
    <section id="planning" className="relative py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 lg:px-20 relative">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <p className="label-mono text-accent mb-6">§ 03 Planning</p>
            <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] text-foreground max-w-3xl">
              Every room. Every minute.
              <br />
              <span className="text-accent">In one glance.</span>
            </h2>
          </div>
          <p className="max-w-sm text-foreground/70 leading-relaxed">
            Sessions sit on a temporal grid. Parallel tracks render side by side. Live ones glow.
            Tap any cell to dive in, or filter to a single room.
          </p>
        </div>

        <div className="squircle-lg card-glass shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-200">
              <div className="grid grid-cols-[100px_repeat(3,1fr)] border-b border-white/10 bg-chartreuse-pale/10">
                <div className="label-mono text-foreground/50 px-4 py-3">TIME</div>
                {displayTracks.map((t) => (
                  <div key={t.room} className="label-mono text-foreground px-4 py-3 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                    {t.room}
                  </div>
                ))}
              </div>

              <div className="relative grid grid-cols-[100px_repeat(3,1fr)] min-h-130">

                {nowOffset !== null && (
                  <div
                    className="absolute left-0 right-0 z-20 flex items-center gap-2 pointer-events-none min-w-200"
                    style={{ top: `${nowOffset}px` }}
                  >
                    <div className="w-25 flex justify-end pr-2">
                      <span className="label-mono text-accent text-[0.6rem]">
                        {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-accent opacity-60" />
                  </div>
                )}

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
                        const top = (s.start - displayHours[0]) * 128;
                        const height = (s.end - s.start) * 128 - 6;
                        return (
                          <div
                            key={`${s.room}-${s.start}-${s.title}`}
                            className={`absolute left-2 right-2 p-3 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-deep squircle ${
                              s.live
                                ? "bg-accent text-accent-foreground"
                                : "bg-charcoal/90 border border-white/10 text-foreground"
                            }`}
                            style={{ top: `${top}px`, height: `${height}px` }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="label-mono opacity-70">
                                {String(Math.floor(s.start)).padStart(2, "0")}:{s.start % 1 ? "30" : "00"}
                              </span>
                              {s.live && (
                                <span className="label-mono pill flex items-center gap-1.5 px-2 py-0.5 glow-chip text-chartreuse-soft font-bold">
                                  <span className="w-1 h-1 rounded-full bg-charcoal blink-dot" />
                                  LIVE
                                </span>
                              )}
                            </div>
                            <p className="font-display font-bold text-base leading-tight mt-1">{s.title}</p>
                            <p className="label-mono opacity-60 mt-1">{s.speaker}</p>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
