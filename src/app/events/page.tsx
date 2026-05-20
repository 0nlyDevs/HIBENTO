"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetEvents } from "@/lib/hooks/useEvents";
import { EventCard } from "@/components/events/EventCard";
import type { EventSummaryDto } from "@/types/dto";

type EventStatus = "all" | "live" | "upcoming" | "ended";

export default function EventsPage() {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<EventStatus>("all");

  const { data: eventsData, isLoading } = useGetEvents({
    page: 1,
    limit: 50,
    ...(selectedCity !== "all" && { city: selectedCity }),
    ...(selectedStatus !== "all" && { status: selectedStatus }),
  });

  const events = eventsData?.data || [];

  // Extract unique cities from events
  const cities = [...new Set(events.filter(e => e.venue).map(e => e.venue!.city))].sort();

  const statusFilters: { value: EventStatus; label: string }[] = [
    { value: "all", label: "ALL" },
    { value: "live", label: "LIVE" },
    { value: "upcoming", label: "UPCOMING" },
    { value: "ended", label: "ENDED" },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="HiBento" width={28} height={28} />
            <span className="font-bold text-xl tracking-tighter text-charcoal">HIBENTO</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/events" className="text-sm font-bold text-charcoal border-b-2 border-charcoal">
              EVENTS
            </Link>
            <Link href="/speakers" className="text-sm text-charcoal/60 hover:text-charcoal">
              SPEAKERS
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tighter text-charcoal mb-2">EVENTS</h1>
          <p className="text-sm text-charcoal/60">Browse all events across Madagascar</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Status Filters */}
          <div className="flex gap-1 bg-charcoal/5 p-1">
            {statusFilters.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedStatus(value)}
                className={`px-4 py-2 text-xs tracking-wider font-medium transition-colors ${
                  selectedStatus === value
                    ? "bg-charcoal text-cream"
                    : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 text-xs tracking-wider bg-cream border border-charcoal/20 text-charcoal"
          >
            <option value="all">ALL CITIES</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-charcoal/5 animate-pulse" />
            ))}
          </div>
        ) : events.length > 0 ? (
          selectedCity === "all" ? (
            (() => {
              const grouped = events.reduce<Record<string, EventSummaryDto[]>>(
                (acc, e) => {
                  const city = e.venue?.city ?? "ONLINE";
                  if (!acc[city]) acc[city] = [];
                  acc[city].push(e);
                  return acc;
                },
                {}
              );
              return (
                <div className="space-y-10">
                  {Object.entries(grouped).map(([city, cityEvents]) => (
                    <div key={city}>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-2 h-2 bg-charcoal" />
                        <h2 className="text-sm font-bold tracking-widest text-charcoal">
                          {city.toUpperCase()}
                        </h2>
                        <div className="flex-1 h-px bg-charcoal/10" />
                        <span className="text-[0.6rem] tracking-wider text-charcoal/30">
                          {cityEvents.length} {cityEvents.length === 1 ? "EVENT" : "EVENTS"}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cityEvents.map((event, idx) => (
                          <EventCard
                            key={event.id}
                            event={event}
                            index={idx}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event, idx) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={idx}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16 border border-dashed border-charcoal/20">
            <p className="text-charcoal/40 text-sm tracking-wider">NO EVENTS FOUND</p>
            <p className="text-charcoal/30 text-xs mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>

    </div>
  );
}