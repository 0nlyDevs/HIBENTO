import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";

export default function EventDetailLoading() {
  return (
    <div className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ivory/70 hover:text-ivory transition-colors mb-6 group"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:-translate-x-0.5">
            <path d="M7 3L4 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          ALL EVENTS
        </Link>

        <div className="relative overflow-hidden squircle-lg min-h-65 flex flex-col justify-end mb-4 animate-pulse">
          <div className="absolute inset-0 bg-ivory/5" />
          <div className="relative z-10 px-6 py-6 space-y-2">
            <p className="label-mono text-chartreuse mb-1">§ EVENT</p>
            <div className="h-8 w-3/4 rounded-xl bg-ivory/5" />
            <div className="h-4 w-1/2 rounded-lg bg-ivory/5" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: "DATES", icon: <Calendar size={16} className="text-chartreuse" /> },
            { label: "TIME", icon: <Clock size={16} className="text-chartreuse" /> },
            { label: "LOCATION", icon: <MapPin size={16} className="text-chartreuse" /> },
            { label: "VENUE", icon: <Users size={16} className="text-chartreuse" /> },
          ].map(({ label, icon }) => (
            <div key={label} className="card-glass squircle p-5 flex items-start gap-3">
              <div className="mt-1 shrink-0">{icon}</div>
              <div className="flex-1 space-y-2">
                <p className="label-mono text-ivory/40 mb-1 text-xs">{label}</p>
                <div className="h-5 w-3/4 rounded-lg bg-ivory/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div id="event-schedule" className="mb-10 scroll-mt-28">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="shrink-0">
              <p className="label-mono text-chartreuse mb-0.5">§ SCHEDULE</p>
              <h2 className="text-display text-2xl text-ivory">Sessions</h2>
            </div>

            <div className="relative flex items-center gap-1 p-1 card-glass rounded-full shrink-0 h-11">
              {["TABLE", "CALENDAR"].map((v) => (
                <span
                  key={v}
                  className={`px-4 py-1 label-mono uppercase tracking-wider text-xs ${
                    v === "TABLE" ? "text-ivory" : "text-ivory/30"
                  }`}
                >
                  {v}
                </span>
              ))}
            </div>

            <div className="relative flex items-center gap-1 p-1 card-glass rounded-full shrink-0 h-11">
              {["ALL", "LIVE", "UPCOMING", "ENDED"].map((s) => (
                <span
                  key={s}
                  className={`px-4 py-1 label-mono uppercase tracking-wider text-xs ${
                    s === "ALL" ? "text-ivory" : "text-ivory/30"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 animate-pulse">
            <div className="h-6 w-full rounded-lg bg-ivory/5" />
            <div className="h-20 w-full rounded-lg bg-ivory/5" />
            <div className="h-20 w-full rounded-lg bg-ivory/5" />
          </div>
        </div>

        <div className="squircle-lg overflow-hidden card-glass animate-pulse">
          <div className="h-44 bg-ivory/5 flex items-center justify-center">
            <MapPin size={28} className="text-ivory/20" />
          </div>
          <div className="px-5 py-4 space-y-2">
            <div className="h-5 w-2/3 rounded-lg bg-ivory/5" />
            <div className="h-4 w-1/2 rounded-lg bg-ivory/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
