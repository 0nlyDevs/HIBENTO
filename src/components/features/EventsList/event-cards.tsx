import Link from "next/link";
import Image from "next/image";
import { Calendar, Users, ArrowRight, Wifi, MapPin } from "lucide-react";
import type { EventSummaryDto } from "@/types/dto";
import { ROUTES } from "@/constants/routes";
import { EVENT_IMAGES } from "@/constants/theme";

const MONTH_COLORS = [
  "hsl(61 69% 80%)", "hsl(220 35% 62%)", "hsl(280 35% 68%)",
  "hsl(160 35% 62%)", "hsl(30 65% 68%)", "hsl(340 45% 68%)",
  "hsl(59 73% 52%)", "hsl(200 50% 65%)", "hsl(15 60% 65%)",
  "hsl(100 35% 60%)", "hsl(250 40% 68%)", "hsl(45 70% 65%)",
];

function formatDateRange(start: Date, end: Date) {
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) return start.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) return `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString("en-US", { month: "short" })} ${start.getFullYear()}`;
  return `${start.toLocaleDateString("en-US", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`;
}

function GlassPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full label-mono text-xs text-ivory/80"
      style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}>
      {children}
    </span>
  );
}

interface HeroCardProps {
  event: EventSummaryDto;
  imageIdx: number;
}

