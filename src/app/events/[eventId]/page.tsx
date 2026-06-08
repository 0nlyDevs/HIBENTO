"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetEvent } from "@/lib/hooks/useEvents";
import { EventHero } from "@/components/events/EventHero";
import { EventInfoGrid } from "@/components/events/EventInfoGrid";
import { EventSchedule } from "@/components/events/EventSchedule";
import { EventVenueCard } from "@/components/events/EventVenueCard";

function LoadingSkeleton() {
  return (
    <div className="min-h-screen pt-28">
      <div className="max-w-5xl mx-auto px-6 space-y-4">
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
    <div className="min-h-screen pt-28 flex items-center justify-center">
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
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Hero banner */}
        <EventHero event={event} isLive={isLive} isEnded={isEnded} />

        {/* Info grid + onsite note */}
        <EventInfoGrid event={event} isOnline={event.isOnline} />

        {/* Session schedule table */}
        {event.eventSessions.length > 0 && (
          <EventSchedule event={event} selectedDay={selectedDay} onDayChange={setSelectedDay} />
        )}

        {/* Venue card */}
        <EventVenueCard event={event} />
      </div>
    </div>
  );
}
