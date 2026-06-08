"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useGetEvents } from "@/lib/hooks/useEvents";
import { api } from "@/lib/api";
import { Select } from "@/components/ui/Select";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Search, X, Radio, MapPin, Wifi, Clock, Calendar, Users, ArrowRight } from "lucide-react";
import type { EventSummaryDto } from "@/types/dto";

type EventStatus = "all" | "live" | "upcoming" | "ended";
type EventFormat = "all" | "onsite" | "online";

const STATUS_OPTIONS = [
  { value: "all",      label: "All statuses", icon: <Clock  size={11} /> },
  { value: "live",     label: "Live now",     icon: <Radio  size={11} /> },
  { value: "upcoming", label: "Upcoming",     icon: <Clock  size={11} /> },
  { value: "ended",    label: "Ended",        icon: <Clock  size={11} /> },
];

const FORMAT_OPTIONS = [
  { value: "all",    label: "All formats", icon: <MapPin size={11} /> },
  { value: "onsite", label: "Onsite",      icon: <MapPin size={11} /> },
  { value: "online", label: "Online",      icon: <Wifi   size={11} /> },
];

// Cycling event images
const EVENT_IMAGES = [
  "/hibento-vibes-01.webp",
  "/hibento-vibes-02.webp",
  "/hibento-vibes-03.jpg",
  "/liveqa.jpg",
];

// Gradient fallbacks per month
const MONTH_GRADIENTS = [
  "from-[hsl(61_69%_30%)] to-[hsl(61_69%_15%)]",
  "from-[hsl(220_35%_30%)] to-[hsl(220_35%_15%)]",
  "from-[hsl(280_35%_30%)] to-[hsl(280_35%_15%)]",
  "from-[hsl(160_35%_28%)] to-[hsl(160_35%_14%)]",
  "from-[hsl(30_65%_30%)] to-[hsl(30_65%_15%)]",
  "from-[hsl(340_45%_30%)] to-[hsl(340_45%_15%)]",
  "from-[hsl(59_73%_28%)] to-[hsl(59_73%_14%)]",
  "from-[hsl(200_50%_30%)] to-[hsl(200_50%_15%)]",
  "from-[hsl(15_60%_30%)] to-[hsl(15_60%_15%)]",
  "from-[hsl(100_35%_26%)] to-[hsl(100_35%_13%)]",
  "from-[hsl(250_40%_30%)] to-[hsl(250_40%_15%)]",
  "from-[hsl(45_70%_28%)] to-[hsl(45_70%_14%)]",
];

function formatDateRange(start: Date, end: Date) {
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) return start.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) return `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString("en-US", { month: "short" })} ${start.getFullYear()}`;
  return `${start.toLocaleDateString("en-US", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`;
}

