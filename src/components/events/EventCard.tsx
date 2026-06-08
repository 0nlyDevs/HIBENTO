import Link from "next/link";
import { MapPin, Wifi, Calendar, Users } from "lucide-react";
import type { EventSummaryDto } from "@/types/dto";

interface EventCardProps {
  event: EventSummaryDto;
  index: number;
}

const MONTH_COLORS = [
  "hsl(61 69% 80%)",   // chartreuse-pale — Jan
  "hsl(220 35% 62%)",  // slate blue      — Feb
  "hsl(280 35% 68%)",  // lavender        — Mar
  "hsl(160 35% 62%)",  // mint            — Apr
  "hsl(30 65% 68%)",   // peach           — May
  "hsl(340 45% 68%)",  // rose            — Jun
  "hsl(59 73% 52%)",   // chartreuse      — Jul
  "hsl(200 50% 65%)",  // sky             — Aug
  "hsl(15 60% 65%)",   // coral           — Sep
  "hsl(100 35% 60%)",  // lime            — Oct
  "hsl(250 40% 68%)",  // periwinkle      — Nov
  "hsl(45 70% 65%)",   // amber           — Dec
];

function formatDateRange(start: Date, end: Date): string {
  const sameDay   = start.toDateString() === end.toDateString();
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameDay)    return start.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  if (sameMonth)  return `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString("en-US", { month: "short" })} ${start.getFullYear()}`;
  return `${start.toLocaleDateString("en-US", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`;
}

export function EventCard({ event, index }: EventCardProps) {
  const now   = new Date();
  const start = new Date(event.startDate);
  const end   = new Date(event.endDate);

  const isLive     = start <= now && end >= now;
  const isEnded    = end < now;
  const isUpcoming = !isLive && !isEnded;

  const accentColor = MONTH_COLORS[start.getMonth()];
  const day   = start.toLocaleDateString("en-US", { day: "2-digit" });
  const month = start.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex items-stretch overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-deep"
      style={{
        background: "#222222E6",
        border: "1px dashed rgba(255,255,255,0.18)",
        borderRadius: "0.75rem",
      }}
    >
      {/* Date badge */}
      <div
        className="w-20 shrink-0 flex flex-col items-center justify-center gap-0.5 py-6"
        style={{ background: accentColor }}
      >
        <span className="text-2xl font-black leading-none" style={{ color: "rgba(0,0,0,0.8)" }}>
          {day}
        </span>
        <span className="text-[0.6rem] font-bold tracking-widest" style={{ color: "rgba(0,0,0,0.55)" }}>
          {month}
        </span>
        {isLive && (
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-black/50 animate-pulse" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 flex flex-col justify-between min-w-0">

        {/* Status + format badges */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {isLive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 label-mono glow-chip rounded-full text-[0.65rem]">
              <span className="w-1 h-1 rounded-full bg-charcoal animate-pulse" />
              LIVE
            </span>
          )}
          {isUpcoming && (
            <span className="label-mono text-chartreuse-soft text-[0.65rem] font-semibold">UPCOMING</span>
          )}
          {isEnded && (
            <span className="label-mono text-ivory/50 text-[0.65rem]">ENDED</span>
          )}
          {event.isOnline ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full label-mono text-[0.65rem] text-ivory/80"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <Wifi size={9} />
              ONLINE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full label-mono text-[0.65rem] text-ivory/80"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <MapPin size={9} />
              ONSITE
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-ivory group-hover:text-chartreuse transition-colors duration-200 text-base leading-snug mb-3 line-clamp-2">
          {event.title}
        </h3>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1 text-[0.7rem] font-medium text-ivory/70">
            <Calendar size={10} />
            {formatDateRange(start, end)}
          </span>
          {event.venue && (
            <span className="flex items-center gap-1 text-[0.7rem] font-medium text-ivory/70">
              <MapPin size={10} />
              {event.venue.city}
            </span>
          )}
          <span className="flex items-center gap-1 text-[0.7rem] font-medium text-ivory/70">
            <Users size={10} />
            {event.eventSessionCount} sessions
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center pr-3 pl-1 shrink-0">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
          className="text-ivory/20 group-hover:text-chartreuse transition-colors duration-200">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}
