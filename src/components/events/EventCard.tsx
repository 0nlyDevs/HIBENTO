import Link from "next/link";
import type { EventSummaryDto } from "@/types/dto";

interface EventCardProps {
  event: EventSummaryDto;
  index: number;
}

const COLORS = ["#EAE151", "#C4D7B2", "#D4C5E2", "#B8D4E3", "#E8D5B7", "#F2E0DE"];

export function EventCard({ event, index }: EventCardProps) {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const isLive = start <= now && end >= now;
  const isEnded = end < now;
  const color = COLORS[index % COLORS.length];

  return (
    <Link
      href={`/events/${event.id}`}
      className="block group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
      style={{
        background: "#FEFCF7",
        border: "1px solid rgba(40,40,40,0.1)",
        borderTop: `3px solid ${color}`,
      }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {event.isOnline && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold tracking-wider bg-charcoal text-cream">
              ONLINE
            </span>
          )}
          {!event.isOnline && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold tracking-wider bg-paper text-charcoal border border-charcoal/20">
              ONSITE
            </span>
          )}
          {isLive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[0.6rem] font-bold tracking-wider bg-nori text-cream">
              ONGOING
            </span>
          )}
          {isEnded && (
            <span className="text-[0.6rem] tracking-wider font-bold text-charcoal/40">
              ENDED
            </span>
          )}
          {!isLive && !isEnded && (
            <span className="text-[0.6rem] tracking-wider font-bold text-matcha">
              UPCOMING
            </span>
          )}
          <span className="text-[0.6rem] font-mono text-charcoal/40">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="font-bold text-charcoal group-hover:text-yellow-dark transition-colors mb-2">
          {event.title}
        </h3>

        <p className="text-xs text-charcoal/60 line-clamp-2 mb-4">
          {event.description}
        </p>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[0.6rem] tracking-wider text-charcoal/40">
          <span>
            {start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {" – "}
            {end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          {event.venue ? <span>{event.venue.name}</span> : <span className="text-nori font-bold">ONLINE</span>}
          <span>{event.eventSessionCount} SESSIONS</span>
        </div>
       <span className="text-[0.6rem]">{event.venue ? `${event.venue.neighborhood}` : "ONLINE EVENT"}</span>
      </div>
      <div
        className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: color }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="#282828" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}