// ── HERO card (live or first upcoming — full width) ──────────────────────────
function HeroCard({ event, imageIdx }: { event: EventSummaryDto; imageIdx: number }) {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const isLive = start <= now && end >= now;
  const img = EVENT_IMAGES[imageIdx % EVENT_IMAGES.length];

  return (
    <Link
      href={`/events/${event.id}`}
      className="group relative col-span-full overflow-hidden squircle-lg min-h-[320px] flex flex-col justify-end"
    >
      {/* Background image */}
      <Image src={img} alt={event.title} fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" sizes="100vw" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
      {/* Live pulse */}
      {isLive && (
        <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full glow-chip label-mono">
          <span className="w-2 h-2 rounded-full bg-charcoal animate-pulse" />
          LIVE NOW
        </div>
      )}
      {/* Content */}
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
                ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full label-mono text-xs text-ivory/80" style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}><Wifi size={10} /> ONLINE</span>
                : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full label-mono text-xs text-ivory/80" style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}><MapPin size={10} /> {event.venue?.city}</span>
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

// ── FEATURE card (medium — col-span-1 or col-span-2) ────────────────────────
function FeatureCard({ event, imageIdx, wide = false }: { event: EventSummaryDto; imageIdx: number; wide?: boolean }) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const img = EVENT_IMAGES[imageIdx % EVENT_IMAGES.length];
  const gradient = MONTH_GRADIENTS[start.getMonth()];

  return (
    <Link
      href={`/events/${event.id}`}
      className={`group relative overflow-hidden squircle-lg flex flex-col justify-end ${wide ? "md:col-span-2" : ""} min-h-[240px]`}
    >
      <Image src={img} alt={event.title} fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full label-mono text-xs font-bold text-charcoal"
            style={{ background: "hsl(59 73% 52%)", boxShadow: "0 0 0 1px hsl(59 73% 52% / 0.4), 0 6px 16px -6px hsl(59 73% 52% / 0.5)" }}>
            UPCOMING
          </span>
          {event.isOnline
            ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full label-mono text-xs text-ivory/80" style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}><Wifi size={9} /> ONLINE</span>
            : event.venue && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full label-mono text-xs text-ivory/80" style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}><MapPin size={9} /> {event.venue.city}</span>
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

// ── COMPACT card (ended events — old EventCard style) ───────────────────────
function CompactCard({ event, index }: { event: EventSummaryDto; index: number }) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  const MONTH_COLORS = [
    "hsl(61 69% 80%)", "hsl(220 35% 62%)", "hsl(280 35% 68%)",
    "hsl(160 35% 62%)", "hsl(30 65% 68%)",  "hsl(340 45% 68%)",
    "hsl(59 73% 52%)",  "hsl(200 50% 65%)", "hsl(15 60% 65%)",
    "hsl(100 35% 60%)", "hsl(250 40% 68%)", "hsl(45 70% 65%)",
  ];
  const accentColor = MONTH_COLORS[start.getMonth()];
  const day   = start.toLocaleDateString("en-US", { day: "2-digit" });
  const month = start.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex items-stretch overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "#222222E6",
        border: "1px dashed rgba(255,255,255,0.18)",
        borderRadius: "0.75rem",
      }}
    >
      {/* Date badge */}
      <div
        className="w-16 shrink-0 flex flex-col items-center justify-center gap-0.5 py-5"
        style={{ background: accentColor }}
      >
        <span className="text-xl font-black leading-none" style={{ color: "rgba(0,0,0,0.8)" }}>{day}</span>
        <span className="text-[0.55rem] font-bold tracking-widest" style={{ color: "rgba(0,0,0,0.55)" }}>{month}</span>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-3 flex flex-col justify-between min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="label-mono text-ivory/50 text-[0.65rem]">ENDED</span>
          {event.isOnline ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full label-mono text-[0.65rem] text-ivory/80"
              style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}>
              <Wifi size={8} /> ONLINE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full label-mono text-[0.65rem] text-ivory/80"
              style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}>
              <MapPin size={8} /> ONSITE
            </span>
          )}
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

      {/* Arrow */}
      <div className="flex items-center pr-3 pl-1 shrink-0">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
          className="text-ivory/20 group-hover:text-chartreuse transition-colors duration-200">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}