export function HeroCard({ event, imageIdx }: HeroCardProps) {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const isLive = start <= now && end >= now;
  const img = EVENT_IMAGES[imageIdx % EVENT_IMAGES.length];

  return (
    <Link
      href={ROUTES.EVENT_DETAIL(event.id)}
      className="group relative col-span-full overflow-hidden squircle-lg min-h-80 flex flex-col justify-end"
    >
      <Image src={img} alt={event.title} fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" sizes="100vw" quality={85} />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

      {isLive && (
        <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full glow-chip label-mono">
          <span className="w-2 h-2 rounded-full bg-chartreuse" />
          ONGOING
        </div>
      )}

      <div className="relative z-10 p-7">
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {!isLive && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full label-mono text-xs font-bold text-charcoal"
                  style={{ background: "hsl(59 73% 52%)", boxShadow: "0 0 0 1px hsl(59 73% 52% / 0.4), 0 8px 20px -8px hsl(59 73% 52% / 0.5)" }}>
                  UPCOMING
                </span>
              )}
              {event.isOnline
                ? <GlassPill><Wifi size={10} /> ONLINE</GlassPill>
                : <GlassPill><MapPin size={10} /> {event.venue?.city}</GlassPill>
              }
            </div>
            <h2 className="text-display text-[clamp(1.6rem,3.5vw,2.8rem)] text-ivory leading-tight mb-3 group-hover:text-chartreuse transition-colors">
              {event.title}
            </h2>
            {event.description && (
              <p className="text-sm text-ivory/70 leading-relaxed max-w-xl line-clamp-2">{event.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-sm text-ivory/70"><Calendar size={13} />{formatDateRange(start, end)}</span>
              <span className="flex items-center gap-1.5 text-sm text-ivory/70"><Users size={13} />{event.eventSessionCount} sessions</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-chartreuse flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-deep">
            <ArrowRight size={20} className="text-charcoal" />
          </div>
        </div>
      </div>
    </Link>
  );
}

interface FeatureCardProps {
  event: EventSummaryDto;
  imageIdx: number;
  wide?: boolean;
}

export function FeatureCard({ event, imageIdx, wide = false }: FeatureCardProps) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const img = EVENT_IMAGES[imageIdx % EVENT_IMAGES.length];

  return (
    <Link
      href={ROUTES.EVENT_DETAIL(event.id)}
      className={`group relative overflow-hidden squircle-lg flex flex-col justify-end ${wide ? "md:col-span-2" : ""} min-h-60`}
    >
      <Image src={img} alt={event.title} fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" quality={85} />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full label-mono text-xs font-bold text-charcoal"
            style={{ background: "hsl(59 73% 52%)", boxShadow: "0 0 0 1px hsl(59 73% 52% / 0.4), 0 6px 16px -6px hsl(59 73% 52% / 0.5)" }}>
            UPCOMING
          </span>
          {event.isOnline
            ? <GlassPill><Wifi size={9} /> ONLINE</GlassPill>
            : event.venue && <GlassPill><MapPin size={9} /> {event.venue.city}</GlassPill>
          }
        </div>
        <h3 className="font-bold text-ivory group-hover:text-chartreuse transition-colors text-lg leading-snug mb-2 line-clamp-2">
          {event.title}
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-ivory/70"><Calendar size={11} />{formatDateRange(start, end)}</span>
          <span className="flex items-center gap-1 text-xs text-ivory/70"><Users size={11} />{event.eventSessionCount} sessions</span>
        </div>
      </div>
    </Link>
  );
}

export function CompactCard({ event }: { event: EventSummaryDto }) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const accentColor = MONTH_COLORS[start.getMonth()];
  const day = start.toLocaleDateString("en-US", { day: "2-digit" });
  const month = start.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

  return (
    <Link
      href={ROUTES.EVENT_DETAIL(event.id)}
      className="group flex items-stretch overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "#222222E6",
        border: "1px dashed rgba(255,255,255,0.18)",
        borderRadius: "0.75rem",
      }}
    >
      <div className="w-16 shrink-0 flex flex-col items-center justify-center gap-0.5 py-5" style={{ background: accentColor }}>
        <span className="text-xl font-black leading-none" style={{ color: "rgba(0,0,0,0.8)" }}>{day}</span>
        <span className="text-[0.55rem] font-bold tracking-widest" style={{ color: "rgba(0,0,0,0.55)" }}>{month}</span>
      </div>

      <div className="flex-1 px-4 py-3 flex flex-col justify-between min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="label-mono text-ivory/50 text-[0.65rem]">ENDED</span>
          {event.isOnline
            ? <GlassPill><Wifi size={8} /> ONLINE</GlassPill>
            : <GlassPill><MapPin size={8} /> ONSITE</GlassPill>
          }
        </div>
        <h4 className="font-bold text-ivory group-hover:text-chartreuse transition-colors text-sm leading-snug mb-2 line-clamp-1">
          {event.title}
        </h4>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="flex items-center gap-1 text-[0.7rem] font-medium text-ivory/70">
            <Calendar size={9} />{formatDateRange(start, end)}
          </span>
          {event.venue && (
            <span className="flex items-center gap-1 text-[0.7rem] font-medium text-ivory/70">
              <MapPin size={9} />{event.venue.city}
            </span>
          )}
          <span className="flex items-center gap-1 text-[0.7rem] font-medium text-ivory/70">
            <Users size={9} />{event.eventSessionCount} sessions
          </span>
        </div>
      </div>

      <div className="flex items-center pr-3 pl-1 shrink-0">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
          className="text-ivory/20 group-hover:text-chartreuse transition-colors duration-200">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}

export function BentoGrid({ events }: { events: EventSummaryDto[] }) {
  const now = new Date();
  const live = events.filter(e => { const s = new Date(e.startDate), en = new Date(e.endDate); return s <= now && en >= now; });
  const upcoming = events.filter(e => new Date(e.startDate) > now);
  const ended = events.filter(e => new Date(e.endDate) < now);
  const featured = [...live, ...upcoming];
  let imgIdx = 0;

  return (
    <div className="space-y-4">
      {featured.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featured.map((event, i) => {
            if (i === 0) return <HeroCard key={event.id} event={event} imageIdx={imgIdx++} />;
            const wide = i % 3 === 1 && i < featured.length - 1;
            return <FeatureCard key={event.id} event={event} imageIdx={imgIdx++} wide={wide} />;
          })}
        </div>
      )}

      {ended.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-white/10" />
            <div className="flex items-center gap-2 px-4 py-2 squircle"
              style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-ivory/30" />
              <p className="label-mono text-ivory/60">PAST EVENTS</p>
              <span className="label-mono text-ivory/30 ml-1">— {ended.length}</span>
            </div>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {ended.map((e) => <CompactCard key={e.id} event={e} />)}
          </div>
        </div>
      )}
    </div>
  );
}
