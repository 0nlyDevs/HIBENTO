"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetEvent } from "@/lib/hooks/useEvents";
import { EventHero } from "@/components/events/EventHero";
import { EventInfoGrid } from "@/components/events/EventInfoGrid";
import { EventSchedule } from "@/components/features/EventSchedule";
import { EventVenueCard } from "@/components/events/EventVenueCard";

function LoadingSkeleton() {
  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-6 space-y-4">
        <div className="h-72 animate-pulse card-glass squircle-lg" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse card-glass squircle" />
          ))}
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="pt-20 flex items-center justify-center">
      <p className="label-mono text-ivory/40">EVENT NOT FOUND</p>
    </div>
  );
}

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isLoading } = useGetEvent(eventId);
  const [selectedDay, setSelectedDay] = useState<string>("all");

  if (isLoading) return <LoadingSkeleton />;
  if (!event) return <NotFound />;

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const now = new Date();
  const isLive = start <= now && end >= now;
  const isEnded = end < now;

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

        <EventHero event={event} isLive={isLive} isEnded={isEnded} />

        <EventInfoGrid event={event} isOnline={event.isOnline} />

        {event.eventSessions.length > 0 && (
          <EventSchedule event={event} selectedDay={selectedDay} onDayChange={setSelectedDay} />
        )}

        <EventVenueCard event={event} />
      </div>
    </div>
  );
}