// ── BENTO GRID ────────────────────────────────────────────────────────────────
function BentoGrid({ events }: { events: EventSummaryDto[] }) {
  const now = new Date();

  const live     = events.filter(e => { const s = new Date(e.startDate), en = new Date(e.endDate); return s <= now && en >= now; });
  const upcoming = events.filter(e => new Date(e.startDate) > now);
  const ended    = events.filter(e => new Date(e.endDate) < now);

  const featured = [...live, ...upcoming]; // live first, then upcoming
  let imgIdx = 0;

  return (
    <div className="space-y-4">
      {/* Active events bento */}
      {featured.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featured.map((event, i) => {
            const isFirst = i === 0;
            const isLive  = live.includes(event);

            if (isFirst) {
              return <HeroCard key={event.id} event={event} imageIdx={imgIdx++} />;
            }
            // Alternate wide/narrow for visual interest
            const wide = i % 3 === 1 && i < featured.length - 1;
            return <FeatureCard key={event.id} event={event} imageIdx={imgIdx++} wide={wide} />;
          })}
        </div>
      )}

      {/* Ended events — compact list */}
      {ended.length > 0 && (
        <div className="mt-10">
          {/* Separator visible */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-white/10" />
            <div
              className="flex items-center gap-2 px-4 py-2 squircle"
              style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-ivory/30" />
              <p className="label-mono text-ivory/60">PAST EVENTS</p>
              <span className="label-mono text-ivory/30 ml-1">— {ended.length}</span>
            </div>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {ended.map((e, i) => <CompactCard key={e.id} event={e} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── PAGE ─────────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [status,   setStatus]   = useState<EventStatus>("all");
  const [format,   setFormat]   = useState<EventFormat>("all");
  const [search,   setSearch]   = useState("");
  const [city,     setCity]     = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");

  const { data: venuesData } = useQuery({ queryKey: ["venues"], queryFn: () => api.getVenues() });

  const { data: eventsData, isLoading } = useGetEvents({
    page: 1, limit: 50,
    ...(status !== "all" && { status }),
    ...(search && { search }),
    ...(city !== "all" && { city }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  });

  const cities = useMemo(
    () => [...new Set((venuesData?.data || []).map((v) => v.city))].sort(),
    [venuesData]
  );

  const cityOptions = useMemo(() => [
    { value: "all", label: "All cities", icon: <MapPin size={11} /> },
    ...cities.map((c) => ({ value: c, label: c, icon: <MapPin size={11} /> })),
  ], [cities]);

  const events = useMemo(() => {
    const raw = eventsData?.data || [];
    const filtered = format === "online" ? raw.filter(e => e.isOnline)
                   : format === "onsite" ? raw.filter(e => !e.isOnline)
                   : raw;
    // Sort: live first, then upcoming (sorted by startDate), then ended
    const now = new Date();
    const live     = filtered.filter(e => { const s = new Date(e.startDate), en = new Date(e.endDate); return s <= now && en >= now; });
    const upcoming = filtered.filter(e => new Date(e.startDate) > now).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    const ended    = filtered.filter(e => new Date(e.endDate) < now).sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
    return [...live, ...upcoming, ...ended];
  }, [eventsData, format]);

  const hasActiveFilters = status !== "all" || format !== "all" || city !== "all" || !!search || !!dateFrom || !!dateTo;

  function clearAll() {
    setStatus("all"); setFormat("all"); setCity("all");
    setSearch(""); setDateFrom(""); setDateTo("");
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Title row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="label-mono text-chartreuse mb-2">§ EXPLORE</p>
            <h1 className="text-display text-[clamp(2.2rem,5vw,4rem)] text-ivory leading-none mb-3">
              Discover our events
            </h1>
            <p className="text-sm text-ivory/70 leading-relaxed">
              Join our upcoming sessions and expand your skills.
            </p>
          </div>
          <p className="label-mono text-ivory/40 pt-0.5 shrink-0">
            {isLoading ? "—" : `${events.length} ${events.length === 1 ? "EVENT" : "EVENTS"}`}
          </p>
        </div>

        {/* Filter bar */}
        <div
          className="flex items-center justify-between gap-3 p-3 mb-8 squircle-lg"
          style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}
        >
          <div className="relative w-56 shrink-0">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search an event…"
              className="w-full h-9 pl-8 pr-3 text-sm font-medium text-ivory placeholder-ivory/40 focus:outline-none transition-colors rounded-lg"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Select value={status} onValueChange={(v) => setStatus(v as EventStatus)} options={STATUS_OPTIONS} placeholder="Status" />
            <Select value={format} onValueChange={(v) => setFormat(v as EventFormat)} options={FORMAT_OPTIONS} placeholder="Format" />
            <Select value={city} onValueChange={setCity} options={cityOptions} placeholder="City" />
            <DateRangePicker from={dateFrom} to={dateTo} onFromChange={setDateFrom} onToChange={setDateTo} />
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 h-9 px-3 text-xs font-semibold text-ivory/60 hover:text-ivory transition-colors rounded-lg whitespace-nowrap"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px dashed rgba(255,255,255,0.18)" }}
              >
                <X size={11} /> Clear all
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-full h-80 animate-pulse squircle-lg" style={{ background: "#222222E6" }} />
            {[1,2,3].map(i => <div key={i} className="h-48 animate-pulse squircle-lg" style={{ background: "#222222E6" }} />)}
          </div>
        ) : events.length > 0 ? (
          <BentoGrid events={events} />
        ) : (
          <div className="text-center py-24 squircle-lg"
            style={{ background: "#222222E6", border: "1px dashed rgba(255,255,255,0.18)" }}>
            <p className="text-4xl mb-4">🔍</p>
            <p className="label-mono text-ivory/60 mb-1">NO EVENTS FOUND</p>
            <p className="text-sm text-ivory/40">Try adjusting your filters</p>
            {hasActiveFilters && (
              <button onClick={clearAll} className="mt-6 px-5 py-2 label-mono text-chartreuse rounded-full hover:bg-chartreuse/10 transition-colors"
                style={{ border: "1px solid rgba(200,210,50,0.3)" }}>
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
