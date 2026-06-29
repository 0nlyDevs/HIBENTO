import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SpeakersLoading() {
  return (
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="label-mono text-chartreuse mb-2">§ COMMUNITY</p>
            <h1 className="text-display text-[clamp(2.2rem,5vw,4rem)] text-ivory leading-none">
              Speakers
            </h1>
          </div>
          <Link
            href="/events"
            className="hidden sm:inline-flex items-center gap-2 shrink-0 py-2.5 px-4 rounded-xl text-xs tracking-widest font-bold cursor-pointer hover:brightness-110 transition-all focus:outline-none"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px dashed rgba(255,255,255,0.18)" }}
          >
            <ArrowRight size={12} />
            BACK TO EVENTS
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="squircle-lg overflow-hidden flex flex-col"
              style={{ background: "#222222E6" }}
            >
              <div className="relative aspect-4/3 bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                  <div className="h-2.5 w-20 rounded-full bg-white/5" />
                </div>
                <div className="h-4 w-32 rounded-lg bg-white/5" />
                <div className="space-y-1.5">
                  <div className="h-2.5 w-full rounded bg-white/5" />
                  <div className="h-2.5 w-3/4 rounded bg-white/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
