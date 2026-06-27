"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGetEvents } from "@/lib/hooks/useEvents";
import { api } from "@/lib/api";
import { Select } from "@/components/ui/Select";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Search, X } from "lucide-react";
import type { EventSummaryDto } from "@/types/dto";
import { BentoGrid } from "@/components/features/EventsList/event-cards";

type EventStatus = "all" | "live" | "upcoming" | "ended";
type EventFormat = "all" | "onsite" | "online";

const STATUS_OPTIONS = [
  { value: "all" as const, label: "All statuses" },
  { value: "live" as const, label: "Live now" },
  { value: "upcoming" as const, label: "Upcoming" },
  { value: "ended" as const, label: "Ended" },
];

const FORMAT_OPTIONS = [
  { value: "all" as const, label: "All formats" },
  { value: "onsite" as const, label: "Onsite" },
  { value: "online" as const, label: "Online" },
];

function filterEvents(events: EventSummaryDto[], format: EventFormat): EventSummaryDto[] {
  const now = new Date();
  let filtered: EventSummaryDto[];
  if (format === "online") {
    filtered = events.filter((e) => e.isOnline);
  } else if (format === "onsite") {
    filtered = events.filter((e) => !e.isOnline);
  } else {
    filtered = events;
  }
  const live = filtered.filter((e) => {
    const s = new Date(e.startDate), en = new Date(e.endDate);
    return s <= now && en >= now;
  });
  const upcoming = filtered
    .filter((e) => new Date(e.startDate) > now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const ended = filtered
    .filter((e) => new Date(e.endDate) < now)
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
  return [...live, ...upcoming, ...ended];
}

export default function EventsPage() {
  const [status, setStatus] = useState<EventStatus>("all");
  const [format, setFormat] = useState<EventFormat>("all");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: venuesData } = useQuery({
    queryKey: ["venues"],
    queryFn: () => api.getVenues(),
  });

  const cityOptions = useMemo(
    () => [
      { value: "all", label: "All cities" },
      ...[...new Set((venuesData?.data || []).map((v) => v.city))].sort().map((c) => ({ value: c, label: c })),
    ],
    [venuesData],
  );

  const queryParams = {
    page: 1, limit: 50,
    ...(status !== "all" && { status }),
    ...(search && { search }),
    ...(city !== "all" && { city }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  };

  const { data: eventsData, isLoading } = useGetEvents(queryParams);

  const events = useMemo(
    () => filterEvents(eventsData?.data || [], format),
    [eventsData, format],
  );

  const hasActiveFilters = status !== "all" || format !== "all" || city !== "all" || !!search || !!dateFrom || !!dateTo;

  const clearAll = () => {
    setStatus("all"); setFormat("all"); setCity("all");
    setSearch(""); setDateFrom(""); setDateTo("");
  };

  return (
    <div className="pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">
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
              placeholder="Search an event"
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-full h-80 animate-pulse squircle-lg" style={{ background: "#222222E6" }} />
            {[1, 2, 3].map((i) => <div key={i} className="h-48 animate-pulse squircle-lg" style={{ background: "#222222E6" }} />)}
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
